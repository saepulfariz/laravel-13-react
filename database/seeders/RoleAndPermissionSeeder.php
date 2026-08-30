<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            'permissions.view',
            'permissions.create',
            'permissions.edit',
            'permissions.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // Create roles and assign created permissions

        // Admin gets all permissions
        $roleSuperadmin = Role::findOrCreate('Super Admin');
        $roleSuperadmin->givePermissionTo(Permission::all());

        $roleMember = Role::firstOrCreate(['name' => 'Member']);

        // give role to user
        $user = User::where('email', 'super@admin.com')->first();
        if ($user) {
            $user->assignRole($roleSuperadmin);
        }
    }
}
