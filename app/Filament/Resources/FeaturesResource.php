<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FeaturesResource\Pages;
use App\Filament\Resources\FeaturesResource\RelationManagers;
use App\Models\Features;
use App\Models\Fitur;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class FeaturesResource extends Resource
{
    protected static ?string $model = Fitur::class;

    protected static ?string $navigationIcon = 'heroicon-o-funnel';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Features';
    protected static ?int $navigationSort = 10;

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
                    TextInput::make('title')->required()->placeholder('Judul'),
                    TextInput::make('desc')->required()->placeholder('Deskripsi'),
                    FileUpload::make('image')->disk('public')
                        ->directory('image-upload-server')
                        ->label('Thumbnail')
                        ->maxSize(3072)
                        ->image()
                        ->deletable(true)
                        ->deleteUploadedFileUsing(function ($record, $file) {
                            if (isset($record->image)) {
                                if ($record->image == $file->image) {
                                    if (File::exists(public_path('storage\\' . $record->image))) {
                                        File::delete(public_path('storage\\' . $record->image));
                                    }
                                }
                            }
                        })->columnSpan(['lg' => 2]),
                ])->columns(2)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                TextColumn::make("title")->label("Mitra")->searchable(),
                ImageColumn::make("image")->width("120px")->height('100px'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()->after(function ($record) {
                    File::delete(public_path('storage\\' . $record->image));
                })->icon('heroicon-o-trash')->color('danger')->button()->label('Hapus'),
                ViewAction::make()->button()->color('warning'),
            ])
            ->bulkActions([
                DeleteBulkAction::make()
                    ->after(function ($records) {
                        foreach ($records as $record) {
                            File::delete(public_path('storage\\' . $record->image));
                        }
                    }),
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
            'index' => Pages\ListFeatures::route('/'),
            'create' => Pages\CreateFeatures::route('/create'),
            'edit' => Pages\EditFeatures::route('/{record}/edit'),
        ];
    }
}
