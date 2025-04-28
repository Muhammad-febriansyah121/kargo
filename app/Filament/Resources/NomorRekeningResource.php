<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NomorRekeningResource\Pages;
use App\Filament\Resources\NomorRekeningResource\RelationManagers;
use App\Models\NomorRekening;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\File;

class NomorRekeningResource extends Resource
{
    protected static ?string $model = NomorRekening::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Nomor Rekening';
    protected static ?int $navigationSort = 20;

    public static function canAccess(): bool
    {
        return false;
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    TextInput::make("nomor_rekening")->required()->placeholder('Nomor Rekening'),
                    TextInput::make("atas_nama")->required()->placeholder('Atas Nama'),
                    TextInput::make("bank")->required()->placeholder('Bank'),
                    FileUpload::make('image')->disk('public')
                        ->directory('image-upload-server')
                        ->label('Thumbnail')
                        ->maxSize(5072)
                        ->image()
                        ->deletable(true)
                        ->deleteUploadedFileUsing(function ($record, $file) {
                            if (isset($record->image)) {
                                if (File::exists(public_path('storage\\' . $record->image))) {
                                    File::delete(public_path('storage\\' . $record->image));
                                }
                            }
                        }),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                ImageColumn::make('image')->label('Thumbnail')->width('200px')->height('100px'),
                TextColumn::make('nomor_rekening')->label('Nomor Rekening')->searchable(),
                TextColumn::make('atas_nama')->label('Atas Nama')->searchable(),
                TextColumn::make('bank')->label('Bank')->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()->after(function ($record) {
                    File::delete(public_path('storage\\' . $record->image));
                })->icon('heroicon-o-trash')->color('danger')->button()->label('Hapus'),
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListNomorRekenings::route('/'),
            'create' => Pages\CreateNomorRekening::route('/create'),
            'edit' => Pages\EditNomorRekening::route('/{record}/edit'),
        ];
    }
}
