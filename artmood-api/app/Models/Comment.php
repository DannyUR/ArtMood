<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';
    protected $primaryKey = 'id_comentario';
    public $timestamps = false;

    protected $fillable = [
        'content',
        'id_usuario',
        'id_obra',
        'status',  // Cambiado de 'estado' a 'status'
        'commented_at'  // Añadido
    ];

    protected $casts = [
        'commented_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function work()
    {
        return $this->belongsTo(Work::class, 'id_obra', 'id_obra');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($comment) {
            $comment->commented_at = now(); // Usa la fecha actual del servidor
        });
    }
}

