<?php

namespace App\Filament\Resources\DefinisiResource\Pages;

use App\Filament\Resources\DefinisiResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDefinisi extends EditRecord
{
    protected static string $resource = DefinisiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
