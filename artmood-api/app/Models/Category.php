<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $table = 'categories';
    protected $primaryKey = 'id_categoria';

    protected $fillable = [
        'name',
        'description',
    ];

    // Una categoría tiene muchas obras
    public function works()
    {
        return $this->hasMany(Work::class, 'id_categoria', 'id_categoria');
    }
}
