<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use App\Models\Transaction;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return TransactionResource::getWidgets();
    }

    protected function getTableQuery(): ?Builder
    {
        $user = Auth::user();

        if ($user->role === 'admin' && $user->divisi === null) {
            return Transaction::query()->latest();
        } elseif ($user->role === 'admin' && $user->divisi !== null || $user->role === 'mitra') {
            return Transaction::query()->where('author', $user->id)->latest();
        }

        return null;
    }


    public function getTabs(): array
    {
        return [
            null => Tab::make('Semua'),
            'pickup' => Tab::make()->query(
                fn($query) =>
                $query->whereHas('ShippingOrder', fn($q) => $q->where('pickup_type', 'pickup'))
            ),
            'dropoff' => Tab::make()->query(
                fn($query) =>
                $query->whereHas('ShippingOrder', fn($q) => $q->where('pickup_type', 'dropoff'))
            ),
        ];
    }
}
