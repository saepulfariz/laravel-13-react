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
});

require __DIR__.'/settings.php';
