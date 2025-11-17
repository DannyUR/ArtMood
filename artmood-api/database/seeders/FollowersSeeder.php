<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class FollowersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('followers')->insert([
            ['id_seguidor' => 1, 'id_seguido' => 2],
            ['id_seguidor' => 2, 'id_seguido' => 1],
            ['id_seguidor' => 3, 'id_seguido' => 1],
        ]);
    }
}
