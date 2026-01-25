import { useState, useEffect, useCallback } from 'react';
import { TAROT_CARDS } from '../data/tarotCards';

export const useTarotGame = () => {
    const [gameState, setGameState] = useState('MENU');
    const [topic, setTopic] = useState(null);
    const [readingType, setReadingType] = useState('2-cards');
    const [deck, setDeck] = useState(TAROT_CARDS);
    const [selectedCards, setSelectedCards] = useState([]);
    const [revealedIndices, setRevealedIndices] = useState([]);
    const [isRevealing, setIsRevealing] = useState(false);
    const [isDrawingFuture, setIsDrawingFuture] = useState(false);
    const [showFutureDialog, setShowFutureDialog] = useState(false);
    const [calendarType, setCalendarType] = useState('lunar');
    const [articleId, setArticleId] = useState(null);

    const requiredPickCount = isDrawingFuture
        ? (readingType === '1-card' ? 2 : 3)
        : (topic === 'monthly' || readingType === 'celtic-cross' ? 10 : (readingType === '3-cards' ? 3 : (readingType === '2-cards' ? 2 : 1)));
    const isSelectionComplete = selectedCards.length === requiredPickCount;

    // Automatically set reading type for specific topics
    useEffect(() => {
        if (topic === 'daily') {
            setReadingType('1-card');
        } else if (topic === 'love' || topic === 'work' || topic === 'finance' || topic === 'social' || topic === 'health') {
            setReadingType('3-cards');
        } else if (topic === 'monthly') {
            setReadingType('2-cards'); // Keeps internal type simple, though count is 10 overrides it
        }
    }, [topic]);

    const resetGame = useCallback(() => {
        setGameState('MENU');
        setTopic(null);
        setReadingType('2-cards');
        setSelectedCards([]);
        setRevealedIndices([]);
        setIsDrawingFuture(false);
        setShowFutureDialog(false);
        setCalendarType('lunar');
        setArticleId(null);
    }, []);

    const startReading = useCallback(() => {
        setGameState('SHUFFLING');
    }, []);

    const openCalendar = useCallback((type = 'lunar') => {
        setCalendarType(type);
        setGameState('CALENDAR');
    }, []);

    const openArticle = useCallback((id) => {
        setArticleId(id);
        setGameState('ARTICLE');
    }, []);

    const onShuffleComplete = useCallback(() => {
        // Use full deck for all topics for better depth (Minor Arcana included)
        const shuffledDeck = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
        setDeck(shuffledDeck);
        setGameState('PICKING');
    }, []);

    const handleCardPick = useCallback((card) => {
        setSelectedCards(prev => {
            const isSelected = prev.some(c => c.id === card.id);
            const originalCount = readingType === '1-card' ? 1 : 2;

            if (isSelected) {
                // Prevent unselecting original cards during Future Unlock
                if (isDrawingFuture) {
                    const cardIndex = prev.findIndex(c => c.id === card.id);
                    if (cardIndex < originalCount) return prev;
                }
                return prev.filter(c => c.id !== card.id);
            } else {
                if (prev.length >= requiredPickCount) return prev;
                return [...prev, card];
            }
        });
    }, [requiredPickCount, isDrawingFuture, readingType]);
    const confirmReading = useCallback(() => {
        if (selectedCards.length !== requiredPickCount) return;

        setGameState('RESULT');

        if (topic === 'monthly' || readingType === '2-cards' || (readingType === '1-card' && isDrawingFuture)) {
            setRevealedIndices([]);
            selectedCards.forEach((_, idx) => {
                const delay = isDrawingFuture && idx >= (readingType === '1-card' ? 1 : 2) ? 400 : idx * 200;
                setTimeout(() => {
                    setRevealedIndices(prev => [...prev, idx]);
                }, delay);
            });
        } else {
            setRevealedIndices([0]);
        }
    }, [selectedCards, requiredPickCount, topic, readingType, isDrawingFuture]);

    const onCutComplete = useCallback(() => {
        const cutPoint = Math.floor(deck.length / 2) + Math.floor(Math.random() * 10) - 5;
        const newDeck = [...deck.slice(cutPoint), ...deck.slice(0, cutPoint)];
        setDeck(newDeck);
        setGameState('PICKING');
    }, [deck]);

    const manualShuffle = useCallback(() => {


        // Logical Reset
        if (isDrawingFuture) {
            const originalCount = readingType === '1-card' ? 1 : 2;
            setSelectedCards(prev => prev.slice(0, originalCount));
        } else {
            setSelectedCards([]);
        }

        // Perform Shuffle Logic In-Place (No state transition)
        const majorArcanaTopics = ['love', 'work', 'finance', 'health', 'social', 'luck'];
        const baseDeck = majorArcanaTopics.includes(topic) ? TAROT_CARDS.slice(0, 22) : TAROT_CARDS;
        const shuffledDeck = [...baseDeck].sort(() => 0.5 - Math.random());
        setDeck(shuffledDeck);

    }, [isDrawingFuture, readingType, topic]);

    const manualCut = useCallback(() => {


        // Logical Reset
        if (isDrawingFuture) {
            const originalCount = readingType === '1-card' ? 1 : 2;
            setSelectedCards(prev => prev.slice(0, originalCount));
        } else {
            setSelectedCards([]);
        }

        // Perform Cut Logic In-Place (No state transition)
        setDeck(currentDeck => {
            const cutPoint = Math.floor(currentDeck.length / 2) + Math.floor(Math.random() * 10) - 5;
            return [...currentDeck.slice(cutPoint), ...currentDeck.slice(0, cutPoint)];
        });

    }, [isDrawingFuture, readingType]);

    return {
        gameState, setGameState,
        topic, setTopic,
        readingType, setReadingType,
        deck, setDeck,
        selectedCards, setSelectedCards,
        revealedIndices, setRevealedIndices,
        isRevealing, setIsRevealing,
        isDrawingFuture, setIsDrawingFuture,
        showFutureDialog, setShowFutureDialog,
        calendarType, setCalendarType,
        articleId, setArticleId,
        requiredPickCount,
        isSelectionComplete,
        resetGame,
        startReading,
        openCalendar,
        openArticle,
        onShuffleComplete,
        handleCardPick,
        confirmReading,
        onCutComplete,
        manualShuffle,
        manualCut
    };
};
