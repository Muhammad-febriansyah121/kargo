<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [
        'id',
    ];
    protected $with = ['city', 'warehouse', 'pesantren'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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

    public function canAccessPanel(Panel $panel): bool
    {
        $user = Auth::user();
        if ($panel->getId() === 'admin' && $user->role === 'admin' || $user->role === 'mitra') {
            return true;
        }

        return false;
    }

    public function news()
    {
        return $this->hasMany(News::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(WareHouse::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function shippingOrders()
    {
        return $this->hasMany(ShippingOrder::class);
    }

    public function trackingHistory()
    {
        return $this->hasMany(TrackingHistory::class);
    }

    public function pesantren()
    {
        return $this->belongsTo(Pesantren::class);
    }
}
