import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    role: Role;
    permissions: Permission[];
}

export default function RoleEdit({ role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map(p => p.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    const togglePermission = (id: number) => {
        const hasPermission = data.permissions.includes(id);
        if (hasPermission) {
            setData('permissions', data.permissions.filter((p) => p !== id));
        } else {
            setData('permissions', [...data.permissions, id]);
        }
    };

    return (
        <>
            <Head title="Edit Role" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Role: {role.name}</h2>
                        <p className="text-muted-foreground">Modify the role details and permissions.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/roles">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 overflow-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Manager"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-4">
                            <Label>Assign Permissions</Label>
                            {permissions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No permissions available yet.</p>
                            ) : (
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(
                                        permissions.reduce((acc, permission) => {
                                            const [group] = permission.name.split('.');
                                            if (!acc[group]) acc[group] = [];
                                            acc[group].push(permission);
                                            return acc;
                                        }, {} as Record<string, Permission[]>)
                                    ).map(([group, groupPermissions]) => (
                                        <div key={group} className="bg-muted/40 border border-border rounded-xl p-4 shadow-sm">
                                            <h4 className="text-lg font-semibold capitalize text-foreground mb-4 border-b border-border pb-2">
                                                {group}
                                            </h4>
                                            <div className="space-y-3">
                                                {groupPermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`perm-${permission.id}`}
                                                            checked={data.permissions.includes(permission.id)}
                                                            onCheckedChange={() => togglePermission(permission.id)}
                                                        />
                                                        <Label htmlFor={`perm-${permission.id}`} className="font-normal cursor-pointer">
                                                            {permission.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.permissions && <p className="text-sm text-destructive">{errors.permissions}</p>}
                        </div>

                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

RoleEdit.layout = {
    breadcrumbs: [
        { title: 'Role Management', href: '/roles' },
        { title: 'Edit Role', href: '' },
    ],
};
