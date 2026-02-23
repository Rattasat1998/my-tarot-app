import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const AgeVerificationModal = ({ isOpen, onAccept, onDecline }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-2xl shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 pointer-events-none"></div>

                {/* Content */}
                <div className="relative p-6 text-center">
                    {/* Logo */}
                    <img
                        src="/favicon.png"
                        alt="Logo"
                        className="w-20 h-20 mx-auto mb-4 rounded-xl drop-shadow-lg"
                    />

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Tarot Wisdom ออนไลน์
                    </h2>

                    <p className="text-slate-400 text-sm mb-6">
                        บริการค้นหาคำแนะนำเพื่อความบันเทิงและพัฒนาตนเอง
                    </p>

                    {/* Age Warning */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                        <div className="flex items-start gap-3 text-left">
                            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                            <div>
                                <h3 className="font-bold text-amber-400 mb-1">ข้อจำกัดอายุ</h3>
                                <p className="text-sm text-slate-300">
                                    เว็บไซต์นี้ให้บริการสำหรับผู้ที่มีอายุ <strong className="text-white">18 ปีขึ้นไป</strong> เท่านั้น
                                    โดยเป็นบริการเพื่อความบันเทิง ไม่ใช่คำแนะนำทางการแพทย์หรือกฎหมาย
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                        การกดยอมรับแสดงว่าท่านยืนยันว่ามีอายุ 18 ปีขึ้นไป
                        และยอมรับ <span className="text-purple-400">ข้อกำหนดการใช้งาน</span> และ <span className="text-purple-400">นโยบายความเป็นส่วนตัว</span> ของเรา
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onAccept}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-500/20"
                        >
                            <CheckCircle size={20} />
                            ฉันมีอายุ 18 ปีขึ้นไป
                        </button>
                        <button
                            onClick={onDecline}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-slate-400 font-medium hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                            <XCircle size={20} />
                            ออกจากเว็บไซต์
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
