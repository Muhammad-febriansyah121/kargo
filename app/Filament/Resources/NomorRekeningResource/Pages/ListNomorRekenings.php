<?php

namespace App\Filament\Resources\NomorRekeningResource\Pages;

use App\Filament\Resources\NomorRekeningResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListNomorRekenings extends ListRecords
{
    protected static string $resource = NomorRekeningResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
