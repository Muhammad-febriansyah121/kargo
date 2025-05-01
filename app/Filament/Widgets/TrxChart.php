<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;

class TrxChart extends ChartWidget
{
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Pendapatan Transaksi';
    protected static string $color = 'info';


    protected function getData(): array
    {
        $trxQuery = Transaction::query();
        $monthlyData = $trxQuery->selectRaw('MONTH(created_at) as month, SUM(amount) as total_amount')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get();

        // Siapkan array untuk data dan label
        $data = [];
        $labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Inisialisasi data untuk setiap bulan dengan nilai default 0
        $monthlyAmount = array_fill(0, 12, 0); // 12 bulan, default 0

        // Isi data transaksi ke dalam array berdasarkan bulan
        foreach ($monthlyData as $transaction) {
            $monthIndex = $transaction->month - 1; // Index bulan dimulai dari 0 (Jan = 0, Feb = 1, dst)
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
