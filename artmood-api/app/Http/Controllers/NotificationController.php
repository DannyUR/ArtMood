<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Notification::with('user')->paginate(10)
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'status' => 'success',
            'data' => Notification::findOrFail($id)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|exists:users,id_usuario',
            'type'       => 'required|in:comentario,reaccion,seguimiento,sistema',
            'message'    => 'required|string'
        ]);

        $notification = Notification::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Notificación creada',
            'data' => $notification
        ], 201);
    }

    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Notificación eliminada'
        ]);
    }
}
