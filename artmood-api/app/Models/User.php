<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $keyType = 'int';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'nickname',
        'email',
        'password',
        'profile_photo',
    ];

    protected $hidden = ['password', 'remember_token',];

    // Un usuario tiene muchas obras
    public function works()
    {
        return $this->hasMany(Work::class, 'id_usuario');
    }

    // Un usuario tiene muchos comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class, 'id_usuario');
    }

    // Un usuario tiene muchas reacciones
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'id_usuario');
    }

    // Un usuario sigue a muchos
    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'id_seguidor', 'id_seguido');
    }

    // Un usuario es seguido por muchos
    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'id_seguido', 'id_seguidor');
    }

    // Un usuario tiene notificaciones
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_usuario');
    }  

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

        public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
