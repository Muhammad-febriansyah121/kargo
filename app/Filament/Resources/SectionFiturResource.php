<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SectionFiturResource\Pages;
use App\Filament\Resources\SectionFiturResource\RelationManagers;
use App\Models\SectionFitur;
use Doctrine\DBAL\Driver\IBMDB2\Exception\CannotCreateTemporaryFile;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\File;

class SectionFiturResource extends Resource
{
    protected static ?string $model = SectionFitur::class;

    protected static ?string $navigationIcon = 'heroicon-o-adjustments-horizontal';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Section Fitur';
    protected static ?int $navigationSort = 12;

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    TextInput::make('title')->label('Judul')->required()->placeholder('Judul'),
                    Textarea::make('desc')->label('Deskripsi')->required()->placeholder('Deskripsi'),
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
                ImageColumn::make('image')->label('Thumbnail')->width('120px')->height('120px'),
                TextColumn::make('title')->label('Judul'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                ViewAction::make()->button()->color('warning'),
            ])
            ->bulkActions([
                // Tables\Actions\BulkActionGroup::make([
                //     Tables\Actions\DeleteBulkAction::make(),
                // ]),
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
            'index' => Pages\ListSectionFiturs::route('/'),
            'create' => Pages\CreateSectionFitur::route('/create'),
            'edit' => Pages\EditSectionFitur::route('/{record}/edit'),
        ];
    }
}
