import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageTitle';

const FAQ_DATA = [
    {
        category: 'การใช้งานทั่วไป',
        items: [
            {
                q: 'ศาสตร์ดวงดาวคืออะไร?',
                a: 'ศาสตร์ดวงดาวเป็นแพลตฟอร์มดูดวงไพ่ทาโรต์ออนไลน์ที่ครบวงจร ให้บริการดูดวงรายวัน รายเดือน ดูดวงความรัก การงาน การเงิน สุขภาพ สังคม และโชคลาภ โดยใช้ไพ่ทาโรต์ครบทั้ง 78 ใบ พร้อมคำทำนายเชิงลึก'
            },
            {
                q: 'ใช้งานฟรีหรือเปล่า?',
                a: 'ผู้ใช้ทุกคนจะได้รับสิทธิ์ดูดวงรายวันฟรี 1 ครั้งต่อวัน สำหรับหัวข้ออื่นๆ จะใช้ระบบเครดิต โดยสามารถเติมเครดิตได้ตามต้องการ นอกจากนี้ยังมีระบบเช็คอินรายวันเพื่อรับเครดิตฟรีอีกด้วย'
            },
            {
                q: 'ต้องสมัครสมาชิกก่อนไหม?',
                a: 'สามารถดูดวงได้โดยไม่ต้องสมัครสมาชิก แต่หากต้องการบันทึกประวัติการดูดวง เก็บเครดิต และใช้ฟีเจอร์พิเศษอื่นๆ แนะนำให้ลงชื่อเข้าใช้ผ่าน Google Account'
            },
            {
                q: 'รองรับมือถือไหม?',
                a: 'รองรับครับ! เว็บไซต์ถูกออกแบบมาให้ใช้งานได้สมบูรณ์ทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์ (Responsive Design)'
            }
        ]
    },
    {
        category: 'เกี่ยวกับไพ่ทาโรต์',
        items: [
            {
                q: 'ไพ่ทาโรต์คืออะไร?',
                a: 'ไพ่ทาโรต์เป็นชุดไพ่ 78 ใบ แบ่งเป็น Major Arcana 22 ใบ (ไพ่หลัก) และ Minor Arcana 56 ใบ (ไพ่รอง 4 ชุด) ใช้ในการทำนายและสะท้อนสถานการณ์ในชีวิต'
            },
            {
                q: 'ไพ่ทาโรต์ทำนายได้แม่นจริงไหม?',
                a: 'ไพ่ทาโรต์เป็นเครื่องมือสะท้อนตัวเองและให้แนวทาง ไม่ใช่การทำนายอนาคตตายตัว ผลทำนายเป็นเพียงคำแนะนำ ชีวิตจริงขึ้นอยู่กับการตัดสินใจและการกระทำของคุณเอง'
            },
            {
                q: 'ไพ่ Death น่ากลัวไหม?',
                a: 'ไม่น่ากลัวเลย! ไพ่ Death (ความตาย) หมายถึงการเปลี่ยนแปลง การจบบทเก่าเพื่อเริ่มบทใหม่ แทบไม่เคยหมายถึงความตายจริงๆ เป็นไพ่แห่งการเริ่มต้นใหม่ที่ดีกว่า'
            },
            {
                q: 'ไพ่กลับหัว (Reversed) คืออะไร?',
                a: 'เมื่อไพ่ปรากฏในลักษณะกลับหัว ความหมายจะเปลี่ยนไป อาจหมายถึงพลังงานที่ถูกปิดกั้น ความล่าช้า หรือเชิญชวนให้ทบทวนในเรื่องนั้นๆ ไม่ได้หมายถึงสิ่งตรงข้ามเสมอไป'
            }
        ]
    },
    {
        category: 'หัวข้อการดูดวง',
        items: [
            {
                q: 'มีหัวข้อดูดวงอะไรบ้าง?',
                a: 'มีหลากหลายหัวข้อ ได้แก่ ดวงรายวัน ดวงรายเดือน ความรัก การงาน การเงิน สุขภาพ สังคม และโชคลาภ แต่ละหัวข้อจะมีคำทำนายเฉพาะทางที่แตกต่างกัน'
            },
            {
                q: 'ดูดวงรายวันต่างจากรายเดือนอย่างไร?',
                a: 'ดวงรายวันใช้ไพ่ 1 ใบ เหมาะสำหรับดูพลังงานของวันนี้ ส่วนดวงรายเดือนใช้ไพ่ 10 ใบ ให้ภาพรวมที่ละเอียดกว่า ครอบคลุมหลายมิติของชีวิตในเดือนนั้น'
            },
            {
                q: 'ควรดูดวงบ่อยแค่ไหน?',
                a: 'แนะนำดูดวงรายวัน 1 ครั้งต่อวันเป็นประจำ เพื่อสร้างสติและเตรียมพร้อมรับพลังงานของวัน ส่วนหัวข้อเฉพาะอย่างความรักหรือการเงิน ควรดู 1-2 ครั้งต่อสัปดาห์ อย่าถามคำถามเดิมซ้ำๆ ในวันเดียวกัน'
            }
        ]
    },
    {
        category: 'เครดิตและการชำระเงิน',
        items: [
            {
                q: 'เครดิตคืออะไร?',
                a: 'เครดิตคือหน่วยที่ใช้สำหรับดูดวงแต่ละครั้ง การดูดวงแต่ละหัวข้อจะใช้เครดิตต่างกัน เช่น รายวัน 1 เครดิต ความรัก 5 เครดิต รายเดือน 10 เครดิต'
            },
            {
                q: 'ได้เครดิตฟรีอย่างไร?',
                a: 'ทุกวันจะได้ดูดวงรายวันฟรี 1 ครั้ง นอกจากนี้ระบบเช็คอินรายวันจะให้เครดิตฟรีตามจำนวนวันที่เช็คอินติดต่อกัน ยิ่ง Streak ยาว ยิ่งได้เครดิตมาก'
            },
            {
                q: 'เติมเครดิตอย่างไร?',
                a: 'กดที่ปุ่มเครดิตด้านบนขวาของหน้าจอ จะมีแพ็กเกจเครดิตให้เลือกซื้อ รองรับการชำระเงินผ่านหลายช่องทาง'
            }
        ]
    },
    {
        category: 'ฟีเจอร์อื่นๆ',
        items: [
            {
                q: 'มีปฏิทินอะไรบ้าง?',
                a: 'มีปฏิทินจันทรคติไทย ปฏิทินวันพระ ปฏิทินวันหยุดราชการ ปฏิทินฤกษ์ดี และปฏิทินปักขคณนา ช่วยวางแผนกิจกรรมตามฤกษ์และโอกาสสำคัญ'
            },
            {
                q: 'มีเรื่องราศีด้วยไหม?',
                a: 'มีครับ! สามารถดูดวง 12 ราศีได้ พร้อมคำทำนายเชิงลึกประจำปี นอกจากนี้ยังมีบทความเชื่อมโยงไพ่ทาโรต์กับ 12 ราศีอีกด้วย'
            },
            {
                q: 'มีบทความให้อ่านไหม?',
                a: 'มีบทความมากกว่า 20 บทความ ครอบคลุมเนื้อหาเกี่ยวกับไพ่ทาโรต์ โหราศาสตร์ ฮวงจุ้ย เลขศาสตร์ ลายมือ และศาสตร์โบราณอื่นๆ เข้าถึงได้จากเมนู "ความรู้"'
            },
            {
                q: 'รูนคืออะไร?',
                a: 'รูน (Rune) เป็นอักษรโบราณของชาวนอร์ส ใช้ในการทำนายคล้ายกับไพ่ทาโรต์ ศาสตร์ดวงดาวมีฟีเจอร์จั่วรูนให้ทดลองใช้ เข้าถึงได้จากเมนูหลัก'
            }
        ]
    },
    {
        category: 'ความเป็นส่วนตัวและความปลอดภัย',
        items: [
            {
                q: 'ข้อมูลของฉันปลอดภัยไหม?',
                a: 'ปลอดภัยครับ เราใช้ระบบ Supabase ในการจัดเก็บข้อมูลซึ่งมีมาตรฐานความปลอดภัยสูง ข้อมูลส่วนตัวจะถูกเก็บรักษาอย่างดีและไม่เปิดเผยต่อบุคคลภายนอก'
            },
            {
                q: 'สามารถลบข้อมูลได้ไหม?',
                a: 'ได้ครับ คุณสามารถติดต่อทีมงานเพื่อขอลบข้อมูลส่วนตัวได้ตามนโยบายความเป็นส่วนตัวของเรา'
            }
        ]
    }
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left group"
            >
                <span className="text-sm sm:text-base text-white font-medium group-hover:text-amber-300 transition-colors">
                    {question}
                </span>
                <ChevronDown
                    size={18}
                    className={`text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-slate-400 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
};

export default function FAQPage() {
    const navigate = useNavigate();

    usePageSEO({
        title: 'คำถามที่พบบ่อย (FAQ) - ศาสตร์ดวงดาว',
        description: 'คำถามที่พบบ่อยเกี่ยวกับการดูดวงไพ่ทาโรต์ออนไลน์ การใช้งาน เครดิต และฟีเจอร์ต่างๆ ของศาสตร์ดวงดาว',
        keywords: 'FAQ, คำถามที่พบบ่อย, ศาสตร์ดวงดาว, ไพ่ทาโรต์, วิธีใช้',
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>กลับหน้าหลัก</span>
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                        <HelpCircle size={16} className="text-purple-400" />
                        <span className="text-sm text-purple-300">FAQ</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 mb-4">
                        คำถามที่พบบ่อย
                    </h1>
                    <p className="text-slate-400">
                        รวมคำตอบสำหรับทุกข้อสงสัยเกี่ยวกับการใช้งานศาสตร์ดวงดาว
                    </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {FAQ_DATA.map((category, catIdx) => (
                        <div key={catIdx}>
                            <h2 className="text-lg font-serif text-yellow-500 mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-yellow-500/60" />
                                {category.category}
                            </h2>
                            <div className="space-y-2">
                                {category.items.map((item, itemIdx) => (
                                    <FAQItem key={itemIdx} question={item.q} answer={item.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-16 text-center">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
                        <h3 className="text-xl font-serif text-purple-300 mb-3">ยังมีคำถามอื่นๆ?</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            หากคุณมีคำถามที่ไม่ได้อยู่ในรายการ สามารถติดต่อทีมงานได้เลย
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/about')}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-full transition-all"
                            >
                                ติดต่อเรา
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full transition-all border border-slate-700"
                            >
                                กลับหน้าหลัก
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
