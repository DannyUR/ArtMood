<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Listar usuarios PAGINADOS
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => User::paginate(10)
        ]);
    }

    // Mostrar un usuario
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    // Crear usuario
    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'nickname'  => 'required|string|max:50|unique:users,nickname',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|min:6',
            'profile_photo' => 'nullable|string'
        ]);

        $user = User::create([
            'name'      => $request->name,
            'nickname'  => $request->nickname,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'profile_photo' => $request->profile_photo,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario creado correctamente',
            'data' => $user
        ], 201);
    }

    // Actualizar usuario
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|string|max:255',
            'nickname'  => 'sometimes|string|max:50|unique:users,nickname,' . $id . ',id_usuario',
            'email'     => 'sometimes|email|unique:users,email,' . $id . ',id_usuario',
            'password'  => 'sometimes|min:6',
            'profile_photo' => 'sometimes|string'
        ]);

        if ($request->has('password')) {
            $request['password'] = Hash::make($request->password);
        }

        $user->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario actualizado correctamente',
            'data' => $user
        ]);
    }

    // Eliminar usuario
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Usuario eliminado correctamente'
        ]);
    }
}
