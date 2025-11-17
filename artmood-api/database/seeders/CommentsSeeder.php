<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CommentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('comments')->insert([
            [
                'content' => '¡Qué hermosa combinación de colores!',
                'id_usuario' => 2,
                'id_obra' => 1,
            ],
            [
                'content' => 'Me encanta el estilo, muy inspirador.',
                'id_usuario' => 1,
                'id_obra' => 2,
            ],
            [
                'content' => 'Un trabajo impresionante 😍',
                'id_usuario' => 3,
                'id_obra' => 1,
            ],
        ]);
    }
}
