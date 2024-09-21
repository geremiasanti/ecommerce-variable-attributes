<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'User 0',
            'email' => 'user0@example.com',
            'password' => Hash::make('password0')
        ]);
    }
}
