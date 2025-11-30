<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    // =============================
    // REGISTRO
    // =============================
   public function register(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'nickname'  => 'required|string|max:50|unique:users,nickname',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|min:6',
            'profile_photo' => 'nullable|string'
        ]);

        // Crear usuario
        $user = User::create([
            'name'      => $request->name,
            'nickname'  => $request->nickname,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'profile_photo' => $request->profile_photo
        ]);

        // Generar token
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Usuario registrado correctamente.',
            'user'    => [
                'id_usuario' => $user->id_usuario, // Cambiado
                'name' => $user->name,
                'nickname' => $user->nickname,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token'   => $token
        ], 201);
    }

    // -----------------------
    // LOGIN
    // -----------------------
   public function login(Request $request)
    {
        $credentials = $request->only("email", "password");

        try {
            // Intentar generar token
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    "error" => "Credenciales inválidas"
                ], 401);
            }

            // Usuario autenticado
            $user = Auth::user();

            return response()->json([
                "message" => "Inicio de sesión correcto",
                "token"   => $token,
                'user' => [
                    'id_usuario' => $user->id_usuario, // Cambiado de 'id' a 'id_usuario'
                    'name' => $user->name,
                    'nickname' => $user->nickname,
                    'email' => $user->email,
                    'role' => $user->role,
                ]                    
            ], 200);

        } catch (JWTException $e) {
            return response()->json([
                "error" => "No se pudo crear el token"
            ], 500);
        }
    }

    // -----------------------
    // LOGOUT
    // -----------------------
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                "message" => "Sesión cerrada correctamente"
            ]);

        } catch (JWTException $e) {
            return response()->json([
                "error" => "No se pudo cerrar la sesión"
            ], 500);
        }
    }

    // -----------------------
    // PERFIL DEL USUARIO
    // -----------------------
    public function profile()
    {
        try {
            $user = Auth::user(); // Usuario autenticado

            return response()->json([
                'id_usuario' => $user->id_usuario, // Cambiado
                'name' => $user->name,
                'nickname' => $user->nickname,
                'email' => $user->email,
                'role' => $user->role,
            ]);

        } catch (JWTException $e) {
            return response()->json([
                "error" => "Token no válido"
            ], 401);
        }
    }
}
