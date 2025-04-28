<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KurirController;
use App\Http\Controllers\ProfileController;
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

    //driver    
    Route::get('/driver/home', [DriverController::class, 'index'])->name('driver.home');



    //kurir
    Route::get('/kurir/home', [KurirController::class, 'index'])->name('kurir.home');


    Route::post('/customers/logout', [CustomerController::class, 'logout'])->name('customers.logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
