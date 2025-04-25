<?php

namespace App\Filament\Pages;

use App\Models\KebijakanPrivasi as ModelsKebijakanPrivasi;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class KebijakanPrivasi extends Page implements HasForms
{
    use InteractsWithForms;
    public ?array $data = [];
    public ModelsKebijakanPrivasi $about;
    protected static ?string $navigationIcon = 'heroicon-o-lock-closed';


    protected static string $view = 'filament.pages.kebijakan-privasi';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Kebijakan Privasi';
    protected static ?int $navigationSort = 4;

    public function mount(): void
    {
        $this->about = ModelsKebijakanPrivasi::first();
        $this->form->fill($this->about->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->schema([
                        RichEditor::make('content')->label('Konten'),
                    ])->columns(1),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->submit('save')->label('Simpan')->icon('heroicon-s-check-circle'),
        ];
    }

    public function save()
    {
        try {
            $data = $this->form->getState();
            $q = ModelsKebijakanPrivasi::first();

            if (isset($data['content']) && $data['content'] !== $q->content) {
                $q->content = $data['content'];
            }


            $q->update($data);

            Notification::make()
                ->success()
                ->title('Data berhasil disimpan')
                ->send();

            return $this->redirect('/admin/kebijakan-privasi', navigate: true);
        } catch (\Exception $exception) {
            Notification::make()
                ->warning()
                ->title($exception->getMessage())
                ->send();
            return $this->redirect('/admin/kebijakan-privasi', navigate: true);
        }
    }
}
