<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DefinisiResource\Pages;
use App\Filament\Resources\DefinisiResource\RelationManagers;
use App\Models\Definisi;
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

class DefinisiResource extends Resource
{
    protected static ?string $model = Definisi::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Definisi';
    protected static ?int $navigationSort = 6;

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
                    TextInput::make('istilah')->required()->placeholder('Istilah'),
                    TextInput::make('definisi')->required()->placeholder('Definisi'),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make('istilah')->label('Istilah')->searchable(),
                TextColumn::make('definisi')->label('Definisi'),
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
            'index' => Pages\ListDefinisis::route('/'),
            'create' => Pages\CreateDefinisi::route('/create'),
            'edit' => Pages\EditDefinisi::route('/{record}/edit'),
        ];
    }
}
