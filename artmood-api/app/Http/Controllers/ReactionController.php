<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Reaction::with(['user', 'work'])->paginate(10)
        ]);
    }

    public function show($id)
    {
        $reaction = Reaction::with(['user', 'work'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $reaction
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'emoji'       => 'required|string|max:10',
            'id_usuario'  => 'required|exists:users,id_usuario',
            'id_obra'     => 'required|exists:works,id_obra'
        ]);

        $reaction = Reaction::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Reacción registrada correctamente',
            'data' => $reaction
        ], 201);
    }

    public function destroy($id)
    {
        Reaction::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Reacción eliminada correctamente'
        ]);
    }
}
