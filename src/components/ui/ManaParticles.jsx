import React, { useMemo } from 'react';

export const ManaParticles = ({ count = 30 }) => {
    const particles = useMemo(() => Array.from({ length: count }), [count]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((_, i) => {
                const size = Math.random() * 3 + 1;
                const left = Math.random() * 100;
                const duration = Math.random() * 10 + 10; // 10-20s slow float
                const delay = Math.random() * -20;

                return (
                    <div
                        key={i}
                        className="absolute rounded-full bg-yellow-400/60 blur-[1px] shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${left}%`,
                            animation: `floatUp ${duration}s linear infinite`,
                            animationDelay: `${delay}s`
                        }}
                    />
                );
            })}
        </div>
    );
};
