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

    // BGM Playlist
    const bgmPlaylist = useRef([
        '/audio/sound-background.mp3',
        '/audio/sound-background2.mp3',
        '/audio/sound-background3.mp3',
    ]);
    const bgmTrackIndex = useRef(0);
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

    // Play next track in the playlist when current one ends
    useEffect(() => {
        const audio = bgmRef.current;
        if (!audio) return;

        const handleEnded = () => {
            bgmTrackIndex.current = (bgmTrackIndex.current + 1) % bgmPlaylist.current.length;
            audio.src = bgmPlaylist.current[bgmTrackIndex.current];
            audio.volume = isMuted ? 0 : volume * 0.6;
            audio.play().catch(() => {});
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [isMuted, volume]);

    const playBGM = (src) => {
        if (!bgmRef.current) return;

        if (src) {
            // Play a specific track if provided
            bgmRef.current.src = src;
            bgmRef.current.loop = false;
            bgmRef.current.volume = isMuted ? 0 : volume * 0.6;
            bgmRef.current.play().catch(() => {});
            return;
        }

        // Start playlist from current index
        const bgmUrl = bgmPlaylist.current[bgmTrackIndex.current];

        if (!bgmRef.current.src || !bgmRef.current.src.endsWith(bgmUrl)) {
            bgmRef.current.src = bgmUrl;
            bgmRef.current.loop = false;
            bgmRef.current.volume = isMuted ? 0 : volume * 0.6;

            const playPromise = bgmRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        } else if (bgmRef.current.paused && !isMuted) {
            bgmRef.current.play().catch(() => {});
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
        setIsMuted(prev => {
            const newMuted = !prev;
            // Resume BGM when unmuting
            if (!newMuted && bgmRef.current && bgmRef.current.src && bgmRef.current.paused) {
                bgmRef.current.play().catch(() => {});
            }
            return newMuted;
        });
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playBGM, stopBGM, playSFX, volume, setVolume }}>
            {children}
        </SoundContext.Provider>
    );
};
