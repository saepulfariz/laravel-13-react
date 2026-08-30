import { Head, useForm, Link } from '@inertiajs/react';
import { type Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent } from 'react';

interface Props {
    roles: Role[];
}

export default function CreateUser({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <>
            <Head title="Add User" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add User</h2>
                    <p className="text-muted-foreground">Create a new user account.</p>
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

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
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

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save
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

CreateUser.layout = {
    breadcrumbs: [
        { title: 'User Management', href: '/users' },
        { title: 'Add User', href: '/users/create' },
    ],
};
