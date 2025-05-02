<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\KurirController;
use App\Http\Controllers\PaymentController;
use App\Models\ShippingOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/sendbarang', [CustomerController::class, 'sendbarang'])->name('sendbarang');

Route::get('/barcode/{tracking}', function ($tracking) {
    $barcode = (new \Milon\Barcode\DNS1D)->getBarcodePNG($tracking, 'C39');
    return response()->json([
        'image' => 'data:image/png;base64,' . $barcode
    ]);
});

// Route::middleware('auth:sanctum')->group(function () {
Route::get('/dropoff', [KurirController::class, 'pengantaran']);
Route::get('/pickup', [KurirController::class, 'pickup']);
// });

Route::get('/api/cek-resi/{invoice_number}', function ($invoice_number) {
    $trx = \App\Models\Transaction::where('invoice_number', $invoice_number)->first();

    if (!$trx) {
        return response()->json(['message' => 'Resi tidak ditemukan.'], 404);
    }

    return response()->json($trx);
});




Route::get('/find-tracking/{trackingNumber}', [DriverController::class, 'findByTracking']);
Route::post('/midtrans-callback', [PaymentController::class, 'callback'])->name('midtrans-callback');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
