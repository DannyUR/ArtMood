<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true; // Cambiado a true porque tienes created_at
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null; // No tienes updated_at

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',           // inglés
        'nickname',       // inglés  
        'email',          // inglés
        'password',       // inglés
        'profile_photo',  // inglés - CORREGIDO: de foto_perfil a profile_photo
        'role',           // inglés
        'last_notification_check' // inglés
    ];

    protected $hidden = [
        'password', 
        'remember_token'
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'created_at' => 'datetime',
            'last_notification_check' => 'datetime'
        ];
    }

    // Para JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Relaciones
    public function works()
    {
        return $this->hasMany(Work::class, 'id_usuario', 'id_usuario');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'id_usuario', 'id_usuario');
    }

    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'id_usuario', 'id_usuario');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'id_seguidor', 'id_seguido');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'id_seguido', 'id_seguidor');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_usuario', 'id_usuario');
    }
}