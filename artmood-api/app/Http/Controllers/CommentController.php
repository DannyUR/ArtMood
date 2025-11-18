<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Comment::with(['user', 'work'])->get()
        ]);
    }

    public function show($id)
    {
        $comment = Comment::with(['user', 'work'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $comment
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content'     => 'required|string',
            'id_usuario'  => 'required|exists:users,id_usuario',
            'id_obra'     => 'required|exists:works,id_obra',
            'status'      => 'sometimes|in:visible,hidden,deleted'
        ]);

        $comment = Comment::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Comentario creado correctamente',
            'data' => $comment
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        $request->validate([
            'content'     => 'sometimes|string',
            'status'      => 'sometimes|in:visible,hidden,deleted'
        ]);

        $comment->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Comentario actualizado correctamente',
            'data' => $comment
        ]);
    }

    public function destroy($id)
    {
        Comment::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Comentario eliminado correctamente'
        ]);
    }
}