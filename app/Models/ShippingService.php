<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingService extends Model
{
    protected $guarded = [];

    public function shippingRates()
    {
        return $this->hasMany(ShippingRate::class);
    }
}
