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
        Schema::table('shipping_services', function (Blueprint $table) {
            $table->string('jenis_pengiriman')->after('price')->nullable(); // contoh nilai: 'air', 'land'
            $table->integer('divisor')->default(0)->after('jenis_pengiriman'); // default bisa disesuaikan

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_services', function (Blueprint $table) {
            //
        });
    }
};
