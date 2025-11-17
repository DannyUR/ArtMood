<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ReactionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reactions')->insert([
            ['emoji' => '❤️', 'id_usuario' => 1, 'id_obra' => 1],
            ['emoji' => '🔥', 'id_usuario' => 2, 'id_obra' => 1],
            ['emoji' => '⭐', 'id_usuario' => 3, 'id_obra' => 2],
            ['emoji' => '😮', 'id_usuario' => 1, 'id_obra' => 3],
        ]);
    }
}
