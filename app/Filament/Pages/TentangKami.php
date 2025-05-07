<?php

namespace App\Filament\Pages;

use App\Models\AboutUs;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class TentangKami extends Page implements HasForms
{
    use InteractsWithForms;
    public ?array $data = [];
    public AboutUs $about;
    protected static ?string $navigationIcon = 'heroicon-o-flag';

    protected static string $view = 'filament.pages.tentang-kami';

    protected static ?string $navigationGroup = 'Main Menu';
    protected static ?string $navigationLabel = 'Tentang Kami';
    protected static ?int $navigationSort = 2;

    public static function canAccess(): bool
    {
        if (Auth::user()->role == 'admin' && Auth::user()->divisi === NULL) {
            return true;
        }
        return false;
    }


    public function mount(): void
    {
        $this->about = AboutUs::first();
        $this->form->fill($this->about->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->schema([
                        TextInput::make('title')->label('Judul'),
                        FileUpload::make('image')->label('Thumbnail')->disk('public')
                            ->directory('image-upload-server')
                            ->maxSize(3072)
                            ->image()
                            ->deletable(true)
                            ->deleteUploadedFileUsing(function ($record, $file) {
                                if (isset($record->image)) {
                                    if ($record->image == $file->image) {
                                        if (File::exists(public_path('storage\\' . $record->image))) {
                                            File::delete(public_path('storage\\' . $record->image));
                                        }
                                    }
                                }
                            }),
                    ])->columns(1),
                Section::make()
                    ->schema([
                        RichEditor::make('body')->label('Deskripsi'),
                    ])->columns(1)
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
            $q = AboutUs::first();
            if (isset($data['image']) && $data['image']) {
                if ($data['image'] !== $q->image) {
                    $destination = public_path('storage\\' . $q->image);
                    if (File::exists($destination)) {
                        File::delete($destination);
                    }
                }
            }


            if (isset($data['content']) && $data['content'] !== $q->content) {
                $q->content = $data['content'];
            }

            $q->update($data);

            Notification::make()
                ->success()
                ->title('Data berhasil disimpan')
                ->send();

            return $this->redirect('/admin/tentang-kami', navigate: true);
        } catch (\Exception $exception) {
            Notification::make()
                ->warning()
                ->title($exception->getMessage())
                ->send();
            return $this->redirect('/admin/tentang-kami', navigate: true);
        }
    }
}
