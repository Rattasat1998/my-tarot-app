import React from 'react';
import { Sparkles, RefreshCw, Search } from 'lucide-react';
import { READING_TOPICS } from '../../constants/readingTopics';
import { GoogleAdSlot } from '../ui/GoogleAdSlot';

export const ResultState = ({
    topic,
    readingType,
    selectedCards,
    resetGame,
    isDrawingFuture,
    setShowFutureDialog
}) => {
    // ---------------------------------------------------------
    // MONTHLY VIEW
    // ---------------------------------------------------------
    if (topic === 'monthly') {
        return (
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-serif text-yellow-500 mb-2">คำทำนายรายเดือน</h2>
                    <p className="text-slate-400 text-sm">ภาพรวมตลอดเดือนของคุณ</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-12">
                    {selectedCards.map((card, idx) => (
                        <div key={card.id} className="flex flex-col items-center gap-2 animate-in zoom-in duration-500 group/card" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="relative w-full aspect-[2/3] group-hover/card:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-yellow-500/5 blur-xl group-hover/card:bg-yellow-500/10 transition-all"></div>
                                <div className="relative w-full h-full overflow-hidden shadow-lg shadow-purple-900/40 z-10">
                                    <img src={card.img} alt={card.name} className="w-full h-full object-contain" />
                                </div>
                            </div>
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
                                    </div>
                                    <p className="text-sm md:text-base text-slate-300 leading-relaxed text-center md:text-left">{card.description}</p>
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
    // STANDARD / MULTI-CARD VIEW
    // ---------------------------------------------------------
    return (
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
            {readingType === '1-card' && !isDrawingFuture && selectedCards.length === 1 ? (
                <div className="w-full flex flex-col items-center">
                    <div className="mb-8 text-center">
                        <span className="px-4 py-1 border border-green-500/30 bg-green-500/10 text-green-300 text-sm tracking-wider uppercase">
                            ปัจจุบัน / สถานการณ์ (พื้นฐาน)
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[100px] -z-10 pointer-events-none"></div>

                        <div className="relative w-72 h-[432px] sm:w-[300px] sm:h-[540px] preserve-3d animate-in zoom-in duration-700">
                            <div className="absolute inset-0 bg-slate-950 overflow-hidden shadow-2xl shadow-purple-900/50">
                                <img src={selectedCards[0].img} alt={selectedCards[0].name} className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                        <div className="flex-1 max-w-xl w-full">
                            <div className="bg-slate-900/40 p-6 md:p-8 border border-slate-800 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold flex flex-wrap items-center gap-2 text-yellow-500">
                                        <Sparkles className="text-yellow-500" />
                                        <span>{selectedCards[0].name}</span>
                                        <span className="text-lg text-yellow-200/80 font-normal">({selectedCards[0].nameThai})</span>
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-lg pb-4 border-b border-slate-800">
                                        <span className="font-bold text-yellow-100">ความหมายปัจจุบัน:</span> {selectedCards[0].description}
                                    </p>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                                    <div className="relative p-6 bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-4">
                                        <div className="text-center space-y-2">
                                            <h4 className="text-lg font-bold text-purple-300 uppercase tracking-widest">อนาคต / บทสรุป</h4>
                                            <p className="text-sm text-slate-500">คำทำนายในอนาคตถูกล็อคไว้...</p>
                                        </div>
                                        <div className="w-full h-12 bg-slate-900/50 overflow-hidden blur-md select-none pointer-events-none">
                                            การเปลี่ยนแปลงที่น่ายินดีกำลังจะเกิดขึ้นในชีวิตของคุณในเร็วๆ นี้
                                        </div>
                                        <button onClick={() => setShowFutureDialog(true)} className="mt-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95 flex items-center gap-2 rounded-none">
                                            <RefreshCw size={18} /> สุ่มเพิ่มเพื่อดูอนาคต
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-center md:justify-start">
                                <button onClick={resetGame} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-none font-medium transition-all">
                                    กลับหน้าหลัก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-serif text-yellow-500 mb-2">
                            คำทำนาย{READING_TOPICS.find(t => t.id === topic)?.label}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {(isDrawingFuture || selectedCards.length === 3)
                                ? 'การทำนายสมบูรณ์ (อดีต - ปัจจุบัน - อนาคต)'
                                : `การทำนายแบบ ${readingType === '1-card' ? '1 ใบ' : '2 ใบ'} (${readingType === '1-card' ? 'ปัจจุบัน' : 'อดีต และ ปัจจุบัน'})`}
                        </p>
                    </div>

                    <div className={`grid grid-cols-1 ${(isDrawingFuture || selectedCards.length === 3) ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-8 md:gap-12 w-full mb-16 relative justify-items-center`}>
                        {selectedCards.map((card, idx) => {
                            let label = '';
                            let badgeClass = '';
                            const isThreeColumn = isDrawingFuture || selectedCards.length === 3;
                            const sizeClass = isThreeColumn ? 'max-w-[280px]' : 'max-w-[320px]';

                            if (readingType === '1-card') {
                                // 1-card flow: Present -> Future
                                label = idx === 0 ? 'ปัจจุบัน / สถานการณ์' : 'อนาคต / บทสรุป';
                                badgeClass = idx === 0 ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-purple-500/30 bg-purple-500/10 text-purple-300';
                            } else {
                                // 2-card flow: Past -> Present -> (Future)
                                label = idx === 0 ? 'อดีต / พื้นฐาน' : idx === 1 ? 'ปัจจุบัน / สถานการณ์' : 'อนาคต / บทสรุป';
                                badgeClass = idx === 0 ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' :
                                    idx === 1 ? 'border-green-500/30 bg-green-500/10 text-green-300' :
                                        'border-purple-500/30 bg-purple-500/10 text-purple-300';
                            }

                            return (
                                <div key={card.id} className="flex flex-col items-center gap-6 animate-in zoom-in duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                                    <div className="text-center">
                                        <span className={`px-4 py-1 border text-xs uppercase tracking-widest ${badgeClass}`}>
                                            {label}
                                        </span>
                                    </div>
                                    <div className={`relative w-full ${sizeClass} aspect-[2/3] group/card`}>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/10 blur-[80px] group-hover/card:bg-yellow-500/20 transition-all pointer-events-none"></div>
                                        <div className="relative w-full h-full overflow-hidden shadow-2xl shadow-purple-900/40 z-10">
                                            <img src={card.img} alt={card.name} className="w-full h-full object-contain bg-slate-950" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-bold text-yellow-500 text-lg">{card.name}</h4>
                                        <div className="text-sm text-slate-400">({card.nameThai})</div>
                                    </div>
                                </div>
                            );
                        })}

                        {!isDrawingFuture && selectedCards.length < (readingType === '1-card' ? 2 : 3) && (
                            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-700" style={{ animationDelay: '400ms' }}>
                                <div className="text-center">
                                    <span className="px-4 py-1 border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs uppercase tracking-widest">
                                        อนาคต / บทสรุป
                                    </span>
                                </div>
                                <div className={`relative w-full ${(isDrawingFuture || selectedCards.length === 3) ? 'max-w-[280px]' : 'max-w-[320px]'} aspect-[2/3] overflow-hidden shadow-2xl bg-slate-900/40 border border-slate-800 border-dashed flex items-center justify-center group/locked`}>
                                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 text-center">
                                        <Search className="text-purple-500 mb-2 animate-pulse" size={32} />
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Locked Future</div>
                                        <button onClick={() => setShowFutureDialog(true)} className="text-[10px] px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-none transition-all shadow-lg active:scale-95">
                                            Unlock Future
                                        </button>
                                    </div>
                                    <div className="w-full h-full opacity-20 filter grayscale">
                                        <img src={selectedCards[0].img} alt="Locked Future" className="w-full h-full object-contain blur-sm" />
                                    </div>
                                </div>
                                <div className="text-center opacity-40">
                                    <h4 className="font-bold text-slate-500">???</h4>
                                    <div className="text-sm text-slate-600">(รอการปลดล็อค)</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-4xl space-y-6 bg-slate-900/30 p-6 md:p-8">
                        <h3 className="text-xl font-serif text-center mb-8 text-purple-300">ความหมายโดยละเอียด</h3>
                        {selectedCards.map((card, idx) => {
                            let label = '';
                            let iconColor = '';
                            if (readingType === '1-card') {
                                label = idx === 0 ? 'ปัจจุบัน / สถานการณ์' : 'อนาคต / บทสรุป';
                                iconColor = idx === 0 ? 'bg-green-600' : 'bg-purple-600';
                            } else {
                                label = idx === 0 ? 'อดีต / พื้นฐาน' : idx === 1 ? 'ปัจจุบัน / สถานการณ์' : 'อนาคต / บทสรุป';
                                iconColor = idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-green-600' : 'bg-purple-600';
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
                                            <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold text-white border border-white/20 ${iconColor}`}>
                                                {idx + 1}
                                            </div>
                                            <span className="font-bold text-lg text-yellow-200">
                                                {label}
                                            </span>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <span className="font-bold text-yellow-500 text-lg block md:inline">{card.name} ({card.nameThai}):</span>
                                            <p className="block md:inline text-slate-300 leading-relaxed md:ml-2">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {!isDrawingFuture && selectedCards.length < (readingType === '1-card' ? 2 : 3) && (
                            <div className="border-t border-slate-800/50 pt-8 mt-4 opacity-60">
                                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                                    <div className="w-6 h-6 bg-purple-900/30 flex items-center justify-center text-[10px] font-bold text-purple-300 border border-purple-500/20">
                                        {selectedCards.length + 1}
                                    </div>
                                    <span className="font-bold text-lg text-purple-400/80 italic">
                                        อนาคต / บทสรุป (Locked)
                                    </span>
                                </div>
                                <p className="text-slate-500 italic text-sm text-center md:text-left">
                                    จิตวิญญานของคุณยังคงเตรียมพร้อมสำหรับบทสรุปในอนาคต พลังงานในปัจจุบันจะส่งผลถึงสิ่งที่กำลังจะมาถึง...
                                </p>
                            </div>
                        )}
                        <div className="mt-8 p-4 bg-slate-800/40 text-center">
                            <p className="text-sm text-slate-400">* คำแจ้งเตือนเป็นเพียงแนวทาง การพิจารณาและตัดสินใจอยู่ที่ตัวคุณเอง</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <button onClick={resetGame} className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/20 rounded-none">
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            )}
            <GoogleAdSlot className="mt-16" />
        </div>
    );
};
