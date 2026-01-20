import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, History, Info, RefreshCw, Moon, Sun } from 'lucide-react';

const TAROT_CARDS = [
  { id: 1, name: 'The Fool', description: 'จุดเริ่มต้นใหม่ การเดินทางที่ไม่ได้วางแผนไว้ และความไร้เดียงสา' },
  { id: 2, name: 'The Magician', description: 'ความสามารถ ทักษะ และการลงมือทำเพื่อสร้างสรรค์สิ่งใหม่' },
  { id: 3, name: 'The High Priestess', description: 'สัญชาตญาณ ความลึกลับ และความรู้ภายในจิตใจ' },
  { id: 4, name: 'The Empress', description: 'ความอุดมสมบูรณ์ ธรรมชาติ และความเมตตา' },
  { id: 5, name: 'The Emperor', description: 'อำนาจ โครงสร้าง และความเป็นผู้นำ' },
  { id: 6, name: 'The Hierophant', description: 'ความเชื่อ ประเพณี และการเรียนรู้' },
  { id: 7, name: 'The Lovers', description: 'ทางเลือก ความสัมพันธ์ และความสมดุล' },
  { id: 8, name: 'The Chariot', description: 'ชัยชนะ ความมุ่งมั่น และการควบคุม' },
  { id: 9, name: 'Strength', description: 'ความกล้าหาญ ความอดทน และพลังจากภายใน' },
  { id: 10, name: 'The Hermit', description: 'การทบทวนตัวเอง ความโดดเดี่ยวที่สร้างสรรค์' },
  { id: 11, name: 'Wheel of Fortune', description: 'โชคชะตา การเปลี่ยนแปลง และวัฏจักรชีวิต' },
  { id: 12, name: 'Justice', description: 'ความยุติธรรม ความสมเหตุสมผล และผลของการกระทำ' },
  { id: 13, name: 'The Hanged Man', description: 'การรอคอย การมองในมุมกลับ และการเสียสละ' },
  { id: 14, name: 'Death', description: 'การสิ้นสุดเพื่อเริ่มต้นใหม่ การเปลี่ยนแปลงครั้งใหญ่' },
  { id: 15, name: 'Temperance', description: 'ความพอดี การปรับตัว และความสมดุล' },
  { id: 16, name: 'The Devil', description: 'กิเลส การยึดติด และพันธนาการทางใจ' },
  { id: 17, name: 'The Tower', description: 'การเปลี่ยนแปลงที่กะทันหัน การทำลายเพื่อสร้างใหม่' },
  { id: 18, name: 'The Star', description: 'ความหวัง แรงบันดาลใจ และความสงบ' },
  { id: 19, name: 'The Moon', description: 'ความกังวล จินตนาการ และสิ่งที่มองไม่เห็น' },
  { id: 20, name: 'The Sun', description: 'ความสำเร็จ ความสุข และความชัดเจน' },
  { id: 21, name: 'Judgement', description: 'การตื่นรู้ การตัดสินใจครั้งสำคัญ' },
  { id: 22, name: 'The World', description: 'ความสำเร็จที่สมบูรณ์แบบ การจบบทเรียน' }
];

