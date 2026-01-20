import React, { useEffect } from 'react';

export const GoogleAdSlot = ({ className = "" }) => {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("Adsbygoogle error:", e);
        }
    }, [className]); // Re-run if className changes, but usually once is enough

    return (
        <div className={`w-full max-w-4xl mx-auto my-8 p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/40 flex items-center justify-center min-h-[100px] overflow-hidden ${className}`}>
            <div className="text-center w-full">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-sans">Advertisement</p>
                <ins className="adsbygoogle"
                    style={{ display: 'block', textAlign: 'center' }}
                    data-ad-client="ca-pub-6454901300191005"
                    data-ad-slot="tarot_auto_slot"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
        </div>
    );
};
