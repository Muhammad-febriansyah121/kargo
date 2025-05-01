<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Setting;
use App\Models\ShippingOrder;
use App\Models\TrackingHistory;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WareHouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DriverController extends Controller
{
    public function index()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $all = ShippingOrder::where('driver_id', $auth->id)->latest()->count();
        return Inertia::render('Driver/Home/Index', compact('setting', 'auth', 'all'));
    }

    public function scan()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $shipping = ShippingOrder::all();
        return Inertia::render('Driver/Scan/Index', compact('setting', 'auth'));
    }

    public function pengiriman()
    {
        $auth = Auth::user();
        $data = ShippingOrder::where('driver_id', $auth->id)->latest()->get();
        $setting = Setting::first();
        return Inertia::render('Driver/Pengiriman/Index', compact('setting', 'auth', 'data'));
    }

    public function detailpengiriman($tracking_number)
    {
        $auth = Auth::user();
        $data = ShippingOrder::where('tracking_number', $tracking_number)->firstOrFail();
        $setting = Setting::first();
        return Inertia::render('Driver/Pengiriman/Detail', compact('setting', 'auth', 'data'));
    }

    public function handle(Request $request)
    {
        $trackingNumber = $request->tracking_number;
        $order = Transaction::where(function ($query) use ($trackingNumber) {
            $query->where('invoice_number', $trackingNumber)
                ->orWhereHas('shippingOrder', function ($q) use ($trackingNumber) {
                    $q->where('tracking_number', $trackingNumber);
                });
        })->where('status', 'paid')->first();
        if (!$order) {
            return response()->json(['error' => 'Barang tidak ditemukan'], 404);
        }
        return response()->json(['data' => $order]);
    }


    public function prosesKirim(Request $request)
    {
        $invoice = $request->tracking_number;
        $shippingOrder = ShippingOrder::where('tracking_number', $invoice)->first();
        if (!$shippingOrder) {
            return response()->json(['error' => 'Transaksi tidak ditemukan'], 404);
        }
        // Cek status dan update status sesuai alur
        if ($shippingOrder->status == 'order_baru' || $shippingOrder->status == 'pickup') {
            $shippingOrder->status = 'dikirim';
            $shippingOrder->driver_id = Auth::user()->id;
            $tracking = new TrackingHistory();
            $tracking->shipping_order_id = $shippingOrder->id;
            $tracking->user_id = $shippingOrder->driver_id;
            $tracking->status = 'dikirim';
            $tracking->description = "Paket sedang dikirim dari gudang sortir oleh supir {$tracking->user->name} - {$tracking->user->phone}";
            $tracking->save();
        } elseif ($shippingOrder->status == 'on_delivery') {
            $shippingOrder->status = 'pengiriman_gudang';
            $shippingOrder->driver_id = Auth::user()->id;
            $tracking = new TrackingHistory();
            $tracking->shipping_order_id = $shippingOrder->id;
            $tracking->user_id = $shippingOrder->driver_id;
            $tracking->status = 'pengiriman_gudang';
            $tracking->description = "Paket telah diterima oleh penerima. Pengiriman diselesaikan oleh kurir {$tracking->user->name} - {$tracking->user->phone}. Terima kasih telah menggunakan layanan kami.";
            $tracking->save();
        } else {
            return response()->json(['error' => 'Status tidak dapat diperbarui'], 400);
        }

        $shippingOrder->save();
        return response()->json(['message' => 'Status berhasil diubah menjadi DIKIRIM.']);
    }



    public function profile()
    {
        $auth = Auth::user();
        $user = User::find($auth->id);
        $city = City::all();
        $setting = Setting::first();
        $warehouse = WareHouse::all();
        return Inertia::render('Driver/Profile/Index', compact('setting', 'auth', 'user', 'city', 'warehouse'));
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
        $user->warehouse_id = $request->warehouse_id;
        $user->phone = $nomorTujuan;
        $user->address = $request->address;
        $user->gender = $request->gender;
        $user->role = "driver";
        $user->save();
    }
}
