<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Emotion extends Model
{

    protected $table = 'emotions';
    protected $primaryKey = 'id_emocion';

    protected $fillable = [
        'name',
        'icon',
    ];

    // Una emoción tiene muchas obras
    public function works()
    {
        return $this->hasMany(Work::class, 'id_emocion', 'id_emocion');
    }

}
