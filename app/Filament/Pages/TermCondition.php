<?php

namespace App\Filament\Pages;

use App\Models\TermCondition as ModelsTermCondition;
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class TermCondition extends Page implements HasForms
{
    use InteractsWithForms;
    public ?array $data = [];
    public ModelsTermCondition $about;

    protected static ?string $navigationIcon = 'heroicon-o-exclamation-circle';

    protected static string $view = 'filament.pages.term-condition';
    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Term Condition';
    protected static ?int $navigationSort = 5;

    public static function canAccess(): bool
    {
        if (Auth::user()->role == 'admin' && Auth::user()->divisi === NULL) {
            return true;
        }
        return false;
    }

    public function mount(): void
    {
        $this->about = ModelsTermCondition::first();
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
            $q = ModelsTermCondition::first();

            if (isset($data['content']) && $data['content'] !== $q->content) {
                $q->content = $data['content'];
            }


            $q->update($data);

            Notification::make()
                ->success()
                ->title('Data berhasil disimpan')
                ->send();

            return $this->redirect('/admin/term-condition', navigate: true);
        } catch (\Exception $exception) {
            Notification::make()
                ->warning()
                ->title($exception->getMessage())
                ->send();
            return $this->redirect('/admin/term-condition', navigate: true);
        }
    }
}
