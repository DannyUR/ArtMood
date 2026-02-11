<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    const CREATED_AT = 'published_at';
    const UPDATED_AT = null;

    // ✅ DESCOMENTAR Y MEJORAR LOS ACCESSORS/MUTATORS
    protected $appends = ['image_url'];

    /**
     * Accessor para obtener la URL completa de la imagen
     */
    public function getImageUrlAttribute()
    {
        if (empty($this->image)) {
            return null;
        }
        
        // Si ya es una URL completa (http://...), retornarla
        if (strpos($this->image, 'http') === 0 || strpos($this->image, 'https') === 0) {
            return $this->image;
        }
        
        // Si empieza con 'obras/', usar asset('storage/...')
        if (strpos($this->image, 'obras/') === 0) {
            return asset('storage/' . $this->image);
        }
        
        // Si solo es un nombre de archivo, agregar 'obras/'
        return asset('storage/obras/' . $this->image);
    }

    /**
     * Mutador para normalizar la ruta de la imagen
     */
    public function setImageAttribute($value)
    {
        // Si viene vacío
        if (empty($value)) {
            $this->attributes['image'] = null;
            return;
        }
        
        // Si ya es una URL, no hacer nada (probablemente de un seeder)
        if (strpos($value, 'http') === 0 || strpos($value, 'https') === 0) {
            $this->attributes['image'] = $value;
            return;
        }
        
        // Limpiar la ruta
        $value = ltrim($value, '/');
        
        // Asegurar que tenga 'obras/' al inicio si no lo tiene
        if (strpos($value, 'obras/') !== 0 && !str_contains($value, '/')) {
            $this->attributes['image'] = 'obras/' . $value;
        } else {
            $this->attributes['image'] = $value;
        }
    }

    // ✅ MANTENER LAS RELACIONES
    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_categoria', 'id_categoria');
    }

    public function emotion()
    {
        return $this->belongsTo(Emotion::class, 'id_emocion', 'id_emocion');
    }
}