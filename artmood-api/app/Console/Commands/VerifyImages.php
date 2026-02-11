<?php

namespace App\Console\Commands;

use App\Models\Work;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class VerifyImages extends Command
{
    protected $signature = 'images:verify {--fix : Corregir automáticamente}';
    protected $description = 'Verifica y corrige rutas de imágenes';

    public function handle()
    {
        $this->info('🔍 Verificando imágenes de obras...');
        
        $works = Work::all();
        $total = $works->count();
        $problems = [];
        $fixed = 0;
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();
        
        foreach ($works as $work) {
            $issue = null;
            
            if (!$work->image) {
                $issue = 'Sin imagen en BD';
            } elseif (!Storage::disk('public')->exists($work->image)) {
                $issue = 'Imagen no existe en storage';
                
                // Intentar encontrar en diferentes ubicaciones
                $possiblePaths = [
                    $work->image,
                    'obras/' . $work->image,
                    'obras/' . basename($work->image),
                    str_replace('storage/', '', $work->image)
                ];
                
                $found = false;
                foreach ($possiblePaths as $path) {
                    if (Storage::disk('public')->exists($path)) {
                        $this->warn("  ✓ Encontrada en: {$path}");
                        
                        if ($this->option('fix')) {
                            $work->update(['image' => $path]);
                            $fixed++;
                            $this->info("  🔧 Corregido: {$work->image} -> {$path}");
                        }
                        $found = true;
                        break;
                    }
                }
                
                if (!$found) {
                    $this->error("  ✗ No encontrada en ninguna ubicación");
                    
                    if ($this->option('fix')) {
                        $work->update(['image' => null]);
                        $fixed++;
                        $this->info("  🗑️  Imagen eliminada de BD");
                    }
                }
            }
            
            if ($issue) {
                $problems[] = [
                    'id' => $work->id_obra,
                    'title' => $work->title,
                    'issue' => $issue,
                    'path' => $work->image
                ];
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        
        $this->newLine(2);
        $this->info('📊 RESUMEN:');
        $this->line("Total obras: {$total}");
        $this->line("Problemas encontrados: " . count($problems));
        $this->line("Corregidos automáticamente: {$fixed}");
        
        if (count($problems) > 0) {
            $this->warn("\n⚠️  PROBLEMAS DETECTADOS:");
            $this->table(['ID', 'Título', 'Problema', 'Ruta'], array_map(function($p) {
                return [$p['id'], $p['title'], $p['issue'], $p['path']];
            }, $problems));
            
            $this->info("\n🎯 RECOMENDACIONES:");
            $this->line("1. Para corregir automáticamente: php artisan images:verify --fix");
            $this->line("2. Subir imágenes faltantes manualmente");
            $this->line("3. Verificar que el storage link esté creado: php artisan storage:link");
        } else {
            $this->info('✅ ¡Todas las imágenes están OK!');
        }
        
        return 0;
    }
}