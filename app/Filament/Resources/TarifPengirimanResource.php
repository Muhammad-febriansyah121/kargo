<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TarifPengirimanResource\Pages;
use App\Filament\Resources\TarifPengirimanResource\RelationManagers;
use App\Models\ShippingRate;
use App\Models\ShippingService;
use App\Models\ShippingZone;
use App\Models\TarifPengiriman;
use DesignTheBox\BarcodeField\Forms\Components\BarcodeInput;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Infolists\Components\Section as ComponentsSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\RawJs;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class TarifPengirimanResource extends Resource
{
    protected static ?string $model = ShippingRate::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Tarif Pengiriman';
    protected static ?int $navigationSort = 16;

    public static function canAccess(): bool
    {
        if (Auth::user()->role == 'admin' && Auth::user()->divisi === NULL) {
            return true;
        }
        return false;
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    Select::make('shipping_service_id')
                        ->label('Layanan Pengiriman')
                        ->options(ShippingService::all()->pluck('name', 'id'))
                        ->searchable()
                        ->required(),

                    Select::make('shipping_zone_id')
                        ->label('Zona Pengiriman')
                        ->options(
                            ShippingZone::with(['originCity', 'destinationCity'])
                                ->get()
                                ->mapWithKeys(function ($zone) {
                                    $origin = "{$zone->originCity->provinsi}, {$zone->originCity->kota}, {$zone->originCity->kecamatan}, {$zone->originCity->kelurahan} ({$zone->originCity->postal_code})";
                                    $dest   = "{$zone->destinationCity->provinsi}, {$zone->destinationCity->kota}, {$zone->destinationCity->kecamatan}, {$zone->destinationCity->kelurahan} ({$zone->destinationCity->postal_code})";
                                    return [$zone->id => "$origin → $dest"];
                                })
                        )
                        ->searchable()
                        ->required(),
                    Select::make("jenis")
                        ->label("Jenis Pengiriman")
                        ->required()
                        ->options([
                            "udara" => "udara",
                            "darat" => "darat"
                        ]),
                    TextInput::make('price_per_kg')
                        ->label('Harga ')
                        ->placeholder('Harga ')
                        ->prefix('Rp')->mask(RawJs::make('$money($input)'))
                        ->stripCharacters(',')
                        ->numeric()
                        ->required(),
                    // TextInput::make('price_per_volume')
                    //     ->label('Harga per Volume (m³)')
                    //     ->placeholder('Harga per Volume (m³)')
                    //     ->prefix('Rp')->mask(RawJs::make('$money($input)'))
                    //     ->stripCharacters(',')
                    //     ->columnSpan(['lg' => 2])
                    //     ->numeric()->required(),
                    // TextInput::make('min_price')
                    //     ->label('Harga Minimal')
                    //     ->placeholder('Harga Minimal')
                    //     ->prefix('Rp')->mask(RawJs::make('$money($input)'))
                    //     ->stripCharacters(',')
                    //     ->columnSpan(['lg' => 2])
                    //     ->numeric(),
                    TextInput::make('estimation_days_min')
                        ->label('Estimasi Hari Min')
                        ->placeholder('Estimasi Hari Min')
                        ->columnSpan(['lg' => 2])
                        ->suffix('Hari')
                        ->numeric(),
                    TextInput::make('estimation_days_max')
                        ->label('Estimasi Hari Max')
                        ->placeholder('Estimasi Hari Max')
                        ->columnSpan(['lg' => 2])
                        ->suffix('Hari')
                        ->numeric(),
                    // BarcodeInput::make('barcode')
                    //     ->required()->columnSpan(['lg' => 2]),
                ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('shippingZone.originCity.kota')->label('Kota Asal')->searchable(),
                TextColumn::make('shippingZone.destinationCity.kota')->label('Kota Tujuan')->searchable(),
                TextColumn::make('estimation_days_max')->label('Estimasi Hari Max')->searchable()->suffix(' Hari'),
                TextColumn::make('shippingService.name')->label('Layanan Pengiriman')->searchable(),
                TextColumn::make('price_per_kg')->label('Harga per Kg')->searchable()->formatStateUsing(fn($state) => 'Rp ' . number_format($state)),
                // TextColumn::make('price_per_volume')->label('Harga per Volume (m³)')->searchable()->formatStateUsing(fn($state) => 'Rp ' . number_format($state)),
                // TextColumn::make('min_price')->label('Harga Minimal')->searchable()->formatStateUsing(fn($state) => 'Rp ' . number_format($state)),

            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                ComponentsSection::make('')->schema([
                    TextEntry::make('shippingService.name')->label('Layanan Pengiriman'),
                    TextEntry::make('price_per_kg')->label('Harga per Kg')->formatStateUsing(function ($state) {
                        return 'Rp ' . number_format($state);
                    }),
                    // TextEntry::make('price_per_volume')->label('Harga per Volume (m³)')->suffix(' Rp')->formatStateUsing(function ($state) {
                    //     return 'Rp ' . number_format($state);
                    // }),
                    // TextEntry::make('min_price')->label('Harga Minimal')->suffix(' Rp')->formatStateUsing(function ($state) {
                    //     return 'Rp ' . number_format($state);
                    // }),
                    TextEntry::make('estimation_days_min')->label('Estimasi Hari Min')->suffix(' Hari'),
                    TextEntry::make('estimation_days_max')->label('Estimasi Hari Max')->suffix(' Hari'),
                ])->columns(2),
                ComponentsSection::make('Kota Asal')->schema([
                    TextEntry::make('shippingZone.originCity.provinsi')->label('Provinsi'),
                    TextEntry::make('shippingZone.originCity.kota')->label('Kota'),
                    TextEntry::make('shippingZone.originCity.kecamatan')->label('Kecamatan'),
                    TextEntry::make('shippingZone.originCity.kelurahan')->label('Kelurahan'),
                    TextEntry::make('shippingZone.originCity.postal_code')->label('Kode POS'),
                ])->columns(2),
                ComponentsSection::make('Kota Tujuan')->schema([
                    TextEntry::make('shippingZone.destinationCity.provinsi')->label('Provinsi'),
                    TextEntry::make('shippingZone.destinationCity.kota')->label('Kota'),
                    TextEntry::make('shippingZone.destinationCity.kecamatan')->label('Kecamatan'),
                    TextEntry::make('shippingZone.destinationCity.kelurahan')->label('Kelurahan'),
                    TextEntry::make('shippingZone.destinationCity.postal_code')->label('Kode POS'),
                    TextEntry::make('shippingZone.distance_km')->label('Jarak')->suffix(' Km'),
                ])->columns(2),
            ])->columns(2);
    }


    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTarifPengirimen::route('/'),
            'create' => Pages\CreateTarifPengiriman::route('/create'),
            'edit' => Pages\EditTarifPengiriman::route('/{record}/edit'),
        ];
    }
}
