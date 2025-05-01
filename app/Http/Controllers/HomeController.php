<?php

namespace App\Http\Controllers;

use App\Models\AboutUs;
use App\Models\CategoryNews;
use App\Models\City;
use App\Models\Definisi;
use App\Models\Faq;
use App\Models\Fitur;
use App\Models\KebijakanPrivasi;
use App\Models\Mitra;
use App\Models\News;
use App\Models\SectionFitur;
use App\Models\Setting;
use App\Models\ShippingRate;
use App\Models\ShippingZone;
use App\Models\TermCondition;
use App\Models\TrackingHistory;
use App\Models\Transaction;
use App\Models\User;
use App\Models\VisiMisi;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    public function index()
    {
        $setting = Setting::first();
        $mitra = Mitra::all();
        $sectionfitur = SectionFitur::first();
        $city = ShippingZone::all();
        $fitur = Fitur::all();
        $news = News::latest()->limit(3)->get();
        return Inertia::render('Home/Home/Index', compact('setting', 'mitra', 'sectionfitur', 'fitur', 'news', 'city'));
    }

    public function cekResiPage($invoice_number)
    {
        $setting = Setting::first();
        $trx = Transaction::where('invoice_number', $invoice_number)->first();
        $tracking = TrackingHistory::where('shipping_order_id', $trx->shipping_order_id)->get();
        return Inertia::render('Home/Resi/Index', [
            'result' => $trx,
            'setting' => $setting,
            'tracking' => $tracking
        ]);
    }


    public function cekOngkir(Request $request)
    {
        $originCity = City::find($request->origin_city_id);
        $destinationCity = City::find($request->destination_city_id);
        $setting = Setting::first();
        if (!$originCity || !$destinationCity) {
            return Inertia::render('Home/Cekongkir/Index', [
                'error' => 'Kota tidak valid',
                'form' => $request->all(),
                'services' => []
            ]);
        }

        $shippingZone = ShippingZone::where('origin_city_id', $originCity->id)
            ->where('destination_city_id', $destinationCity->id)
            ->first();

        if (!$shippingZone) {
            return Inertia::render('Home/Cekongkir/Index', [
                'error' => 'Zona tidak ditemukan',
                'form' => $request->all(),
                'services' => []
            ]);
        }

        $rates = ShippingRate::with('shippingService')
            ->where('shipping_zone_id', $shippingZone->id)
            ->get();

        $panjang = $request->panjang / 100;
        $lebar = $request->lebar / 100;
        $tinggi = $request->tinggi / 100;
        $volume = $panjang * $lebar * $tinggi;

        $results = [];

        foreach ($rates as $rate) {
            $weightCost = $request->berat * $rate->price_per_kg;
            $volumeCost = $volume * $rate->price_per_volume;
            $shippingCost = max($weightCost, $volumeCost);

            if ($rate->min_price) {
                $shippingCost = max($shippingCost, $rate->min_price);
            }

            $results[] = [
                'id' => $rate->shippingService->id,
                'name' => $rate->shippingService->name,
                'desc' => $rate->shippingService->desc,
                'price' => $shippingCost,
            ];
        }

        return Inertia::render('Home/Cekongkir/Index', [
            'form' => $request->all(),
            'services' => $results,
            'setting' => $setting
        ]);
    }




    public function faq()
    {
        $setting = Setting::first();
        $faq = Faq::all();
        return Inertia::render('Home/Faq/Index', compact('setting', 'faq'));
    }

    public function visimisi()
    {
        $setting = Setting::first();
        $data = VisiMisi::first();
        return Inertia::render('Home/VisiMisi/Index', compact('setting', 'data'));
    }

    public function term()
    {
        $setting = Setting::first();
        $data = TermCondition::first();
        return Inertia::render('Home/Term/Index', compact('setting', 'data'));
    }

    public function privacypolicy()
    {
        $setting = Setting::first();
        $data = KebijakanPrivasi::first();
        return Inertia::render('Home/Privasi/Index', compact('setting', 'data'));
    }

    public function definisi()
    {
        $setting = Setting::first();
        $data = Definisi::all();
        return Inertia::render('Home/Definisi/Index', compact('setting', 'data'));
    }

    public function news()
    {
        $setting = Setting::first();
        $data = News::latest()->get();
        $recent = News::latest()->limit(5)->get();
        $category = CategoryNews::all();
        return Inertia::render('Home/News/Index', compact('setting', 'data', 'recent', 'category'));
    }

    public function newsdetail($slug)
    {
        $setting = Setting::first();
        $data = News::where('slug', $slug)->firstOrFail();
        $data->increment('views'); // lebih clean untuk update +1
        $recent = News::latest()->limit(5)->get();
        $category = CategoryNews::all();
        return Inertia::render('Home/News/Detail', compact('setting', 'data', 'recent', 'category'));
    }

    public function contact()
    {
        $setting = Setting::first();
        return Inertia::render('Home/Contact/Index', compact('setting'));
    }

    public function aboutus()
    {
        $setting = Setting::first();
        $data = AboutUs::first();
        return Inertia::render('Home/Aboutus/Index', compact('setting', 'data'));
    }

    public function register()
    {
        $setting = Setting::first();
        $city = City::all();
        return Inertia::render('Home/Register/Index', compact('setting', 'city'));
    }

    public function saveregister(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'gender' => 'required',
        ]);
        $check = User::where('email', $request->email)->first();
        if ($check) {
            return to_route('daftar');
        }
        $nomorTujuan = $request->phone;
        if (Str::startsWith($nomorTujuan, '08')) {
            $nomorTujuan = '62' . substr($nomorTujuan, 1);
        }
        $q = new User();
        $q->name = $request->name;
        $q->email = $request->email;
        $q->password = Hash::make($request->password);
        $q->city_id = $request->city_id;
        $q->phone = $nomorTujuan;
        $q->address = $request->address;
        $q->gender = $request->gender;
        $q->role = "customer";
        $q->save();
        Notification::make()
            ->success()
            ->title("Customer $q->name berhasil mendaftar")
            ->sendToDatabase(User::where('role', 'admin')->get());
        return to_route('home.login')->with('success', 'Pendaftaran Berhasil');
    }

    public function login()
    {
        $setting = Setting::first();
        return Inertia::render('Home/Login/Index', compact('setting'));
    }

    public function checklogin(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $request->session()->regenerate();
            if (Auth::user()->role === 'customer') {
                return to_route('customers.home');
            } else if (Auth::user()->role === 'kurir') {
                return to_route('kurir.home');
            } else if (Auth::user()->role === 'driver') {
                return to_route('driver.home');
            }
        }
        return to_route('home.login')->withErrors(['email' => 'Email atau password salah.']);
    }
}
