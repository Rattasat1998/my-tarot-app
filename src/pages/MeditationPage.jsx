import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Brain, Moon, Sun, Play, Pause, RotateCcw, Volume2, VolumeX, Crown, Music, Waves, ArrowLeft } from 'lucide-react';
import { PremiumGate } from '../components/ui/PremiumGate';
import { usePremium } from '../hooks/usePremium';
import { useActivityLog } from '../hooks/useActivityLog';

export const MeditationPage = ({ isDark }) => {
    const navigate = useNavigate();
    const { isPremium } = usePremium();
    const { logActivity } = useActivityLog();
    const [isPlaying, setIsPlaying] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState('inhale');
    const [sessionTime, setSessionTime] = useState(0);
    const [selectedDuration, setSelectedDuration] = useState(5);
    const [selectedSound, setSelectedSound] = useState('none');
    const [isMuted, setIsMuted] = useState(false);
    const [currentAffirmation, setCurrentAffirmation] = useState(0);

    const premiumAffirmations = [
        "ฉันเป็นแสงสว่างที่ส่องออกมาจากภายใน",
        "จิตใจของฉันบริสุทธิ์และสงบสันติ",
        "ฉันเชื่อมต่อกับพลังงานสากลของจักรวาล",
        "ฉันเปิดรับความเข้าใจและปัญญาอันลึกซึ้ง",
        "ฉันสมดุลกับทุกสิ่งในชีวิต",
        "ฉันเดินทางสู่การตื่นรู้และการเจริญเติบโต",
        "จิตวิญญาณของฉันแข็งแกร่งและสง่างาม",
        "ฉันสร้างความเป็นอยู่ที่ดีกับตนเองและผู้อื่น"
    ];

    const soundOptions = [
        { id: 'none', name: 'ไม่มีเสียง', icon: <VolumeX size={16} /> },
        { id: 'rain', name: 'เสียงฝน', icon: <Waves size={16} /> },
        { id: 'ocean', name: 'เสียงคลื่นทะเล', icon: <Waves size={16} /> },
        { id: 'forest', name: 'เสียงป่า', icon: <Music size={16} /> },
        { id: 'bells', name: 'เสียงระฆัง', icon: <Music size={16} /> }
    ];
    const freeSoundOption = soundOptions[0];
    const premiumSoundOptions = soundOptions.slice(1);
    const effectiveSelectedSound = isPremium ? selectedSound : 'none';

    const affirmations = isPremium ? premiumAffirmations : [
        "ฉันพร้อมที่จะรับฟังคำแนะนำจากภายใน",
        "จิตใจของฉันสงบและเปิดกว้าง",
        "ฉันไว้วางใจในปัญญาของตนเอง",
        "ฉันสมดุลและสันติสุข",
        "ฉันเชื่อมต่อกับความเข้าใจลึกๆ ของตนเอง"
    ];

    const breathingCycles = [
        { phase: 'inhale', duration: 4, text: 'หายใจเข้า' },
        { phase: 'hold', duration: 4, text: 'กลั้นหายใจ' },
        { phase: 'exhale', duration: 4, text: 'หายใจออก' },
        { phase: 'hold', duration: 4, text: 'พัก' }
    ];

    useEffect(() => {
        if (!isPlaying) return undefined;

        const durationLimit = selectedDuration * 60;
        const interval = setInterval(() => {
            setSessionTime(prev => {
                const next = prev + 1;
                if (next >= durationLimit) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    logActivity('meditation', `ทำสมาธิ ${selectedDuration} นาที`, { duration: selectedDuration });
                    return durationLimit;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, selectedDuration, logActivity]);

    useEffect(() => {
        let interval;
        let currentPhaseIndex = 0;
        
        if (isPlaying) {
            interval = setInterval(() => {
                const cycle = breathingCycles[currentPhaseIndex];
                setBreathingPhase(cycle.phase);
                currentPhaseIndex = (currentPhaseIndex + 1) % breathingCycles.length;
            }, 4000);
        }
        
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        const affirmationInterval = setInterval(() => {
            setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
        }, 8000);
        
        return () => clearInterval(affirmationInterval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getBreathingInstruction = () => {
        const current = breathingCycles.find(c => c.phase === breathingPhase);
        return current ? current.text : 'เตรียมตัว';
    };

    const resetSession = () => {
        setIsPlaying(false);
        setSessionTime(0);
        setBreathingPhase('inhale');
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate('/');
    };

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                {/* Header */}
                <div className="text-center pt-8 pb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all backdrop-blur-sm border border-slate-700/50"
                            aria-label="ย้อนกลับ"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="p-3 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                            <Brain className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Meditation & Reflection
                        </h1>
                    </div>
                    <p className="text-slate-300 max-w-2xl mx-auto px-4">
                        เตรียมจิตใจให้สงบก่อนการค้นหาคำแนะนำจากไพ่ทาโรต์
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 pb-12">
                    {/* Breathing Circle */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="relative">
                            <div 
                                className={`w-48 h-48 rounded-full border-4 border-indigo-500/30 flex items-center justify-center transition-all duration-4000 ${
                                    breathingPhase === 'inhale' ? 'scale-110 border-indigo-400' :
                                    breathingPhase === 'hold' ? 'scale-105 border-purple-400' :
                                    breathingPhase === 'exhale' ? 'scale-95 border-indigo-300' :
                                    'scale-100 border-indigo-200'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-light text-indigo-300 mb-2">
                                        {getBreathingInstruction()}
                                    </div>
                                    <div className="text-4xl animate-pulse">
                                        {breathingPhase === 'inhale' ? '🌊' :
                                         breathingPhase === 'hold' ? '⭕' :
                                         breathingPhase === 'exhale' ? '🍃' : '🌸'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Animated rings */}
                            <div className={`absolute inset-0 rounded-full border-2 border-indigo-400/20 animate-ping ${
                                isPlaying ? '' : 'hidden'
                            }`} />
                            <div className={`absolute inset-4 rounded-full border-2 border-purple-400/20 animate-ping animation-delay-1000 ${
                                isPlaying ? '' : 'hidden'
                            }`} />
                        </div>

                        {/* Timer */}
                        <div className="mt-8 text-center">
                            <div className="text-5xl font-mono font-light text-indigo-300 mb-2">
                                {formatTime(sessionTime)}
                            </div>
                            <div className="text-sm text-slate-400">
                                จาก {selectedDuration} นาที
                            </div>
                        </div>
                    </div>

                    {/* Affirmation */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <p className="text-indigo-300 font-medium italic">
                                "{affirmations[currentAffirmation]}"
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-6">
                        {/* Duration Selection */}
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400">ระยะเวลา:</span>
                            <div className="flex gap-2">
                                {/* Free options */}
                                {[3, 5].map((duration) => (
                                    <button
                                        key={duration}
                                        onClick={() => setSelectedDuration(duration)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${
                                            selectedDuration === duration
                                                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                    >
                                        {duration} นาที
                                    </button>
                                ))}
                                
                                {/* Premium options */}
                                <PremiumGate feature="premiumMeditation" fallback={
                                    <>
                                        {[10, 15, 30].map((duration) => (
                                            <button
                                                key={duration}
                                                disabled
                                                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-500 cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Crown size={12} />
                                                {duration} นาที
                                            </button>
                                        ))}
                                    </>
                                }>
                                    {[10, 15, 30].map((duration) => (
                                        <button
                                            key={duration}
                                            onClick={() => setSelectedDuration(duration)}
                                            className={`px-4 py-2 rounded-lg border transition-all ${
                                                selectedDuration === duration
                                                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            {duration} นาที
                                        </button>
                                    ))}
                                </PremiumGate>
                            </div>
                        </div>

                        {/* Sound Selection */}
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400">เสียงพื้นหลัง:</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    key={freeSoundOption.id}
                                    onClick={() => setSelectedSound(freeSoundOption.id)}
                                    className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                                        effectiveSelectedSound === freeSoundOption.id
                                            ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    {freeSoundOption.icon}
                                    <span className="text-sm">{freeSoundOption.name}</span>
                                </button>

                                <PremiumGate feature="premiumMeditation" fallback={
                                    <>
                                        {premiumSoundOptions.map((sound) => (
                                            <button
                                                key={sound.id}
                                                disabled
                                                className="px-3 py-2 rounded-lg border border-slate-700 text-slate-500 cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Crown size={12} />
                                                {sound.icon}
                                                <span className="text-sm">{sound.name}</span>
                                            </button>
                                        ))}
                                    </>
                                }>
                                    {premiumSoundOptions.map((sound) => (
                                        <button
                                            key={sound.id}
                                            onClick={() => setSelectedSound(sound.id)}
                                            className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                                                effectiveSelectedSound === sound.id
                                                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            {sound.icon}
                                            <span className="text-sm">{sound.name}</span>
                                        </button>
                                    ))}
                                </PremiumGate>
                            </div>
                        </div>
                        {!isPremium && (
                            <p className="text-xs text-slate-500">สมาชิกทั่วไปใช้งานได้เฉพาะโหมดไม่มีเสียง</p>
                        )}
                        {/* Play Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-all shadow-lg shadow-indigo-500/25"
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            
                            <button
                                onClick={resetSession}
                                className="p-3 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 transition-all"
                            >
                                <RotateCcw size={20} />
                            </button>

                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                disabled={!isPremium || effectiveSelectedSound === 'none'}
                                className={`p-3 rounded-full border transition-all ${
                                    !isPremium || effectiveSelectedSound === 'none'
                                        ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                            <div className="p-3 rounded-full bg-purple-500/20 w-fit mx-auto mb-4">
                                <Heart className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">สงบจิตใจ</h3>
                            <p className="text-slate-400 text-sm">
                                ลดความเครียดและเตรียมจิตใจให้พร้อมรับคำแนะนำ
                            </p>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                            <div className="p-3 rounded-full bg-indigo-500/20 w-fit mx-auto mb-4">
                                <Brain className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">เพิ่มความชัดเจน</h3>
                            <p className="text-slate-400 text-sm">
                                ช่วยให้มีสมาธิและเข้าใจคำแนะนำได้ลึกซึ้งขึ้น
                            </p>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                            <div className="p-3 rounded-full bg-green-500/20 w-fit mx-auto mb-4">
                                <Sparkles className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">เชื่อมต่อภายใน</h3>
                            <p className="text-slate-400 text-sm">
                                เสริมสร้างการเชื่อมต่อกับปัญญาของตนเอง
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
