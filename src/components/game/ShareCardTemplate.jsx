import React, { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';

export const ShareCardTemplate = forwardRef(({ cards, topic, appName = "ศาสตร์ดวงดาว", ...props }, ref) => {
    // Handle both single 'card' prop (legacy) and 'cards' array
    const displayCards = cards || (props.card ? [props.card] : []);

    if (!displayCards || displayCards.length === 0) return null;

    const isSingle = displayCards.length === 1;

    return (
        <div
            ref={ref}
            className="relative bg-slate-950 text-white overflow-hidden flex flex-col items-center p-8 font-sans"
            style={{
                zIndex: -1,
                width: '1080px',
                height: '1920px',
                minWidth: '1080px',
                minHeight: '1920px'
            }}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-900 to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center gap-6">

                {/* Header (Flex None) */}
                <div className="mt-4 text-center space-y-3 shrink-0">
                    <div className="inline-flex items-center justify-center gap-4 px-8 py-2 rounded-full border border-yellow-500/30 bg-slate-900">
                        <Sparkles size={20} className="text-yellow-400" />
                        <span className="text-xl font-bold tracking-[0.2em] text-yellow-100 uppercase">Daily Destiny</span>
                        <Sparkles size={20} className="text-yellow-400" />
                    </div>
                    {topic && (
                        <h2 className="text-3xl text-purple-200 font-serif opacity-80">
                            {topic === 'love' ? 'ความรัก' : topic === 'work' ? 'การงาน' : topic === 'money' ? 'การเงิน' : topic === 'monthly' ? 'ดวงรายเดือน' : 'ดวงชะตา'}
                        </h2>
                    )}
                </div>

                {/* Main Content Area (Flex 1) */}
                <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0">

                    {isSingle ? (
                        // SINGLE CARD LAYOUT
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative w-[700px] aspect-[2/3] max-h-[850px] rounded-3xl overflow-hidden border-4 border-yellow-500/20 shrink-0 shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                <img
                                    src={displayCards[0].img}
                                    alt={displayCards[0].name}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />

                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-center pt-32">
                                    <h1 className="text-5xl font-bold text-yellow-400 font-serif mb-2">
                                        {displayCards[0].name}
                                    </h1>
                                    <p className="text-2xl text-white/90 font-light tracking-wide">
                                        {displayCards[0].nameThai}
                                    </p>
                                </div>
                            </div>

                            {/* Prediction Box */}
                            <div className="w-[850px] bg-slate-950/95 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden shrink-0">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                                <p className="text-2xl text-purple-100 leading-relaxed font-light line-clamp-4">
                                    "{displayCards[0].description}"
                                </p>
                            </div>
                        </div>
                    ) : (
                        // MULTI CARD LAYOUT
                        <div className="flex flex-col gap-5 w-full max-w-[900px]">
                            {/* Limit to 3 cards */}
                            {displayCards.slice(0, 3).map((card, idx) => (
                                <div key={idx} className="flex items-center gap-6 bg-slate-950/90 p-4 rounded-2xl border border-white/10 shadow-lg">
                                    {/* Thumbnail */}
                                    <div className="w-[160px] aspect-[2/3] rounded-lg overflow-hidden border border-yellow-500/20 shrink-0 relative">
                                        <img
                                            src={card.img}
                                            alt={card.name}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1 opacity-70">
                                            {idx === 0 ? 'CARD #1' : idx === 1 ? 'CARD #2' : 'CARD #3'}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-0.5 font-serif truncate">{card.name}</h3>
                                        <p className="text-lg text-purple-200 mb-2 truncate">{card.nameThai}</p>
                                        <p className="text-base text-slate-300 font-light line-clamp-2 leading-snug">
                                            "{card.description}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {displayCards.length > 3 && (
                                <div className="text-center text-slate-400 text-lg italic">
                                    + {displayCards.length - 3} more cards...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer (Flex None) */}
                <div className="mb-4 text-center opacity-60 shrink-0">
                    <p className="text-lg font-bold tracking-[0.2em] uppercase">{appName}</p>
                    <p className="text-xs mt-1">https://my-tarot-app.vercel.app/</p>
                </div>
            </div>
        </div>
    );
});
