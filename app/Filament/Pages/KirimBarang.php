<?php

namespace App\Filament\Pages;

use App\Models\ShippingService;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;

class KirimBarang extends Page implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];


    protected static ?string $navigationIcon = 'heroicon-o-truck';

    protected static string $view = 'filament.pages.kirim-barang';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Kirim Barang';
    protected static ?int $navigationSort = 21;


    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Wizard::make([
                    Wizard\Step::make('Detail Barang')
                        ->schema([
                            TextInput::make("nama_barang")->required()->placeholder('Nama Barang')->columnSpan(["lg" => 2])->label('Barang'),
                            TextInput::make("berat")->required()->placeholder('Harap gunakan tanda titik (.) untuk angka desimal, seperti 2.5 kg, bukan koma (,)')->numeric()->label('Berat (kg)')->suffix('kg')->columnSpan(["lg" => 1]),
                            TextInput::make("panjang")->required()->placeholder('Panjang barang')->numeric()->label('Panjang (cm)')->suffix('cm')->columnSpan(["lg" => 1]),
                            TextInput::make("tinggi")->required()->placeholder('Tinggi barang')->numeric()->label('Tinggi (cm)')->suffix('cm')->columnSpan(["lg" => 1]),
                            TextInput::make("lebar")->required()->placeholder('Lebar barang')->numeric()->label('Lebar (cm)')->suffix('cm')->columnSpan(["lg" => 1]),
                            Select::make("shipping_service_id")->options(ShippingService::all()->pluck('name', 'id'))->searchable()->label('Layanan Pengiriman')->columnSpan(["lg" => 2])->required(),
                        ])->columns(2),
                    Wizard\Step::make('Pengirim')
                        ->schema([
                            Select::make('customer_id')
                                ->label('Pengirim')
                                ->options(function () {
                                    if (Auth::user()->role == 'admin' && Auth::user()->divisi === null) {
                                        return User::where("role", "customer")->orWhere('role', 'santri')->pluck('name', 'id');
                                    } else {
                                        return User::where('author', Auth::id())->pluck('name', 'id');
                                    }
                                })
                                ->searchable()
                                ->live(onBlur: true)
                                ->afterStateUpdated(function (Set $set, ?string $state) {
                                    if ($state) {
                                        $user = User::find($state);
                                        if ($user) {
                                            $set('customer_phone', $user->phone);
                                            $set('customer_address', $user->address);
                                            $set('customer_kota', $user->city->kota);
                                            $set('customer_gender', $user->gender);
                                        }
                                    }
                                })
                                ->columnSpan(['lg' => 2]),
                            TextInput::make("customer_phone")->readOnly()->placeholder('Nomor Telepon')->numeric()->label('Nomor Telepon')->label('Nomor Telepon'),
                            TextInput::make("customer_gender")->readOnly()->placeholder('Jenis Kelamin')->label('Jenis Kelamin'),
                            TextInput::make("customer_kota")->readOnly()->placeholder('Kota Asal')->label('Kota Asal')->columnSpan(["lg" => 2]),
                            Textarea::make("customer_address")->readOnly()->placeholder('Alamat')->label('Alamat')->columnSpan(["lg" => 2]),

                        ])->columns(2),
                    Wizard\Step::make('Penerima')
                        ->schema([
                            TextInput::make('recipient_name')->required()->placeholder('Nama Penerima')->label('Penerima')->columnSpan(["lg" => 2]),
                            TextInput::make('recipient_phone')->numeric()->required()->placeholder('Nomor Telepon Penerima')->label('Nomor Telepon Penerima'),
                            Select::make('recipient_city_id')
                                ->options(
                                    \App\Models\City::get()
                                        ->mapWithKeys(function ($city) {
                                            return [
                                                $city->id => $city->provinsi . ' - ' .
                                                    $city->kota . ' - ' .
                                                    $city->kecamatan . ' - ' .
                                                    $city->kelurahan . ' - ' .
                                                    $city->postal_code,
                                            ];
                                        })
                                )
                                ->label('Kota')
                                ->searchable()
                                ->required(),
                            Textarea::make('recipient_address')->required()->placeholder('Alamat Penerima')->label('Alamat Penerima')->columnSpan(["lg" => 2]),
                        ])->columns(2),
                    Wizard\Step::make('Pembayaran')
                        ->schema([
                            ToggleButtons::make('pickup_type')
                                ->label("Metode Pengiriman")
                                ->live()
                                ->grouped()
                                ->required()
                                ->options([
                                    'pickup' => 'Pick Up',
                                    'dropoff' => 'Pengantaran',
                                ])
                                ->icons([
                                    'pickup' => 'heroicon-o-map-pin',
                                    'dropoff' => 'heroicon-o-truck',
                                ]),
                            Textarea::make("pickup_address")->placeholder('Alamat Pick Up')->label('Alamat Pick Up')->columnSpan(["lg" => 2])->visible(fn($get) => $get('pickup_type') == 'pickup'),
                            Textarea::make("notes")->placeholder('Catatan')->label('Catatan')->columnSpan(["lg" => 2]),


                        ]),
                ])
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        try {
            $data = $this->form->getState();
            $user = User::findOrFail($data['customer_id']);

            // Kota asal dan tujuan
            $originCity = \App\Models\City::find($user->city_id);
            $destinationCity = \App\Models\City::find($data['recipient_city_id']);

            if (!$originCity || !$destinationCity) {
                Notification::make()->title('Kota asal atau tujuan tidak valid')->danger()->send();
                return;
            }

            // Cari zona pengiriman
            $shippingZone = \App\Models\ShippingZone::where([
                ['origin_city_id', '=', $originCity->id],
                ['destination_city_id', '=', $destinationCity->id],
            ])->first();

            if (!$shippingZone) {
                Notification::make()->title('Zona pengiriman tidak ditemukan')->danger()->send();
                return;
            }

            // Ambil rate dan divisor dari jenis layanan
            $shippingRate = \App\Models\ShippingRate::where('shipping_zone_id', $shippingZone->id)
                ->where('shipping_service_id', $data['shipping_service_id'])
                ->first();

            $shippingService = \App\Models\ShippingService::find($data['shipping_service_id']);

            if (!$shippingRate || !$shippingService) {
                Notification::make()->title('Tarif layanan tidak tersedia')->danger()->send();
                return;
            }

            // Hitung volume dan berat final
            $volume = $data['panjang'] * $data['lebar'] * $data['tinggi']; // cm³
            $divisor = $shippingService->price; // divisor (misal 6000 atau 4000)
            $beratVolume = $volume / $divisor;
            $beratFinal = max($data['berat'], $beratVolume);
            $shippingCost = $beratFinal * $shippingRate->price_per_kg;

            // Generate QR dan Tracking Number
            $trackingNumber = 'INV' . now()->format('YmdHis') . Str::upper(Str::random(3));
            $filename = $trackingNumber . '.png';
            $qrPath = 'qrcodes/' . $filename;

            Storage::disk('public')->makeDirectory('qrcodes');
            $qrImage = QrCode::format('png')->size(300)->errorCorrection('H')->margin(4)->generate($trackingNumber);
            Storage::disk('public')->put($qrPath, $qrImage);

            // Format nomor telepon penerima
            $nomorTujuan = Str::startsWith($data['recipient_phone'], '08')
                ? '62' . substr($data['recipient_phone'], 1)
                : $data['recipient_phone'];

            $estimationDate = Carbon::now()->addDays($shippingRate->estimation_day_max)->format('Y-m-d');

            // Simpan pengiriman
            $order = \App\Models\ShippingOrder::create([
                'barcode' => 'storage/' . $qrPath,
                'tracking_number' => $trackingNumber,
                'customer_id' => $data['customer_id'],
                'origin_city_id' => $originCity->id,
                'nama_barang' => $data['nama_barang'],
                'berat' => $data['berat'],
                'panjang' => $data['panjang'],
                'tinggi' => $data['tinggi'],
                'lebar' => $data['lebar'],
                'destination_city_id' => $destinationCity->id,
                'shipping_rate_id' => $shippingRate->id,
                'recipient_name' => $data['recipient_name'],
                'recipient_address' => $data['recipient_address'],
                'recipient_phone' => $nomorTujuan,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'pickup_type' => $data['pickup_type'],
                'pickup_address' => $data['pickup_address'] ?? null,
                'notes' => $data['notes'] ?? null,
                'estimation_date' => $estimationDate,
            ]);

            // Simpan transaksi
            $trx = \App\Models\Transaction::create([
                'user_id' => $data['customer_id'],
                'shipping_order_id' => $order->id,
                'invoice_number' => $trackingNumber,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'status' => 'paid',
                'amount' => $shippingCost,
                'author' => $user->id
            ]);

            $trx->payment_url = route('customers.successPayment', ['invoice_number' => $trx->invoice_number]);
            $trx->save();

            Notification::make()
                ->title('Pengiriman berhasil disimpan')
                ->success()
                ->send();

            $this->reset();
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Terjadi kesalahan: ' . $e->getMessage())
                ->danger()
                ->send();
        }
    }


    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->submit('save')->label('Simpan')->icon('heroicon-o-check-circle'),
        ];
    }
}
