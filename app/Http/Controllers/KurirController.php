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
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class KurirController extends Controller
{
    public function index()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $pickup = ShippingOrder::where('status', 'pickup')
            ->where('pickup_courier_id', $auth->id)
            ->latest()->count();
        $pengantaran = ShippingOrder::where('status', 'ready_for_delivery')
            ->where('delivery_courier_id', $auth->id)
            ->latest()->count();

        return Inertia::render('Kurir/Home/Index', compact('setting', 'auth', 'pickup', 'pengantaran'));
    }

    public function scan()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        return Inertia::render('Kurir/Scan/Index', compact('setting', 'auth'));
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

        $user = Auth::user();

        // Upload foto jika ada
        if ($request->hasFile('delivery_proof')) {
            $file = $request->file('delivery_proof');
            $path = $file->store('delivery_proofs', 'public'); // simpan di storage/app/public/delivery_proofs
            $shippingOrder->delivery_proof = $path;
        }

        // Status handling
        if ($shippingOrder->status == 'pickup') {
            $shippingOrder->status = 'picked';
            $shippingOrder->driver_id = Auth::user()->id;
            $tracking = new TrackingHistory();
            $tracking->shipping_order_id = $shippingOrder->id;
            $tracking->user_id = $shippingOrder->driver_id;
            $tracking->status = 'picked';
            $tracking->description = "Paket telah dijemput oleh kurir {$tracking->user->name} - {$tracking->user->phone} dan dalam perjalanan menuju gudang sortir.";
            $tracking->save();
        } elseif ($shippingOrder->status == 'ready_for_delivery') {
            $shippingOrder->status = 'delivered';
            $shippingOrder->driver_id = Auth::user()->id;
            $tracking = new TrackingHistory();
            $tracking->shipping_order_id = $shippingOrder->id;
            $tracking->user_id = $shippingOrder->driver_id;
            $tracking->status = 'delivered';
            $tracking->description = "Paket telah diterima oleh penerima. Pengiriman diselesaikan oleh kurir {$tracking->user->name} - {$tracking->user->phone}. Terima kasih telah menggunakan layanan kami.";
            $tracking->save();
        } else {
            return response()->json(['error' => 'Status tidak dapat diperbarui'], 400);
        }
        $shippingOrder->driver_id = $user->id;
        $shippingOrder->save();
        return response()->json(['message' => 'Status berhasil diperbarui']);
    }

    public function pengiriman()
    {
        $auth = Auth::user();
        $pickup = ShippingOrder::where('status', 'pickup')
            ->where('pickup_courier_id', $auth->id)
            ->latest()->get();
        $pengantaran = ShippingOrder::where('status', 'ready_for_delivery')
            ->where('delivery_courier_id', $auth->id)
            ->latest()->get();
        $all = ShippingOrder::where('pickup_courier_id', $auth->id)->orWhere('delivery_courier_id', $auth->id)->latest()->get();
        $setting = Setting::first();
        return Inertia::render('Kurir/Pengiriman/Index', [
            'auth' => $auth,
            'pickup' => $pickup,
            'pengantaran' => $pengantaran,
            'setting' => $setting,
            'all' => $all
        ]);
    }

    public function pickup()
    {
        $user = Auth::user();
        $pickup = ShippingOrder::where('pickup_type', 'pickup')
            ->where('pickup_courier_id', $user->id)
            ->latest()
            ->get();

        return response()->json($pickup);
    }

    public function pengantaran()
    {
        $user = Auth::user();
        $dropoff = ShippingOrder::where('pickup_type', 'dropoff')
            ->where('delivery_courier_id', $user->id)
            ->latest()
            ->get();
        return response()->json($dropoff);
    }

    public function detailpengiriman($tracking_number)
    {
        $auth = Auth::user();
        $all = ShippingOrder::where('tracking_number', $tracking_number)->firstOrFail();
        $setting = Setting::first();
        return Inertia::render('Kurir/Pengiriman/Detail', compact('setting', 'auth', 'all'));
    }

    public function profile()
    {
        $auth = Auth::user();
        $user = User::find($auth->id);
        $city = City::all();
        $setting = Setting::first();
        $warehouse = WareHouse::all();
        return Inertia::render('Kurir/Profile/Index', compact('setting', 'auth', 'user', 'city', 'warehouse'));
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
        $user->vehicle_number = $request->vehicle_number;
        $user->role = "kurir";
        $user->save();
    }
}
