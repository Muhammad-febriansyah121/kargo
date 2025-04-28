<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];
    protected $with = ['ShippingOrder', 'user'];

    public function ShippingOrder()
    {
        return $this->belongsTo(ShippingOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
