<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ListCustomers extends ListRecords
{
    protected static string $resource = CustomerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTitle(): string|Htmlable
    {
        return 'Customer';
    }

    protected function getTableQuery(): ?Builder
    {
        $user = Auth::user();
        if ($user->role === 'admin' && $user->divisi === NULL) {
            return User::query()->where('role', 'customer');
        } else {
            return User::query()->where('role', 'customer')->where('author', Auth::user()->id);
        }

        return null;
    }
}
