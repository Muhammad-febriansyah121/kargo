<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DriverResource\Pages;
use App\Filament\Resources\DriverResource\RelationManagers;
use App\Models\Driver;
use App\Models\User;
use App\Models\WareHouse;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\Section as ComponentsSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class DriverResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'Master Data';
    protected static ?string $navigationLabel = 'Driver/Supir';
    protected static ?int $navigationSort = 17;

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
                    TextInput::make('name')->required()->placeholder('Driver/Supir'),
                    TextInput::make('email')->required()->email()->placeholder('Email'),
                    TextInput::make('password')->password()->placeholder('Password'),
                    TextInput::make('phone')->required()->placeholder('Nomor Telepon'),
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
                        ->live()
                        ->searchable()
                        ->required(),
                    Select::make('warehouse_id')
                        ->options(fn(Get $get): Collection => WareHouse::query()
                            ->where('city_id', (int) $get('city_id'))
                            ->pluck('name', 'id'))
                        ->label('Gudang')
                        ->searchable()
                        ->required(),
                    TextInput::make('address')->required()->placeholder('Alamat'),
                    Select::make('gender')->options([
                        'Laki-laki' => 'Laki-laki',
                        'Perempuan' => 'Perempuan',
                    ])->label('Jenis Kelamin')->required(),
                ])->columnSpan(['lg' => 2]),
                Section::make()->schema([
                    FileUpload::make('image')->disk('public')
                        ->directory('image-upload-server')
                        ->label('Foto')
                        ->maxSize(5072)
                        ->image()
                        ->avatar()
                        ->alignCenter()
                        ->deletable(true)
                        ->deleteUploadedFileUsing(function ($record, $file) {
                            if (isset($record->image)) {
                                if (File::exists(public_path('storage\\' . $record->image))) {
                                    File::delete(public_path('storage\\' . $record->image));
                                }
                            }
                        })->columnSpan(['lg' => 2]),
                ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("No")->rowIndex(),
                ImageColumn::make('image')->label('Foto')->width('120px')->height('120px'),
                TextColumn::make('name')->label('Driver/Supir')->searchable(),
                TextColumn::make('email')->label('Email')->searchable(),
                TextColumn::make('phone')->label('Nomor Telepon')->searchable(),
                TextColumn::make('address')->label('Alamat')->searchable(),
                TextColumn::make('gender')->label('Jenis Kelamin')->searchable(),

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

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                ComponentsSection::make()->schema(
                    [
                        TextEntry::make('name')->label('Nama'),
                        TextEntry::make('email')->label('Email'),
                        TextEntry::make('phone')->label('Nomor Telepon'),
                        TextEntry::make('gender')->label('Jenis Kelamin'),
                        TextEntry::make('created_at')->label('Dibuat')->date(),
                    ]
                )->columnSpan(['lg' => 2])->columns(2),
                ComponentsSection::make()->schema(
                    [
                        ImageEntry::make('image')->label('Foto')->width('100%')->height('100%')->circular()->alignCenter(),
                    ]
                )->columnSpan(['lg' => 1]),
                ComponentsSection::make()->schema(
                    [
                        TextEntry::make('city.provinsi')->label('Provinsi'),
                        TextEntry::make('city.kota')->label('Kota'),
                        TextEntry::make('city.kecamatan')->label('Kecamatan'),
                        TextEntry::make('city.kelurahan')->label('Kelurahan'),
                        TextEntry::make('city.postal_code')->label('Kode POS'),
                        TextEntry::make('warehouse.name')->label('Gudang'),
                        TextEntry::make('warehouse.address')->label('Alamat Gudang'),
                        TextEntry::make('address')->label('Alamat'),
                    ]
                )->columnSpan(['lg' => 3])->columns(2),
            ])->columns(3);
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
            'index' => Pages\ListDrivers::route('/'),
            'create' => Pages\CreateDriver::route('/create'),
            'edit' => Pages\EditDriver::route('/{record}/edit'),
        ];
    }
}
