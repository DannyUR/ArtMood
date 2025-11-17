<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{

    protected $table = 'works';
    protected $primaryKey = 'id_obra';

    protected $fillable = [
        'title',
        'description',
        'image',
        'id_usuario',
        'id_categoria',
        'id_emocion',
    ];

    // Relación con Usuario (obra pertenece a un usuario)
    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    // Relación con Categoría
    public function category()
    {
        return $this->belongsTo(Category::class, 'id_categoria', 'id_categoria');
    }

    // Relación con Emoción
    public function emotion()
    {
        return $this->belongsTo(Emotion::class, 'id_emocion', 'id_emocion');
    }

    // Relación con Comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class, 'id_obra');
    }

    // Relación con Reacciones
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'id_obra');
    }
}
