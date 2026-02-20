import React, { useMemo, useRef, useState } from 'react';
import { Sparkles, RefreshCw, Search, Volume2, VolumeX, Pause, Play, Share2, Download, Loader, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { READING_TOPICS } from '../../constants/readingTopics';
import { GoogleAdSlot } from '../ui/GoogleAdSlot';
import { useSpeech } from '../../hooks/useSpeech';
import { HolographicCard } from '../ui/HolographicCard';
import { ManaParticles } from '../ui/ManaParticles';
import { MysticBackground } from '../ui/MysticBackground';
import { ShareCardTemplate } from './ShareCardTemplate';
import { SaveMemoModal } from '../modals/SaveMemoModal';
import { CardDetailModal } from '../modals/CardDetailModal';
import { useCardAudio } from '../../hooks/useCardAudio';

export const ResultState = ({
    topic,
    readingType,
    selectedCards,
    resetGame,
    isDrawingFuture,
    setShowFutureDialog,
    isDark
}) => {
    const { speak, stop, toggle, isSpeaking, isPaused } = useSpeech();
    const { playDescription, playingCardId, stopAudio } = useCardAudio();
    const [isSharing, setIsSharing] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [selectedDetailCard, setSelectedDetailCard] = useState(null);
    const [detailLabel, setDetailLabel] = useState('');
    const shareTemplateRef = useRef(null);

    const handleCardClick = (card, label) => {
        setSelectedDetailCard(card);
        setDetailLabel(label);
    };

    const closeDetailModal = () => {
        setSelectedDetailCard(null);
        setDetailLabel('');
    };

    const getCardMeaning = (card, topic) => {
        if (!card) return '';
        if (topic === 'love' && card.meaningLove) return card.meaningLove;
        if (topic === 'work' && card.meaningWork) return card.meaningWork;
        if (topic === 'finance' && card.meaningFinance) return card.meaningFinance;
        if (topic === 'health' && card.meaningHealth) return card.meaningHealth;
        if (topic === 'social' && card.meaningSocial) return card.meaningSocial;
        if (topic === 'luck' && card.meaningLuck) return card.meaningLuck;
        if (card.meaningUpright) return card.meaningUpright;
        return card.description;
    };

    // Create full reading text for TTS
    const fullReadingText = useMemo(() => {
        const topicLabel = READING_TOPICS.find(t => t.id === topic)?.label || '';
        let text = `คำทำนาย${topicLabel}。`;

        selectedCards.forEach((card, idx) => {
            let label = '';
            if (topic === 'monthly') {
                label = `ใบที่ ${idx + 1}`;
            } else if (readingType === 'celtic-cross') {
                const labels = ['สถานการณ์ปัจจุบัน', 'อุปสรรค', 'เป้าหมาย', 'พื้นฐาน', 'อดีต', 'อนาคต', 'ทัศนคติ', 'อิทธิพลภายนอก', 'ความหวัง', 'บทสรุป'];
                label = labels[idx] || `ใบที่ ${idx + 1}`;
            } else if (readingType === '1-card') {
                label = idx === 0 ? 'ปัจจุบัน' : 'อนาคต';
            } else {
                label = idx === 0 ? 'อดีต' : idx === 1 ? 'ปัจจุบัน' : 'อนาคต';
            }
            text += ` ${label}。 ไพ่ ${card.nameThai}。 ${getCardMeaning(card, topic)}。`;
        });

        text += ' ขอให้โชคดี';
        return text;
    }, [selectedCards, topic, readingType]);

    const handleSpeak = () => {
        if (isSpeaking && !isPaused) {
            stop();
        } else {
            speak(fullReadingText);
        }
    };

    const handleShare = async () => {
        if (!shareTemplateRef.current) return;
        setIsSharing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const canvas = await html2canvas(shareTemplateRef.current, {
                useCORS: true,
                scale: 1, // Native 1080x1920
                backgroundColor: '#020617',
                logging: false,
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `tarot-destiny-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating share image:", error);
            alert("ขออภัย ไม่สามารถสร้างรูปภาพได้ในขณะนี้");
        } finally {
            setIsSharing(false);
        }
    };

    const TTSButton = () => (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSpeak}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isSpeaking
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
            >
                {isSpeaking ? (
                    <>
                        <VolumeX size={18} />
                        <span className="text-sm">หยุดอ่าน</span>
                    </>
                ) : (
                    <>
                        <Volume2 size={18} />
                        <span className="text-sm">อ่านให้ฟัง</span>
                    </>
                )}
            </button>
            {isSpeaking && (
                <button
                    onClick={toggle}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
            )}
        </div>
    );

    const ShareButton = () => (
        <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60 text-sm font-bold"
        >
            <Share2 size={18} />
            Coming Soon
        </button>
    );

    const SaveButton = () => (
        <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all text-sm font-bold"
        >
            <Save size={18} />
            บันทึก
        </button>
    );

    // ---------------------------------------------------------
    // MONTHLY VIEW
    // ---------------------------------------------------------
    if (topic === 'monthly') {
        return (
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto relative overflow-hidden">
                <MysticBackground />
                <ManaParticles count={50} />

                <div style={{ position: 'fixed', left: '-3000px', top: 0, width: '1080px', height: '1920px', zIndex: -10, overflow: 'hidden' }}>
                    <div ref={shareTemplateRef} data-share-template>
                        <ShareCardTemplate
                            cards={selectedCards}
                            topic={topic}
                            readingType={readingType}
                            appName="ศาสตร์ดวงดาว"
                        />
                    </div>
                </div>

                <SaveMemoModal
                    isOpen={showSaveModal}
                    onClose={() => setShowSaveModal(false)}
                    topic={topic}
                    readingType={readingType}
                    cards={selectedCards}
                    isDark={isDark}
                />

                <CardDetailModal
                    isOpen={!!selectedDetailCard}
                    onClose={closeDetailModal}
                    card={selectedDetailCard}
                    label={detailLabel}
                    topic={topic}
                />

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-serif text-yellow-500 mb-2">คำทำนายรายเดือน</h2>
                    <p className="text-slate-400 text-sm mb-4">ภาพรวมตลอดเดือนของคุณ</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        <TTSButton />
                        <SaveButton />
                        <ShareButton />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-12">
                    {selectedCards.map((card, idx) => (
                        <div key={card.id} className="flex flex-col items-center gap-2 animate-in zoom-in duration-500 group/card" style={{ animationDelay: `${idx * 100}ms` }}>
                            <HolographicCard
                                className="relative w-full aspect-[2/3] group-hover/card:scale-105 transition-transform duration-500"
                                onClick={() => handleCardClick(card, `ใบที่ ${idx + 1}`)}
                            >
                                <div className="absolute inset-0 bg-yellow-500/5 blur-xl group-hover/card:bg-yellow-500/10 transition-all"></div>
                                <div className="relative w-full h-full overflow-hidden shadow-lg shadow-purple-900/40 z-10">
                                    <img src={card.img} alt={card.name} className="w-full h-full object-contain" />
                                </div>
                            </HolographicCard>
                            <div className="text-center">
                                <div className="text-xs text-yellow-500/70 font-mono mb-1">ใบที่ {idx + 1}</div>
                                <h4 className="text-xs sm:text-sm font-bold text-yellow-100 leading-tight">{card.name}</h4>
                                <div className="text-[10px] text-slate-400">({card.nameThai})</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-4xl space-y-6 bg-slate-900/30 p-6 md:p-8">
                    <h3 className="text-xl font-serif text-center mb-6 text-purple-300">ความหมายของไพ่แต่ละใบ</h3>
                    <div className="grid grid-cols-1 gap-6">
                        {selectedCards.map((card, idx) => (
                            <div key={card.id} className="flex flex-col md:flex-row gap-6 border-b border-slate-800/50 pb-8 last:border-0 last:pb-0 items-center md:items-start group">
                                <div className="relative shrink-0 w-32 aspect-[2/3] group/glow">
                                    <div className="absolute inset-0 bg-yellow-500/10 blur-2xl group-hover/glow:bg-yellow-500/20 transition-all duration-700"></div>
                                    <div className="relative w-full h-full overflow-hidden shadow-xl z-10">
                                        <img src={card.img} alt={card.name} className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                                        <div className="shrink-0 w-6 h-6 rounded-none bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-300 border border-purple-500/20">
                                            {idx + 1}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-yellow-500 text-lg">{card.name}</span>
                                            <span className="text-sm text-slate-400">({card.nameThai})</span>
                                        </div>
                                        <button
                                            onClick={() => playDescription(card.id)}
                                            className={`shrink-0 p-1.5 rounded-full transition-all ${playingCardId === card.id ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                            title={playingCardId === card.id ? 'หยุดฟัง' : 'ฟังคำอธิบายไพ่'}
                                        >
                                            {playingCardId === card.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                        </button>
                                    </div>
                                    <p className="text-sm md:text-base text-slate-300 leading-relaxed text-center md:text-left">{getCardMeaning(card, topic)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button onClick={resetGame} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-none font-medium transition-all">
                        กลับหน้าหลัก
                    </button>
                </div>
                <GoogleAdSlot className="mt-16" />
            </div>
        );
    }

    // ---------------------------------------------------------
    // STANDARD & CELTIC LAYOUT
    // ---------------------------------------------------------
    return (
        <div className="w-full relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            {/* Mystic Background */}
            <div className="fixed inset-0 z-0">
                <MysticBackground />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center pb-24">

                {/* Header Actions */}
                <div className="w-full flex justify-between items-center mb-6 pt-4">
                    <button
                        onClick={resetGame}
                        className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all backdrop-blur-sm border border-slate-700"
                    >
                        <RefreshCw size={20} />
                    </button>

                    <div className="flex gap-2">
                        <TTSButton />

                        <div style={{ position: 'fixed', left: '-3000px', top: 0, width: '1080px', height: '1920px', zIndex: -10, overflow: 'hidden' }}>
                            <div ref={shareTemplateRef} data-share-template>
                                <ShareCardTemplate cards={selectedCards} topic={topic} readingType={readingType} appName="ศาสตร์ดวงดาว" />
                            </div>
                        </div>

                        <ShareButton />

                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white font-medium shadow-lg shadow-green-500/30 transition-all"
                        >
                            <Save size={18} />
                            <span className="hidden sm:inline">Save</span>
                        </button>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-2 text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    ลิขิตแห่งดวงดาว
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-10"></div>

                {/* Main Card Grid */}
                <div className={`grid gap-4 sm:gap-6 w-full ${readingType === 'celtic-cross'
                    ? 'grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto'
                    : readingType === '3-cards'
                        ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
                        : readingType === '2-cards'
                            ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                            : 'grid-cols-1 max-w-md mx-auto'
                    }`}>
                    {readingType === 'celtic-cross' ? (
                        // Celtic Cross Layout
                        <>
                            <div className="lg:col-span-2 relative min-h-[600px] flex items-center justify-center p-4 sm:p-8 bg-slate-900/30 rounded-3xl border border-slate-700/50">
                                <div className="relative w-full h-full max-w-md mx-auto aspect-square">
                                    {/* Helper for rendering card content */}
                                    {/* 1. Present */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 sm:w-32 aspect-[2/3]">
                                        <HolographicCard className="w-full h-full" onClick={() => handleCardClick(selectedCards[0], "1. ปัจจุบัน")}>
                                            <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                <img src={selectedCards[0].img} alt="Present" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">1. ปัจจุบัน</div>
                                            </div>
                                        </HolographicCard>
                                    </div>
                                    {/* 2. Challenge */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 sm:w-32 aspect-[2/3] rotate-90 opacity-90 hover:rotate-0 transition-all duration-500">
                                        <HolographicCard className="w-full h-full" onClick={() => handleCardClick(selectedCards[1], "2. อุปสรรค")}>
                                            <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                <img src={selectedCards[1].img} alt="Challenge" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">2. อุปสรรค</div>
                                            </div>
                                        </HolographicCard>
                                    </div>
                                    {/* 3. Crown */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-24 sm:w-32 aspect-[2/3]">
                                        <HolographicCard className="w-full h-full" onClick={() => handleCardClick(selectedCards[2], "3. เป้าหมาย")}>
                                            <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                <img src={selectedCards[2].img} alt="Goal" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">3. เป้าหมาย</div>
                                            </div>
                                        </HolographicCard>
                                    </div>
                                    {/* 4. Root */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-24 sm:w-32 aspect-[2/3]">
                                        <HolographicCard className="w-full h-full" onClick={() => handleCardClick(selectedCards[3], "4. พื้นฐาน")}>
                                            <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                <img src={selectedCards[3].img} alt="Foundation" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">4. พื้นฐาน</div>
                                            </div>
                                        </HolographicCard>
                                    </div>
                                    {/* 5. Past */}
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10 w-24 sm:w-32 aspect-[2/3]">
                                        <HolographicCard className="w-full h-full" onClick={() => handleCardClick(selectedCards[4], "5. อดีต")}>
                                            <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                <img src={selectedCards[4].img} alt="Past" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">5. อดีต</div>
                                            </div>
                                        </HolographicCard>
                                    </div>
                                    {/* 6. Future */}
                                    <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10 w-24 sm:w-32 aspect-[2/3]">
                                        <HolographicCard className="w-full h-full" onClick={() => handleCardClick(selectedCards[5], "6. อนาคต")}>
                                            <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                <img src={selectedCards[5].img} alt="Future" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">6. อนาคต</div>
                                            </div>
                                        </HolographicCard>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-4 items-center justify-center bg-slate-900/30 rounded-3xl border border-slate-700/50">
                                {/* Stack cards 7-10 */}
                                {[9, 8, 7, 6].map((idx, i) => {
                                    const label = idx === 9 ? '10. บทสรุป' : idx === 8 ? '9. หวัง/กลัว' : idx === 7 ? '8. อิทธิพล' : '7. ทัศนคติ';
                                    return (
                                        <div key={idx} className="w-24 sm:w-32 aspect-[2/3] scale-90 hover:scale-100 transition-transform duration-300">
                                            <HolographicCard
                                                className="w-full h-full"
                                                onClick={() => handleCardClick(selectedCards[idx], label)}
                                            >
                                                <div className="w-full h-full rounded-lg overflow-hidden relative shadow-xl">
                                                    <img src={selectedCards[idx].img} alt={`Card ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center text-[10px] text-white font-bold">
                                                        {label}
                                                    </div>
                                                </div>
                                            </HolographicCard>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        // Standard Layout
                        <>
                            {selectedCards.map((card, idx) => {
                                let label = '';
                                if (readingType === '1-card') label = idx === 0 ? 'ไพ่ใบที่เลือก' : 'บทสรุปอนาคต';
                                else label = idx === 0 ? 'อดีต / สาเหตุ' : idx === 1 ? 'ปัจจุบัน / สถานการณ์' : 'อนาคต / แนวโน้ม';

                                return (
                                    <div key={card.id} className="flex flex-col items-center gap-4 animate-in zoom-in duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                                        <span className="px-3 py-1 bg-slate-800/80 rounded-full text-xs text-purple-200 border border-purple-500/30">{label}</span>
                                        <div className="w-full max-w-[320px] aspect-[2/3]">
                                            <HolographicCard
                                                className="w-full h-full"
                                                onClick={() => handleCardClick(card, label)}
                                            >
                                                <div className="relative w-full h-full overflow-hidden shadow-2xl shadow-purple-900/40 z-10 rounded-xl">
                                                    <img src={card.img} alt={card.name} className="w-full h-full object-contain bg-slate-950" />
                                                </div>
                                            </HolographicCard>
                                        </div>
                                        <h3 className="font-bold text-yellow-500">{card.name}</h3>
                                    </div>
                                );
                            })}

                            {/* Future Locked Card (Only for 1-card/2-cards modes that support it) */}
                            {!isDrawingFuture && selectedCards.length < (readingType === '1-card' ? 2 : 3) && (
                                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-700 delay-300">
                                    <span className="px-3 py-1 bg-slate-800/80 rounded-full text-xs text-slate-400 border border-slate-700">อนาคต</span>
                                    <div className="w-full max-w-[280px] aspect-[2/3] bg-slate-900/40 border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center p-4">
                                        <Search className="text-purple-500 mb-2 animate-pulse" />
                                        <button onClick={() => setShowFutureDialog(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg transition-colors">
                                            Unlock Future
                                        </button>
                                    </div>
                                    <div className="text-center opacity-40">
                                        <h4 className="font-bold text-slate-500">???</h4>
                                        <div className="text-sm text-slate-600">(รอการปลดล็อค)</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Meanings Section */}
                <div className="w-full max-w-4xl mt-12 space-y-8 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
                    <h3 className="text-2xl font-serif text-center text-purple-300 mb-8">ความหมายโดยละเอียด</h3>
                    {selectedCards.map((card, idx) => {
                        let label = '';
                        if (readingType === 'celtic-cross') {
                            const labels = ['สถานการณ์ปัจจุบัน', 'อุปสรรค', 'เป้าหมาย/ความคิด', 'พื้นฐาน/จิตใต้สำนึก', 'อดีต', 'อนาคตอันใกล้', 'ทัศนคติ', 'อิทธิพลภายนอก', 'ความหวัง/ความกลัว', 'บทสรุป'];
                            label = `${idx + 1}. ${labels[idx]}`;
                        } else if (readingType === '1-card') {
                            label = idx === 0 ? 'ปัจจุบัน' : 'อนาคต';
                        } else {
                            label = idx === 0 ? 'อดีต' : idx === 1 ? 'ปัจจุบัน' : 'อนาคต';
                        }

                        return (
                            <div key={card.id} className="flex flex-col md:flex-row gap-6 border-b border-slate-800/50 pb-8 last:border-0 last:pb-0 items-center md:items-start group">
                                <div className="relative shrink-0 w-32 aspect-[2/3] group/glow">
                                    <div className="absolute inset-0 bg-yellow-500/10 blur-2xl group-hover/glow:bg-yellow-500/20 transition-all duration-700"></div>
                                    <div className="relative w-full h-full overflow-hidden shadow-xl z-10">
                                        <img src={card.img} alt={card.name} className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                                        <div className="shrink-0 w-6 h-6 rounded-none bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-300 border border-purple-500/20">
                                            {idx + 1}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-yellow-500 text-lg">{card.name}</span>
                                            <span className="text-sm text-slate-400">({card.nameThai})</span>
                                        </div>
                                        <button
                                            onClick={() => playDescription(card.id)}
                                            className={`shrink-0 p-1.5 rounded-full transition-all ${playingCardId === card.id ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                            title={playingCardId === card.id ? 'หยุดฟัง' : 'ฟังคำอธิบายไพ่'}
                                        >
                                            {playingCardId === card.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                        </button>
                                    </div>
                                    <p className="text-sm md:text-base text-slate-300 leading-relaxed text-center md:text-left">{getCardMeaning(card, topic)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 flex justify-center">
                    <button onClick={resetGame} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
                        กลับหน้าหลัก
                    </button>
                </div>

                <GoogleAdSlot className="mt-16" />

                <SaveMemoModal
                    isOpen={showSaveModal}
                    onClose={() => setShowSaveModal(false)}
                    cards={selectedCards}
                    readingType={readingType}
                    topic={topic}
                />

                <CardDetailModal
                    isOpen={!!selectedDetailCard}
                    onClose={closeDetailModal}
                    card={selectedDetailCard}
                    label={detailLabel}
                    topic={topic}
                />
            </div>
        </div>
    );
};
