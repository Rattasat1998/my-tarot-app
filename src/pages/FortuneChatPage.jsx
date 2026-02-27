import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Sparkles, Coins, Crown, History, ArrowLeft, MessageCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { askFortuneTeller, createSession, updateSessionMessages, getRecentSessions, getPremiumCountToday, getActiveSession } from '../services/fortuneService';
import { useCredits } from '../hooks/useCredits';
import { useAuth } from '../contexts/AuthContext';

const NORMAL_CREDIT_COST = 10;
const PREMIUM_CREDIT_COST = 5;
const PREMIUM_FREE_PER_DAY = 1;
const MAX_MESSAGES_PER_SESSION = 3;

const TOPICS = [
    { id: 'love', emoji: '💕', label: 'ความรัก' },
    { id: 'career', emoji: '💼', label: 'การงาน' },
    { id: 'finance', emoji: '💰', label: 'การเงิน' },
    { id: 'health', emoji: '🌿', label: 'สุขภาพ' },
    { id: 'education', emoji: '📚', label: 'การเรียน' },
    { id: 'general', emoji: '🔮', label: 'ดวงทั่วไป' },
];

const GENDERS = [
    { id: 'female', emoji: '👩‍🔮', label: 'หมอดูหญิง', pronoun: 'ค่ะ' },
    { id: 'male', emoji: '👨‍🔮', label: 'หมอดูชาย', pronoun: 'ครับ' },
];

