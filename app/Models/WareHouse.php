<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WareHouse extends Model
{
    protected $guarded = [];
    protected $with = ['city'];
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function user()
    {
        return $this->hasMany(User::class);
    }


    public function trackingHistory()
    {
        return $this->hasMany(TrackingHistory::class);
    }
}
