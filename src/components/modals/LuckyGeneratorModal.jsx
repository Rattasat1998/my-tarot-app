import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { generateLuckyNumber, getUpcomingDraw } from '../../data/lottoData';

export const LuckyGeneratorModal = ({ isOpen, onClose, isDark }) => {
    const [result, setResult] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayDigits, setDisplayDigits] = useState(['?', '?']);

    const upcomingDraw = getUpcomingDraw();

    // Play celebratory sound effect
    const playSuccessSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create a simple chime sound
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5

            oscillator1.type = 'sine';
            oscillator2.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.5);
            oscillator2.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    };

    const handleGenerate = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        let counter = 0;
        const interval = setInterval(() => {
            const r1 = Math.floor(Math.random() * 10);
            const r2 = Math.floor(Math.random() * 10);
            setDisplayDigits([r1.toString(), r2.toString()]);
            counter++;

            if (counter > 15) {
                clearInterval(interval);
                const luckyNumber = generateLuckyNumber(upcomingDraw?.luckyPool);
                setDisplayDigits([luckyNumber[0], luckyNumber[1]]);
                setResult(luckyNumber);
                setIsSpinning(false);
                playSuccessSound(); // Play sound when complete
            }
        }, 80);
    };

    useEffect(() => {
        if (isOpen) {
            setResult(null);
            setDisplayDigits(['?', '?']);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gradient-to-br from-amber-600 to-orange-700' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}
            >
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>

                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
                >
                    <X size={20} className="text-white" />
                </button>

                {/* Content */}
                <div className="relative z-10 p-8 text-center text-white space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <span>🎰</span> สุ่มเลขนำโชค
                        </h3>
                        {upcomingDraw && (
                            <p className="text-amber-100 text-sm mt-1">{upcomingDraw.label}</p>
                        )}
                    </div>

                    <p className="text-amber-100 text-sm">
                        ระบบคำนวณน้ำหนักจากสถิติและเลขชนสำนัก เพื่อสุ่มตัวเลขที่มีโอกาสสำหรับคุณ
                    </p>

                    {/* Result Box */}
                    <div className={`bg-white/20 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 ${isSpinning ? 'scale-95 opacity-80' : ''}`}>
                        <span className="text-amber-100 text-sm uppercase tracking-widest mb-2 block">
                            {result ? 'เลขนำโชคของคุณ' : isSpinning ? 'กำลังประมวลผล...' : 'กดปุ่มเพื่อเริ่มสุ่ม'}
                        </span>
                        <div className="flex gap-4 justify-center text-5xl font-mono font-bold tracking-wider mt-4">
                            <span className={`${result ? 'bg-white text-amber-600 px-3 py-1 rounded shadow-lg' : ''} transition-all`}>
                                {displayDigits[0]}
                            </span>
                            <span className={`${result ? 'bg-white text-amber-600 px-3 py-1 rounded shadow-lg' : ''} transition-all`}>
                                {displayDigits[1]}
                            </span>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isSpinning}
                        className={`bg-white text-orange-600 hover:bg-orange-50 font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-lg flex items-center gap-2 mx-auto ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Sparkles size={20} />
                        {isSpinning ? 'กำลังสุ่ม...' : 'เสี่ยงทาย'}
                    </button>

                    <p className="text-amber-200/70 text-xs">
                        * เพื่อความบันเทิงเท่านั้น ไม่สนับสนุนการพนัน
                    </p>
                </div>
            </div>
        </div>
    );
};
