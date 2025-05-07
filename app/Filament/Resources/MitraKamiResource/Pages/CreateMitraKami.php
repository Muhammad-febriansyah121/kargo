<?php

namespace App\Filament\Resources\MitraKamiResource\Pages;

use App\Filament\Resources\MitraKamiResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateMitraKami extends CreateRecord
{
    protected static string $resource = MitraKamiResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $nomorTujuan = $data['phone'];
        if (Str::startsWith($nomorTujuan, '08')) {
            $nomorTujuan = '62' . substr($nomorTujuan, 1);
        }
        $data['phone'] = $nomorTujuan;
        $data['author'] = Auth::user()->id;
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'mitra';
        return $data;
    }
}
