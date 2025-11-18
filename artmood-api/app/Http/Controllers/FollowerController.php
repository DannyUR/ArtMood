<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use Illuminate\Http\Request;

class FollowerController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Follower::with(['seguidor', 'seguido'])->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_seguidor' => 'required|exists:users,id_usuario',
            'id_seguido'  => 'required|exists:users,id_usuario'
        ]);

        $f = Follower::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Ahora sigues a este usuario',
            'data' => $f
        ], 201);
    }

    public function destroy($id_seguidor, $id_seguido)
    {
        Follower::where('id_seguidor', $id_seguidor)
                ->where('id_seguido', $id_seguido)
                ->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Dejaste de seguir al usuario'
        ]);
    }

    public function followers($id)
    {
        $followers = Follower::with('seguidor')
            ->where('id_seguido', $id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $followers
        ]);
    }

    public function following($id)
    {
        $following = Follower::with('seguido')
            ->where('id_seguidor', $id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $following
        ]);
    }
}
