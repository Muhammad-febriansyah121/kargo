<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ZonaPengirimanResource\Pages;
use App\Filament\Resources\ZonaPengirimanResource\RelationManagers;
use App\Models\City;
use App\Models\ShippingZone;
use App\Models\ZonaPengiriman;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Infolists\Components\Section as ComponentsSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class ZonaPengirimanResource extends Resource
{
    protected static ?string $model = ShippingZone::class;

    protected static ?string $navigationIcon = 'heroicon-o-arrow-path-rounded-square';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Zona Pengiriman';
    protected static ?int $navigationSort = 15;

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
                    Select::make('origin_city_id')
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
                        ->label('Asal Kota')
                        ->searchable()
                        ->required(),

                    Select::make('destination_city_id')
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
                        ->label('Tujuan Kota')
                        ->searchable()
                        ->required(),
                    TextInput::make('distance_km')->placeholder('Jarak')->numeric()->prefix('Km')->columnSpan(['lg' => 2]),
                ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('originCity.kota')->label('Asal Kota')->searchable(),
                TextColumn::make('destinationCity.kota')->label('Tujuan Kota')->searchable(),
                TextColumn::make('distance_km')->label('Jarak')->searchable()->suffix(' Km'),
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
                ComponentsSection::make('Kota Asal')->schema([
                    TextEntry::make('originCity.provinsi')->label('Provinsi'),
                    TextEntry::make('originCity.kota')->label('Kota'),
                    TextEntry::make('originCity.kecamatan')->label('Kecamatan'),
                    TextEntry::make('originCity.kelurahan')->label('Kelurahan'),
                    TextEntry::make('originCity.postal_code')->label('Kode POS'),
                ]),
                ComponentsSection::make('Kota Tujuan')->schema([
                    TextEntry::make('destinationCity.provinsi')->label('Provinsi'),
                    TextEntry::make('destinationCity.kota')->label('Kota'),
                    TextEntry::make('destinationCity.kecamatan')->label('Kecamatan'),
                    TextEntry::make('destinationCity.kelurahan')->label('Kelurahan'),
                    TextEntry::make('destinationCity.postal_code')->label('Kode POS'),
                ]),
                ComponentsSection::make('Jarak')->schema([
                    TextEntry::make('distance_km')->label('Jarak')->suffix(' Km'),
                ]),
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
            'index' => Pages\ListZonaPengirimen::route('/'),
            'create' => Pages\CreateZonaPengiriman::route('/create'),
            'edit' => Pages\EditZonaPengiriman::route('/{record}/edit'),
        ];
    }
}
