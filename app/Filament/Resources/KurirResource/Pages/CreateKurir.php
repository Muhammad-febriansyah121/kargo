<?php

namespace App\Filament\Resources\KurirResource\Pages;

use App\Filament\Resources\KurirResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateKurir extends CreateRecord
{
    protected static string $resource = KurirResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'kurir';
        return $data;
    }
}
