"use client"

import { useEffect } from "react"

export default function BootstrapJs(){
    useEffect(() => {
        // Only load Bootstrap on client-side and ensure it's loaded once
        if (typeof window !== 'undefined' && !window.bootstrap) {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
                .then((module) => {
                    // Bootstrap is now available globally as window.bootstrap
                    if (module.default) {
                        (window as any).bootstrap = module.default;
                    }
                })
                .catch(err => console.error('Failed to load Bootstrap:', err));
        }
    }, []);
    return null
}