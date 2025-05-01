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
        Schema::table('shipping_orders', function (Blueprint $table) {
            $table->unsignedBigInteger('pickup_courier_id')->nullable()->after('courier_id');
            $table->unsignedBigInteger('delivery_courier_id')->nullable()->after('pickup_courier_id');
            $table->foreign('pickup_courier_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('delivery_courier_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_orders', function (Blueprint $table) {
            //
        });
    }
};
