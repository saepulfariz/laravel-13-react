import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ShieldCheck, Key, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { type User } from '@/types/auth';

interface DashboardProps {
    stats: {
        users: number;
        roles: number;
        permissions: number;
        active_users: number;
    };
    recentUsers: User[];
}

export default function Dashboard({ stats, recentUsers = [] }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here's an overview of your application.</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.users || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.active_users || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.roles || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                            <Key className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.permissions || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="col-span-1 border-sidebar-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>Latest users who joined the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentUsers && recentUsers.length > 0 ? recentUsers.map(user => (
                                    <div key={user.id} className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image ? `/storage/${user.image}` : user.avatar} />
                                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div>
                                            {user.roles && user.roles.length > 0 ? (
                                                <Badge variant="outline" className="font-normal text-xs">{user.roles[0].name}</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="font-normal text-xs">No Role</Badge>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No recent users.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="col-span-1 border-sidebar-border/70 shadow-sm flex flex-col items-center justify-center p-6 text-center min-h-[300px] bg-muted/30">
                         <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                         <h3 className="text-lg font-medium">Access Control Active</h3>
                         <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            This application uses Role-Based Access Control (RBAC). 
                            Manage users, roles, and permissions from the sidebar menu.
                         </p>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
