<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create permissions needed for the tests
        Permission::create(['name' => 'permissions.view']);
        Permission::create(['name' => 'permissions.create']);
        Permission::create(['name' => 'permissions.edit']);
        Permission::create(['name' => 'permissions.delete']);
    }

    public function test_user_without_permission_cannot_view_permissions()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('permissions.index'));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_view_permissions()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.view');

        Permission::create(['name' => 'test permission']);

        $response = $this->actingAs($user)->get(route('permissions.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('permissions/index')
            ->has('permissions')
        );
    }

    public function test_user_without_permission_cannot_access_create_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('permissions.create'));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_access_create_page()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.create');

        $response = $this->actingAs($user)->get(route('permissions.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('permissions/create')
        );
    }

    public function test_user_can_store_new_permission()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.create');

        $response = $this->actingAs($user)->post(route('permissions.store'), [
            'name' => 'new.permission',
        ]);

        $response->assertRedirect(route('permissions.index'));
        $this->assertDatabaseHas('permissions', [
            'name' => 'new.permission',
        ]);
    }

    public function test_user_cannot_store_duplicate_permission()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.create');

        Permission::create(['name' => 'existing.permission']);

        $response = $this->actingAs($user)->post(route('permissions.store'), [
            'name' => 'existing.permission',
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_user_without_permission_cannot_access_edit_page()
    {
        $user = User::factory()->create();
        $permission = Permission::create(['name' => 'test.edit']);

        $response = $this->actingAs($user)->get(route('permissions.edit', $permission));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_access_edit_page()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.edit');
        $permission = Permission::create(['name' => 'test.edit']);

        $response = $this->actingAs($user)->get(route('permissions.edit', $permission));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('permissions/edit')
            ->has('permission')
        );
    }

    public function test_user_can_update_permission()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.edit');
        $permission = Permission::create(['name' => 'test.edit']);

        $response = $this->actingAs($user)->put(route('permissions.update', $permission), [
            'name' => 'updated.permission',
        ]);

        $response->assertRedirect(route('permissions.index'));
        $this->assertDatabaseHas('permissions', [
            'id' => $permission->id,
            'name' => 'updated.permission',
        ]);
    }

    public function test_user_without_permission_cannot_delete_permission()
    {
        $user = User::factory()->create();
        $permission = Permission::create(['name' => 'test.delete']);

        $response = $this->actingAs($user)->delete(route('permissions.destroy', $permission));

        $response->assertStatus(403);
        $this->assertDatabaseHas('permissions', [
            'id' => $permission->id,
        ]);
    }

    public function test_user_with_permission_can_delete_permission()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('permissions.delete');
        $permission = Permission::create(['name' => 'test.delete']);

        $response = $this->actingAs($user)->delete(route('permissions.destroy', $permission));

        $response->assertRedirect(route('permissions.index'));
        $this->assertDatabaseMissing('permissions', [
            'id' => $permission->id,
        ]);
    }
}
