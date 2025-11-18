<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;

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
        $request->validate([
            'title'        => 'required|string|max:150',
            'description'  => 'nullable|string',
            'image'        => 'required|string|max:255',
            'id_usuario'   => 'required|exists:users,id_usuario',
            'id_categoria' => 'nullable|exists:categories,id_categoria',
            'id_emocion'   => 'nullable|exists:emotions,id_emocion',
        ]);

        $work = Work::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Obra creada correctamente',
            'data' => $work
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $work = Work::findOrFail($id);

        $request->validate([
            'title'        => 'sometimes|string|max:150',
            'description'  => 'sometimes|string',
            'image'        => 'sometimes|string|max:255',
            'id_usuario'   => 'sometimes|exists:users,id_usuario',
            'id_categoria' => 'sometimes|exists:categories,id_categoria',
            'id_emocion'   => 'sometimes|exists:emotions,id_emocion',
        ]);

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
