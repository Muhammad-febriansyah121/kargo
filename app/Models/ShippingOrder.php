<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingOrder extends Model
{
    protected $guarded = [];
    protected $with = ['originCity', 'destinationCity', 'shippingRate', 'transaction', 'customer', 'pickupCourier', 'deliveryCourier', 'driver', 'author'];

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

    public function courier()
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function pickupCourier()
    {
        return $this->belongsTo(User::class, 'pickup_courier_id');
    }

    public function deliveryCourier()
    {
        return $this->belongsTo(User::class, 'delivery_courier_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function trackingHistory()
    {
        return $this->hasMany(TrackingHistory::class);
    }
}
