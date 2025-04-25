<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsResource\Pages;
use App\Filament\Resources\NewsResource\RelationManagers;
use App\Models\CategoryNews;
use App\Models\News;
use Filament\Actions\ViewAction;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\ViewAction as ActionsViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\File;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Berita';
    protected static ?int $navigationSort = 8;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    TextInput::make('title')->label('Judul')->required()->placeholder('Judul'),
                    Select::make('category_news_id')->label('Kategori')->required()->options(CategoryNews::all()->pluck('title', 'id')),
                    Textarea::make('desc')->label('Deskripsi')->required()->placeholder('Deskripsi'),
                ])->columnSpan(['lg' => 2]),
                Section::make()->schema([
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
                        })->columnSpan(['lg' => 2]),
                ])->columnSpan(['lg' => 1]),
                Section::make()->schema([
                    RichEditor::make('body')->label('Body')->required()->placeholder('Body'),
                ])
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                ImageColumn::make('image')->label('Thumbnail')->width('120px')->height('120px'),
                TextColumn::make('title')->label('Judul')->searchable(),
                TextColumn::make('CategoryNews.title')->label('Kategori')->searchable(),
                TextColumn::make('created_at')->date()->label('Dibuat')->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()->after(function ($record) {
                    File::delete(public_path('storage\\' . $record->image));
                })->icon('heroicon-o-trash')->color('danger')->button()->label('Hapus'),
                ActionsViewAction::make()->icon('heroicon-o-eye')->color('info')->button()->label('Lihat'),
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
            'index' => Pages\ListNews::route('/'),
            'create' => Pages\CreateNews::route('/create'),
            'edit' => Pages\EditNews::route('/{record}/edit'),
        ];
    }
}
