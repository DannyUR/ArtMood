<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WorkController extends Controller
{
    public function index()
    {
        return response()->json([
        'status' => 'success',
        'data' => Work::with([
            'user:id_usuario,name,nickname,email,profile_photo',
            'category:id_categoria,name,description',
            'emotion:id_emocion,name,icon'
        ])->get()
    ]);
    }

    public function show($id)
    {
        $work = Work::with([
        'user:id_usuario,name,nickname,email,profile_photo',
        'category:id_categoria,name,description',
        'emotion:id_emocion,name,icon'
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $work
        ]);
    }

        public function store(Request $request)
    {
        \Log::info('Datos recibidos:', $request->all());
        \Log::info('Archivos recibidos:', $request->file());
        
        try {
            $request->validate([
                'title'        => 'required|string|max:150',
                'description'  => 'nullable|string',
                'image'        => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
                'id_usuario'   => 'required|exists:users,id_usuario',
                'id_categoria' => 'nullable|exists:categories,id_categoria',
                'id_emocion'   => 'nullable|exists:emotions,id_emocion',
            ]);

            \Log::info('Validación pasada');

            // Procesar la imagen
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('obras', $imageName, 'public');
                \Log::info('Imagen guardada: ' . $imagePath);
            } else {
                \Log::error('No se encontró archivo de imagen con nombre: image');
                \Log::error('Archivos disponibles:', array_keys($request->file() ?? []));
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se proporcionó una imagen válida'
                ], 422);
            }

            $work = Work::create([
                'title' => $request->title,
                'description' => $request->description,
                'image' => $imagePath,
                'id_usuario' => $request->id_usuario,
                'id_categoria' => $request->id_categoria,
                'id_emocion' => $request->id_emocion,
            ]);

            \Log::info('Obra creada exitosamente: ' . $work->id_obra);

            return response()->json([
                'status' => 'success',
                'message' => 'Obra creada correctamente',
                'data' => $work
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creando obra: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $work = Work::findOrFail($id);

        $request->validate([
            'titulo'        => 'sometimes|string|max:150',
            'descripcion'   => 'sometimes|string',
            'imagen'        => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:5120', // Cambiado
            'id_usuario'    => 'sometimes|exists:users,id_usuario',
            'id_categoria'  => 'sometimes|exists:categories,id_categoria',
            'id_emocion'    => 'sometimes|exists:emotions,id_emocion',
        ]);

        // Procesar la nueva imagen si se envió
        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior si existe
            if ($work->imagen && Storage::disk('public')->exists($work->imagen)) {
                Storage::disk('public')->delete($work->imagen);
            }
            
            $imagePath = $request->file('imagen')->store('obras', 'public');
            $request->merge(['imagen' => $imagePath]);
        }

        $work->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Obra actualizada correctamente',
            'data' => $work
        ]);
    }

    public function destroy($id)
    {
        Work::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Obra eliminada correctamente'
        ]);
    }
}
