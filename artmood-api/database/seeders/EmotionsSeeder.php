<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class EmotionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('emotions')->insert([
            ['name' => 'Feliz', 'icon' => '😊'],
            ['name' => 'Triste', 'icon' => '😢'],
            ['name' => 'Sorprendido', 'icon' => '😮'],
            ['name' => 'Enojado', 'icon' => '😡'],
            ['name' => 'Inspirado', 'icon' => '✨'],
        ]);
    }
}
