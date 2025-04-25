<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingOrder extends Model
{
    protected $guarded = [];
    protected $with = ['originCity', 'destinationCity', 'shippingRate', 'transaction'];

    // Model ShippingOrder.php
    public function originCity()
    {
        return $this->belongsTo(City::class, 'origin_city_id');
    }

    public function destinationCity()
    {
        return $this->belongsTo(City::class, 'destination_city_id');
    }

    public function shippingRate()
    {
        return $this->belongsTo(ShippingRate::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
