import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft } from 'lucide-react';

export default function PermissionCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/permissions');
    };

    return (
        <>
            <Head title="Create Permission" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create Permission</h2>
                        <p className="text-muted-foreground">Add a new permission to the system.</p>
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
                            <Save className="mr-2 h-4 w-4" /> Save Permission
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

PermissionCreate.layout = {
    breadcrumbs: [
        { title: 'Permission Management', href: '/permissions' },
        { title: 'Create Permission', href: '/permissions/create' },
    ],
};
