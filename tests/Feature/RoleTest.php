<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create permissions needed for the tests
        Permission::create(['name' => 'roles.view']);
        Permission::create(['name' => 'roles.create']);
        Permission::create(['name' => 'roles.edit']);
        Permission::create(['name' => 'roles.delete']);
    }

    public function test_user_without_permission_cannot_view_roles()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('roles.index'));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_view_roles()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.view');

        Role::create(['name' => 'test role']);

        $response = $this->actingAs($user)->get(route('roles.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('roles/index')
            ->has('roles')
            ->has('filters')
        );
    }

    public function test_user_without_permission_cannot_access_create_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('roles.create'));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_access_create_page()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.create');

        $response = $this->actingAs($user)->get(route('roles.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('roles/create')
            ->has('permissions')
        );
    }

    public function test_user_can_store_new_role_with_permissions()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.create');

        $permission = Permission::create(['name' => 'some.permission']);

        $response = $this->actingAs($user)->post(route('roles.store'), [
            'name' => 'new.role',
            'permissions' => [$permission->name],
        ]);

        $response->assertRedirect(route('roles.index'));
        $this->assertDatabaseHas('roles', [
            'name' => 'new.role',
        ]);
        
        $role = Role::where('name', 'new.role')->first();
        $this->assertTrue($role->hasPermissionTo('some.permission'));
    }

    public function test_user_cannot_store_duplicate_role()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.create');

        Role::create(['name' => 'existing.role']);

        $response = $this->actingAs($user)->post(route('roles.store'), [
            'name' => 'existing.role',
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_user_without_permission_cannot_access_edit_page()
    {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'test.edit']);

        $response = $this->actingAs($user)->get(route('roles.edit', $role));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_access_edit_page()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.edit');
        $role = Role::create(['name' => 'test.edit']);

        $response = $this->actingAs($user)->get(route('roles.edit', $role));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('roles/edit')
            ->has('role')
            ->has('permissions')
        );
    }

    public function test_user_can_update_role_and_sync_permissions()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.edit');
        $role = Role::create(['name' => 'test.edit']);
        $permission1 = Permission::create(['name' => 'perm1']);
        $permission2 = Permission::create(['name' => 'perm2']);
        
        $role->givePermissionTo($permission1);

        $response = $this->actingAs($user)->put(route('roles.update', $role), [
            'name' => 'updated.role',
            'permissions' => [$permission2->name],
        ]);

        $response->assertRedirect(route('roles.index'));
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'updated.role',
        ]);

        $role->refresh();
        $this->assertFalse($role->hasPermissionTo('perm1'));
        $this->assertTrue($role->hasPermissionTo('perm2'));
    }

    public function test_user_without_permission_cannot_delete_role()
    {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'test.delete']);

        $response = $this->actingAs($user)->delete(route('roles.destroy', $role));

        $response->assertStatus(403);
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
        ]);
    }

    public function test_user_with_permission_can_delete_role()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.delete');
        $role = Role::create(['name' => 'test.delete']);

        $response = $this->actingAs($user)->delete(route('roles.destroy', $role));

        $response->assertRedirect(route('roles.index'));
        $this->assertDatabaseMissing('roles', [
            'id' => $role->id,
        ]);
    }

    public function test_user_cannot_delete_admin_role()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.delete');
        $role = Role::create(['name' => 'admin']);

        $response = $this->actingAs($user)->delete(route('roles.destroy', $role));

        $response->assertRedirect(route('roles.index'));
        $response->assertSessionHas('error', 'Cannot delete admin role.');
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
        ]);
    }

    public function test_user_cannot_delete_superadmin_role()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('roles.delete');
        $role = Role::create(['name' => 'SuperAdmin']);

        $response = $this->actingAs($user)->delete(route('roles.destroy', $role));

        $response->assertRedirect(route('roles.index'));
        $response->assertSessionHas('error', 'Cannot delete admin role.');
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
        ]);
    }
}
