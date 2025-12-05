<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use App\Models\User;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReactionController extends Controller
{
    /**
     * Obtener reacciones de una obra - VERSIÓN SIMPLIFICADA Y SEGURA
     */
    public function getByWork($id_obra)
    {
        try {
            Log::info("=== GET BY WORK INICIADO - OBRA: $id_obra ===");
            
            // 1. Verificar obra
            $work = Work::find($id_obra);
            if (!$work) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Obra no encontrada'
                ], 404);
            }
            
            Log::info("✅ Obra encontrada: {$work->title}");
            
            // 2. Obtener usuario autenticado (SI EXISTE)
            $userId = null;
            $userEmail = 'No autenticado';
            
            try {
                if (auth()->check()) {
                    $userId = auth()->id();
                    $userEmail = auth()->user()->email ?? 'Sin email';
                    Log::info("👤 Usuario autenticado: ID=$userId, Email=$userEmail");
                } else {
                    Log::info("👤 Usuario NO autenticado");
                }
            } catch (\Exception $authError) {
                Log::warning("⚠️ Error en autenticación: " . $authError->getMessage());
            }
            
            // 3. Obtener TODAS las reacciones de esta obra
            $reactions = Reaction::where('id_obra', $id_obra)->get();
            Log::info("📊 Total reacciones en DB: " . $reactions->count());
            
            // 4. Si no hay reacciones, devolver vacío
            if ($reactions->isEmpty()) {
                Log::info("📭 No hay reacciones para esta obra");
                return $this->successResponse([
                    'reactions' => [],
                    'total_reactions' => 0,
                    'work_id' => $id_obra,
                    'work_title' => $work->title,
                    'user_id' => $userId
                ]);
            }
            
            // 5. Obtener IDs de usuarios
            $userIds = $reactions->pluck('id_usuario')->unique()->toArray();
            Log::info("👥 IDs de usuarios únicos: " . implode(', ', $userIds));
            
            // 6. Obtener información de usuarios
            $users = [];
            try {
                $users = User::whereIn('id_usuario', $userIds)
                    ->select('id_usuario', 'nickname', 'profile_photo')
                    ->get()
                    ->keyBy('id_usuario');
                Log::info("✅ Usuarios cargados: " . $users->count());
            } catch (\Exception $userError) {
                Log::error("❌ Error cargando usuarios: " . $userError->getMessage());
                $users = collect();
            }
            
            // 7. Agrupar por emoji - MANUALMENTE para evitar errores
            $grouped = [];
            $debugInfo = [];
            
            foreach ($reactions as $reaction) {
                $emoji = $reaction->emoji;
                
                if (!isset($grouped[$emoji])) {
                    $grouped[$emoji] = [
                        'emoji' => $emoji,
                        'count' => 0,
                        'users' => [],
                        'user_reacted' => false,
                        'user_reaction_id' => null
                    ];
                }
                
                $grouped[$emoji]['count']++;
                
                // Agregar usuario si hay espacio (máx 3)
                if (count($grouped[$emoji]['users']) < 3) {
                    $user = $users[$reaction->id_usuario] ?? null;
                    if ($user) {
                        $grouped[$emoji]['users'][] = [
                            'id' => $user->id_usuario,
                            'nickname' => $user->nickname,
                            'avatar' => $user->profile_photo
                        ];
                    }
                }
                
                // Verificar si es el usuario autenticado
                if ($userId && $reaction->id_usuario == $userId) {
                    $grouped[$emoji]['user_reacted'] = true;
                    $grouped[$emoji]['user_reaction_id'] = $reaction->id_reaccion;
                    
                    Log::info("🎯 Usuario $userId REACCIONÓ con $emoji (ID reacción: {$reaction->id_reaccion})");
                }
            }
            
            // 8. Convertir a array indexado
            $reactionsArray = array_values($grouped);
            
            // 9. Log para debug
            foreach ($reactionsArray as $index => $reaction) {
                $debugInfo[] = "Reacción $index: {$reaction['emoji']} - Count: {$reaction['count']} - UserReacted: " . ($reaction['user_reacted'] ? 'YES' : 'NO');
            }
            
            Log::info("🎨 Reacciones procesadas:\n" . implode("\n", $debugInfo));
            
            // 10. Devolver respuesta
            return $this->successResponse([
                'reactions' => $reactionsArray,
                'total_reactions' => $reactions->count(),
                'work_id' => $id_obra,
                'work_title' => $work->title,
                'user_id' => $userId,
                'debug' => [
                    'user_authenticated' => $userId ? true : false,
                    'reactions_count' => count($reactionsArray),
                    'timestamp' => now()->toDateTimeString()
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ ERROR CRÍTICO en getByWork: ' . $e->getMessage());
            Log::error('📋 Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error interno del servidor',
                'debug' => env('APP_DEBUG') ? [
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    }
    
    /**
     * Crear reacción - VERSIÓN SEGURA
     */
// app/Http/Controllers/ReactionController.php
public function store(Request $request)
{
    $request->validate([
        'id_obra' => 'required|exists:works,id_obra',
        'emoji' => 'required|string|max:10'
    ]);
    
    $userId = auth()->id();
    $workId = $request->id_obra;
    $emoji = $request->emoji;
    
    // Verificar si ya reaccionó
    $existingReaction = Reaction::where('id_usuario', $userId)
        ->where('id_obra', $workId)
        ->first();
    
    if ($existingReaction) {
        // Opción 1: Devolver error
        return response()->json([
            'message' => 'Ya has reaccionado a esta obra',
            'current_reaction' => $existingReaction
        ], 409); // Código 409 Conflict
        
        // Opción 2: Actualizar (cambiar emoji)
        // $existingReaction->update(['emoji' => $emoji, 'reacted_at' => now()]);
        // return response()->json($existingReaction);
    }
    
    // Crear nueva reacción
    $reaction = Reaction::create([
        'id_usuario' => $userId,
        'id_obra' => $workId,
        'emoji' => $emoji,
        'reacted_at' => now()
    ]);
    
    return response()->json($reaction, 201);
}
    
    /**
     * Eliminar reacción por ID
     */
    public function destroy($id)
    {
        try {
            Log::info("=== DESTROY REACTION - ID: $id ===");
            
            $reaction = Reaction::find($id);
            
            if (!$reaction) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Reacción no encontrada'
                ], 404);
            }
            
            // Verificar propiedad (opcional, puedes comentar si quieres)
            /*
            if (auth()->check() && auth()->id() != $reaction->id_usuario) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No tienes permiso para eliminar esta reacción'
                ], 403);
            }
            */
            
            $reaction->delete();
            Log::info("✅ Reacción eliminada - ID: $id");
            
            return response()->json([
                'status' => 'success',
                'message' => 'Reacción eliminada'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en destroy: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar reacción'
            ], 500);
        }
    }
    
    /**
     * Helper para respuestas exitosas
     */
    private function successResponse($data)
    {
        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }
    
    // Eliminar otros métodos por ahora para simplificar
    public function index() { return $this->successResponse([]); }
    public function show($id) { return $this->successResponse([]); }
    public function removeReaction(Request $request) { return $this->successResponse([]); }
    public function getStats($id_obra = null) { return $this->successResponse([]); }
}