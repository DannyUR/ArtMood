<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WorkController extends Controller
{
    public function index()
    {
        try {
            Log::info('INDEX - Obteniendo todas las obras');
            
            $works = Work::with([
                'user:id_usuario,name,nickname,email,profile_photo',
                'category:id_categoria,name,description',
                'emotion:id_emocion,name,icon'
            ])->get();

            Log::info('INDEX - Obras obtenidas: ' . $works->count());

            return response()->json([
                'status' => 'success',
                'count' => $works->count(),
                'data' => $works
            ]);

        } catch (\Exception $e) {
            Log::error('INDEX - Error obteniendo obras: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener las obras'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            Log::info('SHOW - Obteniendo obra ID: ' . $id);
            
            $work = Work::with([
                'user:id_usuario,name,nickname,email,profile_photo',
                'category:id_categoria,name,description',
                'emotion:id_emocion,name,icon'
            ])->findOrFail($id);

            Log::info('SHOW - Obra encontrada: ' . $work->title);
            
            return response()->json([
                'status' => 'success',
                'data' => $work
            ]);

        } catch (\Exception $e) {
            Log::error('SHOW - Error obteniendo obra ' . $id . ': ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Obra no encontrada'
            ], 404);
        }
    }

    public function store(Request $request)
    {
        Log::info('STORE - Creando nueva obra', [
            'datos' => $request->except(['image']),
            'tiene_imagen' => $request->hasFile('image')
        ]);

        try {
            $validator = Validator::make($request->all(), [
                'title'        => 'required|string|max:150',
                'description'  => 'nullable|string',
                'image'        => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'id_usuario'   => 'required|exists:users,id_usuario',
                'id_categoria' => 'nullable|exists:categories,id_categoria',
                'id_emocion'   => 'nullable|exists:emotions,id_emocion',
            ]);

            if ($validator->fails()) {
                Log::warning('STORE - Validación fallida', $validator->errors()->toArray());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Procesar la imagen - VERSIÓN CORREGIDA
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                
                // Generar nombre único
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $safeName = preg_replace('/[^a-zA-Z0-9]/', '_', $originalName);
                $imageName = 'obra_' . time() . '_' . $safeName . '.' . $image->getClientOriginalExtension();
                
                // 🔴 CORRECCIÓN: Guardar correctamente en el disco 'public'
                $image->storeAs('obras', $imageName, 'public');
                
                // Ruta relativa correcta
                $imagePath = 'obras/' . $imageName;
                
                Log::info('STORE - Imagen guardada exitosamente', [
                    'nombre_guardado' => $imageName,
                    'ruta_en_bd' => $imagePath,
                    'ruta_completa_storage' => storage_path('app/public/obras/' . $imageName)
                ]);
            } else {
                Log::error('STORE - No se recibió archivo de imagen');
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se proporcionó una imagen válida'
                ], 422);
            }

            // Crear la obra
            $work = Work::create([
                'title' => $request->title,
                'description' => $request->description,
                'image' => $imagePath,
                'id_usuario' => $request->id_usuario,
                'id_categoria' => $request->id_categoria,
                'id_emocion' => $request->id_emocion,
            ]);

            Log::info('STORE - Obra creada exitosamente', [
                'id' => $work->id_obra,
                'title' => $work->title,
                'image' => $work->image
            ]);

            $work->load(['user', 'category', 'emotion']);

            return response()->json([
                'status' => 'success',
                'message' => 'Obra creada correctamente',
                'data' => $work
            ], 201);

        } catch (\Exception $e) {
            Log::error('STORE - Error crítico:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear la obra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // DEBUG EXTENDIDO
        Log::info('🔄 UPDATE - Request completo:', [
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'has_file_image' => $request->hasFile('image'),
            'all_inputs' => $request->except(['image']),
            'file_info' => $request->file('image') ? [
                'name' => $request->file('image')->getClientOriginalName(),
                'size' => $request->file('image')->getSize(),
                'mime' => $request->file('image')->getMimeType(),
                'is_valid' => $request->file('image')->isValid()
            ] : 'NO FILE',
            'all_files' => $request->allFiles(),
            'is_multipart' => $request->is('multipart/form-data')
        ]);

        try {
            $work = Work::findOrFail($id);
            Log::info('UPDATE - Obra encontrada: ' . $work->title);

            // Validación
            $validator = Validator::make($request->all(), [
                'title'        => 'sometimes|string|max:150',
                'description'  => 'sometimes|string',
                'image'        => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'id_categoria' => 'sometimes|exists:categories,id_categoria',
                'id_emocion'   => 'sometimes|exists:emotions,id_emocion',
            ]);

            if ($validator->fails()) {
                Log::warning('UPDATE - Validación fallida', $validator->errors()->toArray());
                return response()->json([
                    'status' => 'error',
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Preparar datos para actualizar
            $updateData = [
                'title' => $request->title ?? $work->title,
                'description' => $request->description ?? $work->description,
                'id_categoria' => $request->id_categoria ?? $work->id_categoria,
                'id_emocion' => $request->id_emocion ?? $work->id_emocion,
            ];

            // 🔴 CRÍTICO: SOLUCIÓN PARA DETECTAR IMÁGENES CORRECTAMENTE
            $newImage = $request->file('image');
            
            if ($newImage && $newImage->isValid()) {
                Log::info('UPDATE - Procesando NUEVA imagen válida', [
                    'name' => $newImage->getClientOriginalName(),
                    'size' => $newImage->getSize(),
                    'mime' => $newImage->getMimeType()
                ]);
                
                // Eliminar imagen anterior si existe
                if ($work->image && Storage::disk('public')->exists($work->image)) {
                    Storage::disk('public')->delete($work->image);
                    Log::info('UPDATE - Imagen anterior eliminada: ' . $work->image);
                }
                
                // Guardar nueva imagen
                $originalName = pathinfo($newImage->getClientOriginalName(), PATHINFO_FILENAME);
                $safeName = preg_replace('/[^a-zA-Z0-9]/', '_', $originalName);
                $imageName = 'obra_' . time() . '_' . $safeName . '.' . $newImage->getClientOriginalExtension();
                $imagePath = 'obras/' . $imageName;
                
                // 🔴 CORRECCIÓN: Guardar correctamente en disco 'public'
                $newImage->storeAs('obras', $imageName, 'public');
                
                $updateData['image'] = $imagePath;
                
                Log::info('UPDATE - Nueva imagen guardada', ['ruta' => $imagePath]);
            } else {
                Log::info('UPDATE - No hay nueva imagen válida', [
                    'file_received' => $newImage ? 'YES' : 'NO',
                    'is_valid' => $newImage ? ($newImage->isValid() ? 'YES' : 'NO') : 'N/A'
                ]);
                // Mantener imagen existente - NO actualizar campo image
            }

            // Actualizar la obra
            $work->update($updateData);
            
            Log::info('UPDATE - Obra actualizada exitosamente', [
                'id' => $work->id_obra,
                'titulo' => $work->title,
                'imagen_actual' => $work->image
            ]);

            $work->load(['user', 'category', 'emotion']);

            return response()->json([
                'status' => 'success',
                'message' => 'Obra actualizada correctamente',
                'data' => $work
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('UPDATE - Obra no encontrada: ' . $id);
            return response()->json([
                'status' => 'error',
                'message' => 'Obra no encontrada'
            ], 404);
            
        } catch (\Exception $e) {
            Log::error('UPDATE - Error crítico:', [
                'obra_id' => $id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar la obra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('DESTROY - Eliminando obra ID: ' . $id);
            
            $work = Work::findOrFail($id);
            
            if ($work->image && Storage::disk('public')->exists($work->image)) {
                Storage::disk('public')->delete($work->image);
                Log::info('DESTROY - Imagen eliminada del storage: ' . $work->image);
            }
            
            $work->delete();
            
            Log::info('DESTROY - Obra eliminada exitosamente: ' . $id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Obra eliminada correctamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('DESTROY - Error eliminando obra:', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar la obra'
            ], 500);
        }
    }

    public function fixImageUrls()
    {
        $works = Work::whereNotNull('image')->get();
        $updated = 0;
        
        foreach ($works as $work) {
            $oldPath = $work->image;
            
            if ($work->image && !str_contains($work->image, '/')) {
                $newPath = 'obras/' . $work->image;
                
                if (Storage::disk('public')->exists($newPath)) {
                    $work->update(['image' => $newPath]);
                    Log::info("Ruta corregida: {$oldPath} -> {$newPath}");
                    $updated++;
                }
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => "{$updated} rutas de imágenes corregidas"
        ]);
    }

    public function diagnoseImages()
    {
        $works = Work::all();
        $results = [];
        
        foreach ($works as $work) {
            $existsInStorage = Storage::disk('public')->exists($work->image);
            
            $results[] = [
                'id' => $work->id_obra,
                'title' => $work->title,
                'image_in_db' => $work->image,
                'exists_in_storage' => $existsInStorage,
                'full_storage_path' => $existsInStorage ? 
                    storage_path('app/public/' . $work->image) : null,
                'image_url' => $work->image_url
            ];
        }
        
        return response()->json([
            'status' => 'success',
            'storage_root' => storage_path('app/public'),
            'public_storage_link' => public_path('storage'),
            'works' => $results
        ]);
    }
}