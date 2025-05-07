<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\Auth;

class TrxChart extends ChartWidget
{
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Pendapatan Transaksi';
    protected static string $color = 'info';


    protected function getData(): array
    {
        $user = Auth::user();

        $trxQuery = Transaction::query();

        // Filter berdasarkan role dan divisi
        if ($user->role === 'admin' && $user->divisi !== null) {
            $trxQuery->where('author', $user->id);
        }

        $monthlyData = $trxQuery->selectRaw('MONTH(created_at) as month, SUM(amount) as total_amount')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get();

        // Siapkan label dan data
        $labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $monthlyAmount = array_fill(0, 12, 0); // 12 bulan default 0

        foreach ($monthlyData as $transaction) {
            $monthIndex = $transaction->month - 1;
            $monthlyAmount[$monthIndex] = $transaction->total_amount;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total',
                    'data' => $monthlyAmount,
                    'fill' => 'start',
                ],
            ],
            'labels' => $labels,
        ];
    }


    protected function getType(): string
    {
        return 'line';
    }
}
