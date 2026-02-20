import React, { useEffect, useRef, useId } from 'react';

export const GoogleAdSlot = ({ className = "" }) => {
    const adRef = useRef(null);
    const isInitialized = useRef(false);
    const uniqueId = useId();

    useEffect(() => {
        // Only initialize once per component instance
        if (isInitialized.current) {
            return;
        }

        const timer = setTimeout(() => {
            try {
                if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
                    // Check if this specific ins element already has an ad
                    const insElement = adRef.current.querySelector('ins.adsbygoogle');
                    if (insElement && !insElement.getAttribute('data-ad-status')) {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        isInitialized.current = true;
                    }
                }
            } catch (e) {
                // Silently ignore "already has ads" error in development
                if (!e.message?.includes('already have ads')) {
                    console.error("Adsbygoogle error:", e);
                }
            }
        }, 100); // Small delay to ensure DOM is ready

        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={adRef} className={`w-full max-w-4xl mx-auto my-8 overflow-hidden ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-client="ca-pub-6454901300191005"
                data-ad-slot="9470221240"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
};
