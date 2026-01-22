<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\UsersRoles;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentPage = $request->query('currentPage') ?? 1;
        $perPage = $request->query('perPage') ?? 10;
        $offset = ($currentPage - 1) * $perPage;
        $users = User::skip($offset)->take($perPage)->orderByDesc('id')->get();
        return response()->json($users->toResourceCollection(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $roleId = $data['role'];
        try {
            $user = new User();
            $usersRoles = new UsersRoles();
            $user->fill($data);
            $user->password = bcrypt($data['password']);
            $user->save();
            $userId = $user->id;
            $usersRoles->user_id = $userId;
            $usersRoles->role_id = $roleId;
            $usersRoles->save();

            return response()->json($user->toResource(), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating user'], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json($user->toResource(), 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $data = $request->validated();
        try {
            $user = User::findOrFail($id);
            $user->update($data);
            return response()->json($user->toResource(), 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating user'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            User::destroy($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting user - {$e->getMessage()}'], 400);
        }
    }
}
