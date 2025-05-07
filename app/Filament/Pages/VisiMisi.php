<?php

namespace App\Filament\Pages;

use App\Models\VisiMisi as ModelsVisiMisi;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class VisiMisi extends Page implements HasForms
{
    use InteractsWithForms;
    public ?array $data = [];
    public ModelsVisiMisi $about;
    protected static ?string $navigationIcon = 'heroicon-o-chevron-up-down';

    protected static string $view = 'filament.pages.visi-misi';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Visi & Misi';
    protected static ?int $navigationSort = 3;

    public static function canAccess(): bool
    {
        if (Auth::user()->role == 'admin' && Auth::user()->divisi === NULL) {
            return true;
        }
        return false;
    }

    public function mount(): void
    {
        $this->about = ModelsVisiMisi::first();
        $this->form->fill($this->about->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->schema([
                        RichEditor::make('visi')->label('Visi'),
                        RichEditor::make('misi')->label('Misi'),
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
            $q = ModelsVisiMisi::first();

            if (isset($data['visi']) && $data['visi'] !== $q->visi) {
                $q->visi = $data['visi'];
            }
            if (isset($data['misi']) && $data['misi'] !== $q->misi) {
                $q->misi = $data['misi'];
            }

            $q->update($data);

            Notification::make()
                ->success()
                ->title('Data berhasil disimpan')
                ->send();

            return $this->redirect('/admin/visi-misi', navigate: true);
        } catch (\Exception $exception) {
            Notification::make()
                ->warning()
                ->title($exception->getMessage())
                ->send();
            return $this->redirect('/admin/visi-misi', navigate: true);
        }
    }
}
