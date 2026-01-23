import React from 'react';

export const FloatingCards = () => {
    // 5 floating card positions
    const cards = [
        { top: '10%', left: '5%', rotate: -15, delay: 0, size: 'w-20 h-32' },
        { top: '20%', right: '8%', rotate: 12, delay: 0.5, size: 'w-24 h-36' },
        { bottom: '25%', left: '10%', rotate: 8, delay: 1, size: 'w-16 h-24' },
        { bottom: '15%', right: '5%', rotate: -20, delay: 1.5, size: 'w-20 h-32' },
        { top: '50%', left: '3%', rotate: 25, delay: 2, size: 'w-14 h-20' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={`absolute ${card.size} transition-all duration-1000 opacity-20 hover:opacity-40`}
                    style={{
                        top: card.top,
                        left: card.left,
                        right: card.right,
                        bottom: card.bottom,
                        transform: `rotate(${card.rotate}deg)`,
                        animation: `float 6s ease-in-out infinite`,
                        animationDelay: `${card.delay}s`
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/40 to-indigo-800/40 rounded-lg border border-purple-500/30 backdrop-blur-sm shadow-xl flex items-center justify-center">
                        <div className="text-3xl">🎴</div>
                    </div>
                </div>
            ))}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(var(--rotate, 0deg)); }
                    50% { transform: translateY(-20px) rotate(var(--rotate, 0deg)); }
                }
            `}</style>
        </div>
    );
};
