import React, { useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, Sparkles, Copy, Check } from 'lucide-react';
import { TAROT_CARDS } from '../../data/tarotCards';

// Each Major Arcana card maps to specific lucky numbers
const CARD_NUMBER_MAP = {
    0: { two: ['00', '09', '90'], three: ['009', '900'] },   // The Fool
    1: { two: ['01', '10', '19'], three: ['019', '110'] },   // The Magician
    2: { two: ['02', '20', '29'], three: ['029', '202'] },   // High Priestess
    3: { two: ['03', '30', '39'], three: ['039', '303'] },   // The Empress
    4: { two: ['04', '40', '14'], three: ['041', '404'] },   // The Emperor
    5: { two: ['05', '50', '15'], three: ['055', '505'] },   // Hierophant
    6: { two: ['06', '60', '69'], three: ['069', '606'] },   // The Lovers
    7: { two: ['07', '70', '77'], three: ['077', '707'] },   // The Chariot
    8: { two: ['08', '80', '88'], three: ['088', '808'] },   // Strength
    9: { two: ['09', '90', '99'], three: ['099', '909'] },   // The Hermit
    10: { two: ['10', '01', '55'], three: ['100', '555'] },  // Wheel of Fortune
    11: { two: ['11', '28', '82'], three: ['112', '282'] },  // Justice
    12: { two: ['12', '21', '48'], three: ['124', '214'] },  // Hanged Man
    13: { two: ['13', '31', '49'], three: ['134', '314'] },  // Death
    14: { two: ['14', '41', '56'], three: ['145', '415'] },  // Temperance
    15: { two: ['15', '51', '66'], three: ['156', '516'] },  // The Devil
    16: { two: ['16', '61', '43'], three: ['163', '613'] },  // The Tower
    17: { two: ['17', '71', '89'], three: ['178', '718'] },  // The Star
    18: { two: ['18', '81', '36'], three: ['183', '813'] },  // The Moon
    19: { two: ['19', '91', '46'], three: ['194', '914'] },  // The Sun
    20: { two: ['20', '02', '74'], three: ['207', '027'] },  // Judgement
    21: { two: ['21', '12', '33'], three: ['213', '123'] },  // The World
};

// Pick random N from array
const pickRandom = (arr, n) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
};

// Generate final lucky numbers from 3 picked cards
const generateLuckyNumbers = (cards) => {
    const allTwo = new Set();
    const allThree = new Set();

    cards.forEach(card => {
        const cardIdx = card.id - 1; // card id is 1-indexed
        const map = CARD_NUMBER_MAP[cardIdx] || CARD_NUMBER_MAP[0];
        map.two.forEach(n => allTwo.add(n));
        map.three.forEach(n => allThree.add(n));
    });

    // Cross-combine: take first digit of each card's primary number
    const crossTwo = `${(cards[0].id - 1) % 10}${(cards[1].id - 1) % 10}`;
    const crossThree = `${(cards[0].id - 1) % 10}${(cards[1].id - 1) % 10}${(cards[2].id - 1) % 10}`;
    allTwo.add(crossTwo.padStart(2, '0'));
    allThree.add(crossThree.padStart(3, '0'));

    return {
        twoDigit: [...allTwo].slice(0, 6),
        threeDigit: [...allThree].slice(0, 4),
    };
};

const CardBack = ({ onClick, index, isRevealing }) => (
    <button
        onClick={onClick}
        disabled={isRevealing}
        className={`group relative w-[100px] h-[150px] sm:w-[120px] sm:h-[180px] rounded-xl cursor-pointer transition-all duration-300 ${
            isRevealing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-2 active:scale-95'
        }`}
        style={{ perspective: '600px', animationDelay: `${index * 100}ms` }}
    >
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 shadow-xl shadow-purple-500/30 border-2 border-purple-400/50 flex items-center justify-center relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-2 border border-yellow-400/60 rounded-lg" />
                <div className="absolute inset-4 border border-yellow-400/40 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-yellow-400/50 rounded-full" />
            </div>
            {/* Center symbol */}
            <div className="relative z-10 text-center">
                <span className="text-3xl sm:text-4xl block mb-1">🔮</span>
                <span className="text-[10px] text-purple-200 font-medium">เลือกใบนี้</span>
            </div>
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-pulse" />
        </div>
    </button>
);

