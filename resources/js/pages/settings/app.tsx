import { Head, useForm, usePage } from "@inertiajs/react";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, FormEventHandler, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, Link } from "lucide-react";

type GeneralSettings = {
    app_title: string;
    company_name: string;
    company_year: string;
    app_description: string;
    allow_registration: boolean;
    favicon: string | null;
    app_logo: string | null;
    seo_keywords: string;
    seo_author: string;
    seo_canonical: string;
    seo_og_image: string | null;
};

type PageProps = {
    settings: GeneralSettings;
};

export default function AppSettings() {
    const { settings } = usePage<PageProps>().props;
    const [previewLogo, setPreviewLogo] = useState<string | null>(
        settings.app_logo ? `/storage/${settings.app_logo}` : null,
    );
    const [previewFavicon, setPreviewFavicon] = useState<string | null>(
        settings.favicon ? `/storage/${settings.favicon}` : null,
    );

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            app_title: settings.app_title || "",
            company_name: settings.company_name || "",
            company_year: settings.company_year || "",
            app_description: settings.app_description || "",
            allow_registration: settings.allow_registration || false,
            favicon: null as File | null,
            app_logo: null as File | null,
            seo_keywords: settings.seo_keywords || "",
            seo_author: settings.seo_author || "",
            seo_canonical: settings.seo_canonical || "",
            seo_og_image: null as File | null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Use post because we are sending files. Inertia handles multipart form data automatically when files are present.
        post("/settings/app", {
            preserveScroll: true,
            forceFormData: true,
            // onSuccess: () => {
            //     toast.success('Application settings updated successfully.');
            // },
        });
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("app_logo", file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleFaviconChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("favicon", file);
            setPreviewFavicon(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <Head title="App Settings" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            App Settings
                        </h2>
                        <p className="text-muted-foreground">
                            Update your application settings, branding, and SEO
                            information
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">
                                    Basic Information
                                </h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="app_title">App Title</Label>
                                    <Input
                                        id="app_title"
                                        name="app_title"
                                        value={data.app_title}
                                        onChange={(e) =>
                                            setData("app_title", e.target.value)
                                        }
                                        required
                                        placeholder="Enter app title"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.app_title}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="company_name">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="company_name"
                                        name="company_name"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                "company_name",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="Enter company name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.company_name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="company_year">
                                        Company Year
                                    </Label>
                                    <Input
                                        id="company_year"
                                        name="company_year"
                                        value={data.company_year}
                                        onChange={(e) =>
                                            setData(
                                                "company_year",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="e.g. 2024"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.company_year}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="app_description">
                                        App Description
                                    </Label>
                                    <Textarea
                                        id="app_description"
                                        name="app_description"
                                        value={data.app_description}
                                        onChange={(e) =>
                                            setData(
                                                "app_description",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="Enter app description"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.app_description}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="allow_registration"
                                        checked={data.allow_registration}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "allow_registration",
                                                checked === true,
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="allow_registration"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Allow new user registration
                                    </Label>
                                    <InputError
                                        className="mt-2"
                                        message={errors.allow_registration}
                                    />
                                </div>
                            </div>

                            {/* SEO and Branding */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">
                                    SEO & Branding
                                </h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="seo_keywords">
                                        SEO Keywords
                                    </Label>
                                    <Input
                                        id="seo_keywords"
                                        name="seo_keywords"
                                        value={data.seo_keywords}
                                        onChange={(e) =>
                                            setData(
                                                "seo_keywords",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="keyword1, keyword2"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.seo_keywords}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="seo_author">
                                        SEO Author
                                    </Label>
                                    <Input
                                        id="seo_author"
                                        name="seo_author"
                                        value={data.seo_author}
                                        onChange={(e) =>
                                            setData(
                                                "seo_author",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="Author name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.seo_author}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="seo_canonical">
                                        SEO Canonical URL
                                    </Label>
                                    <Input
                                        id="seo_canonical"
                                        type="url"
                                        name="seo_canonical"
                                        value={data.seo_canonical}
                                        onChange={(e) =>
                                            setData(
                                                "seo_canonical",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="https://example.com"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.seo_canonical}
                                    />
                                </div>

                                <div className="grid gap-2 pt-2">
                                    <Label htmlFor="app_logo">App Logo</Label>
                                    <Input
                                        id="app_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                    {previewLogo && (
                                        <div className="mt-2">
                                            <img
                                                src={previewLogo}
                                                alt="Logo preview"
                                                className="h-16 w-auto object-contain bg-neutral-100 rounded p-1 dark:bg-neutral-800"
                                            />
                                        </div>
                                    )}
                                    <InputError
                                        className="mt-2"
                                        message={errors.app_logo}
                                    />
                                </div>

                                <div className="grid gap-2 pt-2">
                                    <Label htmlFor="favicon">Favicon</Label>
                                    <Input
                                        id="favicon"
                                        type="file"
                                        accept=".ico,.png"
                                        onChange={handleFaviconChange}
                                    />
                                    {previewFavicon && (
                                        <div className="mt-2">
                                            <img
                                                src={previewFavicon}
                                                alt="Favicon preview"
                                                className="h-8 w-8 object-contain bg-neutral-100 rounded p-1 dark:bg-neutral-800"
                                            />
                                        </div>
                                    )}
                                    <InputError
                                        className="mt-2"
                                        message={errors.favicon}
                                    />
                                </div>

                                <div className="grid gap-2 pt-2">
                                    <Label htmlFor="seo_og_image">
                                        SEO OG Image
                                    </Label>
                                    <Input
                                        id="seo_og_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData("seo_og_image", file);
                                            }
                                        }}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.seo_og_image}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                            <Button disabled={processing} type="submit">
                                Save Settings
                            </Button>
                            {recentlySuccessful && (
                                <span className="text-sm text-green-600 dark:text-green-400">
                                    Saved successfully.
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

AppSettings.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: "App Settings",
                href: "/settings/app",
            },
        ]}
    >
        {page}
    </AppLayout>
);
