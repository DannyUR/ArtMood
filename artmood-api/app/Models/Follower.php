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

    public function follower()
    {
        return $this->belongsTo(User::class, 'id_seguidor');
    }

    public function followed()
    {
        return $this->belongsTo(User::class, 'id_seguido');
    }
}
