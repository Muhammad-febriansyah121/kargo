<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingHistory extends Model
{
    protected $guarded = [];
    protected $with = ['shippingOrder', 'user', 'warehouse'];

    public function shippingOrder()
    {
        return $this->belongsTo(ShippingOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
