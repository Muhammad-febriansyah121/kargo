<?php

namespace App\Filament\Resources;

use App\Filament\Resources\KotaResource\Pages;
use App\Filament\Resources\KotaResource\RelationManagers;
use App\Models\City;
use App\Models\Kota;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use Teguh02\IndonesiaTerritoryForms\IndonesiaTerritoryForms;

class KotaResource extends Resource
{
    protected static ?string $model = City::class;

    protected static ?string $navigationIcon = 'heroicon-o-map';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Kota';
    protected static ?int $navigationSort = 14;

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
                    TextInput::make('provinsi')->label('Provinsi')->required()->placeholder('Provinsi'),
                    TextInput::make('kota')->required()->placeholder('Kota'),
                    TextInput::make('kecamatan')->required()->placeholder('Kecamatan'),
                    TextInput::make('kelurahan')->required()->placeholder('Kelurahan'),
                    TextInput::make('postal_code')->required()->placeholder('Kode Pos'),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('provinsi')->label('Provinsi')->searchable(),
                TextColumn::make('kota')->label('Kota')->searchable(),
                TextColumn::make('kecamatan')->label('Kecamatan')->searchable(),
                TextColumn::make('kelurahan')->label('Kelurahan')->searchable(),
                TextColumn::make('postal_code')->label('Kode Pos')->searchable(),
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
            'index' => Pages\ListKotas::route('/'),
            'create' => Pages\CreateKota::route('/create'),
            'edit' => Pages\EditKota::route('/{record}/edit'),
        ];
    }
}
