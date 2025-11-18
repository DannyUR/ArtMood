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
            'data' => Notification::with('user')->get()
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

    public function markAllAsRead()
    {
        // Obtener el usuario autenticado
        $userId = auth()->user()->id_usuario;

        // Marcar todas sus notificaciones como leídas
        Notification::where('id_usuario', $userId)
                    ->update(['status' => 'leido']);

        return response()->json([
            'status' => 'success',
            'message' => 'Todas las notificaciones fueron marcadas como leídas'
        ]);
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
