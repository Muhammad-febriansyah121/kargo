<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    protected $guarded = [];
    protected $with = ['originCity', 'destinationCity'];

    public function originCity()
    {
        return $this->belongsTo(City::class, 'origin_city_id');
    }

    public function destinationCity()
    {
        return $this->belongsTo(City::class, 'destination_city_id');
    }

    public function shippingRates()
    {
        return $this->hasMany(ShippingRate::class);
    }
}
