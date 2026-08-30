import { Head, useForm, Link } from '@inertiajs/react';
import { type User, type Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent } from 'react';

interface Props {
    user: User;
    roles: Role[];
}

export default function EditUser({ user, roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: user.name,
        username: user.username || '',
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles?.map(r => r.name) || [],
        is_active: !!user.is_active,
        image: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/users/${user.id}`);
    };

    return (
        <>
            <Head title="Edit User" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit User</h2>
                    <p className="text-muted-foreground">Update user information.</p>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card text-card-foreground relative max-w-2xl overflow-hidden rounded-xl border p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username (Optional)</Label>
                            <Input
                                id="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Active User
                            </Label>
                        </div>
                        {errors.is_active && <p className="text-sm text-destructive">{errors.is_active}</p>}

                        <div className="space-y-2">
                            <Label htmlFor="image">Profile Image (Optional)</Label>
                            {user.image && (
                                <div className="mb-2">
                                    <img src={`/storage/${user.image}`} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                                </div>
                            )}
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                            />
                            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                            <p className="text-xs text-muted-foreground">Upload a new image to replace the existing one.</p>
                        </div>

                        <div className="space-y-4">
                            <Label>Assign Roles</Label>
                            {roles.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No roles available yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border rounded-md p-4">
                                    {roles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={data.roles.includes(role.name)}
                                                onCheckedChange={() => {
                                                    const hasRole = data.roles.includes(role.name);
                                                    if (hasRole) {
                                                        setData('roles', data.roles.filter(r => r !== role.name));
                                                    } else {
                                                        setData('roles', [...data.roles, role.name]);
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`role-${role.id}`} className="font-normal cursor-pointer">
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.roles && <p className="text-sm text-destructive">{errors.roles}</p>}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Change Password (Optional)</h3>
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save Changes
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/users">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

EditUser.layout = {
    breadcrumbs: [
        { title: 'User Management', href: '/users' },
        { title: 'Edit User', href: '#' },
    ],
};
