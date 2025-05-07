<?php

namespace App\Filament\Resources\SantriResource\Pages;

use App\Filament\Resources\SantriResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateSantri extends CreateRecord
{
    protected static string $resource = SantriResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $nomorTujuan = $data['phone'];
        if (Str::startsWith($nomorTujuan, '08')) {
            $nomorTujuan = '62' . substr($nomorTujuan, 1);
        }
        $data['phone'] = $nomorTujuan;
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'santri';
        $data['author'] = Auth::user()->id;
        return $data;
    }
}
