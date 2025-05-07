<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateCustomer extends CreateRecord
{
    protected static string $resource = CustomerResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $user = Auth::user();
        if ($user->role == 'admin' && $user->divisi === null) {
            $nomorTujuan = $data['phone'];
            if (Str::startsWith($nomorTujuan, '08')) {
                $nomorTujuan = '62' . substr($nomorTujuan, 1);
            }
            $data['phone'] = $nomorTujuan;
            $data['author'] = $user->id;
            $data['password'] = Hash::make($data['password']);
            $data['role'] = 'customer';
            return $data;
        } elseif ($user->role == 'admin' && $user->divisi !== null) {
            $nomorTujuan = $data['phone'];
            if (Str::startsWith($nomorTujuan, '08')) {
                $nomorTujuan = '62' . substr($nomorTujuan, 1);
            }
            $data['phone'] = $nomorTujuan;
            $data['author'] = $user->id;
            $data['email'] = Str::random(8) . '@gmail.com';
            $data['password'] = '-';
            $data['role'] = 'customer';
            return $data;
        } elseif ($user->role == 'mitra') {
            $nomorTujuan = $data['phone'];
            if (Str::startsWith($nomorTujuan, '08')) {
                $nomorTujuan = '62' . substr($nomorTujuan, 1);
            }
            $data['phone'] = $nomorTujuan;
            $data['author'] = $user->id;
            $data['email'] = Str::random(8) . '@gmail.com';
            $data['password'] = '-';
            $data['role'] = 'customer';
            return $data;
        }

        return $data;
    }
}
