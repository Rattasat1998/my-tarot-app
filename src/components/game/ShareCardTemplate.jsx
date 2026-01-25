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
            className="fixed left-[-9999px] top-0 w-[1080px] h-[1920px] bg-slate-950 text-white overflow-hidden flex flex-col items-center justify-between p-16 font-sans"
            style={{ zIndex: -1 }}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-900 to-black"></div>

                {/* Stars/Dust Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>

                {/* Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center">

                {/* Header */}
                <div className="mt-12 text-center space-y-4 shrink-0">
                    <div className="inline-flex items-center justify-center gap-4 px-8 py-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md">
                        <Sparkles size={20} className="text-yellow-400" />
                        <span className="text-2xl font-bold tracking-[0.2em] text-yellow-100 uppercase">Daily Destiny</span>
                        <Sparkles size={20} className="text-yellow-400" />
                    </div>
                    {topic && (
                        <h2 className="text-4xl text-purple-200 font-serif opacity-80 mt-4">
                            {topic === 'love' ? 'ความรัก' : topic === 'work' ? 'การงาน' : topic === 'money' ? 'การเงิน' : topic === 'monthly' ? 'ดวงรายเดือน' : 'ดวงชะตา'}
                        </h2>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full my-8">

                    {isSingle ? (
                        // SINGLE CARD LAYOUT
                        <div className="relative w-[800px] aspect-[2/3] max-h-[1000px] shadow-2xl shadow-purple-900/50 rounded-3xl overflow-hidden border-4 border-yellow-500/20">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                            <img
                                src={displayCards[0].img}
                                alt={displayCards[0].name}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 text-center bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
                                <h1 className="text-6xl font-bold text-yellow-400 font-serif drop-shadow-lg mb-4">
                                    {displayCards[0].name}
                                </h1>
                                <p className="text-3xl text-white/90 font-light tracking-wide">
                                    {displayCards[0].nameThai}
                                </p>
                            </div>
                        </div>
                    ) : (
                        // MULTI CARD LAYOUT (Vertical Stack)
                        <div className="flex flex-col gap-6 w-full max-w-[850px]">
                            {/* We limit to top 3 cards to fit nicely */}
                            {displayCards.slice(0, 3).map((card, idx) => (
                                <div key={idx} className="flex items-center gap-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg">
                                    {/* Card Image Thumbnail */}
                                    <div className="w-[200px] aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-yellow-500/20 shrink-0 relative">
                                        <img
                                            src={card.img}
                                            alt={card.name}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 text-left">
                                        <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-1 opacity-70">
                                            {idx === 0 ? 'CARD #1' : idx === 1 ? 'CARD #2' : 'CARD #3'}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-1 font-serif">{card.name}</h3>
                                        <p className="text-xl text-purple-200 mb-3">{card.nameThai}</p>
                                        <p className="text-lg text-slate-300 font-light line-clamp-3 leading-relaxed">
                                            "{card.description}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {displayCards.length > 3 && (
                                <div className="text-center text-slate-400 text-xl italic mt-2">
                                    + {displayCards.length - 3} more cards...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Prediction / Keywords (Only for Single Card Mode) */}
                {isSingle && (
                    <div className="w-full max-w-[900px] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center mb-16 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                        <p className="text-3xl text-purple-100 leading-relaxed font-light">
                            "{displayCards[0].description}"
                        </p>
                    </div>
                )}

                {!isSingle && <div className="mb-8"></div>}

                {/* Footer */}
                <div className="mb-12 text-center opacity-60 shrink-0">
                    <p className="text-xl font-bold tracking-[0.2em] uppercase">{appName}</p>
                    <p className="text-sm mt-2">https://my-tarot-app.vercel.app/</p>
                </div>
            </div>
        </div>
    );
});
