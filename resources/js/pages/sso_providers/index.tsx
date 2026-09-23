import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Trash2, Plus, ArrowUpDown, ChevronDown, ChevronUp, Search, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

interface SsoProvider {
    id: number;
    code: string;
    name: string;
    icon: string | null;
    is_active: boolean;
    can_register: boolean;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: SsoProvider[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Filters {
    search?: string;
    sort_field?: string;
    sort_direction?: 'asc' | 'desc';
    per_page?: string | number;
}

interface Props {
    ssoProviders: PaginatedData;
    filters: Filters;
}

export default function SsoProvidersIndex({ ssoProviders, filters }: Props) {
    const { auth } = usePage<any>().props;
    const userPermissions = auth.user.permissions || [];
    const [search, setSearch] = useState(filters.search || '');
    const [providerToDelete, setProviderToDelete] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/sso-providers', { search, sort_field: filters.sort_field, sort_direction: filters.sort_direction, per_page: filters.per_page }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search, filters.sort_field, filters.sort_direction, filters.per_page, filters.search]);

    const handleSort = (field: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (filters.sort_field === field && filters.sort_direction === 'asc') {
            direction = 'desc';
        }
        router.get('/sso-providers', { search: filters.search, sort_field: field, sort_direction: direction, per_page: filters.per_page }, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (value: string) => {
        router.get('/sso-providers', { search: filters.search, sort_field: filters.sort_field, sort_direction: filters.sort_direction, per_page: value }, { preserveState: true, preserveScroll: true });
    };

    const confirmDelete = () => {
        if (providerToDelete !== null) {
            router.delete(`/sso-providers/${providerToDelete}`, {
                preserveScroll: true,
                onSuccess: () => setProviderToDelete(null)
            });
        }
    };

    const renderSortIcon = (field: string) => {
        if (filters.sort_field !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
        if (filters.sort_direction === 'asc') return <ChevronUp className="ml-2 h-4 w-4" />;
        return <ChevronDown className="ml-2 h-4 w-4" />;
    };

    return (
        <>
            <Head title="SSO Providers" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">SSO Providers</h2>
                        <p className="text-muted-foreground">
                            Manage Single Sign-On providers.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {userPermissions.includes('sso-providers.create') && (
                            <Button asChild>
                                <Link href="/sso-providers/create">
                                    <Plus className="mr-2 h-4 w-4" /> Add Provider
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show</span>
                        <Select defaultValue={String(filters.per_page || '5')} onValueChange={handlePerPageChange}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="5" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">entries</span>
                    </div>

                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search providers..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border border-border bg-card">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b [&_tr]:border-border">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        No
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            onClick={() => handleSort('code')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Code
                                            {renderSortIcon('code')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Name
                                            {renderSortIcon('name')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Icon
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            onClick={() => handleSort('is_active')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Active
                                            {renderSortIcon('is_active')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            onClick={() => handleSort('can_register')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Registration
                                            {renderSortIcon('can_register')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <button
                                            onClick={() => handleSort('created_at')}
                                            className="flex items-center hover:text-foreground"
                                        >
                                            Created At
                                            {renderSortIcon('created_at')}
                                        </button>
                                    </th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {ssoProviders.data.map((provider, index) => (
                                    <tr key={provider.id} className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            {ssoProviders.from + index}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {provider.code}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {provider.name}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {provider.icon ? (
                                                 <div className="flex items-center justify-center w-8 h-8 rounded bg-muted/50 text-muted-foreground">
                                                    <i className={provider.icon}></i>
                                                 </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {provider.is_active ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {provider.can_register ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(provider.created_at).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex justify-end">
                                                {(userPermissions.includes('sso-providers.edit') || userPermissions.includes('sso-providers.delete')) && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {userPermissions.includes('sso-providers.edit') && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/sso-providers/${provider.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {userPermissions.includes('sso-providers.delete') && (
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive cursor-pointer"
                                                                    onClick={() => setProviderToDelete(provider.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {ssoProviders.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="h-24 text-center text-muted-foreground">
                                            No SSO Providers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {ssoProviders.total > 0 && (
                        <div className="border-t border-border p-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{ssoProviders.from}</span> to <span className="font-medium">{ssoProviders.to}</span> of{' '}
                                <span className="font-medium">{ssoProviders.total}</span> results
                            </div>
                            <div className="flex items-center gap-1">
                                {ssoProviders.links.map((link, i) => {
                                    let label = link.label;
                                    if (label.includes('Previous')) label = '«';
                                    if (label.includes('Next')) label = '»';

                                    return (
                                        <Button
                                            key={i}
                                            variant={link.active ? "default" : "outline"}
                                            size="icon"
                                            className="w-8 h-8"
                                            asChild={!!link.url}
                                            disabled={!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url} dangerouslySetInnerHTML={{ __html: label }} preserveScroll preserveState />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={providerToDelete !== null} onOpenChange={(open) => !open && setProviderToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the SSO provider.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setProviderToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SsoProvidersIndex.layout = {
    breadcrumbs: [
        {
            title: 'SSO Providers',
            href: '/sso-providers',
        },
    ],
};
