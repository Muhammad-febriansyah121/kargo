<?php

namespace App\Filament\Resources\MitraKamiResource\Pages;

use App\Filament\Resources\MitraKamiResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ListMitraKamis extends ListRecords
{
    protected static string $resource = MitraKamiResource::class;

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
            return User::query()->where('role', 'mitra');
        } else {
            return User::query()->where('role', 'mitra')->where('author', Auth::user()->id);
        }

        return null;
    }
}
