<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create permissions needed for the tests
        Permission::create(['name' => 'users.view']);
        Permission::create(['name' => 'users.create']);
        Permission::create(['name' => 'users.edit']);
        Permission::create(['name' => 'users.delete']);
    }

    public function test_user_without_permission_cannot_view_users()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('users.index'));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_view_users()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.view');

        User::factory()->create(['name' => 'test user']);

        $response = $this->actingAs($user)->get(route('users.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users')
            ->has('filters')
        );
    }

    public function test_user_without_permission_cannot_access_create_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('users.create'));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_access_create_page()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.create');

        $response = $this->actingAs($user)->get(route('users.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('users/create')
            ->has('roles')
        );
    }

    public function test_user_can_store_new_user()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.create');
        $role = Role::create(['name' => 'test_role']);

        $response = $this->actingAs($user)->post(route('users.store'), [
            'name' => 'New User',
            'username' => 'newuser',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'is_active' => 1,
            'roles' => [$role->name],
        ]);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'username' => 'newuser',
            'name' => 'New User',
        ]);
        
        $newUser = User::where('email', 'newuser@example.com')->first();
        $this->assertTrue($newUser->hasRole('test_role'));
    }

    public function test_user_can_store_new_user_with_image()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $user->givePermissionTo('users.create');

        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->actingAs($user)->post(route('users.store'), [
            'name' => 'New User Image',
            'username' => 'newuserimage',
            'email' => 'image@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'is_active' => 1,
            'image' => $file,
        ]);

        $response->assertRedirect(route('users.index'));
        $newUser = User::where('email', 'image@example.com')->first();
        $this->assertNotNull($newUser->image);
        Storage::disk('public')->assertExists($newUser->image);
    }

    public function test_user_without_permission_cannot_access_edit_page()
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $response = $this->actingAs($user)->get(route('users.edit', $targetUser));

        $response->assertStatus(403);
    }

    public function test_user_with_permission_can_access_edit_page()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.edit');
        $targetUser = User::factory()->create();

        $response = $this->actingAs($user)->get(route('users.edit', $targetUser));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('users/edit')
            ->has('user')
            ->has('roles')
        );
    }

    public function test_user_can_update_user_details()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.edit');
        $targetUser = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);
        
        $role = Role::create(['name' => 'test_role']);

        $response = $this->actingAs($user)->put(route('users.update', $targetUser), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'is_active' => 0,
            'roles' => [$role->name],
        ]);

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'is_active' => 0,
        ]);
        
        $targetUser->refresh();
        $this->assertTrue($targetUser->hasRole('test_role'));
    }

    public function test_user_can_update_user_password()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('users.edit');
        $targetUser = User::factory()->create([
            'password' => Hash::make('oldpassword'),
        ]);

        $response = $this->actingAs($user)->put(route('users.update', $targetUser), [
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect(route('users.index'));
        $targetUser->refresh();
        $this->assertTrue(Hash::check('newpassword123', $targetUser->password));
    }

    public function test_user_can_update_user_image_and_old_image_deleted()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $user->givePermissionTo('users.edit');
        
        $oldImage = UploadedFile::fake()->image('old.jpg')->store('users', 'public');
        
        $targetUser = User::factory()->create([
            'image' => $oldImage,
        ]);

        Storage::disk('public')->assertExists($oldImage);

        $newImage = UploadedFile::fake()->image('new.jpg');

        $response = $this->actingAs($user)->put(route('users.update', $targetUser), [
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'image' => $newImage,
        ]);

        $response->assertRedirect(route('users.index'));
        
        $targetUser->refresh();
        $this->assertNotEquals($oldImage, $targetUser->image);
        Storage::disk('public')->assertExists($targetUser->image);
        Storage::disk('public')->assertMissing($oldImage);
    }

    public function test_user_without_permission_cannot_delete_user()
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $response = $this->actingAs($user)->delete(route('users.destroy', $targetUser));

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
        ]);
    }

    public function test_user_with_permission_can_delete_user_and_image()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $user->givePermissionTo('users.delete');
        
        $image = UploadedFile::fake()->image('avatar.jpg')->store('users', 'public');
        $targetUser = User::factory()->create([
            'image' => $image,
        ]);

        Storage::disk('public')->assertExists($image);

        $response = $this->actingAs($user)->delete(route('users.destroy', $targetUser));

        $response->assertRedirect(route('users.index'));
        $this->assertDatabaseMissing('users', [
            'id' => $targetUser->id,
        ]);
        Storage::disk('public')->assertMissing($image);
    }
}
