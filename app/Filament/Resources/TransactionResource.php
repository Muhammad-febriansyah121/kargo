<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionResource\Pages;
use App\Filament\Resources\TransactionResource\RelationManagers;
use App\Models\ShippingOrder;
use App\Models\TrackingHistory;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\Alignment;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Transaksi';
    protected static ?int $navigationSort = 20;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function getGlobalSearchResultTitle(Model $record): string | Htmlable
    {
        return $record->invoice_number;
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Customer' => $record->user->name,
            'Barang' => $record->ShippingOrder->nama_barang,
            'Total' => number_format($record->amount, 0, ',', '.'),
            'Status' => $record->status,
            'Tanggal' => $record->created_at->format('d-m-Y H:i:s'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['invoice_number', 'user.name', 'ShippingOrder.nama_barang'];
    }


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll("10s")
            ->columns([
                TextColumn::make('No')->rowIndex()->toggleable(),
                ImageColumn::make('ShippingOrder.barcode')
                    ->label('Barcode')
                    ->getStateUsing(fn($record) => asset('' . $record->ShippingOrder->barcode))
                    ->toggleable()->width('200px')->height('150px'),
                TextColumn::make('invoice_number')->label('Resi')->toggleable(),
                TextColumn::make('user.name')->label('Customer')->searchable(),
                TextColumn::make('ShippingOrder.nama_barang')->label('Barang')->toggleable(),
                TextColumn::make('amount')->label('Total')->money('IDR')->toggleable()->summarize([
                    Tables\Columns\Summarizers\Sum::make()
                        ->money('IDR'),
                ]),
                SelectColumn::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                    ])->label('Status Pembayaran')->toggleable(),
                TextColumn::make('ShippingOrder.status')
                    ->label('Status Pengiriman')->toggleable()->badge()->color(function (string $state): string {
                        return match ($state) {
                            'pending' => 'warning',
                            'pickup' => 'info',
                            'in_transit' => 'success',
                            'delivered' => 'danger',
                            'cancelled' => 'secondary',
                        };
                    }),
                TextColumn::make('payment_method')->label('Jenis Pembayaran')->toggleable()->badge()->color(function (string $state): string {
                    return match ($state) {
                        'cash' => 'success',
                        'transfer' => 'info',
                    };
                }),
                TextColumn::make('created_at')->label('tgl Trx')->dateTime()->toggleable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                    ]),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')->native(false)
                            ->placeholder(fn($state): string =>  now()->subYear()->format('M d, Y')),
                        Forms\Components\DatePicker::make('created_until')->native(false)
                            ->placeholder(fn($state): string => now()->format('M d, Y')),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'] ?? null,
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'] ?? null,
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['created_from'] ?? null) {
                            $indicators['created_from'] = 'Order from ' . Carbon::parse($data['created_from'])->toFormattedDateString();
                        }
                        if ($data['created_until'] ?? null) {
                            $indicators['created_until'] = 'Order until ' . Carbon::parse($data['created_until'])->toFormattedDateString();
                        }

                        return $indicators;
                    }),
            ], layout: FiltersLayout::Modal)->actions([
                Tables\Actions\ViewAction::make()->label('Detail')->icon('heroicon-s-eye')->button()->color('info'),
                Action::make('updateCourier')
                    ->button()
                    ->label('Pilih Kurir')->icon('heroicon-o-truck')
                    ->form([
                        Select::make('city_id')
                            ->options(
                                \App\Models\City::all()->mapWithKeys(fn($city) => [
                                    $city->id => $city->provinsi . ' - ' .
                                        $city->kota . ' - ' .
                                        $city->kecamatan . ' - ' .
                                        $city->kelurahan . ' - ' .
                                        $city->postal_code,
                                ])
                            )
                            ->live()
                            ->label('Pilih Kurir By Kecamatan')
                            ->searchable()
                            ->afterStateUpdated(fn(callable $set) => $set('courier_id', null))
                            ->required(),
                        Select::make('courier_id')
                            ->label('Pilih Kurir')
                            ->required()
                            ->searchable()
                            ->options(function (Get $get): array {
                                $cityId = $get('city_id');
                                return $cityId
                                    ? User::where('role', 'kurir')
                                    ->where('city_id', $cityId)
                                    ->pluck('name', 'id')
                                    ->toArray()
                                    : [];
                            }),
                    ])
                    ->action(function (array $data, Transaction $trx): void {
                        $shippingOrder = ShippingOrder::findOrFail($trx->shipping_order_id);
                        $shippingOrder->pickup_courier_id = $data['courier_id'];
                        $shippingOrder->status = 'in_transit';
                        $shippingOrder->save();
                        $kurir = User::findOrFail($shippingOrder->pickup_courier_id);
                        $tracking = new TrackingHistory();
                        $tracking->shipping_order_id = $shippingOrder->id;
                        $tracking->user_id = $shippingOrder->pickup_courier_id;
                        $tracking->status = 'in_transit';
                        $tracking->description = "paket di PICK UP Oleh kurir {$kurir->name} - {$kurir->phone} menuju gudang sortir";
                        $tracking->save();
                        Notification::make()
                            ->title('Kurir berhasil dipilih!')
                            ->success()
                            ->send();
                    })
                    ->visible(fn($record) => $record->ShippingOrder->pickup_courier_id === null && $record->ShippingOrder->pickup_type === 'pickup')
                    ->modalAlignment(Alignment::Center),

                Action::make('pilihDriver')
                    ->button()
                    ->color('success')
                    ->label('Pilih Driver')->icon('heroicon-o-truck')
                    ->form([
                        Select::make('city_id')
                            ->options(
                                \App\Models\City::all()->mapWithKeys(fn($city) => [
                                    $city->id => $city->provinsi . ' - ' .
                                        $city->kota . ' - ' .
                                        $city->kecamatan . ' - ' .
                                        $city->kelurahan . ' - ' .
                                        $city->postal_code,
                                ])
                            )
                            ->live()
                            ->label('Pilih Driver By Kecamatan')
                            ->searchable()
                            ->afterStateUpdated(fn(callable $set) => $set('driver_id', null))
                            ->required(),
                        Select::make('driver_id')
                            ->label('Pilih Driver')
                            ->required()
                            ->searchable()
                            ->options(function (Get $get): array {
                                $cityId = $get('city_id');
                                return $cityId
                                    ? User::where('role', 'driver')
                                    ->where('city_id', $cityId)
                                    ->pluck('name', 'id')
                                    ->toArray()
                                    : [];
                            }),
                    ])
                    ->action(function (array $data, Transaction $trx): void {
                        $shippingOrder = ShippingOrder::findOrFail($trx->shipping_order_id);
                        $shippingOrder->pickup_courier_id = $data['driver_id'];
                        $shippingOrder->status = 'to_destination_warehouse';
                        $shippingOrder->save();
                        $driver = User::findOrFail($shippingOrder->driver_id);
                        $tracking = new TrackingHistory();
                        $tracking->shipping_order_id = $shippingOrder->id;
                        $tracking->user_id = $shippingOrder->driver_id;
                        $tracking->status = 'to_destination_warehouse';
                        $tracking->description = "Paket sedang dikirim menuju gudang kecamatan tujuan oleh driver {$driver->name} ({$driver->phone})";
                        $tracking->save();

                        Notification::make()
                            ->title('Driver berhasil dipilih!')
                            ->success()
                            ->send();
                    })
                    ->visible(fn($record) => $record->ShippingOrder->driver_id === null)
                    ->modalAlignment(Alignment::Center),

                Action::make('deliveryCourier_id')
                    ->button()
                    ->color('warning')
                    ->label('Pilih Kurir Pengantar')->icon('heroicon-o-truck')
                    ->form([
                        Select::make('city_id')
                            ->options(
                                \App\Models\City::all()->mapWithKeys(fn($city) => [
                                    $city->id => $city->provinsi . ' - ' .
                                        $city->kota . ' - ' .
                                        $city->kecamatan . ' - ' .
                                        $city->kelurahan . ' - ' .
                                        $city->postal_code,
                                ])
                            )
                            ->live()
                            ->label('Pilih Kurir By Kecamatan')
                            ->searchable()
                            ->afterStateUpdated(fn(callable $set) => $set('deliveryCourier_id', null))
                            ->required(),
                        Select::make('deliveryCourier_id')
                            ->label('Pilih Kurir')
                            ->required()
                            ->searchable()
                            ->options(function (Get $get): array {
                                $cityId = $get('city_id');
                                return $cityId
                                    ? User::where('role', 'driver')
                                    ->where('city_id', $cityId)
                                    ->pluck('name', 'id')
                                    ->toArray()
                                    : [];
                            }),
                    ])
                    ->action(function (array $data, Transaction $trx): void {
                        $shippingOrder = ShippingOrder::findOrFail($trx->shipping_order_id);
                        $shippingOrder->delivery_courier_id = $data['deliveryCourier_id'];
                        $shippingOrder->status = 'to_destination_warehouse';
                        $shippingOrder->save();
                        $driver = User::findOrFail($shippingOrder->deliveryCourier_id);
                        $tracking = new TrackingHistory();
                        $tracking->shipping_order_id = $shippingOrder->id;
                        $tracking->user_id = $shippingOrder->deliveryCourier_id;
                        $tracking->status = 'to_destination_warehouse';
                        $tracking->description = "Paket sedang dikirim menuju gudang kecamatan tujuan oleh driver {$driver->name} ({$driver->phone})";
                        $tracking->save();

                        Notification::make()
                            ->title('Driver berhasil dipilih!')
                            ->success()
                            ->send();
                    })
                    ->visible(fn($record) => $record->ShippingOrder->delivery_courier_id === null)
                    ->modalAlignment(Alignment::Center)

            ])
            ->groups([
                Tables\Grouping\Group::make('created_at')
                    ->label('Tgl Transaksi')
                    ->date()
                    ->collapsible(),
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
                Section::make()
                    ->schema([
                        ImageEntry::make('ShippingOrder.barcode')
                            ->label('Barcode')
                            ->width('100%')
                            ->height('100%')
                            ->getStateUsing(fn($record) => asset('' . $record->ShippingOrder->barcode)),
                    ]),
                Section::make('Detail Transaksi')
                    ->schema([
                        TextEntry::make('invoice_number')->label('Resi'),
                        TextEntry::make('amount')->label('Total')->money('IDR'),
                        TextEntry::make('status')->label('Status Pembayaran')->badge()->color(function (string $state): string {
                            return match ($state) {
                                'pending' => 'warning',
                                'paid' => 'success',
                                'failed' => 'danger',
                            };
                        })->icon(function (string $state): string {
                            return match ($state) {
                                'pending' => 'heroicon-s-clock',
                                'paid' => 'heroicon-s-check-circle',
                                'failed' => 'heroicon-s-x-circle',
                            };
                        }),
                        TextEntry::make('payment_method')->label('Jenis Pembayaran')->badge()->color(function (string $state): string {
                            return match ($state) {
                                'cash' => 'success',
                                'transfer' => 'info',
                            };
                        }),
                        TextEntry::make('created_at')->label('Tgl Transaksi')->badge()->color('success')->dateTime(),
                    ])->columnSpan(['lg' => 3, 'md' => 1, 'sm' => 1])->columns(['lg' => 2, 'md' => 1, 'sm' => 1]),
                Section::make('Detail Customer')
                    ->schema([
                        TextEntry::make('user.name')->label('Nama'),
                        TextEntry::make('user.email')->label('Email'),
                        TextEntry::make('user.phone')->label('No Telepon'),
                        TextEntry::make('user.store')->label('Toko'),
                        TextEntry::make('user.gender')->label('Jenis Kelamin'),
                        TextEntry::make('user.city.kota')->label('Kota'),
                        TextEntry::make('user.address')->label('Alamat'),
                    ])->columnSpan(['lg' => 3, 'md' => 1, 'sm' => 1])->columns(['lg' => 2, 'md' => 1, 'sm' => 1]),
                Section::make('Detail Penerima')
                    ->schema([
                        TextEntry::make('ShippingOrder.recipient_name')->label('Nama'),
                        TextEntry::make('ShippingOrder.recipient_phone')->label('No Telepon'),
                        TextEntry::make('ShippingOrder.recipient_address')->label('Alamat'),
                    ])->columnSpan(['lg' => 3, 'md' => 1, 'sm' => 1])->columns(['lg' => 2, 'md' => 1, 'sm' => 1]),

                Section::make('Detail Pengiriman')
                    ->schema([
                        TextEntry::make('ShippingOrder.nama_barang')->label('Nama Barang'),
                        TextEntry::make('ShippingOrder.berat')->label('Berat')->suffix('Kg'),
                        TextEntry::make('ShippingOrder.panjang')->label('Panjang')->suffix('Cm'),
                        TextEntry::make('ShippingOrder.lebar')->label('Lebar')->suffix('Cm'),
                        TextEntry::make('ShippingOrder.tinggi')->label('Tinggi')->suffix('Cm'),
                        TextEntry::make('ShippingOrder.originCity.kota')->label('Kota Asal'),
                        TextEntry::make('ShippingOrder.destinationCity.kota')->label('Kota Tujuan'),
                        TextEntry::make('ShippingOrder.pickup_type')
                            ->label('Jenis Pickup')
                            ->badge()
                            ->color(function (string $state): string {
                                return match ($state) {
                                    'pickup' => 'success',
                                    'dropoff' => 'info',
                                };
                            }),

                        TextEntry::make('ShippingOrder.pickup_address')
                            ->label('Alamat Pickup')
                            ->visible(fn($record) => $record->ShippingOrder->pickup_type === 'pickup'),
                        TextEntry::make('ShippingOrder.status')->label('Status Pengiriman')->badge()->color(function (string $state): string {
                            return match ($state) {
                                'pending' => 'warning',
                                'pickup' => 'info',
                                'dropoff' => 'info',
                                'in_transit' => 'success',
                                'delivered' => 'danger',
                                'cancelled' => 'secondary',
                            };
                        }),
                    ])->columnSpan(['lg' => 2, 'md' => 1, 'sm' => 1])->columns(['lg' => 2, 'md' => 1, 'sm' => 1]),

            ])->columns(1);
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
            'index' => Pages\ListTransactions::route('/'),
            'create' => Pages\CreateTransaction::route('/create'),
            'edit' => Pages\EditTransaction::route('/{record}/edit'),
            'view' => Pages\ViewTrx::route('/{record}'),
            // 'pilih-kurir' => Pages\PilihKurir::route('/{record}/pilih-kurir'),
            // 'add-kurir' => Pages\AddKurir::route('/{record}/edit/add-kurir'),
        ];
    }
}
