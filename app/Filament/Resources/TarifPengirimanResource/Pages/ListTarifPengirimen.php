<?php

namespace App\Filament\Resources\TarifPengirimanResource\Pages;

use App\Filament\Resources\TarifPengirimanResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTarifPengirimen extends ListRecords
{
    protected static string $resource = TarifPengirimanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
