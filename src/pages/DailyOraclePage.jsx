import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageTitle';
import { OracleCard } from '../components/oracle/OracleCard';
import { DayNavigation } from '../components/oracle/DayNavigation';
import { ColorChart } from '../components/oracle/ColorChart';
import { ProgressChart } from '../components/oracle/ProgressChart';

// Daily fortune data structure
const WEEKLY_FORTUNES = [
  {
    id: 'monday',
    dayTH: 'วันจันทร์',
    dayEN: 'MONDAY',
    emoji: '🌙',
    quote: '"สัญชาตญาณแม่นยำ ฟังเสียงหัวใจ"',
    desc: 'ดาวพระจันทร์ส่องสว่าง สัญชาตญาณของคุณจะแม่นยำเป็นพิเศษ เหมาะกับการตัดสินใจตามความรู้สึกมากกว่าเหตุผลตรรกะในวันนี้',
    advice: 'ฟังเสียงหัวใจ สัญชาตญาณแม่นยำ',
    action: 'ตัดสินใจตามความรู้สึกได้เลย',
    colors: ['#F5F5F5', '#C0C0C0', '#A7C7E7'],
    colorNames: ['ขาว', 'เงิน', 'ฟ้าอ่อน'],
    accent: 'border-blue-200'
  },
  {
    id: 'tuesday',
    dayTH: 'วันอังคาร',
    dayEN: 'TUESDAY',
    emoji: '🌡️',
    quote: '"สุขภาพเด่น ร่างกายฟื้นตัว"',
    desc: 'ดวงสุขภาพโดดเด่นมาก พลังงานชีวิตกลับมาเต็มเปี่ยม ความเจ็บป่วยเล็กๆ น้อยๆ จะทุเลาลงอย่างรวดเร็ว',
    advice: 'สุขภาพดีขึ้น ร่างกายฟื้นตัวเร็ว',
    action: 'เหมาะกับการเริ่มออกกำลังกาย',
    colors: ['#FF6B6B', '#FFA500', '#FFB6C1'],
    colorNames: ['แดง', 'ส้ม', 'ชมพู'],
    accent: 'border-red-200'
  },
  {
    id: 'wednesday',
    dayTH: 'วันพุธ',
    dayEN: 'WEDNESDAY',
    emoji: '📝',
    quote: '"เจรจาดี พูดอะไรคนก็เข้าใจ"',
    desc: 'วาทศิลป์เป็นเลิศ เหมาะแก่การเจรจาต่อรองธุรกิจ การค้า หรือการเคลียร์ใจ ปิดดีลสำคัญได้สำเร็จ',
    advice: 'การเจรจาดี พูดอะไรก็เข้าใจ',
    action: 'เหมาะกับการทำสัญญา/ตกลงราคา',
    colors: ['#4CAF50', '#FFEB3B', '#D4AF37'],
    colorNames: ['เขียว', 'เหลือง', 'ทอง'],
    accent: 'border-green-200'
  },
  {
    id: 'thursday',
    dayTH: 'วันพฤหัสบดี',
    dayEN: 'THURSDAY',
    emoji: '🌙',
    quote: '"พระจันทร์ส่งพลัง ขอพรก่อนนอน"',
    desc: 'ค่ำคืนนี้มีพลังงานพิเศษแฝงอยู่ การตั้งจิตอธิษฐานก่อนนอนจะส่งผลดีอย่างน่าอัศจรรย์ ความฝันอาจบอกเหตุ',
    advice: 'ขอพรก่อนนอนจะสมหวัง',
    action: 'สิ่งที่หวังจะสมปรารถนา',
    colors: ['#9C27B0', '#000080', '#FFFDD0'],
    colorNames: ['ม่วง', 'น้ำเงิน', 'ครีม'],
    accent: 'border-purple-200'
  },
  {
    id: 'friday',
    dayTH: 'วันศุกร์',
    dayEN: 'FRIDAY',
    emoji: '🤗',
    quote: '"มิตรภาพเด่น ได้เพื่อนใหม่ที่ดี"',
    desc: 'บรรยากาศรอบตัวเต็มไปด้วยความเป็นมิตร มีเกณฑ์ได้พบปะผู้คนใหม่ๆ ที่จริงใจและเกื้อกูลกันในอนาคต',
    advice: 'มิตรภาพดี ได้เพื่อนใหม่ที่ดี',
    action: 'เหมาะกับการออกไปสังสรรค์',
    colors: ['#FF69B4', '#87CEEB', '#FFFFFF'],
    colorNames: ['ชมพู', 'ฟ้า', 'ขาว'],
    accent: 'border-pink-200'
  },
  {
    id: 'saturday',
    dayTH: 'วันเสาร์',
    dayEN: 'SATURDAY',
    emoji: '🦋',
    quote: '"เปิดใจรับสิ่งใหม่ ก้าวข้ามความกลัว"',
    desc: 'วันนี้เป็นวันที่เหมาะแก่การทำลายกำแพงความกลัว สิ่งที่เคยกังวลอาจไม่ได้น่ากลัวอย่างที่คิด ลองเปิดใจดู',
    advice: 'เปิดใจรับสิ่งใหม่',
    action: 'ลองทำสิ่งที่เคยกลัวดูสักครั้ง',
    colors: ['#333333', '#808080', '#8B4513'],
    colorNames: ['ดำ', 'เทา', 'น้ำตาล'],
    accent: 'border-gray-400'
  },
  {
    id: 'sunday',
    dayTH: 'วันอาทิตย์',
    dayEN: 'SUNDAY',
    emoji: '📱',
    quote: '"การสื่อสารราบรื่น ข่าวดีทางโซเชียล"',
    desc: 'ดาวพุธส่งผลดีต่อการสื่อสาร โลกออนไลน์และการติดต่อระยะไกลจะนำพาข่าวดีหรือโอกาสใหม่ๆ มาให้',
    advice: 'การสื่อสารดีเป็นพิเศษ',
    action: 'ติดต่อใครก็ได้รับคำตอบที่ดี',
    colors: ['#FFD700', '#FF8C00', '#FFFF00'],
    colorNames: ['ทอง', 'ส้ม', 'เหลือง'],
    accent: 'border-yellow-300'
  }
];

