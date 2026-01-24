import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "คุณแอน",
        avatar: "🌸",
        rating: 5,
        text: "แม่นมากค่ะ! ดูเรื่องความรักแล้วตรงกับสถานการณ์เป๊ะเลย ใช้ทุกวันเลยค่ะตอนนี้",
        topic: "ความรัก",
        date: "2 วันก่อน"
    },
    {
        id: 2,
        name: "คุณเจมส์",
        avatar: "⭐",
        rating: 5,
        text: "เพิ่งลองใช้ครั้งแรก ไพ่ที่ได้มาทำให้คิดได้หลายอย่าง แนะนำเลยครับ!",
        topic: "การงาน",
        date: "3 วันก่อน"
    },
    {
        id: 3,
        name: "คุณมิ้นท์",
        avatar: "🌙",
        rating: 5,
        text: "ชอบมากค่ะ UI สวย ใช้ง่าย แถมผลทำนายก็ตรงกับชีวิตจริงมาก กลับมาดูบ่อยเลย",
        topic: "ดวงรายวัน",
        date: "5 วันก่อน"
    },
    {
        id: 4,
        name: "คุณบอส",
        avatar: "🔮",
        rating: 5,
        text: "ดูดวงการเงินก่อนลงทุน ไพ่บอกให้ระวัง ผมเลยชะลอไว้ก่อน โชคดีมากครับที่ฟัง!",
        topic: "การเงิน",
        date: "1 สัปดาห์ก่อน"
    },
    {
        id: 5,
        name: "คุณเฟิร์น",
        avatar: "🌿",
        rating: 5,
        text: "เสียงอ่านให้ฟังดีมากเลยค่ะ รู้สึกเหมือนมีคนดูให้จริงๆ ขอบคุณมากนะคะ",
        topic: "ดวงรายเดือน",
        date: "1 สัปดาห์ก่อน"
    },
    {
        id: 6,
        name: "คุณต้น",
        avatar: "🌳",
        rating: 5,
        text: "ใช้มาหลายเดือนแล้ว ความแม่นยำอยู่ที่ 80% ได้เลย เป็นเว็บดูดวงที่ดีที่สุดที่เคยใช้มา",
        topic: "สุขภาพ",
        date: "2 สัปดาห์ก่อน"
    }
];

export const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay]);

    const goToPrev = () => {
        setIsAutoPlay(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToNext = () => {
        setIsAutoPlay(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                    <MessageCircle size={14} className="text-purple-400" />
                    <span className="text-purple-300 text-xs uppercase tracking-widest">รีวิวจากผู้ใช้จริง</span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">เสียงจากผู้ใช้งาน</h3>
                <p className="text-slate-400 text-sm">ความประทับใจจากผู้ที่ได้ลองใช้บริการ</p>
            </div>

            {/* Testimonial Card */}
            <div className="relative">
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-8 border border-slate-800/50 backdrop-blur-sm">
                    {/* Quote Icon */}
                    <Quote className="absolute top-6 left-6 text-purple-500/20" size={48} />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        {/* Avatar */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                            {currentTestimonial.avatar}
                        </div>

                        {/* Rating */}
                        <div className="flex justify-center gap-1 mb-4">
                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>

                        {/* Text */}
                        <p className="text-lg text-slate-200 leading-relaxed mb-6 italic">
                            "{currentTestimonial.text}"
                        </p>

                        {/* Author */}
                        <div className="space-y-1">
                            <p className="font-bold text-white">{currentTestimonial.name}</p>
                            <div className="flex items-center justify-center gap-2 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                    {currentTestimonial.topic}
                                </span>
                                <span className="text-slate-500">{currentTestimonial.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={goToPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500 transition-all"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setIsAutoPlay(false);
                            setCurrentIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                ? 'w-6 bg-purple-500'
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                    />
                ))}
            </div>

            {/* Total Reviews */}
            <div className="text-center mt-6">
                <p className="text-xs text-slate-500">
                    ⭐ จากผู้ใช้งานกว่า 1,000+ คน • ความพึงพอใจ 98%
                </p>
            </div>
        </div>
    );
};
