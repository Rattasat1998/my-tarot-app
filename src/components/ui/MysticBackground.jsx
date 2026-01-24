import React from 'react';

export const MysticBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
            {/* Layer 1: Outer Ring (Slow Rotation) - Increased Opacity */}
            <div className="absolute w-[800px] h-[800px] sm:w-[1000px] sm:h-[1000px] opacity-20 animate-spin-slow mix-blend-screen">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current text-purple-500/30">
                    <circle cx="50" cy="50" r="49" strokeWidth="0.5" strokeDasharray="4 4" />
                    <circle cx="50" cy="50" r="40" strokeWidth="0.2" />
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" strokeWidth="0.2" opacity="0.8" />
                </svg>
            </div>

            {/* Layer 2: Middle Ring (Reverse Rotation) - Increased Opacity */}
            <div className="absolute w-[600px] h-[600px] sm:w-[700px] sm:h-[700px] opacity-20 animate-spin-reverse-slower mix-blend-screen">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current text-yellow-500/30">
                    <circle cx="50" cy="50" r="48" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="45" strokeWidth="0.1" strokeDasharray="2 1" />
                    {/* Hexagon */}
                    <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" strokeWidth="0.3" />
                </svg>
            </div>

            {/* Layer 3: Inner Runes (Pulse & Rotate) - Increased Opacity */}
            <div className="absolute w-[400px] h-[400px] opacity-30 animate-spin-slower mix-blend-screen">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current text-cyan-400/40">
                    <circle cx="50" cy="50" r="45" strokeWidth="0.8" />
                    <path d="M50 10 L60 35 L40 35 Z" opacity="0.8" />
                    <path d="M50 90 L60 65 L40 65 Z" opacity="0.8" />
                    <path d="M10 50 L35 40 L35 60 Z" opacity="0.8" />
                    <path d="M90 50 L65 40 L65 60 Z" opacity="0.8" />
                </svg>
            </div>

            {/* Vignette - Adjusted to not hide the bottom layers completely */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/90 pointer-events-none"></div>
        </div>
    );
};
