import React from 'react';

export const CardBack = () => (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center border-[6px] border-double border-yellow-600/20 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                    fill="url(#moon-gradient)"
                    stroke="#eab308"
                    strokeWidth="0.5"
                />
                <defs>
                    <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <div className="absolute top-2 left-2 text-yellow-600/30 text-[10px]">✦</div>
        <div className="absolute top-2 right-2 text-yellow-600/30 text-[10px]">✦</div>
        <div className="absolute bottom-2 left-2 text-yellow-600/30 text-[10px]">✦</div>
        <div className="absolute bottom-2 right-2 text-yellow-600/30 text-[10px]">✦</div>
    </div>
);