const DailyOraclePage = ({ isDark = true }) => {
  const navigate = useNavigate();
  const [currentDayIndex, setCurrentDayIndex] = useState(() => (new Date().getDay() + 6) % 7);
  const [currentDayOfYear, setCurrentDayOfYear] = useState(0);
  const [todayDateText, setTodayDateText] = useState('');
  const [hoursUntilNextFortune, setHoursUntilNextFortune] = useState(0);
  const [minutesUntilNextFortune, setMinutesUntilNextFortune] = useState(0);

  usePageSEO({
    title: 'Daily Oracle - คำทำนายดวงชะตาประจำวัน',
    description: 'ดูดวงประจำวันแบบ interactive พร้อมสีมงคล คำแนะนำ และการวิเคราะห์จากดวงดาว',
    path: '/daily-oracle',
    type: 'website'
  });

  // Calculate current day of year + countdown to next daily refresh
  useEffect(() => {
    const updateDailyTimeData = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
      setCurrentDayOfYear(dayOfYear);

      setTodayDateText(now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));

      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const msUntilNextMidnight = nextMidnight - now;

      const remainingHours = Math.floor(msUntilNextMidnight / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((msUntilNextMidnight % (1000 * 60 * 60)) / (1000 * 60));

      setHoursUntilNextFortune(remainingHours);
      setMinutesUntilNextFortune(remainingMinutes);
    };

    updateDailyTimeData();
    const timerId = setInterval(updateDailyTimeData, 30000);

    return () => clearInterval(timerId);
  }, []);

  const handleDayChange = (index) => {
    setCurrentDayIndex(index);
  };

  const currentDay = WEEKLY_FORTUNES[currentDayIndex];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-900' : 'bg-stone-50'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`w-full ${isDark ? 'bg-stone-800' : 'bg-white'} shadow-lg py-6 sticky top-0 z-10`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-stone-700' : 'hover:bg-stone-100'} transition-colors`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-stone-300' : 'text-stone-600'}`} />
            </button>
            <div>
              <h1 className={`text-2xl md:text-3xl font-light tracking-widest ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
                DAILY ORACLE
              </h1>
              <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-1`}>
                ✨ คำทำนายประจำวันที่ {todayDateText}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <span className={`inline-block ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-600'} px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase`}>
              Day {currentDayOfYear} / 365
            </span>
            <p className={`mt-2 text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} flex items-center justify-end gap-1`}>
              <Sparkles className="w-3 h-3" />
              อีก {hoursUntilNextFortune} ชั่วโมง {minutesUntilNextFortune} นาที คำทำนายจะเปลี่ยน
            </p>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="container mx-auto px-4 mt-8 mb-6">
        <div className={`${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'} p-6 rounded-xl shadow-lg border`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2`}>
            ยินดีต้อนรับสู่ปฏิทินแห่งโชคชะตา
          </h2>
          <p className={`${isDark ? 'text-stone-400' : 'text-stone-600'} leading-relaxed`}>
            แอปพลิเคชันนี้รวบรวมคำทำนายดวงชะตาประจำสัปดาห์ ท่านสามารถเลือก <strong>"วัน"</strong> จากแถบนำทางด้านซ้ายเพื่อรับฟังเสียงกระซิบจากดวงดาว 
            ดูสีมงคลที่ช่วยเสริมพลัง และแนวทางในการดำเนินชีวิตประจำวัน ข้อมูลจะแสดงผลในรูปแบบอินเทอร์แอคทีฟเพื่อให้ท่านเข้าใจพลังงานของแต่ละวันได้ดียิ่งขึ้น
          </p>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 flex-grow mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <DayNavigation 
              days={WEEKLY_FORTUNES}
              currentIndex={currentDayIndex}
              onDayChange={handleDayChange}
              isDark={isDark}
            />
            
            <div className={`${isDark ? 'bg-stone-800' : 'bg-white'} rounded-xl shadow-lg p-4 text-center`}>
              <h4 className={`text-xs uppercase ${isDark ? 'text-stone-400' : 'text-stone-400'} font-bold tracking-wider mb-2`}>
                Year Progress
              </h4>
              <ProgressChart currentDay={currentDayOfYear} isDark={isDark} />
            </div>
          </aside>

          {/* Center Column - Oracle Card */}
          <section className="lg:col-span-5">
            <OracleCard day={currentDay} isDark={isDark} />
          </section>

          {/* Right Column - Visual Insights */}
          <section className="lg:col-span-4 space-y-6">
            <div className={`${isDark ? 'bg-stone-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-stone-200' : 'text-stone-700'} mb-2 text-center`}>
                🎨 Lucky Colors
              </h3>
              <p className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'} text-center mb-6`}>
                สีมงคลประจำวันที่ช่วยเสริมพลังด้านบวก
              </p>
              
              <ColorChart 
                colors={currentDay.colors}
                colorNames={currentDay.colorNames}
                isDark={isDark}
              />
            </div>

            <div className={`${isDark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'} rounded-xl p-4 border`}>
              <h4 className={`text-sm font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'} mb-2`}>
                💡 Tips
              </h4>
              <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                เคล็ดลับวันนี้: {currentDay.advice}
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-stone-800' : 'bg-stone-100'} py-6 mt-auto`}>
        <div className="container mx-auto px-4 text-center text-sm">
          <p className={isDark ? 'text-stone-500' : 'text-stone-400'}>
            ✧ สร้างจากข้อมูลดวงประจำวันที่ {todayDateText} ✧
          </p>
        </div>
      </footer>
    </div>
  );
};

export { DailyOraclePage };
export default DailyOraclePage;
