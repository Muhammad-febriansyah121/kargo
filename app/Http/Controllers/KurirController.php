<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Setting;
use App\Models\ShippingOrder;
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
        return Inertia::render('Kurir/Home/Index', compact('setting', 'auth'));
    }

    public function scan()
    {
        $auth = Auth::user();
        $setting = Setting::first();
        return Inertia::render('Kurir/Scan/Index', compact('setting', 'auth'));
    }

    public function pengiriman()
    {
        $auth = Auth::user();
        $pickup = ShippingOrder::where('pickup_type', 'pickup')->where('pickup_courier_id', $auth->id)->latest()->get();
        $dropoff = ShippingOrder::where('pickup_type', 'dropoff')->where('courier_id', $auth->id)->latest()->get();
        $all = ShippingOrder::where('courier_id', $auth->id)->latest()->get();
        $setting = Setting::first();
        return Inertia::render('Kurir/Pengiriman/Index', compact('setting', 'auth', 'pickup', 'dropoff', 'all'));
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
