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
        Schema::create('shipping_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('origin_city_id');
            $table->unsignedBigInteger('destination_city_id');
            $table->unsignedBigInteger('shipping_service_id');
            $table->unsignedBigInteger('shipping_rate_id');
            $table->unsignedBigInteger('courier_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->string('tracking_number')->unique();
            $table->string('barcode')->nullable();
            $table->string('nama_barang');
            $table->float('berat');
            $table->float('panjang')->nullable();
            $table->float('lebar')->nullable();
            $table->float('tinggi')->nullable();
            $table->float('harga_barang')->nullable();
            $table->string('status')->default('pending'); // pending, pickup, in_transit, delivered, etc.
            $table->date('estimation_date')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('origin_city_id')->references('id')->on('cities');
            $table->foreign('destination_city_id')->references('id')->on('cities');
            $table->foreign('shipping_service_id')->references('id')->on('shipping_services');
            $table->foreign('shipping_rate_id')->references('id')->on('shipping_rates');
            $table->foreign('courier_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('driver_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_orders');
    }
};
