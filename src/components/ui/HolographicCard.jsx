import React, { useRef, useState } from 'react';

export const HolographicCard = ({ children, className = '' }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');
    const [sheen, setSheen] = useState('50% 50%');
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt Effect
        const rotateX = ((y - centerY) / centerY) * 15; // Max 15 deg
        const rotateY = ((x - centerX) / centerX) * -15;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);

        // Sheen Position
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        setSheen(`${percentX}% ${percentY}%`);
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
        setOpacity(0);
    };

    return (
        <div
            ref={cardRef}
            className={`relative transition-transform duration-300 ease-out preserve-3d will-change-transform cursor-pointer ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transformStyle: 'preserve-3d'
            }}
        >
            {children}

            {/* Holographic Sheen Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-300 rounded-xl"
                style={{
                    background: `radial-gradient(circle at ${sheen}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
                    opacity: opacity
                }}
            />

            {/* Rainbow Holo Gradient (Subtle) */}
            <div
                className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-purple-500/20 to-transparent rounded-xl"
                style={{ opacity: opacity * 0.5 }}
            />
        </div>
    );
};
