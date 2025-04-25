<?php

namespace App\Filament\Resources\KurirResource\Pages;

use App\Filament\Resources\KurirResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;

class ListKurirs extends ListRecords
{
    protected static string $resource = KurirResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTitle(): string|Htmlable
    {
        return 'Kurir';
    }

    protected function getTableQuery(): ?Builder
    {
        return User::query()->where('role', 'kurir');
    }
}
