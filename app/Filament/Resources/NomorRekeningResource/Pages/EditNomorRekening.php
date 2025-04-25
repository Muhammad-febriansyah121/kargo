<?php

namespace App\Filament\Resources\NomorRekeningResource\Pages;

use App\Filament\Resources\NomorRekeningResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNomorRekening extends EditRecord
{
    protected static string $resource = NomorRekeningResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
