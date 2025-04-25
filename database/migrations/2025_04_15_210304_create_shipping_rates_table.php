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
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shipping_service_id');
            $table->unsignedBigInteger('shipping_zone_id');
            $table->float('price_per_kg')->default(0); // Biaya berdasarkan berat (kg)
            $table->float('price_per_volume')->default(0); // Biaya berdasarkan volume (panjang x lebar x tinggi)
            $table->float('min_price')->nullable(); // Harga minimum untuk pengiriman
            $table->integer('estimation_days_min')->nullable(); // Estimasi pengiriman minimal (hari)
            $table->integer('estimation_days_max')->nullable(); // Estimasi pengiriman maksimal (hari)
            $table->foreign('shipping_service_id')
                ->references('id')
                ->on('shipping_services')
                ->onDelete('cascade');
            $table->foreign('shipping_zone_id')
                ->references('id')
                ->on('shipping_zones')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
