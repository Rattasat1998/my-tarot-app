import { useState, useCallback, useEffect } from 'react';

export const useSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Stop speech when component unmounts
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = useCallback((text, options = {}) => {
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Thai voice settings
        utterance.lang = 'th-TH';
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        // Try to find a Thai voice
        const voices = window.speechSynthesis.getVoices();
        const thaiVoice = voices.find(voice => voice.lang.includes('th')) ||
            voices.find(voice => voice.lang.includes('TH'));
        if (thaiVoice) {
            utterance.voice = thaiVoice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    const stop = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, []);

    const pause = useCallback(() => {
        if (window.speechSynthesis && isSpeaking) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    }, [isSpeaking]);

    const resume = useCallback(() => {
        if (window.speechSynthesis && isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    }, [isPaused]);

    const toggle = useCallback(() => {
        if (isPaused) {
            resume();
        } else if (isSpeaking) {
            pause();
        }
    }, [isSpeaking, isPaused, pause, resume]);

    return {
        speak,
        stop,
        pause,
        resume,
        toggle,
        isSpeaking,
        isPaused
    };
};
