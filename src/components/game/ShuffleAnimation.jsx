import React, { useEffect } from 'react';
import { CardBack } from '../ui/CardBack';

export const ShuffleAnimation = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500);

        return () => {
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <div className="flex items-center justify-center h-64 relative preserve-3d">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-32 h-52 sm:w-40 sm:h-64 transition-all duration-500 ease-in-out"
                    style={{
                        animation: `shuffleCard 2s infinite ease-in-out`,
                        animationDelay: `${i * 0.1}s`,
                        zIndex: i
                    }}
                >
                    <CardBack />
                </div>
            ))}
        </div>
    );
};
