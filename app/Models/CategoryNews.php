<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryNews extends Model
{
    protected $guarded = [];

    public function news()
    {
        $this->hasMany(News::class);
    }
}
