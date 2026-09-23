import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft } from 'lucide-react';

export default function SsoProviderCreate() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        icon: '',
        is_active: false,
        can_register: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sso-providers');
    };

    return (
        <>
            <Head title="Create SSO Provider" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create SSO Provider</h2>
                        <p className="text-muted-foreground">Add a new single sign-on provider to the system.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/sso-providers">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 overflow-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <Label htmlFor="code">Provider Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="e.g. google"
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Provider Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Google, GitHub"
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon Class (optional)</Label>
                            <Input
                                id="icon"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                placeholder="e.g. fab fa-google"
                            />
                            {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="is_active" 
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        {errors.is_active && <p className="text-sm text-destructive">{errors.is_active}</p>}

                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="can_register" 
                                checked={data.can_register}
                                onCheckedChange={(checked) => setData('can_register', checked as boolean)}
                            />
                            <Label htmlFor="can_register">Allow Registration</Label>
                        </div>
                        {errors.can_register && <p className="text-sm text-destructive">{errors.can_register}</p>}

                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Save Provider
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

SsoProviderCreate.layout = {
    breadcrumbs: [
        { title: 'SSO Providers', href: '/sso-providers' },
        { title: 'Create', href: '/sso-providers/create' },
    ],
};
