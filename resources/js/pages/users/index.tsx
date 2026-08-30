import { Head, Link, router, usePage } from '@inertiajs/react';
import { type User } from '@/types/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Edit, Trash2, Plus, ArrowUpDown, ChevronDown, ChevronUp, Search, Download, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: User[];
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
    status?: string;
}

interface Props {
    users: PaginatedData;
    filters: Filters;
}

export default function UsersIndex({ users, filters }: Props) {
    const { auth } = usePage().props;
    const permissions = auth.user.permissions || [];
    const [search, setSearch] = useState(filters.search || '');
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/users', { search, sort_field: filters.sort_field, sort_direction: filters.sort_direction, per_page: filters.per_page, status: filters.status }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search, filters.sort_field, filters.sort_direction, filters.per_page, filters.status, filters.search]);

    const handleSort = (field: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (filters.sort_field === field && filters.sort_direction === 'asc') {
            direction = 'desc';
        }
        router.get('/users', { search: filters.search, sort_field: field, sort_direction: direction, per_page: filters.per_page, status: filters.status }, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (value: string) => {
        router.get('/users', { search: filters.search, sort_field: filters.sort_field, sort_direction: filters.sort_direction, per_page: value, status: filters.status }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (value: string) => {
        const statusValue = value === 'all' ? undefined : value;
        router.get('/users', { search: filters.search, sort_field: filters.sort_field, sort_direction: filters.sort_direction, per_page: filters.per_page, status: statusValue }, { preserveState: true, preserveScroll: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.sort_field) params.append('sort_field', filters.sort_field);
        if (filters.sort_direction) params.append('sort_direction', filters.sort_direction);
        if (filters.status) params.append('status', filters.status);

        window.location.href = `/users/export?${params.toString()}`;
    };

    const confirmDelete = () => {
        if (userToDelete !== null) {
            router.delete(`/users/${userToDelete}`, { 
                preserveScroll: true,
                onSuccess: () => setUserToDelete(null)
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
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                        <p className="text-muted-foreground">
                            Manage user data, roles, and access rights.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {permissions.includes('users.view') && (
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" /> Export Excel
                            </Button>
                        )}
                        {permissions.includes('users.create') && (
                            <Button asChild>
                                <Link href="/users/create">
                                    <Plus className="mr-2 h-4 w-4" /> Add User
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
                    
                    <div className="flex items-center gap-2">
                        <Select defaultValue={filters.status || 'all'} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card text-card-foreground relative flex flex-col overflow-hidden rounded-xl border shadow-sm">
                    <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-muted/50 sticky top-0 z-10">
                                <tr className="border-border transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort('name')}>
                                        <div className="flex items-center">
                                            User {renderSortIcon('name')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort('email')}>
                                        <div className="flex items-center">
                                            Email {renderSortIcon('email')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                        Roles
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                        Status
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted" onClick={() => handleSort('created_at')}>
                                        <div className="flex items-center">
                                            Joined {renderSortIcon('created_at')}
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-border hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                    >
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.image ? `/storage/${user.image}` : user.avatar} alt={user.name} />
                                                    <AvatarFallback>
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.name}</span>
                                                    {user.username && <span className="text-xs text-muted-foreground">@{user.username}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {user.email}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map(role => (
                                                        <Badge key={role.id} variant="outline" className="font-normal">{role.name}</Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground italic text-xs">None</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1 items-start">
                                                {user.is_active ? (
                                                    <Badge variant="default" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:text-emerald-400">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-destructive">Inactive</Badge>
                                                )}
                                                {user.email_verified_at ? (
                                                    <Badge variant="outline" className="text-xs font-normal">Verified</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">Pending</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex justify-end">
                                                {(permissions.includes('users.edit') || permissions.includes('users.delete')) && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {permissions.includes('users.edit') && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/users/${user.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {permissions.includes('users.delete') && (
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive cursor-pointer"
                                                                    onClick={() => setUserToDelete(user.id)}
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
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {users.total > 0 && (
                        <div className="border-t border-border p-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{users.from}</span> to <span className="font-medium">{users.to}</span> of{' '}
                                <span className="font-medium">{users.total}</span> results
                            </div>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, i) => {
                                    // Make "Previous" and "Next" rendering look better
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

            <Dialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user account
                            and remove their data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'User Management',
            href: '/users',
        },
    ],
};
