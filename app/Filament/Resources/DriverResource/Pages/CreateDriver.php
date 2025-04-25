<?php

namespace App\Filament\Resources\DriverResource\Pages;

use App\Filament\Resources\DriverResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateDriver extends CreateRecord
{
    protected static string $resource = DriverResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'driver';
        return $data;
    }
}
