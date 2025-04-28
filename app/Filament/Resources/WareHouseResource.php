<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WareHouseResource\Pages;
use App\Filament\Resources\WareHouseResource\RelationManagers;
use App\Models\WareHouse;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WareHouseResource extends Resource
{
    protected static ?string $model = WareHouse::class;

    protected static ?string $navigationIcon = 'heroicon-o-home-modern';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Gudang';
    protected static ?int $navigationSort = 16;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->placeholder('Nama Gudang'),
                    Forms\Components\TextInput::make('manager')
                        ->placeholder('Manager Gudang'),
                    Select::make('city_id')
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
                    Forms\Components\TextInput::make('address')
                        ->required()
                        ->placeholder('Alamat Gudang'),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('name')
                    ->label('Nama Gudang')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('manager')
                    ->label('Manager Gudang')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('city.provinsi')
                    ->label('Provinsi')
                    ->sortable(),
                TextColumn::make('city.kota')
                    ->label('Kota')
                    ->sortable(),
                TextColumn::make('city.kecamatan')
                    ->label('Kecamatan')
                    ->sortable(),
                TextColumn::make('city.kelurahan')
                    ->label('Kelurahan')
                    ->sortable(),
                TextColumn::make('city.postal_code')
                    ->label('Kode Pos')
                    ->sortable(),
                TextColumn::make('address')->label('Alamat')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
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
            'index' => Pages\ListWareHouses::route('/'),
            'create' => Pages\CreateWareHouse::route('/create'),
            'edit' => Pages\EditWareHouse::route('/{record}/edit'),
        ];
    }
}
