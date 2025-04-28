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
        Schema::table('tracking_histories', function (Blueprint $table) {
            $table->foreignId('warehouse_id')->nullable()->after('shipping_order_id')->constrained('ware_houses')->nullOnDelete();
            $table->foreignId('courier_id')->nullable()->after('warehouse_id')->constrained('users')->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->after('courier_id')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tracking_histories', function (Blueprint $table) {
            //
        });
    }
};
