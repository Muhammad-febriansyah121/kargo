<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class PilihKurir extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string $resource = TransactionResource::class;

    protected static string $view = 'filament.resources.transaction-resource.pages.pilih-kurir';

    public ?Transaction $record = null;

    public function mount($record): void
    {
        $this->record = Transaction::findOrFail($record);

        $this->form->fill([
            'courier_id' => $this->record->courier_id,
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->statePath('data') // penting agar state tersimpan
            ->schema([
                Section::make()->schema([
                    Select::make('city_id')
                        ->options(
                            \App\Models\City::all()->mapWithKeys(fn($city) => [
                                $city->id => $city->provinsi . ' - ' .
                                    $city->kota . ' - ' .
                                    $city->kecamatan . ' - ' .
                                    $city->kelurahan . ' - ' .
                                    $city->postal_code,
                            ])
                        )
                        ->live()
                        ->label('Pilih Kurir By Kecamatan')
                        ->searchable()
                        ->afterStateUpdated(fn(callable $set) => $set('courier_id', null))
                        ->required(),

                    Select::make('courier_id')
                        ->label('Pilih Kurir')
                        ->required()
                        ->searchable()
                        ->options(function (Get $get): array {
                            $cityId = $get('city_id');
                            return $cityId
                                ? User::where('role', 'kurir')
                                ->where('city_id', $cityId)
                                ->pluck('name', 'id')
                                ->toArray()
                                : [];
                        }),
                ])
            ]);
    }

    public function submit(): void
    {
        $data = $this->form->getState();

        // Handle update
        $this->record->update([
            'city_id' => $data['city_id'],
            'courier_id' => $data['courier_id'],
        ]);

        Notification::make()
            ->title('Kurir berhasil diperbarui!')
            ->success()
            ->send();
    }


    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->submit('save')->label('Simpan')->icon('heroicon-o-check-circle'),
        ];
    }
}