const CardFront = ({ card, index, luckyNums }) => {
    const cardIdx = card.id - 1;
    const map = CARD_NUMBER_MAP[cardIdx] || CARD_NUMBER_MAP[0];
    const primaryNum = map.two[0];

    return (
        <div
            className="relative w-[100px] h-[150px] sm:w-[120px] sm:h-[180px] rounded-xl overflow-hidden shadow-xl animate-in zoom-in-95 duration-500"
            style={{ animationDelay: `${index * 200}ms` }}
        >
            <img
                src={card.img}
                alt={card.nameThai}
                className="w-full h-full object-cover"
            />
            {/* Number badge */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-6">
                <div className="text-center">
                    <span className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-lg px-3 py-0.5 rounded-full shadow-lg">
                        {primaryNum}
                    </span>
                </div>
            </div>
            {/* Card name */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-1.5">
                <p className="text-white text-[9px] sm:text-[10px] text-center font-medium truncate">
                    {card.nameThai}
                </p>
            </div>
        </div>
    );
};

export const TarotLottoModal = ({ isOpen, onClose }) => {
    const [phase, setPhase] = useState('pick'); // pick | revealing | result
    const [deck, setDeck] = useState([]);
    const [pickedCards, setPickedCards] = useState([]);
    const [revealedIndices, setRevealedIndices] = useState([]);
    const [luckyNumbers, setLuckyNumbers] = useState(null);
    const [copiedNum, setCopiedNum] = useState(null);

    // Shuffle deck on open
    useEffect(() => {
        if (isOpen) {
            // Use only Major Arcana (first 22 cards) for more meaningful readings
            const majorArcana = TAROT_CARDS.filter((_, i) => i < 22);
            const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
            setDeck(shuffled.slice(0, 5)); // Show 5 cards to pick from
            setPickedCards([]);
            setRevealedIndices([]);
            setLuckyNumbers(null);
            setPhase('pick');
        }
    }, [isOpen]);

    const handlePickCard = useCallback((cardIndex) => {
        if (phase !== 'pick' || revealedIndices.includes(cardIndex)) return;

        const newRevealed = [...revealedIndices, cardIndex];
        setRevealedIndices(newRevealed);

        const newPicked = [...pickedCards, deck[cardIndex]];
        setPickedCards(newPicked);

        if (newPicked.length >= 3) {
            setPhase('revealing');
            // Calculate numbers after short delay
            setTimeout(() => {
                const nums = generateLuckyNumbers(newPicked);
                setLuckyNumbers(nums);
                setPhase('result');
            }, 800);
        }
    }, [phase, revealedIndices, pickedCards, deck]);

    const handleReset = () => {
        const majorArcana = TAROT_CARDS.filter((_, i) => i < 22);
        const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
        setDeck(shuffled.slice(0, 5));
        setPickedCards([]);
        setRevealedIndices([]);
        setLuckyNumbers(null);
        setPhase('pick');
    };

    const handleCopy = (num) => {
        navigator.clipboard?.writeText(num).catch(() => {});
        setCopiedNum(num);
        setTimeout(() => setCopiedNum(null), 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-indigo-950 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
            >
                {/* Mystical background effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-600/10 rounded-full blur-[60px]" />
                </div>

                {/* Header */}
                <div className="relative p-5 sm:p-6 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-white/70" />
                    </button>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl">🃏</span>
                        <h3 className="text-xl font-bold text-white">ไพ่ทาโรต์ทำนายเลข</h3>
                    </div>
                    <p className="text-indigo-300 text-sm">
                        {phase === 'pick'
                            ? `ตั้งจิตอธิษฐาน แล้วเลือกไพ่ ${3 - pickedCards.length} ใบ`
                            : phase === 'revealing'
                                ? '✨ กำลังทำนายเลขจากไพ่...'
                                : '🎯 เลขเด็ดจากไพ่ทาโรต์ประจำงวด'
                        }
                    </p>

                    {/* Pick counter */}
                    {phase === 'pick' && (
                        <div className="flex justify-center gap-2 mt-3">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        i < pickedCards.length
                                            ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50'
                                            : 'bg-white/20'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Cards Area */}
                <div className="relative flex-1 overflow-y-auto px-4 pb-4">
                    {/* Card Selection */}
                    <div className="flex justify-center gap-3 sm:gap-4 flex-wrap mb-6">
                        {deck.map((card, idx) => (
                            <div key={card.id}>
                                {revealedIndices.includes(idx) ? (
                                    <CardFront card={card} index={revealedIndices.indexOf(idx)} />
                                ) : (
                                    <CardBack
                                        onClick={() => handlePickCard(idx)}
                                        index={idx}
                                        isRevealing={phase !== 'pick'}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Revealing Animation */}
                    {phase === 'revealing' && (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center gap-2 text-amber-400 animate-pulse">
                                <Sparkles size={20} />
                                <span className="text-base font-medium">กำลังคำนวณเลขมงคล...</span>
                                <Sparkles size={20} />
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {phase === 'result' && luckyNumbers && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                                <span className="text-amber-400 text-sm font-medium">เลขเด็ดจากไพ่</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                            </div>

                            {/* 2-digit */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <p className="text-amber-400 text-xs font-semibold mb-3 text-center">เลขท้าย 2 ตัว</p>
                                <div className="flex flex-wrap justify-center gap-2.5">
                                    {luckyNumbers.twoDigit.map((num, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleCopy(num)}
                                            className={`min-w-[52px] h-[52px] rounded-xl flex items-center justify-center font-bold text-xl transition-all active:scale-90 ${
                                                idx === 0
                                                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/30 ring-2 ring-yellow-300/50'
                                                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                            }`}
                                        >
                                            {copiedNum === num ? <Check size={18} className="text-green-400" /> : num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3-digit */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <p className="text-purple-400 text-xs font-semibold mb-3 text-center">เลข 3 ตัว</p>
                                <div className="flex flex-wrap justify-center gap-2.5">
                                    {luckyNumbers.threeDigit.map((num, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleCopy(num)}
                                            className={`min-w-[64px] h-[44px] px-3 rounded-xl flex items-center justify-center font-bold text-lg transition-all active:scale-90 ${
                                                idx === 0
                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-300/50'
                                                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                            }`}
                                        >
                                            {copiedNum === num ? <Check size={16} className="text-green-400" /> : num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card meanings summary */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <p className="text-indigo-300 text-xs font-semibold mb-2 text-center">ไพ่ที่เลือก</p>
                                <div className="space-y-2">
                                    {pickedCards.map((card, idx) => {
                                        const cardIdx = card.id - 1;
                                        const map = CARD_NUMBER_MAP[cardIdx] || CARD_NUMBER_MAP[0];
                                        return (
                                            <div key={idx} className="flex items-center gap-3 text-sm">
                                                <span className="text-amber-400 font-bold">{idx + 1}.</span>
                                                <span className="text-white font-medium">{card.nameThai}</span>
                                                <span className="text-indigo-400">→</span>
                                                <span className="text-amber-300 font-bold">{map.two[0]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reset button */}
                            <button
                                onClick={handleReset}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                            >
                                <RotateCcw size={18} />
                                เปิดไพ่ใหม่
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative p-3 border-t border-white/5 text-center">
                    <p className="text-xs text-indigo-400/50">
                        * เพื่อความบันเทิงเท่านั้น ไม่สนับสนุนการพนัน
                    </p>
                </div>
            </div>
        </div>
    );
};
