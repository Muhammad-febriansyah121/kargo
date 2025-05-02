<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function callback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');

        // Format gross_amount jadi string desimal 2 digit, seperti Midtrans kirim
        $grossAmount = number_format((float) $request->input('gross_amount'), 2, '.', '');

        // Hitung ulang signature
        $hashed = hash(
            'sha512',
            $request->input('order_id') .
                $request->input('status_code') .
                $grossAmount .
                $serverKey
        );

        if ($hashed !== $request->input('signature_key')) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $transaction = Transaction::where('invoice_number', $request->order_id)->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Ubah status sesuai status dari Midtrans
        switch ($request->input('transaction_status')) {
            case 'capture':
            case 'settlement':
                $transaction->status = 'paid';
                break;
            case 'pending':
                $transaction->status = 'pending';
                break;
            case 'deny':
                $transaction->status = 'failed';
                break;
            case 'expire':
                $transaction->status = 'expired';
                break;
            case 'cancel':
                $transaction->status = 'canceled';
                break;
            default:
                $transaction->status = 'unknown';
        }

        $transaction->save();

        return response()->json(['message' => 'Callback success']);
    }
}
