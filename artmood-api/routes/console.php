<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

use App\Jobs\CleanupInvalidImages;

// Comandos inspiradores (ya existe)
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// ✅ CONFIGURACIÓN DE TAREAS PROGRAMADAS
Schedule::command('works:fix-all --dry-run')
    ->weekly()
    ->mondays()
    ->at('02:00')
    ->name('weekly-works-check')
    ->description('Verificación semanal de obras');

Schedule::job(new CleanupInvalidImages)
    ->dailyAt('03:00')
    ->name('daily-image-cleanup')
    ->description('Limpieza diaria de imágenes inválidas');

// Opcional: Verificación más frecuente en desarrollo
if (app()->environment('local')) {
    Schedule::command('works:fix-all --dry-run')
        ->everyMinute()
        ->skip(function () {
            return !app()->isLocal();
        });
}