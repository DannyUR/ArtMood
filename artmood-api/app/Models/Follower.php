<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{

    protected $primaryKey = 'id_follower';
    
    protected $table = 'followers';

    public $timestamps = false;

    protected $fillable = [
        'id_seguidor',
        'id_seguido',
    ];

    // usuario que sigue (seguidor)
    public function seguidor()
    {
        return $this->belongsTo(User::class, 'id_seguidor', 'id_usuario');
    }

    // usuario que es seguido (seguido)
    public function seguido()
    {
        return $this->belongsTo(User::class, 'id_seguido', 'id_usuario');
    }
}
