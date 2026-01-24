import React from 'react';
import { X, FileText, AlertTriangle, Shield, CreditCard, RefreshCw } from 'lucide-react';

export const TermsModal = ({ isOpen, onClose, isDark }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            <div className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-700 bg-inherit">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="text-purple-500" size={24} />
                        ข้อกำหนดการใช้งาน
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 text-sm leading-relaxed">
                    {/* Disclaimer Banner */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-bold text-amber-500 mb-1">⚠️ ข้อจำกัดความรับผิดชอบ (Disclaimer)</h3>
                                <p className="text-slate-300">
                                    บริการดูดวงบนเว็บไซต์นี้เป็นเพียง <strong className="text-amber-400">ความบันเทิง (Entertainment)</strong> เท่านั้น
                                    ผลทำนายทั้งหมดไม่ใช่ข้อเท็จจริงและไม่ควรนำไปใช้ในการตัดสินใจสำคัญในชีวิต
                                    ผู้ใช้ควรใช้วิจารณญาณและความรับผิดชอบของตนเอง
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 1 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Shield className="text-purple-500" size={18} />
                            1. ข้อกำหนดทั่วไป
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>เว็บไซต์ "ศาสตร์ดวงดาว ออนไลน์" ให้บริการดูดวงเพื่อความบันเทิงเท่านั้น</li>
                            <li>ผลการทำนายเป็นเพียงคำแนะนำและความบันเทิง ไม่ใช่ข้อเท็จจริงหรือคำยืนยัน</li>
                            <li>ผู้ใช้ต้องมีอายุ 18 ปีขึ้นไป หรือได้รับอนุญาตจากผู้ปกครอง</li>
                            <li>ห้ามใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมาย</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <CreditCard className="text-purple-500" size={18} />
                            2. ระบบเครดิตและการชำระเงิน
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>เครดิตที่ซื้อแล้วไม่สามารถคืนเงินได้</li>
                            <li>เครดิตไม่มีวันหมดอายุ</li>
                            <li>ราคาเครดิตอาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งล่วงหน้า</li>
                            <li>การเติมเงินผ่านการโอนเงินจะได้รับเครดิตภายใน 24 ชั่วโมง</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <RefreshCw className="text-purple-500" size={18} />
                            3. การยกเลิกและเปลี่ยนแปลง
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>ผู้ให้บริการสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดโดยไม่ต้องแจ้งล่วงหน้า</li>
                            <li>ผู้ให้บริการสามารถระงับหรือยกเลิกบัญชีผู้ใช้ที่ละเมิดข้อกำหนด</li>
                            <li>ในกรณีที่ระบบขัดข้อง เครดิตที่ถูกหักจะได้รับคืนภายใน 48 ชั่วโมง</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2">4. ความเป็นส่วนตัว</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>เราเก็บข้อมูลเฉพาะที่จำเป็นสำหรับการให้บริการ</li>
                            <li>ข้อมูลส่วนตัวจะไม่ถูกขายหรือเปิดเผยให้บุคคลที่สาม</li>
                            <li>ประวัติการทำนายจะถูกเก็บไว้เพื่อให้ผู้ใช้เข้าถึงได้</li>
                        </ul>
                    </section>

                    {/* Final Note */}
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
                        <p className="text-purple-300">
                            การใช้งานเว็บไซต์นี้ถือว่าท่านยอมรับข้อกำหนดทั้งหมดข้างต้น
                        </p>
                    </div>

                    {/* Last Updated */}
                    <p className="text-center text-xs text-slate-500">
                        อัปเดตล่าสุด: มกราคม 2569
                    </p>
                </div>
            </div>
        </div>
    );
};
