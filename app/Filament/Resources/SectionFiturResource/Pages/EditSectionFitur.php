<?php

namespace App\Filament\Resources\SectionFiturResource\Pages;

use App\Filament\Resources\SectionFiturResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSectionFitur extends EditRecord
{
    protected static string $resource = SectionFiturResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
