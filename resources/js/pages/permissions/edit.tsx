import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permission: Permission;
}

export default function PermissionEdit({ permission }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/permissions/${permission.id}`);
    };

    return (
        <>
            <Head title="Edit Permission" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Permission: {permission.name}</h2>
                        <p className="text-muted-foreground">Modify the permission details.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/permissions">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 overflow-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <Label htmlFor="name">Permission Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. view users"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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

PermissionEdit.layout = {
    breadcrumbs: [
        { title: 'Permission Management', href: '/permissions' },
        { title: 'Edit Permission', href: '' },
    ],
};