// Placeholder component for Google Ads
const GoogleAdSlot = ({ className = "" }) => {
  useEffect(() => {
    try {
      // พยายามเรียก adsbygoogle เพื่อให้โฆษณาแสดงผลหลังจากคอมโพเนนต์ถูกติดตั้ง
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsbygoogle error:", e);
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto my-8 p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/40 flex items-center justify-center min-h-[100px] overflow-hidden ${className}`}>
      <div className="text-center w-full">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-sans">Advertisement</p>
        
        {/* AdSense Unit */}
        <ins className="adsbygoogle"
             style={{ display: 'block', textAlign: 'center' }}
             data-ad-client="ca-pub-6454901300191005"
             data-ad-slot="tarot_auto_slot"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

const CardBack = () => (
  <div className="w-full h-full p-4 flex flex-col items-center justify-center border-[6px] border-double border-yellow-600/20 rounded-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    
    <div className="relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" 
          fill="url(#moon-gradient)"
          stroke="#eab308" 
          strokeWidth="0.5"
        />
        <defs>
          <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <div className="absolute top-4 left-4 text-yellow-600/30 text-xs">✦</div>
    <div className="absolute top-4 right-4 text-yellow-600/30 text-xs">✦</div>
    <div className="absolute bottom-4 left-4 text-yellow-600/30 text-xs">✦</div>
    <div className="absolute bottom-4 right-4 text-yellow-600/30 text-xs">✦</div>
  </div>
);

const App = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [readingType, setReadingType] = useState('3-cards'); 
  const [theme, setTheme] = useState('dark');
  const audioContextRef = useRef(null);

  // Load Google AdSense Script once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6454901300191005";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const drawCards = () => {
    setIsRevealing(true);
    setSelectedCards([]);
    setRevealedIndices([]);
    
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      const numToDraw = readingType === '3-cards' ? 3 : 1;
      setSelectedCards(shuffled.slice(0, numToDraw));
      setIsRevealing(false);
    }, 800);
  };

  const playRevealSound = () => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.18);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.32);
  };

  const toggleCard = (index) => {
    if (revealedIndices.includes(index)) return;
    playRevealSound();
    setRevealedIndices(prev => [...prev, index]);
  };

  const getPositionLabel = (index) => {
    if (readingType === '1-card') return 'คำแนะนำรายวัน';
    const labels = ['อดีต (Past)', 'ปัจจุบัน (Present)', 'อนาคต (Future)'];
    return labels[index];
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <nav className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-serif font-bold tracking-wider">
          <Sparkles className="text-purple-500" />
          <span>TAROT ORACLE</span>
        </div>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="self-start sm:self-auto p-2 rounded-full hover:bg-slate-800/20 transition-colors"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3 sm:mb-4">ค้นหาคำตอบจากจิตวิญญาณ</h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            ตั้งจิตอธิษฐานถึงเรื่องที่ต้องการทราบ แล้วคลิกที่ไพ่จันทร์เสี้ยวเพื่อเปิดเผยคำทำนาย
          </p>
        </header>

        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <button 
            onClick={() => { setReadingType('3-cards'); setSelectedCards([]); }}
            className={`w-full sm:w-auto px-6 py-2 rounded-full border transition-all ${readingType === '3-cards' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'border-slate-700'}`}
          >
            แบบ 3 ใบ
          </button>
          <button 
            onClick={() => { setReadingType('1-card'); setSelectedCards([]); }}
            className={`w-full sm:w-auto px-6 py-2 rounded-full border transition-all ${readingType === '1-card' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'border-slate-700'}`}
          >
            ใบเดียว
          </button>
        </div>

        {/* Top Ad Slot */}
        <GoogleAdSlot className="mb-8" />

        <div className="w-full flex flex-wrap justify-center gap-6 sm:gap-8 min-h-[320px] sm:min-h-[400px]">
          {selectedCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-8">
               <div className="flex gap-3 sm:gap-4">
                  {[0, 1, 2].slice(0, readingType === '3-cards' ? 3 : 1).map(i => (
                    <div key={i} className="w-24 h-40 sm:w-32 sm:h-52 md:w-48 md:h-80 bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center animate-pulse">
                       <Moon className="text-slate-800 w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                  ))}
               </div>
               <button 
                onClick={drawCards}
                disabled={isRevealing}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold text-base sm:text-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-purple-500/20"
               >
                 {isRevealing ? 'กำลังสื่อจิตกับดวงดาว...' : 'เริ่มต้นทำนาย'}
               </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12 mb-10 sm:mb-12">
                {selectedCards.map((card, idx) => {
                  const isRevealed = revealedIndices.includes(idx);
                  return (
                    <div 
                      key={card.id} 
                      className="flex flex-col items-center animate-in fade-in zoom-in duration-500"
                    >
                      <span className="mb-3 sm:mb-4 text-purple-400 font-medium tracking-widest uppercase text-xs sm:text-sm">
                        {getPositionLabel(idx)}
                      </span>
                      
                      <div 
                        onClick={() => toggleCard(idx)}
                        className={`relative w-32 h-52 sm:w-40 sm:h-64 md:w-48 md:h-80 cursor-pointer transition-all duration-700 preserve-3d ${isRevealed ? '[transform:rotateY(180deg)]' : 'hover:-translate-y-2'}`}
                        style={{ perspective: '1000px' }}
                      >
                        <div className={`absolute inset-0 rounded-2xl border-2 border-purple-900/50 backface-hidden z-10 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}>
                           <CardBack />
                        </div>

                        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black rounded-2xl border-2 border-yellow-500/30 flex flex-col items-center justify-center p-4 sm:p-6 text-center [transform:rotateY(180deg)] backface-hidden ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="mb-4 sm:mb-6 text-3xl sm:text-4xl">✨</div>
                          <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 sm:mb-3 text-yellow-500">{card.name}</h3>
                          <div className="h-px w-12 bg-yellow-500/30 mb-4"></div>
                          <p className="text-[10px] sm:text-xs text-slate-200 leading-relaxed italic">
                            "{card.description}"
                          </p>
                          <div className="absolute inset-2 border border-yellow-500/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      {!isRevealed && (
                        <p className="mt-3 sm:mt-4 text-xs text-slate-500 animate-bounce">คลิกเปิดไพ่พระจันทร์</p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <button 
                onClick={drawCards}
                className="flex items-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 hover:bg-slate-700 rounded-full transition-colors mt-6 sm:mt-8"
              >
                <RefreshCw size={20} />
                สลับไพ่ใหม่
              </button>
            </div>
          )}
        </div>

        {/* Bottom Ad Slot */}
        <GoogleAdSlot className="mt-12" />
      </main>

      <footer className="mt-16 sm:mt-20 border-t border-slate-800/50 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start">
              <Info size={18} className="text-purple-500" />
              วิธีใช้งาน
            </h4>
            <p className="text-sm text-slate-500">กดปุ่มเริ่มต้นเพื่ออัญเชิญไพ่ จากนั้นเลือกเปิดไพ่จันทร์เสี้ยวเพื่อรับคำชี้แนะ</p>
          </div>
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start">
              <History size={18} className="text-purple-500" />
              พลังของดวงจันทร์
            </h4>
            <p className="text-sm text-slate-500">จันทร์เสี้ยวเป็นสัญลักษณ์ของสัญชาตญาณและการเติบโตที่กำลังจะมาถึง</p>
          </div>
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-bold justify-center md:justify-start">
              <Sparkles size={18} className="text-purple-500" />
              คำแนะนำ
            </h4>
            <p className="text-sm text-slate-500">จงใช้สติในการรับคำทำนาย และให้ไพ่เป็นเพียงกระจกสะท้อนความคิดภายในใจ</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}} />
    </div>
  );
};

export default App;
