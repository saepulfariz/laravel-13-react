import { createInertiaApp } from "@inertiajs/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeTheme } from "@/hooks/use-appearance";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import SettingsLayout from "@/layouts/settings/layout";

let appName = import.meta.env.VITE_APP_NAME || "Laravel";
try {
    const el = document.getElementById("app");
    if (el && el.dataset.page) {
        const page = JSON.parse(el.dataset.page);
        if (page.props && page.props.name) {
            appName = page.props.name;
        }
    }
} catch (e) {
    // Ignore and fallback to default
}

void createInertiaApp({
    title: (title) => {
        let currentAppName = appName;
        // Try to read dynamically from Inertia props first
        try {
            const pageProps = document.getElementById("app")?.dataset.page
                ? JSON.parse(document.getElementById("app")!.dataset.page!)
                      .props
                : null;
            if (pageProps?.settings?.app_title) {
                currentAppName = pageProps.settings.app_title;
            }
        } catch (e) {}

        return title ? `${title} - ${currentAppName}` : currentAppName;
    },
    layout: (name) => {
        switch (true) {
            case name === "welcome":
                return null;
            case name.startsWith("auth/"):
                return AuthLayout;
            case name.startsWith("settings/"):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});

// This will set light / dark mode on load...
initializeTheme();
