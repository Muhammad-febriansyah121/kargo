<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    protected $guarded = [];
    protected $with = ['shippingService', 'shippingZone'];

    // ShippingRate.php
    public function shippingService()
    {
        return $this->belongsTo(ShippingService::class);
    }

    public function shippingZone()
    {
        return $this->belongsTo(ShippingZone::class);
    }

    // ShippingZone.php
    public function originCity()
    {
        return $this->belongsTo(City::class, 'origin_city_id');
    }

    public function destinationCity()
    {
        return $this->belongsTo(City::class, 'destination_city_id');
    }

    public function shippingOrder()
    {
        return $this->hasMany(ShippingOrder::class);
    }
}
