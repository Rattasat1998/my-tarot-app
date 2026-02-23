import React from 'react';
import { X, Star, Heart, Briefcase, Coins, Activity, Sparkles, Calendar } from 'lucide-react';
import { ELEMENTS } from '../../data/zodiacData';

const StarRating = ({ score, maxScore = 5 }) => {
    return (
        <div className="flex gap-0.5">
            {[...Array(maxScore)].map((_, i) => (
                <Star
                    key={i}
                    size={14}
                    className={i < score ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                />
            ))}
        </div>
    );
};

const FortuneCategory = ({ icon: Icon, title, text, score, colorClass }) => {
    return (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon size={16} />
                    </div>
                    <span className="font-medium text-white">{title}</span>
                </div>
                <StarRating score={score} />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
        </div>
    );
};

export const ZodiacFortune = ({ fortune, onClose }) => {
    if (!fortune) return null;

    const { zodiac, date, overall, love, work, money, health, advice, luckyNumber } = fortune;
    const element = ELEMENTS[zodiac.element];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className={`sticky top-0 z-10 bg-gradient-to-br ${zodiac.elementColor} p-6 rounded-t-2xl`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-5xl">{zodiac.symbol}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {zodiac.emoji} {zodiac.nameTh}
                                <span className="text-lg font-normal opacity-80">({zodiac.nameEn})</span>
                            </h2>
                            <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                                <Calendar size={14} />
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Element & Planet */}
                    <div className="flex gap-3 mt-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                            {element.icon} ธาตุ{zodiac.element}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                            ☆ {zodiac.rulingPlanet}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Overall */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-purple-400" size={20} />
                                <span className="font-bold text-lg text-white">ค้นหาแนะนำ/วิเคราะห์โดยรวม</span>
                            </div>
                            <StarRating score={overall.score} />
                        </div>
                        <p className="text-purple-200 leading-relaxed">{overall.text}</p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FortuneCategory
                            icon={Heart}
                            title="ความรัก"
                            text={love.text}
                            score={love.score}
                            colorClass="bg-pink-500/20 text-pink-400"
                        />
                        <FortuneCategory
                            icon={Briefcase}
                            title="การงาน"
                            text={work.text}
                            score={work.score}
                            colorClass="bg-blue-500/20 text-blue-400"
                        />
                        <FortuneCategory
                            icon={Coins}
                            title="การเงิน"
                            text={money.text}
                            score={money.score}
                            colorClass="bg-amber-500/20 text-amber-400"
                        />
                        <FortuneCategory
                            icon={Activity}
                            title="สุขภาพ"
                            text={health.text}
                            score={health.score}
                            colorClass="bg-green-500/20 text-green-400"
                        />
                    </div>

                    {/* Lucky Info */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex-1 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                            <p className="text-xs text-amber-400 mb-1">เลขนำโชค</p>
                            <p className="text-2xl font-bold text-amber-300">{luckyNumber}</p>
                        </div>
                        <div className="flex-1 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                            <p className="text-xs text-emerald-400 mb-1">สีมงคล</p>
                            <p className="text-lg font-bold text-emerald-300">{zodiac.luckyColor}</p>
                        </div>
                        <div className="flex-1 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
                            <p className="text-xs text-violet-400 mb-1">วันมงคล</p>
                            <p className="text-lg font-bold text-violet-300">{zodiac.luckyDay}</p>
                        </div>
                    </div>

                    {/* Advice */}
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                        <p className="text-sm text-slate-400 mb-1">💡 คำแนะนำประจำวัน</p>
                        <p className="text-slate-200 font-medium">{advice}</p>
                    </div>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2">
                        {zodiac.traits.map((trait, idx) => (
                            <span
                                key={idx}
                                className={`px-3 py-1 rounded-full text-sm ${element.bg} ${element.color} ${element.border} border`}
                            >
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-500">
                        บริการค้นหาแนะนำเพื่อความบันเทิงและพัฒนาตนเอง โปรดใช้วิจารณญาณ ✨
                    </p>
                </div>
            </div>
        </div>
    );
};
