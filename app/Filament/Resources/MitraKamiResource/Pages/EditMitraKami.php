<?php

namespace App\Filament\Resources\MitraKamiResource\Pages;

use App\Filament\Resources\MitraKamiResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EditMitraKami extends EditRecord
{
    protected static string $resource = MitraKamiResource::class;

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
        $data['author'] = Auth::user()->id;
        $data['role'] = 'mitra';
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        return $data;
    }
}
