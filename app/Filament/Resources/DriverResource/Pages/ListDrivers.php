<?php

namespace App\Filament\Resources\DriverResource\Pages;

use App\Filament\Resources\DriverResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;

class ListDrivers extends ListRecords
{
    protected static string $resource = DriverResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTitle(): string|Htmlable
    {
        return 'Driver';
    }

    protected function getTableQuery(): ?Builder
    {
        return User::query()->where('role', 'driver');
    }
}
