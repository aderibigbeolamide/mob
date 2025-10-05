"use client"

import { useEffect } from "react"

export default function BootstrapJs(){
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        const initializeBootstrap = async () => {
            if (typeof window === 'undefined') return;
            
            try {
                // Import Bootstrap
                const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
                (window as any).bootstrap = bootstrap;
                
                // Function to initialize dropdowns
                const initDropdowns = () => {
                    const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
                    dropdownElements.forEach((element) => {
                        if (!(element as any)._bsDropdown) {
                            new bootstrap.Dropdown(element);
                            (element as any)._bsDropdown = true;
                        }
                    });
                };
                
                // Initialize existing dropdowns
                initDropdowns();
                
                // Re-initialize dropdowns periodically for dynamically loaded content
                intervalId = setInterval(initDropdowns, 500);
                
            } catch (err) {
                console.error('Failed to load Bootstrap:', err);
            }
        };
        
        initializeBootstrap();
        
        // Cleanup
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);
    
    return null
}