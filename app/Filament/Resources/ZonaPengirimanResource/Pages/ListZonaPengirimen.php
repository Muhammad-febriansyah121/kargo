<?php

namespace App\Filament\Resources\ZonaPengirimanResource\Pages;

use App\Filament\Resources\ZonaPengirimanResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListZonaPengirimen extends ListRecords
{
    protected static string $resource = ZonaPengirimanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
