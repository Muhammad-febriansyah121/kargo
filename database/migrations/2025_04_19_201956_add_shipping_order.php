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
            // $table->unsignedBigInteger('shipping_service_id');
            $table->unsignedBigInteger('shipping_rate_id');
            $table->unsignedBigInteger('courier_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();

            $table->string('tracking_number')->unique();
            $table->string('barcode')->nullable();

            $table->string('nama_barang');
            $table->decimal('berat', 10, 2);
            $table->decimal('panjang', 10, 2)->nullable();
            $table->decimal('lebar', 10, 2)->nullable();
            $table->decimal('tinggi', 10, 2)->nullable();
            $table->decimal('harga_barang', 10, 2)->nullable();

            $table->enum('pickup_type', ['pickup', 'dropoff'])->default('pickup');
            $table->text('pickup_address')->nullable(); // jika user memilih 'pickup', bisa beda dari alamat user

            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('recipient_address');

            $table->enum('payment_method', ['cash', 'transfer', 'midtrans'])->default('cash');
            $table->enum('payment_status', ['unpaid', 'paid', 'pending'])->default('unpaid');

            // $table->boolean('is_insured')->default(false);
            // $table->decimal('insurance_fee', 10, 2)->nullable();

            $table->enum('status', ['pending', 'pickup', 'in_transit', 'delivered', 'cancelled'])->default('pending');
            $table->date('estimation_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('delivery_proof')->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('origin_city_id')->references('id')->on('cities');
            $table->foreign('destination_city_id')->references('id')->on('cities');
            // $table->foreign('shipping_service_id')->references('id')->on('shipping_services');
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
