<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PesantrenResource\Pages;
use App\Filament\Resources\PesantrenResource\RelationManagers;
use App\Models\Pesantren;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PesantrenResource extends Resource
{
    protected static ?string $model = Pesantren::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationParentItem = 'Santri';
    protected static ?string $navigationLabel = 'Pesantren';
    protected static ?string $navigationGroup = 'Master Data';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make("")->schema([
                    TextInput::make('name')->required()->placeholder('Pesantren'),
                    Textarea::make("address")->required()->placeholder('Alamat'),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('name')->label('Pesantren')->searchable(),
                TextColumn::make('address')->label('Alamat')->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListPesantrens::route('/'),
            'create' => Pages\CreatePesantren::route('/create'),
            'edit' => Pages\EditPesantren::route('/{record}/edit'),
        ];
    }
}
