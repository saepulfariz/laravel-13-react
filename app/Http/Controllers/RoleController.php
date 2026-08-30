<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('can:roles.view', only: ['index']),
            new Middleware('can:roles.create', only: ['create', 'store']),
            new Middleware('can:roles.edit', only: ['edit', 'update']),
            new Middleware('can:roles.delete', only: ['destroy']),
        ];
    }
    
    /**
     * Display a listing of the roles.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $perPage = $request->input('per_page', 5);

        $roles = Role::with('permissions')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create(): Response
    {
        $permissions = Permission::all();
        
        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:'.Role::class],
            'permissions' => ['nullable', 'array'],
        ]);

        $role = Role::create(['name' => $validated['name']]);
        
        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role): Response
    {
        $permissions = Permission::all();
        $role->load('permissions');
        
        return Inertia::render('roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:'.Role::class.',name,'.$role->id],
            'permissions' => ['nullable', 'array'],
        ]);

        $role->update(['name' => $validated['name']]);
        
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        // prevent deleting superadmin role if needed
        if (strtolower($role->name) === 'admin' || strtolower($role->name) === 'superadmin') {
            return redirect()->route('roles.index')->with('error', 'Cannot delete admin role.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
