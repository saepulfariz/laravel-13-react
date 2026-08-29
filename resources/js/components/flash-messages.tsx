import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function FlashMessages() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                position: 'top-right',
                duration: 5000,
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                position: 'top-right',
                duration: 5000,
            });
        }
    }, [flash]);

    return null;
}
