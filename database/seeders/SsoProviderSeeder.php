<?php

namespace Database\Seeders;

use App\Models\SsoProvider;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SsoProviderSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'sso-providers.view',
            'sso-providers.create',
            'sso-providers.edit',
            'sso-providers.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $roleSuperadmin = Role::firstOrCreate(['name' => 'Super Admin']);

        foreach ($permissions as $permissionName) {
            if (!$roleSuperadmin->hasPermissionTo($permissionName)) {
                $roleSuperadmin->givePermissionTo($permissionName);
            }
        }

        // seed sso-providers
        $ssoProviders = [
            [
                'code' => 'ldap',
                'name' => 'LDAP',
                'icon' => '-',
                'is_active' => true,
                'can_register' => false,
            ],
        ];

        foreach ($ssoProviders as $ssoProvider) {
            SsoProvider::firstOrCreate($ssoProvider);
        }
    }
}
