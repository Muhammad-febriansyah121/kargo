<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Teguh02\IndonesiaTerritoryForms\Models\City as ModelsCity;
use Teguh02\IndonesiaTerritoryForms\Models\District;
use Teguh02\IndonesiaTerritoryForms\Models\PostalCode;
use Teguh02\IndonesiaTerritoryForms\Models\Province;

class City extends Model
{
    protected $guarded = [];

    public function ShippingZone()
    {
        return $this->hasMany(ShippingZone::class);
    }

    public function shippingRates()
    {
        return $this->hasMany(ShippingRate::class);
    }

    public function user()
    {
        return $this->hasMany(User::class);
    }

    public function shippingOrder()
    {
        return $this->hasMany(ShippingOrder::class);
    }

    public function warehouse()
    {
        return $this->hasMany(WareHouse::class);
    }
}
