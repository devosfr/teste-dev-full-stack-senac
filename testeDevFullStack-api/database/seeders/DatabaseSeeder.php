<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\UsersRoles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
            'cpf' => '00000000000',
            'password' => bcrypt('123456'),
        ]);


        $roles = [
            [
                'name' => 'Administrador',
                'slug' => 'admin',
            ],
            [
                'name' => 'Moderador',
                'slug' => 'moderator',
            ],
            [
                'name' => 'Leitor',
                'slug' => 'reader',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }

        UsersRoles::create([
            'user_id' => 1,
            'role_id' => 1,
        ]);
    }
}