export const FortuneChatPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { credits, useCredit, addCredits, isPremium } = useCredits();

    // Screens: 'tellerList' | 'form' | 'chat' | 'history' | 'viewSession'
    const [screen, setScreen] = useState('tellerList'); // 'tellerList' | 'history' | 'form' | 'chat' | 'viewSession'

    // Form state
    const [formName, setFormName] = useState('');
    const [formBirthday, setFormBirthday] = useState('');
    const [formTopic, setFormTopic] = useState('');
    const [formQuestion, setFormQuestion] = useState('');
    const [formGender, setFormGender] = useState('female');

    // Chat state
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messagesUsed, setMessagesUsed] = useState(0);
    const [premiumFreeUsedToday, setPremiumFreeUsedToday] = useState(0);
    const [creditError, setCreditError] = useState('');
    const [resumableSession, setResumableSession] = useState(null);
    const [checkingResume, setCheckingResume] = useState(false);

    // Typing animation state
    const [isTyping, setIsTyping] = useState(false);
    const [typingIndex, setTypingIndex] = useState(0);
    const [fullReplyText, setFullReplyText] = useState('');

    // History state
    const [historyList, setHistoryList] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [viewingSession, setViewingSession] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Pre-fill from profile on open + check for resumable session
    useEffect(() => {
        const name = user?.user_metadata?.name || user?.user_metadata?.full_name || '';
        setFormName(name);
        setFormBirthday('');
        setFormTopic('');
        setFormQuestion('');
        setScreen('tellerList');
        setMessages([]);
        setMessagesUsed(0);
        setSessionId(null);
        setCreditError('');
        setResumableSession(null);
        setFormGender('female');

        if (isPremium && user) {
            getPremiumCountToday().then(count => setPremiumFreeUsedToday(count));
        }

        // Check for active session to resume
        if (user) {
            setCheckingResume(true);
            getActiveSession(MAX_MESSAGES_PER_SESSION).then(session => {
                setResumableSession(session);
                setCheckingResume(false);
            });
        }
    }, [user, isPremium]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (screen === 'chat' && !isLoading && !isTyping && messagesUsed < MAX_MESSAGES_PER_SESSION) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [screen, isLoading, isTyping, messagesUsed]);

    // Typing animation effect
    useEffect(() => {
        if (!isTyping || !fullReplyText) return;

        // Speed: shorter messages = slower (more dramatic), longer = faster per char
        // Range: 15ms (long) to 40ms (short) per character
        const len = fullReplyText.length;
        const speed = len > 500 ? 10 : len > 200 ? 20 : 30;

        if (typingIndex >= fullReplyText.length) {
            setIsTyping(false);
            return;
        }

        const timer = setTimeout(() => {
            setTypingIndex(prev => {
                // Type 1-3 chars at a time for natural feel
                const skip = len > 300 ? 3 : len > 100 ? 2 : 1;
                return Math.min(prev + skip, fullReplyText.length);
            });
        }, speed);

        return () => clearTimeout(timer);
    }, [isTyping, typingIndex, fullReplyText]);

    useEffect(() => {
        if (creditError) {
            const timer = setTimeout(() => setCreditError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [creditError]);

    const saveMessages = useCallback(async (msgs, sid) => {
        const id = sid || sessionId;
        if (id && user && msgs.length > 0) {
            await updateSessionMessages(id, msgs);
        }
    }, [sessionId, user]);

    // ─── Close & Navigation ───
    const handleExitApp = () => {
        navigate('/');
    };

    const handleBackToHistory = () => {
        setScreen('history');
    };

    const handleBackToTellerList = () => {
        setScreen('tellerList');
    };

    // ─── Resume Session ───
    const handleResume = () => {
        if (!resumableSession) return;
        setMessages(resumableSession.messages || []);
        setMessagesUsed(resumableSession.messagesUsed || 0);
        setSessionId(resumableSession.id);
        setScreen('chat');
        setResumableSession(null);
    };

    // ─── Start Session from Form ───
    const handleFormSubmit = async () => {
        if (!formName.trim() || !formBirthday || !formTopic) return;
        setCreditError('');

        // ─── Credit Check ───
        const hasFreeSession = isPremium && premiumFreeUsedToday < PREMIUM_FREE_PER_DAY;
        const cost = hasFreeSession ? 0 : (isPremium ? PREMIUM_CREDIT_COST : NORMAL_CREDIT_COST);

        if (!hasFreeSession) {
            if (credits < cost) {
                setCreditError(`เครดิตไม่เพียงพอ (ต้องใช้ ${cost} เครดิต, คงเหลือ ${credits})`);
                return;
            }
            const result = await useCredit(cost);
            if (!result.success) {
                setCreditError(result.message || 'ไม่สามารถหักเครดิตได้');
                return;
            }
        } else {
            setPremiumFreeUsedToday(prev => prev + 1);
        }

        // Build first message
        const topicLabel = TOPICS.find(t => t.id === formTopic)?.label || formTopic;
        const genderInfo = GENDERS.find(g => g.id === formGender);
        const pronoun = genderInfo?.pronoun || 'ค่ะ';
        const firstMessage = `สวัสดี${pronoun} ชื่อ ${formName.trim()} เกิดวันที่ ${formBirthday} อยากให้ดูดวงเรื่อง${topicLabel}${formQuestion.trim() ? ` — ${formQuestion.trim()}` : ''}`;

        const initialMessages = [{ role: 'user', text: firstMessage }];
        setMessages(initialMessages);
        setMessagesUsed(1);
        setScreen('chat');
        setIsLoading(true);

        // Create session
        let newSessionId = null;
        if (user) {
            newSessionId = await createSession({
                isPremiumSession: hasFreeSession,
                creditCost: cost,
                messages: initialMessages,
            });
            setSessionId(newSessionId);
        }

        // Call AI
        try {
            const reply = await askFortuneTeller(initialMessages.map(({ role, text }) => ({ role, text })), formGender);
            const finalMessages = [...initialMessages, { role: 'model', text: reply }];
            setMessages(finalMessages);
            if (newSessionId) saveMessages(finalMessages, newSessionId);
            // Start typing animation
            setFullReplyText(reply);
            setTypingIndex(0);
            setIsTyping(true);
        } catch (err) {
            // Refund on error
            if (cost > 0) await addCredits(cost);
            if (hasFreeSession) setPremiumFreeUsedToday(prev => Math.max(0, prev - 1));
            setMessagesUsed(0);
            setMessages([
                ...initialMessages,
                { role: 'model', text: `ขออภัยค่ะ เกิดข้อผิดพลาด 😔\n\n(${err.message})${cost > 0 ? `\n\n✅ คืนเครดิต ${cost} เครดิตเรียบร้อยแล้วค่ะ` : ''}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Follow-up Messages ───
    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading || isTyping || messagesUsed >= MAX_MESSAGES_PER_SESSION) return;

        const userMessage = { role: 'user', text: trimmed };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);
        setMessagesUsed(prev => prev + 1);

        try {
            const chatHistory = updatedMessages
                .filter((m) => m.role === 'user' || m.role === 'model')
                .map(({ role, text }) => ({ role, text }));

            const reply = await askFortuneTeller(chatHistory, formGender);
            const finalMessages = [...updatedMessages, { role: 'model', text: reply }];
            setMessages(finalMessages);
            saveMessages(finalMessages, sessionId);
            // Start typing animation
            setFullReplyText(reply);
            setTypingIndex(0);
            setIsTyping(true);
        } catch (err) {
            // Don't count failed messages
            setMessagesUsed(prev => Math.max(0, prev - 1));
            setMessages((prev) => [
                ...prev,
                { role: 'model', text: `ขออภัยค่ะ เกิดข้อผิดพลาด 😔 กรุณาลองถามใหม่อีกครั้งนะคะ\n\n(${err.message})\n\n💡 ข้อความนี้ไม่นับรวมในจำนวนคำถามค่ะ` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const loadHistory = async () => {
        setHistoryLoading(true);
        const sessions = await getRecentSessions(20);
        setHistoryList(sessions);
        setHistoryLoading(false);
    };

    // ─── Teller List Screen ───
    if (screen === 'tellerList') {
        return (
            <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none hidden sm:block" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

                <div className="flex-1 w-full max-w-md mx-auto flex flex-col bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950/95 relative z-10 overflow-hidden sm:border-x sm:border-indigo-500/20 sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950">
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />

                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20 z-10 shadow-md">
                        <button onClick={handleExitApp} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-400" /> ห้องดูดวงส่วนตัว
                        </h1>
                        <button onClick={() => { setScreen('history'); loadHistory(); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 relative">
                            <History size={20} className="text-white" />
                        </button>
                    </div>

                    <div className="relative p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
                        {/* Resume active session card */}
                        {resumableSession && (
                            <div className="mb-2 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">💬</span>
                                    <span className="text-green-400 font-bold text-sm">มี Session ที่ยังไม่จบ!</span>
                                </div>
                                <p className="text-green-300/70 text-xs mb-3">
                                    เหลืออีก {MAX_MESSAGES_PER_SESSION - resumableSession.messagesUsed} คำถาม — กดเพื่อถามต่อโดยไม่เสียเครดิตเพิ่ม
                                </p>
                                <button onClick={handleResume} className="w-full px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle size={16} /> ถามต่อจากเดิม
                                </button>
                            </div>
                        )}

                        {checkingResume && (
                            <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs mb-4">
                                <div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                ตรวจสอบ Session...
                            </div>
                        )}

                        <h2 className="text-indigo-200 text-sm font-semibold px-2">เลือกหมอดูที่ต้องการ</h2>

                        <div className="space-y-3">
                            {GENDERS.map((g) => (
                                <button key={g.id} onClick={() => { setFormGender(g.id); setScreen('form'); }} className="w-full text-left p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 hover:bg-indigo-900/50 hover:border-indigo-400/40 transition-all group flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg ring-2 ring-purple-500/20 group-hover:scale-105 transition-transform">
                                            {g.emoji}
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 border-2 border-indigo-950 rounded-full"></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-base md:text-lg group-hover:text-purple-300 transition-colors">{g.label}</h3>
                                        <p className="text-indigo-300 text-xs sm:text-sm truncate opacity-80 mt-1">ออนไลน์ พร้อมให้คำทำนายดวงชะตา{g.pronoun}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20 transition-colors flex-shrink-0">
                                        <ChevronRight size={18} className="text-indigo-400 group-hover:text-purple-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Info Form Screen ───
    if (screen === 'form') {
        const hasFreeLeft = isPremium && premiumFreeUsedToday < PREMIUM_FREE_PER_DAY;
        const cost = hasFreeLeft ? 0 : (isPremium ? PREMIUM_CREDIT_COST : NORMAL_CREDIT_COST);
        const canSubmit = formName.trim() && formBirthday && formTopic && (hasFreeLeft || credits >= cost);

        return (
            <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none hidden sm:block" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

                <div className="flex-1 w-full max-w-md mx-auto flex flex-col bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950/95 relative z-10 overflow-hidden sm:border-x sm:border-indigo-500/20 sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950">
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />

                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20 z-10 shadow-md">
                        <button onClick={handleBackToTellerList} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                            {formGender === 'male' ? '👨‍🔮 หมอดูชาย' : '👩‍🔮 หมอดูหญิง'}
                        </h1>
                        <div className="w-10"></div> {/* Spacer for centering */}
                    </div>

                    <div className="relative p-6 sm:p-8 flex-1 overflow-y-auto">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/40 ring-4 ring-purple-500/20 text-4xl">🔮</div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200">ยินดีต้อนรับสู่ห้องพยากรณ์</h2>
                            <p className="text-indigo-300 flex items-center justify-center gap-2 text-sm mt-2">
                                กรอกข้อมูลเพื่อเปิดคำทำนายของคุณ
                            </p>
                        </div>

                        {/* Name */}
                        <div className="mb-5">
                            <label className="text-indigo-200 text-sm font-semibold mb-2 block flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> ชื่อ / ชื่อเล่น</label>
                            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="ชื่อที่ต้องการให้หมอดูเรียก" className="w-full bg-indigo-950/40 text-white placeholder-indigo-300/30 px-5 py-3.5 rounded-xl text-base border border-indigo-500/30 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner" />
                        </div>

                        {/* Birthday */}
                        <div className="mb-5">
                            <label className="text-indigo-200 text-sm font-semibold mb-2 block flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-400" /> วัน/เดือน/ปีเกิด</label>
                            <input type="date" value={formBirthday} onChange={(e) => setFormBirthday(e.target.value)} className="w-full bg-indigo-950/40 text-white px-5 py-3.5 rounded-xl text-base border border-indigo-500/30 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner [color-scheme:dark]" />
                        </div>

                        {/* Topic */}
                        <div className="mb-6">
                            <label className="text-indigo-200 text-sm font-semibold mb-2 block flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> เรื่องที่อยากให้ทำนาย</label>
                            <div className="grid grid-cols-3 gap-3">
                                {TOPICS.map((t) => (
                                    <button key={t.id} onClick={() => setFormTopic(t.id)} className={`px-2 py-3.5 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 border-2 ${formTopic === t.id ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-400/50 text-white shadow-lg shadow-purple-500/25 scale-[1.05] z-10' : 'bg-indigo-950/30 text-indigo-300 border-transparent hover:border-indigo-500/30 hover:bg-slate-800/50'}`}>
                                        <span className="text-2xl filter drop-shadow-md">{t.emoji}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optional question */}
                        <div className="mb-6">
                            <label className="text-indigo-200 text-sm font-semibold mb-2 block flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> คำถามเฉพาะเจาะจง <span className="text-indigo-500/70 font-normal">(ไม่จำเป็น)</span></label>
                            <textarea value={formQuestion} onChange={(e) => setFormQuestion(e.target.value)} placeholder="เช่น ระบุสถานการณ์ที่เป็นอยู่ หรือคำถามที่ต้องการคำตอบชัดเจน..." rows="3" className="w-full bg-indigo-950/40 text-white placeholder-indigo-300/30 px-5 py-3.5 rounded-xl text-base border border-indigo-500/30 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner resize-none" />
                        </div>

                        {/* Credit error */}
                        {creditError && (
                            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                                <p className="text-red-300 text-xs flex-1">{creditError}</p>
                            </div>
                        )}

                        {/* Cost info */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4 space-y-1.5">
                            {cost === 0 ? (
                                <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium">
                                    <Crown size={14} className="text-amber-400" /> สิทธิ์ Premium — ฟรี!
                                </div>
                            ) : (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">ค่าบริการ:</span>
                                    <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                        <Coins size={14} /> {cost} เครดิต
                                        {isPremium && <span className="text-amber-400/60 text-[10px] font-normal">(Premium)</span>}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>ถามได้ {MAX_MESSAGES_PER_SESSION} คำถาม / session</span>
                                {cost > 0 && <span>คงเหลือ {credits} เครดิต</span>}
                            </div>
                        </div>

                        {/* Submit */}
                        <button onClick={handleFormSubmit} disabled={!canSubmit || isLoading} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:scale-100">
                            <Sparkles size={18} /> เริ่มพูดคุยเลย <ChevronRight size={16} />
                        </button>

                        <p className="text-indigo-400/30 text-[10px] text-center mt-3">คำทำนายเป็นเพียงความบันเทิง โปรดใช้วิจารณญาณ</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── History List ───
    if (screen === 'history') {
        return (
            <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none hidden sm:block" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

                <div className="flex-1 w-full max-w-md mx-auto flex flex-col bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950/95 relative z-10 overflow-hidden sm:border-x sm:border-indigo-500/20 sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950">

                    {/* Appbar (Header) */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20 z-10 shadow-md">
                        <h1 className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
                            แชทประวัติพยากรณ์
                        </h1>
                        <button onClick={handleBackToTellerList} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                            <X size={20} className="text-white" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 pb-24">
                        {historyLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-indigo-300">
                                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3" />
                                <p className="text-sm">กำลังโหลดประวัติ...</p>
                            </div>
                        ) : historyList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-indigo-400">
                                <MessageCircle size={48} className="mb-3 opacity-30" />
                                <p className="text-sm">ยังไม่มีประวัติการดูดวง</p>
                            </div>
                        ) : (
                            historyList.map((session) => {
                                const msgs = session.messages || [];
                                const firstUserMsg = msgs.find(m => m.role === 'user');
                                const preview = firstUserMsg?.text?.slice(0, 60) || 'เซสชันดูดวง';
                                const date = new Date(session.created_at);
                                const dateStr = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                                const timeStr = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
                                const msgCount = msgs.filter(m => m.role === 'user').length;
                                return (
                                    <button key={session.id} onClick={() => { setViewingSession(session); setScreen('viewSession'); }} className="w-full text-left p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 hover:bg-indigo-900/40 hover:border-indigo-400/30 transition-all group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-base font-medium truncate group-hover:text-purple-200 transition-colors">{preview}{firstUserMsg?.text?.length > 60 ? '...' : ''}</p>
                                                <div className="flex items-center gap-3 mt-2 flex-wrap text-sm">
                                                    <span className="text-indigo-300 font-medium">{dateStr} {timeStr}</span>
                                                    <span className="text-slate-600">•</span>
                                                    <span className="text-indigo-300">{msgCount} คำถาม</span>
                                                    {session.is_premium_session && (
                                                        <><span className="text-slate-600">•</span><span className="text-amber-400 font-bold flex items-center gap-1"><Crown size={12} /> ฟรี</span></>
                                                    )}
                                                    {!session.is_premium_session && session.credit_cost > 0 && (
                                                        <><span className="text-slate-600">•</span><span className="text-yellow-400 font-bold">{session.credit_cost} เครดิต</span></>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20 transition-colors self-center">
                                                <ChevronRight size={18} className="text-indigo-400 group-hover:text-purple-300 transition-colors" />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Bottombar (New Chat Button) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
                        <button onClick={() => setScreen('form')} className="w-full max-w-md mx-auto py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                            <MessageCircle size={20} /> เริ่มทำนายดวงชะตาใหม่
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Viewing Past Session ───
    if (screen === 'viewSession' && viewingSession) {
        const viewMsgs = viewingSession.messages || [];
        return (
            <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none hidden sm:block" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

                <div className="flex-1 w-full max-w-md mx-auto flex flex-col bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950/95 relative z-10 overflow-hidden sm:border-x sm:border-indigo-500/20 sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950">

                    {/* Appbar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20 z-10 shadow-md">
                        <div className="flex items-center gap-3">
                            <button onClick={handleBackToHistory} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                                <ArrowLeft size={20} className="text-white" />
                            </button>
                            <div>
                                <h1 className="text-white font-bold text-lg tracking-wide">บันทึกคำทำนาย</h1>
                                <p className="text-indigo-300 text-xs font-medium">{new Date(viewingSession.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
                        {viewMsgs.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-lg mr-3 mt-1 flex-shrink-0 shadow-lg shadow-purple-500/30">🔮</div>}
                                <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-base leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm shadow-lg shadow-indigo-500/20' : 'bg-indigo-950/40 text-indigo-100 rounded-tl-sm border border-indigo-500/20 shadow-inner'}`}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-3 bg-slate-900/80 border-t border-indigo-500/20 text-center">
                        <p className="text-indigo-400/50 text-xs">📜 ประวัติการดูดวง (อ่านอย่างเดียว)</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Active Chat ───
    const remainingMessages = MAX_MESSAGES_PER_SESSION - messagesUsed;
    const sessionExhausted = messagesUsed >= MAX_MESSAGES_PER_SESSION;

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none hidden sm:block" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

            <div className="flex-1 w-full max-w-md mx-auto flex flex-col bg-gradient-to-b from-indigo-950/90 via-slate-900/95 to-slate-950 relative z-10 overflow-hidden sm:border-x sm:border-indigo-500/20 sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950">

                {/* Appbar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-900 border-b border-indigo-500/20 z-10 shadow-md">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBackToTellerList} className="w-10 h-10 mr-1 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5">
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/30">🔮</div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-base sm:text-lg leading-tight">หมอดูศาสตร์ดวงดาว</h1>
                            <p className="text-indigo-300 text-[10px] sm:text-xs font-medium mt-0.5">ออนไลน์ พร้อมให้คำปรึกษา</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Message counter */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${sessionExhausted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                            {messagesUsed}/{MAX_MESSAGES_PER_SESSION}
                        </span>
                        {isPremium && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-[10px] font-bold">
                                <Crown size={10} /> Premium
                            </span>
                        )}
                        <button onClick={handleExitApp} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-28 space-y-5 scroll-smooth z-10">
                    {messages.map((msg, idx) => {
                        const isLastModel = msg.role === 'model' && idx === messages.length - 1;
                        const displayText = (isLastModel && isTyping) ? fullReplyText.slice(0, typingIndex) : msg.text;

                        return (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-lg mr-3 mt-1 flex-shrink-0 shadow-lg shadow-purple-500/30">🔮</div>}
                                <div className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 rounded-3xl text-base leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-xl shadow-indigo-500/20' : 'bg-slate-800/80 text-indigo-100 rounded-bl-sm border border-slate-700/50 shadow-inner'}`}>
                                    {displayText}{isLastModel && isTyping && <span className="inline-block w-1.5 h-5 bg-indigo-400 ml-1.5 animate-pulse align-middle rounded-full" />}
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-lg mr-3 mt-1 flex-shrink-0 shadow-lg shadow-purple-500/30">🔮</div>
                            <div className="bg-slate-800/80 border border-slate-700/50 px-6 py-5 rounded-3xl rounded-bl-sm shadow-inner">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Credit error */}
                {creditError && (
                    <div className="mx-4 mb-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                        <p className="text-red-300 text-xs flex-1">{creditError}</p>
                    </div>
                )}

                {/* Input or Session End */}
                {sessionExhausted ? (
                    <div className="px-4 sm:px-6 py-6 bg-slate-900 border-t border-indigo-500/20 text-center space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-10">
                        <p className="text-indigo-300 text-base font-medium">✨ จบการทำนายสำหรับรอบนี้ค่ะ</p>
                        <div className="flex gap-3 max-w-sm mx-auto">
                            <button onClick={() => setScreen('form')} className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/25">
                                🔮 ดูดวงใหม่
                            </button>
                            <button onClick={handleExitApp} className="px-5 py-3.5 rounded-xl bg-slate-800 text-indigo-300 text-base border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors">
                                กลับหน้าแรก
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="px-4 sm:px-6 py-5 bg-slate-900 border-t border-indigo-500/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-10">
                        <div className="flex items-center gap-3">
                            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="พิมพ์ข้อความที่ต้องการถาม..." disabled={isLoading || isTyping} className="flex-1 bg-indigo-950/40 text-white placeholder-indigo-300/40 px-5 py-3.5 rounded-full text-base border border-indigo-500/30 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50 transition-all shadow-inner" />
                            <button onClick={handleSend} disabled={!input.trim() || isLoading || isTyping} className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100 shadow-xl shadow-indigo-500/30">
                                <Send size={20} className="ml-1" />
                            </button>
                        </div>
                        <p className="text-center text-indigo-400/60 text-xs font-medium mt-3">
                            เหลือข้อความได้อีก <span className="text-indigo-300">{remainingMessages}</span> ครั้ง • คำทำนายเป็นเพียงความบันเทิง
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FortuneChatPage;
