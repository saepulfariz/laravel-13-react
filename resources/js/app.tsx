import { createInertiaApp, router } from "@inertiajs/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeTheme } from "@/hooks/use-appearance";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import SettingsLayout from "@/layouts/settings/layout";

void createInertiaApp({
    title: (title) => {
        const currentAppName =
            (window as any).APP_NAME ||
            import.meta.env.VITE_APP_NAME ||
            "Laravel";
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
