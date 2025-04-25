<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ShippingServiceResource\Pages;
use App\Filament\Resources\ShippingServiceResource\RelationManagers;
use App\Models\ShippingService;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\RawJs;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Teguh02\IndonesiaTerritoryForms\IndonesiaTerritoryForms;

class ShippingServiceResource extends Resource
{
    protected static ?string $model = ShippingService::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Layanan Pengiriman';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    TextInput::make('name')->required()->placeholder('Layanan'),
                    TextInput::make('price')->required()->placeholder('Harga')->prefix('Rp')->mask(RawJs::make('$money($input)'))
                        ->stripCharacters(',')
                        ->numeric(),
                    Textarea::make('desc')->required()->placeholder('Deskripsi'),
                    ToggleButtons::make('is_active')
                        ->label('Status')
                        ->boolean()
                        ->grouped()
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('name')->label('Layanan'),
                TextColumn::make('price')->label('Harga')->formatStateUsing(fn($state) => 'Rp ' . number_format($state, 0, ',', '.')),
                TextColumn::make('is_active')->label('Status')->badge()->color(function ($state) {
                    return $state ? 'success' : 'danger';
                })->icon(function ($state) {
                    return $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle';
                })->formatStateUsing(fn($state) => $state ? 'Aktif' : 'Tidak Aktif'),
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListShippingServices::route('/'),
            'create' => Pages\CreateShippingService::route('/create'),
            'edit' => Pages\EditShippingService::route('/{record}/edit'),
        ];
    }
}
