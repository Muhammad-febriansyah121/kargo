<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $trx = Transaction::count();
        $pending = Transaction::where('status', 'pending')->count();
        $paid = Transaction::where('status', 'paid')->count();
        $cancel = Transaction::where('status', 'cancel')->count();
        return [
            Stat::make('Total Transaksi', $trx),
            Stat::make('Total Transaksi Pending', $pending),
            Stat::make('Total Transaksi Selesai', $paid),
            Stat::make('Total Transaksi Batal', $cancel),
        ];
    }
}
