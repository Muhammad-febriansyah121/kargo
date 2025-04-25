<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\File;

class SettingWebsite extends Page implements HasForms
{
    use InteractsWithForms;
    public ?array $data = [];
    public Setting $setting;
    public $settings;

    protected static ?string $navigationIcon = 'heroicon-o-cog';


    protected static string $view = 'filament.pages.setting-website';

    protected static ?string $navigationGroup = 'Setting';
    protected static ?string $navigationLabel = 'Setting Website';
    protected static ?int $navigationSort = 100;

    public function mount(): void
    {
        $this->setting = Setting::first();
        $this->form->fill($this->setting->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->columns(['lg' => 2, 'md' => 1, 'sm' => 1])
                    ->schema([
                        TextInput::make('site_name')->label('Site Name'),
                        TextInput::make('keyword')->label('Keyword'),
                        TextInput::make('email')->label('Email')->email(),
                        TextInput::make('tel_perusahaan')->label('Nomor Telepon Perusahaan'),
                        TextInput::make('phone')->label('Nomor Whatsapp')->numeric(),
                        TextInput::make('address')->label('Alamat'),
                        TextInput::make('ig')->label('URL Instagram')->url()->columnSpan(['lg' => 2]),
                        TextInput::make('fb')->label('URL Facebook')->url()->columnSpan(['lg' => 2]),
                        TextInput::make('tags')->label('Tagline')->columnSpan(['lg' => 2]),
                        TextInput::make('heading')->label('Heading')->columnSpan(['lg' => 2]),
                        Textarea::make('description')->label('Deskripsi')->columnSpan(['lg' => 2]),
                        Textarea::make('map')->label('URL Maps Embed')->columnSpan(['lg' => 2]),
                        FileUpload::make('logo')->label('Logo Website')->disk('public')
                            ->directory('image-upload-server')
                            ->label('Logo Website')
                            ->maxSize(3072)
                            ->image()
                            ->deletable(true)
                            ->deleteUploadedFileUsing(function ($record, $file) {
                                if (isset($record->logo)) {
                                    if ($record->logo == $file->logo) {
                                        if (File::exists(public_path('storage\\' . $record->logo))) {
                                            File::delete(public_path('storage\\' . $record->logo));
                                        }
                                    }
                                }
                            })->columnSpan(['lg' => 2]),
                        FileUpload::make('long_logo')->label('Long Logo')->disk('public')
                            ->directory('image-upload-server')
                            ->label('Long Logo')
                            ->maxSize(3072)
                            ->image()
                            ->deletable(true)
                            ->deleteUploadedFileUsing(function ($record, $file) {
                                if (isset($record->long_logo)) {
                                    if ($record->long_logo == $file->long_logo) {
                                        if (File::exists(public_path('storage\\' . $record->long_logo))) {
                                            File::delete(public_path('storage\\' . $record->long_logo));
                                        }
                                    }
                                }
                            })->columnSpan(['lg' => 2]),
                        FileUpload::make('thumbnail')->label('Thumbnail')->disk('public')
                            ->directory('image-upload-server')
                            ->maxSize(7072)
                            ->image()
                            ->deletable(true)
                            ->deleteUploadedFileUsing(function ($record, $file) {
                                if (isset($record->thumbnail)) {
                                    if ($record->thumbnail == $file->thumbnail) {
                                        if (File::exists(public_path('storage\\' . $record->thumbnail))) {
                                            File::delete(public_path('storage\\' . $record->thumbnail));
                                        }
                                    }
                                }
                            })->columnSpan(['lg' => 2]),
                        FileUpload::make('thumbnail_login')->label('Thumbnail Login & Register')->disk('public')
                            ->directory('image-upload-server')
                            ->maxSize(7072)
                            ->image()
                            ->deletable(true)
                            ->deleteUploadedFileUsing(function ($record, $file) {
                                if (isset($record->thumbnail_login)) {
                                    if ($record->thumbnail_login == $file->thumbnail_login) {
                                        if (File::exists(public_path('storage\\' . $record->thumbnail_login))) {
                                            File::delete(public_path('storage\\' . $record->thumbnail_login));
                                        }
                                    }
                                }
                            })->columnSpan(['lg' => 2]),
                    ]),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->submit('save')->label('Simpan')->icon('heroicon-o-check-circle'),
        ];
    }

    public function save()
    {
        try {
            $data = $this->form->getState();
            $q = Setting::findOrFail(1);  // Assuming you're updating the first setting

            // Check if logo is being updated
            if (isset($data['logo']) && $data['logo'] && $data['logo'] !== $q->logo) {
                // Delete old logo if exists
                $destination = public_path('storage\\' . $q->logo);
                if (File::exists($destination)) {
                    File::delete($destination);
                }
            }

            // Check if long_logo is being updated
            if (isset($data['long_logo']) && $data['long_logo'] && $data['long_logo'] !== $q->long_logo) {
                // Delete old long_logo if exists
                $destination = public_path('storage\\' . $q->long_logo);
                if (File::exists($destination)) {
                    File::delete($destination);
                }
            }

            // Check if thumbnail is being updated
            if (isset($data['thumbnail']) && $data['thumbnail'] && $data['thumbnail'] !== $q->thumbnail) {
                // Delete old thumbnail if exists
                $destination = public_path('storage\\' . $q->thumbnail);
                if (File::exists($destination)) {
                    File::delete($destination);
                }
            }

            if (isset($data['thumbnail_login']) && $data['thumbnail_login'] && $data['thumbnail_login'] !== $q->thumbnail_login) {
                // Delete old thumbnail_login if exists
                $destination = public_path('storage\\' . $q->thumbnail_login);
                if (File::exists($destination)) {
                    File::delete($destination);
                }
            }

            // Update only the fields that are provided (partial update)
            $q->update($data);

            Notification::make()
                ->success()
                ->title('Data berhasil disimpan')
                ->send();

            return $this->redirect('/admin/setting-website', navigate: true);
        } catch (\Exception $exception) {
            Notification::make()
                ->warning()
                ->title($exception->getMessage())
                ->send();

            return $this->redirect('/admin/setting-website', navigate: true);
        }
    }
}
