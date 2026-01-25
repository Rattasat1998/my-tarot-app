import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import shuffleSoundUrl from '../assets/tarot-shuffle-89105.mp3';

const SoundContext = createContext();

export const useSound = () => {
    return useContext(SoundContext);
};

export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(() => {
        try {
            const saved = localStorage.getItem('tarot-sound-muted');
            return saved ? JSON.parse(saved) : false;
        } catch (e) {
            console.warn("Failed to parse sound mute state:", e);
            return false;
        }
    });

    // Volume control (0.0 to 1.0)
    const [volume, setVolume] = useState(0.5);

    // BGM Ref
    const bgmRef = useRef(new Audio());

    // SFX Refs (Preloading common sounds)
    const sfxRefs = useRef({
        shuffle: new Audio(shuffleSoundUrl), // Correctly imported
        flip: new Audio('https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3'), // Placeholder: Card Slide
        reveal: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'), // Placeholder: Magic Sparkle
        click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'), // Placeholder: Select
    });

    useEffect(() => {
        localStorage.setItem('tarot-sound-muted', JSON.stringify(isMuted));

        // Update BGM state
        if (bgmRef.current) {
            bgmRef.current.muted = isMuted;
            bgmRef.current.volume = isMuted ? 0 : volume * 0.6; // BGM slightly quieter
        }
    }, [isMuted, volume]);

    const playBGM = (src) => {
        if (!bgmRef.current) return;

        // Use a mystical ambient track
        const bgmUrl = src || 'https://assets.mixkit.co/music/preview/mixkit-ethereal-fairy-win-628.mp3'; // Placeholder ambient

        if (bgmRef.current.src !== bgmUrl) {
            bgmRef.current.src = bgmUrl;
            bgmRef.current.loop = true;
            bgmRef.current.volume = isMuted ? 0 : volume * 0.6;

            // Try autoplay, handle browser block
            const playPromise = bgmRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // console.log("Auto-play prevented (user interaction needed):", error);
                });
            }
        } else if (bgmRef.current.paused && !isMuted) {
            bgmRef.current.play();
        }
    };

    const stopBGM = () => {
        if (bgmRef.current) {
            bgmRef.current.pause();
        }
    };

    const playSFX = (name) => {
        if (isMuted) return;

        const audio = sfxRefs.current[name];
        if (audio) {
            audio.currentTime = 0;
            audio.volume = volume;
            audio.play().catch(e => console.warn("SFX play failed:", e));
        }
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playBGM, stopBGM, playSFX, volume, setVolume }}>
            {children}
        </SoundContext.Provider>
    );
};
