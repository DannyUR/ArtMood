<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reaction extends Model
{

    protected $table = 'reactions';
    protected $primaryKey = 'id_reaccion';

    protected $fillable = [
        'emoji',
        'id_usuario',
        'id_obra',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }

    public function work()
    {
        return $this->belongsTo(Work::class, 'id_obra', 'id_obra');
    }
}

