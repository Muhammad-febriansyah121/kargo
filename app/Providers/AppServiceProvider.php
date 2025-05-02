<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Request $request): void
    {
        Vite::prefetch(concurrency: 3);
        if (str_ends_with($request->getHost(), '.ngrok-free.app')) {
            URL::forceScheme('https');
        }
    }
}
