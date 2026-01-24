import React from 'react';
import { X, Shield, Eye, Database, Lock, UserCheck, Mail } from 'lucide-react';

export const PrivacyModal = ({ isOpen, onClose, isDark }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            <div className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-700 bg-inherit">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="text-purple-500" size={24} />
                        นโยบายความเป็นส่วนตัว
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
                    {/* Intro */}
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                        <p className="text-purple-300">
                            เว็บไซต์ "ศาสตร์ดวงดาว ออนไลน์" ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน
                            นโยบายนี้อธิบายว่าเราเก็บ ใช้ และปกป้องข้อมูลของท่านอย่างไร
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Database className="text-purple-500" size={18} />
                            1. ข้อมูลที่เราเก็บรวบรวม
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li><strong className="text-slate-300">ข้อมูลบัญชี:</strong> อีเมล, ชื่อ (จาก Google Sign-in)</li>
                            <li><strong className="text-slate-300">ประวัติการใช้งาน:</strong> ประวัติการทำนาย, การเติมเครดิต</li>
                            <li><strong className="text-slate-300">ข้อมูลการชำระเงิน:</strong> หลักฐานการโอนเงิน (ถ้ามี)</li>
                            <li><strong className="text-slate-300">ข้อมูลอุปกรณ์:</strong> IP Address, ประเภทเบราว์เซอร์ (สำหรับการปรับปรุงบริการ)</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Eye className="text-purple-500" size={18} />
                            2. วัตถุประสงค์ในการใช้ข้อมูล
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>ให้บริการดูดวงและจัดการบัญชีผู้ใช้</li>
                            <li>บันทึกประวัติการทำนายเพื่อให้ผู้ใช้เข้าถึงได้</li>
                            <li>ประมวลผลการเติมเครดิตและธุรกรรม</li>
                            <li>ปรับปรุงและพัฒนาบริการ</li>
                            <li>ติดต่อสื่อสารเกี่ยวกับบริการ (ถ้าจำเป็น)</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Lock className="text-purple-500" size={18} />
                            3. การปกป้องข้อมูล
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>ข้อมูลถูกเก็บในฐานข้อมูลที่มีความปลอดภัยสูง (Supabase)</li>
                            <li>การเชื่อมต่อทั้งหมดเข้ารหัสด้วย SSL/TLS</li>
                            <li>ไม่เก็บรหัสผ่านโดยตรง ใช้ระบบ OAuth ผ่าน Google</li>
                            <li>เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงข้อมูลได้</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <UserCheck className="text-purple-500" size={18} />
                            4. สิทธิ์ของผู้ใช้
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li><strong className="text-slate-300">เข้าถึง:</strong> ดูข้อมูลส่วนตัวและประวัติของท่าน</li>
                            <li><strong className="text-slate-300">แก้ไข:</strong> ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
                            <li><strong className="text-slate-300">ลบ:</strong> ขอลบบัญชีและข้อมูลทั้งหมด</li>
                            <li><strong className="text-slate-300">ปฏิเสธ:</strong> ปฏิเสธการรับข่าวสารและโฆษณา</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2">5. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h3>
                        <p className="text-slate-400 mb-2">เราจะ <strong className="text-red-400">ไม่</strong> ขาย แลกเปลี่ยน หรือเปิดเผยข้อมูลส่วนตัวของท่านแก่บุคคลที่สาม ยกเว้น:</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>เมื่อได้รับความยินยอมจากท่าน</li>
                            <li>เมื่อกฎหมายกำหนด</li>
                            <li>เพื่อปกป้องสิทธิ์และความปลอดภัยของเรา</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h3 className="font-bold text-lg mb-2">6. คุกกี้และการติดตาม</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li>เราใช้คุกกี้เพื่อรักษาสถานะการเข้าสู่ระบบ</li>
                            <li>Google Analytics อาจถูกใช้เพื่อวิเคราะห์การใช้งาน</li>
                            <li>Google Ads อาจแสดงโฆษณาตามความสนใจ</li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Mail className="text-purple-500" size={18} />
                            ติดต่อเรา
                        </h3>
                        <p className="text-slate-400">
                            หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อได้ที่:
                        </p>
                        <p className="text-purple-400 mt-1">support@saatduangdao.online</p>
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
