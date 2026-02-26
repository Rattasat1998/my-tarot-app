import React, { useEffect, useState, useRef } from 'react';
import { CardBack } from './CardBack';

export const Screensaver = () => {
    const [isActive, setIsActive] = useState(false);
    const timeoutRef = useRef(null);
    const [floatingCards, setFloatingCards] = useState([]);

    // Initialize floating cards positions
    useEffect(() => {
        const cards = Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            x: Math.random() * 80 + 10, // 10% to 90%
            y: Math.random() * 80 + 10,
            rotation: Math.random() * 360,
            scale: 0.6 + Math.random() * 0.4, // 0.6 to 1.0
            speedX: (Math.random() - 0.5) * 0.2, // Drifting speed
            speedY: (Math.random() - 0.5) * 0.2,
            rotationSpeed: (Math.random() - 0.5) * 20,
            delay: i * 2,
        }));
        setFloatingCards(cards);
    }, []);

    const resetTimer = () => {
        setIsActive(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsActive(true);
        }, 20000); // 20 seconds
    };

    useEffect(() => {
        // Initial timer
        resetTimer();

        // Listeners for user activity
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

        const handleActivity = () => {
            // Only reset if currently active or just starting timer
            resetTimer();
        };

        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, []);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden bg-black animate-in fade-in duration-1000">
            {/* Mystic Background */}
            <div
                className="absolute inset-0 opacity-80"
                style={{
                    backgroundImage: 'url(/backgrounds/screensaver_bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Subtle Pulse Overlay */}
                <div className="absolute inset-0 bg-black/30 animate-pulse" style={{ animationDuration: '8s' }}></div>
            </div>

            {/* Drifting Particles/Stars */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={`star-${i}`}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-[twinkle_3s_ease-in-out_infinite]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        boxShadow: '0 0 5px rgba(255,255,255,0.8)'
                    }}
                />
            ))}

            {/* Floating Cards */}
            {floatingCards.map((card) => (
                <div
                    key={card.id}
                    className="absolute w-32 h-48 md:w-48 md:h-72 shadow-2xl transition-transform duration-[20s] ease-linear will-change-transform"
                    style={{
                        left: `${card.x}%`,
                        top: `${card.y}%`,
                        animation: `float-card-${card.id} 20s infinite alternate ease-in-out`,
                        transform: `rotate(${card.rotation}deg) scale(${card.scale})`,
                    }}
                >
                    <div className="w-full h-full relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-4 bg-purple-500/30 rounded-xl blur-xl animate-pulse"></div>
                        <div className="w-full h-full rounded-xl overflow-hidden ring-1 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                            <CardBack />
                        </div>
                    </div>

                    {/* Unique Float Animation for each card */}
                    <style>{`
                        @keyframes float-card-${card.id} {
                            0% {
                                transform: translate(0, 0) rotate(${card.rotation}deg) scale(${card.scale});
                            }
                            25% {
                                transform: translate(${card.speedX * 50}px, ${card.speedY * 50}px) rotate(${card.rotation + 5}deg) scale(${card.scale});
                            }
                            50% {
                                transform: translate(${card.speedX * 100}px, ${card.speedY * 100}px) rotate(${card.rotation}deg) scale(${card.scale});
                            }
                            75% {
                                transform: translate(${card.speedX * 50}px, ${card.speedY * 150}px) rotate(${card.rotation - 5}deg) scale(${card.scale});
                            }
                            100% {
                                transform: translate(0, 0) rotate(${card.rotation}deg) scale(${card.scale});
                            }
                        }
                        
                        @keyframes twinkle {
                            0%, 100% { opacity: 0; transform: scale(0.5); }
                            50% { opacity: 1; transform: scale(1.2); }
                        }
                    `}</style>
                </div>
            ))}

            {/* Wake up text */}
            <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-slate-900 dark:text-white/50 text-sm font-light tracking-[0.2em] animate-pulse">
                    ขยับเมาส์เพื่อดำเนินการต่อ
                </p>
            </div>
        </div>
    );
};
