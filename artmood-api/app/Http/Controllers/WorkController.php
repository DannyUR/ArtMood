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

            // image_url se agrega automáticamente por el $appends en el modelo
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
            
            // image_url ya está incluido por $appends
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
            'datos' => $request->except(['image']), // Excluir imagen para no saturar logs
            'tiene_imagen' => $request->hasFile('image')
        ]);

        try {
            // Validación
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

            // Procesar la imagen
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                
                // Generar nombre único y seguro
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $safeName = preg_replace('/[^a-zA-Z0-9]/', '_', $originalName);
                $imageName = 'obra_' . time() . '_' . $safeName . '.' . $image->getClientOriginalExtension();
                
                // Guardar en storage
                $image->storeAs('public/obras', $imageName);
                
                // Ruta relativa (sin 'public/')
                $imagePath = 'obras/' . $imageName;
                
                Log::info('STORE - Imagen guardada exitosamente', [
                    'nombre_original' => $image->getClientOriginalName(),
                    'nombre_guardado' => $imageName,
                    'ruta_relativa' => $imagePath
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
                'image' => $imagePath, // Guardar solo la ruta relativa
                'id_usuario' => $request->id_usuario,
                'id_categoria' => $request->id_categoria,
                'id_emocion' => $request->id_emocion,
            ]);

            Log::info('STORE - Obra creada exitosamente', [
                'id' => $work->id_obra,
                'titulo' => $work->title,
                'imagen' => $work->image
            ]);

            // Cargar relaciones (image_url se incluye automáticamente)
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
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear la obra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        Log::info('UPDATE - Iniciando actualización obra ID: ' . $id, [
            'datos' => $request->except(['image', '_method']),
            'tiene_imagen' => $request->hasFile('image'),
            'es_formdata' => $request->is('multipart/form-data')
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

            // 🔴 IMPORTANTE: Solo procesar imagen si es un archivo nuevo (File)
            // NO procesar si es una ruta o string (evitar rutas temporales)
            if ($request->hasFile('image')) {
                Log::info('UPDATE - Procesando NUEVA imagen desde archivo');
                
                // Validar que sea realmente un archivo
                $image = $request->file('image');
                if (!$image->isValid()) {
                    Log::error('UPDATE - Archivo de imagen no válido');
                    return response()->json([
                        'status' => 'error',
                        'message' => 'El archivo de imagen no es válido'
                    ], 422);
                }
                
                // Eliminar imagen anterior si existe
                if ($work->image && Storage::disk('public')->exists($work->image)) {
                    Storage::disk('public')->delete($work->image);
                    Log::info('UPDATE - Imagen anterior eliminada: ' . $work->image);
                }
                
                // Guardar nueva imagen
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $safeName = preg_replace('/[^a-zA-Z0-9]/', '_', $originalName);
                $imageName = 'obra_' . time() . '_' . $safeName . '.' . $image->getClientOriginalExtension();
                $imagePath = 'obras/' . $imageName;
                
                $image->storeAs('public/obras', $imageName);
                $updateData['image'] = $imagePath;
                
                Log::info('UPDATE - Nueva imagen guardada', [
                    'ruta' => $imagePath,
                    'tamaño' => $image->getSize(),
                    'tipo' => $image->getMimeType()
                ]);
            } else {
                Log::info('UPDATE - No hay nueva imagen, manteniendo la existente');
                // NO actualizar el campo image si no hay nueva imagen
                // Esto previene que se guarde la ruta temporal que pueda venir del frontend
            }

            // Actualizar la obra
            $work->update($updateData);
            
            Log::info('UPDATE - Obra actualizada exitosamente', [
                'id' => $work->id_obra,
                'titulo' => $work->title,
                'imagen_actual' => $work->image
            ]);

            // Cargar relaciones (image_url se incluye automáticamente)
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
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
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
            
            // Eliminar imagen del storage si existe
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
}