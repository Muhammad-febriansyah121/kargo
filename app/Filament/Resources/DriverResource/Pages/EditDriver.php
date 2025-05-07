<?php

namespace App\Filament\Resources\DriverResource\Pages;

use App\Filament\Resources\DriverResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EditDriver extends EditRecord
{
    protected static string $resource = DriverResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $nomorTujuan = $data['phone'];
        if (Str::startsWith($nomorTujuan, '08')) {
            $nomorTujuan = '62' . substr($nomorTujuan, 1);
        }
        $data['phone'] = $nomorTujuan;
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        return $data;
    }
}
