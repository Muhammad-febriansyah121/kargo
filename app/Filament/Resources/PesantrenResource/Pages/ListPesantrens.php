<?php

namespace App\Filament\Resources\PesantrenResource\Pages;

use App\Filament\Resources\PesantrenResource;
use App\Models\Pesantren;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ListPesantrens extends ListRecords
{
    protected static string $resource = PesantrenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getTableQuery(): ?Builder
    {
        $user = Auth::user();
        if ($user->role === 'admin' && $user->divisi === NULL) {
            return Pesantren::query();
        } elseif ($user->role === "admin" && $user->divisi === "SANTRI EXPRESS") {
            return Pesantren::query()->where('author', $user->id);
        }
        return null;
    }
}
