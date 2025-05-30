<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryNewsResource\Pages;
use App\Filament\Resources\CategoryNewsResource\RelationManagers;
use App\Models\CategoryNews;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class CategoryNewsResource extends Resource
{
    protected static ?string $model = CategoryNews::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Kategori Berita';
    protected static ?string $navigationParentItem = 'Berita';
    protected static ?int $navigationSort = 7;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    TextInput::make('title')
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn(Set $set, ?string $state) => $set('slug', Str::slug($state)))->placeholder('Kategori'),
                    TextInput::make('slug')->readOnly()->placeholder('Slug'),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('No')->rowIndex(),
                TextColumn::make('title')->label('Kategori')->searchable(),
                TextColumn::make('slug')->label('Slug')->searchable(),
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
            'index' => Pages\ListCategoryNews::route('/'),
            'create' => Pages\CreateCategoryNews::route('/create'),
            'edit' => Pages\EditCategoryNews::route('/{record}/edit'),
        ];
    }
}
