<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use Filament\Actions;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;

class AddKurir extends EditRecord
{
    protected static string $resource = TransactionResource::class;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // ...
            ]);
    }
}
