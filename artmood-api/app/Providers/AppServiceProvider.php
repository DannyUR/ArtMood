<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use App\Jobs\CleanupInvalidImages;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Programar limpieza automática
        $this->app->booted(function () {
            $schedule = $this->app->make(Schedule::class);
            
            // Ejecutar limpieza diaria a las 3 AM
            $schedule->job(new CleanupInvalidImages)->dailyAt('03:00');
            
            // Verificación semanal de obras
            $schedule->command('works:fix-all --dry-run')->weekly();
        });
    }
}