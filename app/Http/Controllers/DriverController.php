<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Setting;
use App\Models\ShippingOrder;
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
        return Inertia::render('Driver/Home/Index', compact('setting', 'auth'));
    }

    public function scan()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        $shipping = ShippingOrder::all();
        return Inertia::render('Driver/Scan/Index', compact('setting', 'auth'));
    }

    public function handle(Request $request)
    {
        $trackingNumber = $request->tracking_number;
        $order = Transaction::where('invoice_number', $trackingNumber)->where('status', 'paid')->first();
        if (!$order) {
            return response()->json(['error' => 'Barang tidak ditemukan'], 404);
        }

        return response()->json(['data' => $order]);
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
