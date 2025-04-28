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
            $table->foreignId('warehouse_id')
                ->nullable() // Perbaiki dari 'nulable()' menjadi 'nullable()'
                ->constrained('ware_houses') // Pastikan nama tabel sesuai, ware_houses dengan underscore
                ->onDelete('cascade')
                ->after('customer_id');
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
