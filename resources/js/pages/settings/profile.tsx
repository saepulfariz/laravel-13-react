import { Form, Head, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import ProfileController from "@/actions/App/Http/Controllers/Settings/ProfileController";
import DeleteUser from "@/components/delete-user";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { edit } from "@/routes/profile";
import type { Auth } from "@/types";
import { send } from "@/routes/verification";

type SsoProvider = {
    id: number;
    code: string;
    name: string;
    icon: string | null;
};

type PageProps = {
    auth: Auth;
    ssoProviders?: SsoProvider[];
    linkedSsoProviders?: number[];
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const {
        auth,
        ssoProviders = [],
        linkedSsoProviders = [],
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-muted-foreground -mt-4 text-sm">
                                            Your email address is unverified.{" "}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            "verification-link-sent" && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {ssoProviders.length > 0 && (
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Connected Accounts"
                        description="Manage your linked social and SSO accounts"
                    />

                    <div className="space-y-4">
                        {ssoProviders.map((provider) => {
                            const isLinked = linkedSsoProviders.includes(
                                provider.id,
                            );

                            return (
                                <div
                                    key={provider.id}
                                    className="flex items-center justify-between border border-border p-4 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        {provider.icon ? (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground text-lg">
                                                <i
                                                    className={provider.icon}
                                                ></i>
                                            </div>
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
                                                {provider.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {provider.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {isLinked
                                                    ? "Connected"
                                                    : "Not connected"}
                                            </p>
                                        </div>
                                    </div>

                                    {isLinked ? (
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/auth/${provider.code}/unlink`}
                                                method="delete"
                                                as="button"
                                                preserveScroll
                                            >
                                                Unlink
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="default" asChild>
                                            <a
                                                href={`/auth/${provider.code}/login`}
                                            >
                                                Link Account
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: "Profile settings",
            href: edit(),
        },
    ],
};
