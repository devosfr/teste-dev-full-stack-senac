<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UsersRoles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'cpf' => 'required|min:11',
            'password' => 'required|min:6',
        ]);
        if (!Auth::attempt($request->only('cpf', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $user = User::where('cpf', $request->cpf)->first();
        $userRole = UsersRoles::where('user_id', $user->id)->first();
        $roleId = $userRole->role_id;
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas'
            ], 401);
        }
        $currentUser = [
            'id' => $user->id,
            'name' => $user->name,
            'cpf' => $user->cpf,
            'email' => $user->email,
            'roleId' => $roleId,
        ];

        return response()->json([
            'message' => 'Successful login',
            'user' => $currentUser,
            'status' => 200
        ]);
    }
}
