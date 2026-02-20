import { useState, useRef, useCallback, useEffect } from 'react';

// Mapping card ID → exact audio filename (description)
const AUDIO_MAP = {
    1: '1.The-Fool-description.mp3',
    2: '2.The-Magiciandescription.mp3',
    3: '3.The-High-Priestess-description.mp3',
    4: '4.The-Empress-description.mp3',
    5: '5.The-Emperor-description.mp3',
    6: '6.The-Hierophant-description.mp3',
    7: '7.The-Lovers-description.mp3',
    8: '8.The-Chariot-description.mp3',
    9: '9.Strength-description.mp3',
    10: '10.The-Hermit-description.mp3',
    11: '11.Wheel-Of-Fortune-description.mp3',
    12: '12.Justice-description.mp3',
    13: '13.The-Hanged-Man-description.mp3',
    14: '14.Death-description.mp3',
    15: '15.Temperance-description.mp3',
    16: '16.The-Devil-description.mp3',
    17: '17.The-Tower-description.mp3',
    18: '18.The-Star-description.mp3',
    19: '19.The-Moon-description.mp3',
    20: '20.The-Sun-description.mp3',
    21: '21.Judgement-description.mp3',
    22: '22.The-World-description.mp3',
    23: '23.Ace-Of-Wands-description.mp3',
    24: '24.Two-Of-Wands-description.mp3',
    25: '25.Three-Of-Wands-description.mp3',
    26: '26.Four-Of-Wands-description.mp3',
    27: '27.Five-Of-Wands-description.mp3',
    28: '28.Six-Of-Wands-description.mp3',
    29: '29.Seven-Of-Wands-description.mp3',
    30: '30.Eight-Of-Wands-description.mp3',
    31: '31.Nine-Of-Wands-description.mp3',
    32: '32.Ten-Of_Wands-description.mp3',
    33: '33.Page-Of-Wands-description.mp3',
    34: '34.Knight-Of-Wands-description.mp3',
    35: '35.Queen-Of-Wands-description.mp3',
    36: '36.King-Of-Wands-description.mp3',
    37: '37.Ace-Of-Cups-description.mp3',
    38: '38.Two-Of-Cups-description.mp3',
    39: '39.Three-Of-Cups-description.mp3',
    40: '40.Four-Of-Cups-description.mp3',
    41: '41.Five-Of-Cups-description.mp3',
    42: '42.Six-Of-Cups-description.mp3',
    43: '43.Seven-Of-Cups-description.mp3',
    44: '44.Eight-Of-Cups-description.mp3',
    45: '45.Nine-Of-Cups-description.mp3',
    46: '46.Ten-Of-Cups-description.mp3',
    47: '47.Page-Of-Cups-description.mp3',
    48: '48.Knight-Of-Cups-description.mp3',
    49: '49.Quen-Of-Cups-description.mp3',
    50: '50.King-Of-Cups-description.mp3',
    51: '51.Ace-Of-Swords-description.mp3',
    52: '52.Two-Of-Swords-description.mp3',
    53: '53.Three-Of-Swords-description.mp3',
    54: '54.Four-Of-Swords-description.mp3',
    55: '55.Five-Of-Swords-description.mp3',
    56: '56.Six-Of-Swords-description.mp3',
    57: '57.Seven-Of-Swords-description.mp3',
    58: '58.Eight-Of-Swords-description.mp3',
    59: '59.Nine-Of-Swords-description.mp3',
    60: '60.Ten-Of-Swords-description.mp3',
    61: '61.Page-Of-Swords-description.mp3',
    62: '62.Knight-Of-Swords-description.mp3',
    63: '63.Queen-Of-Swords-description.mp3',
    64: '64.King-Of-Swords-description.mp3',
    65: '65.Ace-Of-Pentacles-description.mp3',
    66: '66.Two-Of-Pentacles-description.mp3',
    67: '67.Three-Of-Pentacles-description.mp3',
    68: '68.Four-Of-Pentacles-description.mp3',
    69: '69.Five-Of-Pentacles-description.mp3',
    70: '70.Six-Of-Pentacles-description.mp3',
    71: '71.Seven-Of-Pentacles-description.mp3',
    72: '72.Eight-Of-Pentacles-description.mp3',
    73: '73.Nine-Of-Pentacles-description.mp3',
    74: '74.Ten-Of-Pentacles-description.mp3',
    75: '75.Page-Of-Pentacles-description.mp3',
    76: '76.Knight-Of-Pentacles-description.mp3',
    77: '77.Queen-Of-Pentacles-description.mp3',
    78: '78.King-Of-Pentacles-description.mp3',
};

export const getCardAudioUrl = (cardId) => {
    const filename = AUDIO_MAP[cardId];
    if (!filename) return null;
    return `/audio/${filename}`;
};

export const useCardAudio = () => {
    const [playingCardId, setPlayingCardId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playDescription = useCallback((cardId) => {
        // If same card is playing, stop it
        if (playingCardId === cardId && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setPlayingCardId(null);
            return;
        }

        // Stop any current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        const url = getCardAudioUrl(cardId);
        if (!url) return;

        const audio = new Audio(url);
        audioRef.current = audio;
        setPlayingCardId(cardId);

        audio.onended = () => {
            setPlayingCardId(null);
            audioRef.current = null;
        };

        audio.onerror = () => {
            console.warn(`Failed to play audio for card ${cardId}`);
            setPlayingCardId(null);
            audioRef.current = null;
        };

        audio.play().catch(() => {
            setPlayingCardId(null);
            audioRef.current = null;
        });
    }, [playingCardId]);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingCardId(null);
    }, []);

    return {
        playDescription,
        stopAudio,
        playingCardId,
        isPlaying: playingCardId !== null,
    };
};
