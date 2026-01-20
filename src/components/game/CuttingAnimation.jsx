import React, { useEffect } from 'react';
import { CardBack } from '../ui/CardBack';

export const CuttingAnimation = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="flex items-center justify-center h-64 relative preserve-3d">
            <div
                className="absolute w-32 h-52 sm:w-40 sm:h-64 transition-all"
                style={{
                    animation: `cutBottom 2s ease-in-out forwards`,
                    zIndex: 10
                }}
            >
                <CardBack />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="absolute inset-0 bg-slate-900/20 rounded-2xl border border-yellow-500/10" style={{ transform: `translate(${(i + 1) * 1}px, ${(i + 1) * 1}px)`, zIndex: -1 }}></div>
                ))}
            </div>

            <div
                className="absolute w-32 h-52 sm:w-40 sm:h-64 transition-all"
                style={{
                    animation: `cutTop 2s ease-in-out forwards`,
                    top: -4, left: -4,
                    zIndex: 20
                }}
            >
                <CardBack />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="absolute inset-0 bg-slate-900/20 rounded-2xl border border-yellow-500/10" style={{ transform: `translate(${(i + 1) * 1}px, ${(i + 1) * 1}px)`, zIndex: -1 }}></div>
                ))}
            </div>
        </div>
    );
};
