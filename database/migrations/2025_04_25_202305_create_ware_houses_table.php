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
        Schema::create('ware_houses', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama warehouse
            $table->foreignId('city_id')->constrained()->onDelete('cascade'); // ID kota terkait
            $table->string('manager')->nullable(); // Nama manajer warehouse
            $table->text('address'); // Alamat lengkap warehouse
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ware_houses');
    }
};
