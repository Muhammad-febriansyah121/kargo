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
        Schema::create('tracking_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shipping_order_id');
            $table->string('status'); // pickup, in_warehouse, on_delivery, delivered
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->foreign('shipping_order_id')->references('id')->on('shipping_orders')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_histories');
    }
};
