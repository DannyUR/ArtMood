<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NotificationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('notifications')->insert([
            [
                'id_usuario' => 1,
                'type' => 'comentario',
                'status' => 'no_leido',
                'message' => 'Te han comentado en tu obra "Atardecer en la montaña".',
            ],
            [
                'id_usuario' => 2,
                'type' => 'reaccion',
                'status' => 'no_leido',
                'message' => 'A tu obra "Guerrera del bosque" le dieron ❤️.',
            ],
            [
                'id_usuario' => 3,
                'type' => 'seguimiento',
                'status' => 'no_leido',
                'message' => 'Tienes un nuevo seguidor.',
            ],
        ]);
    }
}
