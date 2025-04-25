<?php

namespace App\Filament\Resources\ShippingServiceResource\Pages;

use App\Filament\Resources\ShippingServiceResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditShippingService extends EditRecord
{
    protected static string $resource = ShippingServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
