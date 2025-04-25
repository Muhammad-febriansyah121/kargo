<?php

namespace App\Filament\Resources\ShippingServiceResource\Pages;

use App\Filament\Resources\ShippingServiceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListShippingServices extends ListRecords
{
    protected static string $resource = ShippingServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
