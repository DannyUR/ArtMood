<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Work extends Model
{
    use HasFactory;

    protected $table = 'works';
    protected $primaryKey = 'id_obra';

    protected $fillable = [
        'title',
        'description',
        'image',
        'published_at',
        'id_usuario',
        'id_categoria',
        'id_emocion'
    ];

    protected $appends = ['image_url']; // Agregar image_url a las respuestas JSON

    // Si usas timestamps personalizados
    const CREATED_AT = 'published_at';
    const UPDATED_AT = null;

    // ACCESSOR para obtener la URL completa de la imagen - CORREGIDO
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        
        Log::info('Calculando image_url para obra ' . $this->id_obra, [
            'image_field' => $this->image,
            'es_temporal' => $this->isTemporaryPath($this->image)
        ]);
        
        // 🔴 DETECTAR Y BLOQUEAR RUTAS TEMPORALES
        if ($this->isTemporaryPath($this->image)) {
            Log::warning('Ruta temporal detectada en getImageUrlAttribute', [
                'work_id' => $this->id_obra,
                'image_path' => $this->image
            ]);
            return null; // No retornar URL para rutas temporales
        }
        
        // Si ya es una URL completa (no debería pasar)
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }
        
        // Si es una ruta relativa válida (ej: 'obras/filename.jpg')
        // NOTA: El accessor 'asset()' ya añade el dominio base
        return asset('storage/' . $this->image);
    }
    
    // MUTATOR para limpiar y validar la ruta de la imagen - CORREGIDO
    public function setImageAttribute($value)
    {
        Log::info('setImageAttribute llamado', [
            'value' => $value,
            'es_temporal' => $this->isTemporaryPath($value)
        ]);
        
        // Si es una ruta temporal, establecer como null y loguear
        if ($this->isTemporaryPath($value)) {
            $this->attributes['image'] = null;
            Log::warning('Se intentó guardar ruta temporal como imagen', [
                'work_id' => $this->id_obra ?? 'new',
                'bad_path' => $value
            ]);
        } else {
            $this->attributes['image'] = $value;
        }
    }
    
    // Método helper para detectar rutas temporales
    private function isTemporaryPath($path)
    {
        if (!is_string($path)) {
            return false;
        }
        
        // Detectar rutas temporales de Windows (XAMPP/WAMP)
        $temporaryIndicators = [
            '\\tmp\\',
            'php',
            'xampp\\tmp',
            'wamp\\tmp',
            'temp\\',
            'C:\\',
            ':\\\\'
        ];
        
        foreach ($temporaryIndicators as $indicator) {
            if (str_contains($path, $indicator)) {
                return true;
            }
        }
        
        return false;
    }

    // Relación con usuario
    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    // Relación con categoría
    public function category()
    {
        return $this->belongsTo(Category::class, 'id_categoria', 'id_categoria');
    }

    // Relación con emoción
    public function emotion()
    {
        return $this->belongsTo(Emotion::class, 'id_emocion', 'id_emocion');
    }

    // Relación con reacciones
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'id_obra', 'id_obra');
    }

    // Relación con comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class, 'id_obra', 'id_obra');
    }
}