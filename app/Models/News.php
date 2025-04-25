<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $guarded = [];
    protected $with = ['categoryNews', 'user'];

    public function categoryNews()
    {
        return $this->belongsTo(CategoryNews::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
