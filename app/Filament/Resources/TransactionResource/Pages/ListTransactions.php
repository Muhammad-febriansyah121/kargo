<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;

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
