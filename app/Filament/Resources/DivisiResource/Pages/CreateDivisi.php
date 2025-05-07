<?php

namespace App\Filament\Resources\DivisiResource\Pages;

use App\Filament\Resources\DivisiResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateDivisi extends CreateRecord
{
    protected static string $resource = DivisiResource::class;

    public function getTitle(): string|Htmlable
    {
        return 'Form Divisi';
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $nomorTujuan = $data['phone'];
        if (Str::startsWith($nomorTujuan, '08')) {
            $nomorTujuan = '62' . substr($nomorTujuan, 1);
        }
        $data['password'] = Hash::make($data['password']);
        $data['phone'] = $nomorTujuan;
        $data['role'] = 'admin';
        return $data;
    }
}
