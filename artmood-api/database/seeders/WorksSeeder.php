<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class WorksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('works')->insert([
            [
                'title' => 'Atardecer en la montaña',
                'description' => 'Una ilustración que muestra un atardecer cálido con tonos anaranjados.',
                'image' => 'obra1.jpg',
                'id_usuario' => 1,
                'id_categoria' => 1,
                'id_emocion' => 1,
            ],
            [
                'title' => 'Guerrera del bosque',
                'description' => 'Personaje femenino con estilo de fantasía.',
                'image' => 'obra2.jpg',
                'id_usuario' => 2,
                'id_categoria' => 3,
                'id_emocion' => 5,
            ],
            [
                'title' => 'Retrato al estilo anime',
                'description' => 'Retrato minimalista inspirado en la estética anime.',
                'image' => 'obra3.jpg',
                'id_usuario' => 3,
                'id_categoria' => 2,
                'id_emocion' => 1,
            ],
        ]);
    }
}
