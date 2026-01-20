import React from 'react';
import { Info, History, Sparkles, Brain, Zap, Heart, Search, Target, Compass, BookOpen, Star, Moon, Calendar } from 'lucide-react';

export const Footer = ({ gameState }) => {
    const getContent = () => {
        switch (gameState) {
            case 'SHUFFLING':
            case 'CUTTING':
                return [
                    { icon: <Brain />, title: "สมาธิ", text: "ตั้งจิตอธิษฐานถึงสิ่งที่ต้องการคำแนะนำก่อนเริ่ม" },
                    { icon: <Zap />, title: "พลังงาน", text: "ให้พลังงานของคุณถ่ายทอดผ่านการสับไพ่ในครั้งนี้" },
                    { icon: <Sparkles />, title: "ความเชื่อ", text: "เชื่อมั่นในคำตอบที่กำลังจะปรากฏแก่สายตาคุณ" }
                ];
            case 'PICKING':
                return [
                    { icon: <Search />, title: "การเลือก", text: "ใช้มือข้างที่รู้สึกดึงดูดใจมากที่สุดในการเลือกไพ่" },
                    { icon: <Target />, title: "แรงดึงดูด", text: "เลือกไพ่ที่รู้สึกสะดุดตาหรือรู้สึกถึงแรงสั่นสะเทือน" },
                    { icon: <Compass />, title: "ความสงบ", text: "หายใจเข้าลึกๆ ก่อนตัดสินใจเลือกใบสุดท้าย" }
                ];
            case 'RESULT':
                return [
                    { icon: <BookOpen />, title: "การตีความ", text: "คำแปลเป็นเพียงแนวทาง ความหมายที่แท้จริงอยู่ที่ใจคุณ" },
                    { icon: <Heart />, title: "การปรับใช้", text: "นำคำแนะนำไปปรับใช้ในทางบวกและพัฒนาตัวเอง" },
                    { icon: <Star />, title: "ความหวัง", text: "ทุกปัญหามีทางออก และทุกคำถามมีคำตอบรออยู่" }
                ];
            case 'CALENDAR':
                return [
                    { icon: <Moon />, title: "ดวงจันทร์", text: "ข้างขึ้นข้างแรมมีอิทธิพลต่ออารมณ์และจิตวิญญาณ" },
                    { icon: <Calendar />, title: "วันสำคัญ", text: "ใช้เวลาในวันพระเพื่อสงบจิตใจและเจริญภาวนา" },
                    { icon: <Compass />, title: "สมดุล", text: "ใช้ชีวิตให้สอดคล้องกับธรรมชาติเพื่อสร้างความสมดุล" }
                ];
            default: // MENU
                return [
                    { icon: <Info />, title: "วิธีใช้งาน", text: "เลือกหัวข้อที่ต้องการ และเลือกไพ่ด้วยสัญชาตญาณ" },
                    { icon: <History />, title: "พลังดวงจันทร์", text: "สัญลักษณ์ของสัญชาตญาณและการเติบโตที่งดงาม" },
                    { icon: <Sparkles />, title: "คำแนะนำ", text: "ใช้สติรับคำทำนาย และให้ไพ่เป็นเพียงกระจกสะท้อนใจ" }
                ];
        }
    };

    const content = getContent();

    return (
        <footer className="mt-16 sm:mt-20 border-t border-slate-800/50 py-8 sm:py-10 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {content.map((item, idx) => (
                    <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                        <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start text-purple-200">
                            {React.cloneElement(item.icon, { size: 18, className: "text-purple-500" })}
                            {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest font-sans">
                &copy; {new Date().getFullYear()} Tarot Oracle • Crafted for Your Inner Peace
            </div>
        </footer>
    );
};
