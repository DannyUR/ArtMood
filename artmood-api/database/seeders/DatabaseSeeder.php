<?php

namespace Database\Seeders;

use App\Models\User;
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
        $this->call([
            UsersSeeder::class,
            CategoriesSeeder::class,
            EmotionsSeeder::class,
            WorksSeeder::class,
            CommentsSeeder::class,
            ReactionsSeeder::class,
            FollowersSeeder::class,
            NotificationsSeeder::class,
        ]);
    }
}
