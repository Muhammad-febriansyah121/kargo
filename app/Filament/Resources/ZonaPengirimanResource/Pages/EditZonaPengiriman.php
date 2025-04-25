<?php

namespace App\Filament\Resources\ZonaPengirimanResource\Pages;

use App\Filament\Resources\ZonaPengirimanResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditZonaPengiriman extends EditRecord
{
    protected static string $resource = ZonaPengirimanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
