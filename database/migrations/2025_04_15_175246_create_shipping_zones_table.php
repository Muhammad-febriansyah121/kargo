<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('origin_city_id');
            $table->unsignedBigInteger('destination_city_id');
            $table->float('distance_km')->nullable();
            $table->foreign('origin_city_id')->references('id')->on('cities');
            $table->foreign('destination_city_id')->references('id')->on('cities');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_zones');
    }
};
