<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KurirController;
use App\Http\Controllers\ProfileController;
use App\Models\Transaction;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home/faq', [HomeController::class, 'faq'])->name('home.faq');
Route::get('/home/visimisi', [HomeController::class, 'visimisi'])->name('home.visimisi');
Route::get('/home/term', [HomeController::class, 'term'])->name('home.term');
Route::get('/home/privacypolicy', [HomeController::class, 'privacypolicy'])->name('home.privacypolicy');
Route::get('/home/definisi', [HomeController::class, 'definisi'])->name('home.definisi');
Route::get('/home/news', [HomeController::class, 'news'])->name('home.news');
Route::get('/home/newsdetail/{slug}', [HomeController::class, 'newsdetail'])->name('home.newsdetail');
Route::get('/home/contact', [HomeController::class, 'contact'])->name('home.contact');
Route::get('/home/aboutus', [HomeController::class, 'aboutus'])->name('home.aboutus');

Route::get('/cek-resi/{invoice_number}', [HomeController::class, 'cekResiPage']);
Route::post('/cek-ongkir', [HomeController::class, 'cekOngkir'])->name('cek.ongkir');


Route::get('/home/register', [HomeController::class, 'register'])->name('home.register');
Route::post('/home/saveregister', [HomeController::class, 'saveregister'])->name('home.saveregister');

Route::get('/home/login', [HomeController::class, 'login'])->name('home.login');
Route::post('/home/checklogin', [HomeController::class, 'checklogin'])->name('home.checklogin');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/customers/home', [CustomerController::class, 'index'])->name('customers.home');
    Route::get('/customers/kirimbarang', [CustomerController::class, 'kirimbarang'])->name('customers.kirimbarang');
    Route::post('/customers/sendbarang', [CustomerController::class, 'sendbarang'])->name('customers.sendbarang');
    Route::get('/customers/successPayment/{invoice_number}', [CustomerController::class, 'successPayment'])->name('customers.successPayment');
    Route::get('/customers/riwayatpengiriman', [CustomerController::class, 'riwayatpengiriman'])->name('customers.riwayatpengiriman');
    Route::get('/customers/detailriwayatpengiriman/{invoice_number}', [CustomerController::class, 'detailriwayatpengiriman'])->name('customers.detailriwayatpengiriman');
    Route::get('/customers/profile', [CustomerController::class, 'profile'])->name('customers.profile');
    Route::post('/customers/updateprofile', [CustomerController::class, 'updateprofile'])->name('customers.updateprofile');
    Route::get('/customers/downloadBarcode/{invoice_number}', [CustomerController::class, 'downloadBarcode'])->name('customers.downloadBarcode');
    Route::get('/customers/selesai/{invoice_number}', [CustomerController::class, 'selesai'])->name('customers.selesai');

    //driver    
    Route::get('/driver/home', [DriverController::class, 'index'])->name('driver.home');
    Route::get('/driver/scan', [DriverController::class, 'scan'])->name('driver.scan');
    Route::post('/driver/prosesKirim', [DriverController::class, 'prosesKirim'])->name('driver.prosesKirim');
    Route::post('/scan-result', [DriverController::class, 'handle']);
    Route::get('/driver/pengiriman', [DriverController::class, 'pengiriman'])->name('driver.pengiriman');
    Route::get('/driver/detailpengiriman/{tracking_number}', [DriverController::class, 'detailpengiriman'])->name('driver.detailpengiriman');
    Route::get('/driver/profile', [DriverController::class, 'profile'])->name('driver.profile');
    Route::post('/driver/updateprofile', [DriverController::class, 'updateprofile'])->name('driver.updateprofile');


    //kurir
    Route::get('/kurir/home', [KurirController::class, 'index'])->name('kurir.home');
    Route::get('/kurir/scan', [KurirController::class, 'scan'])->name('kurir.scan');
    Route::get('/kurir/pengiriman', [KurirController::class, 'pengiriman'])->name('kurir.pengiriman');
    Route::get('/kurir/detailpengiriman/{tracking_number}', [KurirController::class, 'detailpengiriman'])->name('kurir.detailpengiriman');
    Route::post('/kurir/scan-result', [KurirController::class, 'handle']);
    Route::post('/kurir/prosesKirim', [KurirController::class, 'prosesKirim'])->name('kurir.prosesKirim');
    Route::get('/kurir/profile', [KurirController::class, 'profile'])->name('kurir.profile');
    Route::post('/kurir/updateprofile', [KurirController::class, 'updateprofile'])->name('kurir.updateprofile');
    Route::get('/dropoff', [KurirController::class, 'pengantaran']);
    Route::get('/pickup', [KurirController::class, 'pickup']);


    Route::post('/customers/logout', [CustomerController::class, 'logout'])->name('customers.logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
