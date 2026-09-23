<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\SsoProvider;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class SsoProviderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        // Using common resource naming, but if specific permissions are missing, 
        // they can be adjusted. Assuming they follow the permissions pattern.
        return [
            new Middleware('can:sso-providers.view', only: ['index']),
            new Middleware('can:sso-providers.create', only: ['create', 'store']),
            new Middleware('can:sso-providers.edit', only: ['edit', 'update']),
            new Middleware('can:sso-providers.delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $perPage = $request->input('per_page', 5);

        $ssoProviders = SsoProvider::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('sso_providers/index', [
            'ssoProviders' => $ssoProviders,
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('sso_providers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255', 'unique:'.SsoProvider::class],
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'can_register' => ['boolean'],
        ]);

        SsoProvider::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? null,
            'is_active' => $validated['is_active'] ?? false,
            'can_register' => $validated['can_register'] ?? false,
        ]);

        return redirect()->route('sso-providers.index')->with('success', 'SSO Provider created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SsoProvider $ssoProvider): Response
    {
        return Inertia::render('sso_providers/edit', [
            'ssoProvider' => $ssoProvider,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SsoProvider $ssoProvider)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:255', 'unique:'.SsoProvider::class.',code,'.$ssoProvider->id],
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'can_register' => ['boolean'],
        ]);

        $ssoProvider->update([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? null,
            'is_active' => $validated['is_active'] ?? false,
            'can_register' => $validated['can_register'] ?? false,
        ]);

        return redirect()->route('sso-providers.index')->with('success', 'SSO Provider updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SsoProvider $ssoProvider)
    {
        $ssoProvider->delete();

        return redirect()->route('sso-providers.index')->with('success', 'SSO Provider deleted successfully.');
    }
}
