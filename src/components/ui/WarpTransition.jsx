import React, { useEffect, useState } from 'react';

export const WarpTransition = ({ isActive, onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (isActive) {
            setPhase(1);

            // Phase 2: Warp effect
            const timer1 = setTimeout(() => setPhase(2), 300);

            // Phase 3: Flash
            const timer2 = setTimeout(() => setPhase(3), 1500);

            // Complete
            const timer3 = setTimeout(() => {
                setPhase(0);
                onComplete?.();
            }, 2000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [isActive, onComplete]);

    if (!isActive && phase === 0) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden pointer-events-auto">
            {/* Background */}
            <div
                className={`absolute inset-0 transition-all duration-500 ${phase >= 1 ? 'bg-black' : 'bg-transparent'
                    }`}
            />

            {/* Stars Container */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                {/* Warp Tunnel Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Concentric circles */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full border border-purple-500/30"
                            style={{
                                width: `${(i + 1) * 20}%`,
                                height: `${(i + 1) * 20}%`,
                                animation: phase >= 2 ? `warpRing 0.8s ease-out ${i * 0.1}s forwards` : 'none',
                                opacity: 0
                            }}
                        />
                    ))}
                </div>

                {/* Flying Stars */}
                {[...Array(60)].map((_, i) => {
                    const angle = (i * 6) * (Math.PI / 180);
                    const delay = Math.random() * 0.5;
                    const duration = 0.5 + Math.random() * 0.5;

                    return (
                        <div
                            key={i}
                            className="absolute w-1 h-8 bg-gradient-to-t from-purple-500 via-white to-transparent rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `rotate(${i * 6}deg)`,
                                transformOrigin: 'center center',
                                animation: phase >= 2
                                    ? `warpStar ${duration}s ease-out ${delay}s forwards`
                                    : 'none',
                                opacity: 0
                            }}
                        />
                    );
                })}

                {/* Central Glow */}
                <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${phase >= 2 ? 'w-32 h-32 opacity-100' : 'w-0 h-0 opacity-0'
                        }`}
                    style={{
                        background: 'radial-gradient(circle, rgba(147,51,234,0.8) 0%, rgba(79,70,229,0.4) 50%, transparent 70%)',
                        boxShadow: '0 0 100px 50px rgba(147,51,234,0.5)'
                    }}
                />

                {/* Particle Burst */}
                {phase >= 2 && [...Array(30)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white"
                        style={{
                            animation: `warpParticle 1s ease-out ${i * 0.03}s forwards`,
                            '--angle': `${i * 12}deg`,
                            opacity: 0
                        }}
                    />
                ))}
            </div>

            {/* Flash Effect */}
            <div
                className={`absolute inset-0 bg-white transition-opacity duration-200 ${phase === 3 ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Portal Text */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${phase === 2 ? 'opacity-100' : 'opacity-0'
                }`}>
                <div className="text-center">
                    <p className="text-purple-300 text-lg font-serif animate-pulse tracking-widest">
                        กำลังเข้าสู่มิติแห่งไพ่ทาโรต์...
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes warpRing {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 0;
                        transform: scale(3);
                    }
                }

                @keyframes warpStar {
                    0% {
                        opacity: 0;
                        transform: rotate(var(--angle, 0deg)) translateY(0);
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: rotate(var(--angle, 0deg)) translateY(-100vh);
                    }
                }

                @keyframes warpParticle {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-50vh);
                    }
                }
            `}</style>
        </div>
    );
};
