<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\Auth;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $user = Auth::user();
        $query = Transaction::query();
        $mitraquery = User::query()->where('role', 'mitra')->where('divisi', "AGENT")->where('author', $user->id);

        if ($user->role === 'admin' && $user->divisi !== null) {
            $query->where('author', $user->id);
        } elseif ($user->role === 'mitra') {
            $query->where('author', $user->id);
        }

        $mitra = (clone $mitraquery)->count();
        $trx = (clone $query)->count();
        $pending = (clone $query)->where('status', 'pending')->count();
        $paid = (clone $query)->where('status', 'paid')->count();
        $cancel = (clone $query)->where('status', 'cancel')->count();

        if ($user->role === 'admin' && $user->divisi === "AGENT") {
            return [
                Stat::make('Total Transaksi', $trx),
                Stat::make('Total Transaksi Pending', $pending),
                Stat::make('Total Transaksi Selesai', $paid),
                Stat::make('Total Mitra', $mitra),
            ];
        }

        return [
            Stat::make('Total Transaksi', $trx),
            Stat::make('Total Transaksi Pending', $pending),
            Stat::make('Total Transaksi Selesai', $paid),
            Stat::make('Total Transaksi Batal', $cancel),
        ];
    }
}
