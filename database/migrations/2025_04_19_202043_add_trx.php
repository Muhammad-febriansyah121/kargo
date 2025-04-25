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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('shipping_order_id');
            $table->string('invoice_number')->unique();
            $table->string('payment_method');
            $table->string('payment_url')->nullable();
            $table->string('status')->default('pending');
            $table->integer('amount')->default(0);
            $table->string('image')->nullable();
            $table->foreign('shipping_order_id')->references('id')->on('shipping_orders')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
