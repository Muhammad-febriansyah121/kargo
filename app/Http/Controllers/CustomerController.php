<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Pesantren;
use App\Models\Setting;
use App\Models\ShippingOrder;
use App\Models\ShippingRate;
use App\Models\ShippingService;
use App\Models\ShippingZone;
use App\Models\TrackingHistory;
use App\Models\Transaction;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Milon\Barcode\DNS1D;
use Illuminate\Support\Str;
use Picqer\Barcode\BarcodeGeneratorPNG;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class CustomerController extends Controller
{
    public function index()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $trx = Transaction::where('user_id', $auth->id)->latest()->count();
        $sudahbayar = Transaction::where('user_id', $auth->id)->where('status', 'paid')->count();
        $belumbayar = Transaction::where('user_id', $auth->id)->where('status', 'pending')->count();
        return Inertia::render('Customer/Home/Index', compact('setting', 'auth', 'trx', 'sudahbayar', 'belumbayar'));
    }

    public function kirimbarang()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $city = City::all();
        $service = ShippingService::all();
        $rate = ShippingRate::all();
        return Inertia::render('Customer/KirimBarang/Index', compact('setting', 'auth', 'city', 'service', 'rate'));
    }


    public function cekBiaya(Request $request)
    {
        $panjang = $request->panjang;
        $lebar = $request->lebar;
        $tinggi = $request->tinggi;
        $berat = $request->berat;
        $shipping_service_id = $request->shipping_service_id; // 1 untuk Udara, 2 untuk Darat
        $origin_city_id = Auth::user()->city_id;
        $destination_city_id = $request->destination_city_id;
        $volume = $panjang * $lebar * $tinggi;
        $shippingService = ShippingService::find($shipping_service_id);
        $divisor = $shippingService->price; // Misalnya harga per kg atau harga divisor berdasarkan layanan pengiriman
        $beratVolume = $volume / $divisor;
        $beratFinal = max($berat, $beratVolume);
        $shippingZone = ShippingZone::where([
            ['origin_city_id', '=', $origin_city_id],
            ['destination_city_id', '=', $destination_city_id]
        ])->first();
        $shippingRate = ShippingRate::where('shipping_zone_id', $shippingZone->id)
            ->where('shipping_service_id', $shipping_service_id)
            ->first();
        if ($shippingRate) {
            $biaya = $beratFinal * $shippingRate->price_per_kg;
        } else {
            $biaya = 0;
        }
        return response()->json(['cost' => $biaya]);
    }

    public function sendbarang(Request $request)
    {
        try {
            $user = Auth::user();
            $originCity = City::find($user->city_id);
            $destinationCity = City::find($request->destination_city_id);

            if (!$originCity || !$destinationCity) {
                return response()->json(['error' => 'Kota asal atau tujuan tidak valid.'], 400);
            }

            $shippingZone = ShippingZone::where('origin_city_id', $originCity->id)
                ->where('destination_city_id', $destinationCity->id)
                ->first();

            if (!$shippingZone) {
                return response()->json(['error' => 'Zona pengiriman tidak ditemukan.'], 400);
            }

            $shippingRate = ShippingRate::where('shipping_zone_id', $shippingZone->id)
                ->where('shipping_service_id', $request->shipping_service_id)
                ->first();

            if (!$shippingRate) {
                return response()->json(['error' => 'Tarif layanan tidak tersedia.'], 400);
            }

            $shippingService = ShippingService::find($request->shipping_service_id);

            $panjang = $request->panjang;
            $lebar = $request->lebar;
            $tinggi = $request->tinggi;
            $beratAktual = $request->berat;

            $volume = $panjang * $lebar * $tinggi;
            $divisor = $shippingService->price;
            $beratVolume = $volume / $divisor;
            $finalWeight = max($beratAktual, $beratVolume);

            $shippingCost = ceil($finalWeight) * $shippingRate->price_per_kg;

            $trackingNumber = 'INV' . now()->format('YmdHis') . Str::upper(Str::random(3));
            $filename = $trackingNumber . '.png';
            $qrPath = 'qrcodes/' . $filename;

            Storage::disk('public')->makeDirectory('qrcodes');
            $qrImage = QrCode::format('png')->size(300)->errorCorrection('H')->margin(4)->generate($trackingNumber);
            Storage::disk('public')->put($qrPath, $qrImage);

            $nomorTujuan = Str::startsWith($request->recipient_phone, '08')
                ? '62' . substr($request->recipient_phone, 1)
                : $request->recipient_phone;

            $estimationDate = Carbon::now()->addDays($shippingRate->estimation_day_max)->format('Y-m-d');

            $orderData = [
                'barcode' => 'storage/' . $qrPath,
                'tracking_number' => $trackingNumber,
                'origin_city_id' => $user->city_id,
                'customer_id' => $user->id,
                'nama_barang' => $request->nama_barang,
                'berat' => $request->berat,
                'panjang' => $request->panjang,
                'tinggi' => $request->tinggi,
                'lebar' => $request->lebar,
                'destination_city_id' => $request->destination_city_id,
                'shipping_rate_id' => $shippingRate->id,
                'recipient_name' => $request->recipient_name,
                'recipient_address' => $request->recipient_address,
                'recipient_phone' => $nomorTujuan,
                'payment_method' => $request->payment_method,
                'pickup_type' => $request->pickup_type,
                'pickup_address' => $request->pickup_address,
                'notes' => $request->notes,
                'estimation_date' => $estimationDate,
            ];

            if ($user->role === "santri") {
                $pesantren = Pesantren::findOrFail($user->pesantren_id);
                $orderData['author_id'] = $pesantren->author;
            }

            $order = ShippingOrder::create($orderData);

            $trx = Transaction::create([
                'user_id' => $user->id,
                'shipping_order_id' => $order->id,
                'invoice_number' => $trackingNumber,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'amount' => $shippingCost,
            ]);

            if ($request->payment_method === 'transfer') {
                \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
                \Midtrans\Config::$clientKey = config('services.midtrans.client_key');
                \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
                \Midtrans\Config::$isSanitized = config('services.midtrans.is_sanitized');
                \Midtrans\Config::$is3ds = config('services.midtrans.is_3ds');
                \Midtrans\Config::$overrideNotifUrl = config('app.url') . '/api/midtrans-callback';

                $params = [
                    'transaction_details' => [
                        'order_id' => $trackingNumber,
                        'gross_amount' => $trx->amount,
                    ],
                    'item_details' => [[
                        'id' => $trx->id,
                        'price' => $trx->amount,
                        'quantity' => 1,
                        'name' => $order->nama_barang,
                        'category' => $shippingRate->shippingService->name,
                    ]],
                    'customer_details' => [
                        'first_name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'address' => $user->address ?? 'Indonesia',
                    ],
                ];

                try {
                    $snapResponse = \Midtrans\Snap::createTransaction($params);
                    $trx->payment_url = $snapResponse->redirect_url;
                    $trx->save();

                    return response()->json(['redirect_url' => $trx->payment_url]);
                } catch (\Exception $e) {
                    Log::error('Midtrans error: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Gagal membuat transaksi Midtrans: ' . $e->getMessage()
                    ], 500);
                }
            }

            $trx->payment_url = route('customers.successPayment', ['invoice_number' => $trx->invoice_number]);
            $trx->save();

            return response()->json(['redirect_url' => $trx->payment_url]);
        } catch (\Throwable $e) {
            Log::error('sendbarang error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan internal. ' . $e->getMessage()
            ], 500);
        }
    }



    public function sendbarangold(Request $request)
    {
        try {
            $user = Auth::user();
            $originCity = City::find($user->city_id);
            $destinationCity = City::find($request->destination_city_id);

            if (!$originCity || !$destinationCity) {
                return response()->json(['error' => 'Kota asal atau tujuan tidak valid.'], 400);
            }

            $shippingZone = ShippingZone::where('origin_city_id', $originCity->id)
                ->where('destination_city_id', $destinationCity->id)
                ->first();

            if (!$shippingZone) {
                return response()->json(['error' => 'Zona pengiriman tidak ditemukan.'], 400);
            }

            $shippingRate = ShippingRate::where('shipping_zone_id', $shippingZone->id)
                ->where('shipping_service_id', $request->shipping_service_id)
                ->first();

            if (!$shippingRate) {
                return response()->json(['error' => 'Tarif layanan tidak tersedia.'], 400);
            }

            $panjang = $request->panjang / 100;
            $lebar = $request->lebar / 100;
            $tinggi = $request->tinggi / 100;
            $volume = $panjang * $lebar * $tinggi;

            $weightCost = $request->berat * $shippingRate->price_per_kg;
            $volumeCost = $volume * $shippingRate->price_per_volume;
            $shippingCost = max($weightCost, $volumeCost, $shippingRate->min_price);

            $trackingNumber = 'INV' . now()->format('YmdHis') . Str::upper(Str::random(3));
            $filename = $trackingNumber . '.png';
            $qrPath = 'qrcodes/' . $filename;

            Storage::disk('public')->makeDirectory('qrcodes');
            $qrImage = QrCode::format('png')->size(300)->errorCorrection('H')->margin(4)->generate($trackingNumber);
            Storage::disk('public')->put($qrPath, $qrImage);

            $nomorTujuan = Str::startsWith($request->recipient_phone, '08')
                ? '62' . substr($request->recipient_phone, 1)
                : $request->recipient_phone;

            $estimationDate = Carbon::now()->addDays($shippingRate->estimation_day_max)->format('Y-m-d');

            $orderData = [
                'barcode' => 'storage/' . $qrPath,
                'tracking_number' => $trackingNumber,
                'origin_city_id' => $user->city_id,
                'customer_id' => $user->id,
                'nama_barang' => $request->nama_barang,
                'berat' => $request->berat,
                'panjang' => $request->panjang,
                'tinggi' => $request->tinggi,
                'lebar' => $request->lebar,
                'destination_city_id' => $request->destination_city_id,
                'shipping_rate_id' => $shippingRate->id,
                'recipient_name' => $request->recipient_name,
                'recipient_address' => $request->recipient_address,
                'recipient_phone' => $nomorTujuan,
                'payment_method' => $request->payment_method,
                'pickup_type' => $request->pickup_type,
                'pickup_address' => $request->pickup_address,
                'notes' => $request->notes,
                'estimation_date' => $estimationDate,
            ];

            if ($user->role === "santri") {
                $pesantren = Pesantren::findOrFail($user->pesantren_id);
                $orderData['author_id'] = $pesantren->author;
            }
            $order = ShippingOrder::create($orderData);
            $trx = Transaction::create([
                'user_id' => $user->id,
                'shipping_order_id' => $order->id,
                'invoice_number' => $trackingNumber,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'amount' => $shippingCost,
            ]);
            if ($request->payment_method === 'transfer') {
                \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
                \Midtrans\Config::$clientKey = config('services.midtrans.client_key');
                \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
                \Midtrans\Config::$isSanitized = config('services.midtrans.is_sanitized');
                \Midtrans\Config::$is3ds = config('services.midtrans.is_3ds');
                \Midtrans\Config::$overrideNotifUrl = config('app.url') . '/api/midtrans-callback';

                $params = [
                    'transaction_details' => [
                        'order_id' => $trackingNumber,
                        'gross_amount' => $trx->amount,
                    ],
                    'item_details' => [[
                        'id' => $trx->id,
                        'price' => $trx->amount,
                        'quantity' => 1,
                        'name' => $order->nama_barang,
                        'category' => $shippingRate->shippingService->name,
                    ]],
                    'customer_details' => [
                        'first_name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'address' => $user->address ?? 'Indonesia',
                    ],
                ];

                try {
                    $snapResponse = \Midtrans\Snap::createTransaction($params);
                    $trx->payment_url = $snapResponse->redirect_url;
                    $trx->save();

                    return response()->json(['redirect_url' => $trx->payment_url]);
                } catch (\Exception $e) {
                    Log::error('Midtrans error: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Gagal membuat transaksi Midtrans: ' . $e->getMessage()
                    ], 500);
                }
            }
            $trx->payment_url = route('customers.successPayment', ['invoice_number' => $trx->invoice_number]);
            $trx->save();
            return response()->json(['redirect_url' => $trx->payment_url]);
        } catch (\Throwable $e) {
            Log::error('sendbarang error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan internal. ' . $e->getMessage()
            ], 500);
        }
    }


    public function callback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        $hashed = hash('sha512', $request->input('order_id') . $request->input('status_code') . $request->input('gross_amount') . $serverKey);
        if ($hashed !== $request->input('signature_key')) {
            return response()->json(['error' => 'Invalid signature'], 400);
        } else {
            $transaction = Transaction::where("invoice_number", $request->order_id)->firstOrFail();
            if ($request->input('transaction_status') == 'capture') {
                $transaction->status = 'paid';
            } else if ($request->input('transaction_status') == 'settlement') {
                $transaction->status = 'paid';
            } else if ($request->input('transaction_status') == 'pending') {
                $transaction->status = 'pending';
            } else if ($request->input('transaction_status') == 'deny') {
                $transaction->status = 'failed';
            } else if ($request->input('transaction_status') == 'expire') {
                $transaction->status = 'expired';
            } else if ($request->input('transaction_status') == 'cancel') {
                $transaction->status = 'canceled';
            }
            $transaction->save();
            return response()->json(['message' => 'Callback success']);
        }
    }

    public function successPayment($invoice_number)
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $trx = Transaction::where('invoice_number', $invoice_number)->first();
        $trackingNumber = $trx->invoice_number ?? null;

        // Generate barcode base64 jika tracking number tersedia
        $barcode = null;
        if ($trackingNumber) {
            $barcode = (new DNS1D)->getBarcodePNG($trackingNumber, 'C39');
        }

        return Inertia::render('Customer/KirimBarang/PaymentSuccess', [
            'trx' => $trx,
            'auth' => $auth,
            'setting' => $setting,
            'barcode' => $barcode ? 'data:image/png;base64,' . $barcode : null,
        ]);
    }

    public function riwayatpengiriman()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $trx = Transaction::where('user_id', $auth->id)->latest()->get();
        return Inertia::render('Customer/RiwayatPengiriman/Index', compact('setting', 'auth', 'trx'));
    }

    public function selesai($invoice_number)
    {
        $trx = ShippingOrder::where('tracking_number', $invoice_number)->first();
        $trx->status = 'selesai';
        $trx->save();
        return to_route('customers.riwayatpengiriman');
    }


    public function downloadBarcode($invoice_number)
    {
        $setting = Setting::first();
        $trx = Transaction::where('invoice_number', $invoice_number)->firstOrFail();
        $barcode = (new \Milon\Barcode\DNS1D)->getBarcodePNG($trx->invoice_number, 'C39', 1.5, 35);
        $customPaper = [0, 0, 141.73, 255]; // width: 50mm (141.73 pt), height: 90mm (255 pt)
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf', compact('trx', 'barcode', 'setting'));
        $pdf->setPaper($customPaper, 'portrait');

        return $pdf->stream('resi-' . $trx->invoice_number . '.pdf');
    }


    public function detailriwayatpengiriman($invoice_number)
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $trx = Transaction::where('invoice_number', $invoice_number)->first();
        $tracking = TrackingHistory::where('shipping_order_id', $trx->shipping_order_id)->get();
        return Inertia::render('Customer/RiwayatPengiriman/Detail', compact('setting', 'auth', 'trx', 'tracking'));
    }

    public function profile()
    {
        $auth = Auth::user();
        $user = User::find($auth->id);
        $pesantren = Pesantren::all();
        $city = City::all();
        $setting = Setting::first();
        return Inertia::render('Customer/Profile/Index', compact('setting', 'auth', 'user', 'city', 'pesantren'));
    }

    public function updateprofile(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpg,png,jpeg,gif,svg|max:3048',
        ]);
        $user = User::findOrFail(Auth::user()->id);
        if ($request->file('image')) {
            $filename = $request->image->store('profile', 'public');
            $user->image = $filename;
        }
        $nomorTujuan = $request->phone;
        if (Str::startsWith($nomorTujuan, '08')) {
            $nomorTujuan = '62' . substr($nomorTujuan, 1);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->has('password') && $request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->city_id = $request->city_id;
        $user->phone = $nomorTujuan;
        $user->address = $request->address;
        $user->gender = $request->gender;
        $user->store = $request->store;
        $user->save();
    }


    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return to_route('home');
    }
}
