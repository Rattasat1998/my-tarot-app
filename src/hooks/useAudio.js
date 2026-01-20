import { useRef, useEffect } from 'react';
import shuffleSoundUrl from '../assets/tarot-shuffle-89105.mp3';

export const useAudio = () => {
    const audioContextRef = useRef(null);

    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playRevealSound = () => {
        if (typeof window === 'undefined') return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // Create White Noise Buffer
        const bufferSize = ctx.sampleRate * 0.1; // 0.1 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        // Nodes
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        const gainNode = ctx.createGain();

        // Envelope for "Swish" sound
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); // Decay

        // Connect
        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Play
        noiseSource.start();
    };

    const playShuffleSound = () => {
        const audio = new Audio(shuffleSoundUrl);
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Audio playback failed:', err));
        return audio;
    };

    return { playRevealSound, playShuffleSound };
};
