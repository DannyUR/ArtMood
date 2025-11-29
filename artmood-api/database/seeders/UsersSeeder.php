<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Daniela Uscanga',
                'nickname' => 'danny_art',
                'email' => 'danny@gmail.com',
                'password' => Hash::make('1234567890'),
                'profile_photo' => 'default.jpg',
                'role' => 'admin'       
            ],
            [
                'name' => 'Rafael Luján',
                'nickname' => 'raf_draws',
                'email' => 'rafael@gmail.com',
                'password' => Hash::make('1234567890'),
                'profile_photo' => 'default.jpg',
                'role' => 'admin'        
            ],
            [
                'name' => 'María López',
                'nickname' => 'marialopez',
                'email' => 'maria@gmail.com',
                'password' => Hash::make('1234567890'),
                'profile_photo' => 'default.jpg',
                'role' => 'user'
            ],
        ]);
    }
}
