<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return \Inertia\Inertia::render('dashboard', [
            'stats' => [
                'users' => \App\Models\User::count(),
                'roles' => \Spatie\Permission\Models\Role::count(),
                'permissions' => \Spatie\Permission\Models\Permission::count(),
                'active_users' => \App\Models\User::where('is_active', 1)->count(),
            ],
            'recentUsers' => \App\Models\User::with('roles')->orderBy('created_at', 'desc')->take(5)->get(),
        ]);
    })->name('dashboard');
    Route::get('users/export', [UserController::class, 'export'])->name('users.export');
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::resource('sso-providers', App\Http\Controllers\SsoProviderController::class);

    // SSO Unlink
    Route::delete('auth/{provider}/unlink', [App\Http\Controllers\SsoController::class, 'unlinkProvider'])->name('sso.unlink');

    Route::get('settings/app', [\App\Http\Controllers\SettingsController::class, 'edit'])->name('settings.edit');
    Route::post('settings/app', [\App\Http\Controllers\SettingsController::class, 'update'])->name('settings.update');
});

// SSO Auth Routes
Route::get('auth/{provider}/login', [App\Http\Controllers\SsoController::class, 'redirectToProvider'])->name('sso.login');
Route::get('auth/{provider}/callback', [App\Http\Controllers\SsoController::class, 'handleProviderCallback'])->name('sso.callback');

require __DIR__ . '/settings.php';
