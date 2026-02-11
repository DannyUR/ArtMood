<?php

namespace App\Jobs;

use App\Models\Work;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CleanupInvalidImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $works = Work::whereNotNull('image')->get();
        
        foreach ($works as $work) {
            // Verificar si la imagen existe
            if (!Storage::disk('public')->exists($work->image)) {
                // Marcar como problema
                $work->update([
                    'image' => null,
                    'image_problem' => true,
                    'image_problem_at' => now()
                ]);
                
                \Log::info('Imagen faltante limpiada', [
                    'work_id' => $work->id_obra,
                    'title' => $work->title
                ]);
            }
            // Verificar si está vacía
            elseif (Storage::disk('public')->size($work->image) === 0) {
                Storage::disk('public')->delete($work->image);
                $work->update(['image' => null]);
            }
        }
        
        // Eliminar obras sin imagen por más de 30 días
        Work::whereNull('image')
            ->where('created_at', '<', now()->subDays(30))
            ->delete();
    }
}