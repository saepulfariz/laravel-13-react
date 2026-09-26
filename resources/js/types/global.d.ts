import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            settings: {
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
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
