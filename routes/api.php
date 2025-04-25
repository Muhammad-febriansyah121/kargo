<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/sendbarang', [CustomerController::class, 'sendbarang'])->name('sendbarang');

Route::get('/barcode/{tracking}', function ($tracking) {
    $barcode = (new \Milon\Barcode\DNS1D)->getBarcodePNG($tracking, 'C39');
    return response()->json([
        'image' => 'data:image/png;base64,' . $barcode
    ]);
});
