<?php

namespace App\Filament\Resources\SantriResource\Pages;

use App\Filament\Resources\SantriResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ListSantris extends ListRecords
{
    protected static string $resource = SantriResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTitle(): string|Htmlable
    {
        return 'Santri';
    }

    protected function getTableQuery(): ?Builder
    {
        $user = Auth::user();
        if ($user->role === 'admin' && $user->divisi === NULL) {
            return User::query()->where('role', 'santri');
        } elseif ($user->role === "admin" && $user->divisi === "SANTRI EXPRESS") {
            return User::query()->where('role', 'santri')->where('author', Auth::user()->id);
        }
        return null;
    }
}
