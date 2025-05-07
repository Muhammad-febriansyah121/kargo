<?php

namespace App\Filament\Resources\DivisiResource\Pages;

use App\Filament\Resources\DivisiResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;

class ListDivisis extends ListRecords
{
    protected static string $resource = DivisiResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTitle(): string|Htmlable
    {
        return 'Divisi';
    }

    protected function getTableQuery(): ?Builder
    {
        return User::query()->where('divisi', '!=', null);
    }
}
