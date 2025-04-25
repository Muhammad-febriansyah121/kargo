<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];
    protected $with = 'ShippingOrder';

    public function ShippingOrder()
    {
        return $this->belongsTo(ShippingOrder::class);
    }
}
