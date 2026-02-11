<?php

namespace App\Console\Commands;

use App\Models\Work;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class FixAllWorks extends Command
{
    protected $signature = 'works:fix-all 
                            {--clean : Solo limpiar imágenes faltantes}
                            {--delete : Eliminar obras sin imagen}
                            {--dry-run : Solo mostrar, no ejecutar cambios}';
    
    protected $description = 'Repara todas las obras con problemas de imágenes';

    public function handle()
    {
        $this->info('🔧 REPARANDO TODAS LAS OBRAS...');
        
        $works = Work::all();
        $total = $works->count();
        $problems = [];
        $fixed = 0;
        $deleted = 0;
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();
        
        foreach ($works as $work) {
            $hasProblem = false;
            $problemType = null;
            
            // Caso 1: Obra sin imagen
            if (!$work->image) {
                if ($this->option('delete')) {
                    if (!$this->option('dry-run')) {
                        $work->delete();
                        $deleted++;
                    }
                    $problemType = 'deleted (no image)';
                } else {
                    $problemType = 'no image';
                }
                $hasProblem = true;
            }
            // Caso 2: Imagen no existe físicamente
            elseif ($work->image && !Storage::disk('public')->exists($work->image)) {
                if ($this->option('clean') || $this->option('delete')) {
                    if (!$this->option('dry-run')) {
                        if ($this->option('delete')) {
                            $work->delete();
                            $deleted++;
                            $problemType = 'deleted (missing image)';
                        } else {
                            $work->update(['image' => null]);
                            $fixed++;
                            $problemType = 'cleaned (image=NULL)';
                        }
                    } else {
                        $problemType = 'would clean/delete';
                    }
                } else {
                    $problemType = 'missing image';
                }
                $hasProblem = true;
            }
            
            if ($hasProblem) {
                $problems[] = [
                    'id' => $work->id_obra,
                    'title' => $work->title,
                    'type' => $problemType,
                    'image' => $work->image
                ];
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        
        // Mostrar reporte
        $this->newLine(2);
        $this->info('📊 REPORTE FINAL:');
        $this->line("Total obras: {$total}");
        $this->line("Obras con problemas: " . count($problems));
        $this->line("Obras limpiadas: {$fixed}");
        $this->line("Obras eliminadas: {$deleted}");
        
        if (count($problems) > 0) {
            $this->warn("\n⚠️  OBRAS CON PROBLEMAS:");
            $headers = ['ID', 'Título', 'Problema', 'Imagen en BD'];
            $this->table($headers, array_map(function($p) {
                return [
                    $p['id'],
                    substr($p['title'], 0, 30) . (strlen($p['title']) > 30 ? '...' : ''),
                    $p['type'],
                    substr($p['image'] ?? 'NULL', 0, 30)
                ];
            }, $problems));
        }
        
        // Recomendaciones
        $this->info("\n🎯 RECOMENDACIONES:");
        if ($fixed > 0) {
            $this->line("1. Edita las {$fixed} obras limpiadas para subir nuevas imágenes");
        }
        if ($deleted > 0) {
            $this->line("2. {$deleted} obras fueron eliminadas (ya no existen)");
        }
        if (empty($problems)) {
            $this->line("✅ ¡Todas las obras están OK!");
        }
        
        return 0;
    }
}