import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Coins, Crown, History, ArrowLeft, MessageCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { askFortuneTeller, createSession, updateSessionMessages, getRecentSessions, getPremiumCountToday, getActiveSession } from '../../services/fortuneService';
import { useCredits } from '../../hooks/useCredits';
import { useAuth } from '../../contexts/AuthContext';

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

export const FortuneChatModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { credits, useCredit, addCredits, isPremium } = useCredits();

    // Screens: 'form' | 'chat' | 'history' | 'viewSession'
    const [screen, setScreen] = useState('form');

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
        if (isOpen) {
            const name = user?.user_metadata?.name || user?.user_metadata?.full_name || '';
            setFormName(name);
            setFormBirthday('');
            setFormTopic('');
            setFormQuestion('');
            setScreen('form');
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
        }
    }, [isOpen, user, isPremium]);

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

    const handleClose = () => {
        onClose();
        setScreen('form');
        setMessages([]);
        setSessionId(null);
        setViewingSession(null);
        setCreditError('');
        setMessagesUsed(0);
        setResumableSession(null);
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

    if (!isOpen) return null;

    const remainingMessages = MAX_MESSAGES_PER_SESSION - messagesUsed;
    const sessionExhausted = messagesUsed >= MAX_MESSAGES_PER_SESSION;

    // ─── Info Form Screen ───
    if (screen === 'form') {
        const hasFreeLeft = isPremium && premiumFreeUsedToday < PREMIUM_FREE_PER_DAY;
        const cost = hasFreeLeft ? 0 : (isPremium ? PREMIUM_CREDIT_COST : NORMAL_CREDIT_COST);
        const canSubmit = formName.trim() && formBirthday && formTopic && (hasFreeLeft || credits >= cost);

        return (
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative w-full sm:w-[420px] max-h-[85vh] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 sm:rounded-2xl overflow-y-auto shadow-2xl border border-indigo-500/20 rounded-t-2xl sm:rounded-b-2xl animate-in zoom-in-95 slide-in-from-bottom-[10%] sm:slide-in-from-bottom-0 duration-300">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />
                    <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10">
                        <X size={18} className="text-white" />
                    </button>

                    <div className="relative p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 text-3xl">🔮</div>
                            <h2 className="text-xl font-bold text-white">ดูดวงกับหมอดู</h2>
                            <p className="text-indigo-300 text-xs mt-1">กรอกข้อมูลเพื่อเริ่มการดูดวง</p>
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            <label className="text-indigo-300 text-xs font-medium mb-1.5 block">ชื่อ / ชื่อเล่น</label>
                            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="ชื่อที่ต้องการให้หมอดูเรียก" className="w-full bg-white/10 text-white placeholder-indigo-300/40 px-4 py-2.5 rounded-xl text-sm border border-indigo-500/20 focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/30 transition-all" />
                        </div>

                        {/* Birthday */}
                        <div className="mb-4">
                            <label className="text-indigo-300 text-xs font-medium mb-1.5 block">วัน/เดือน/ปีเกิด</label>
                            <input type="date" value={formBirthday} onChange={(e) => setFormBirthday(e.target.value)} className="w-full bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm border border-indigo-500/20 focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/30 transition-all [color-scheme:dark]" />
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="text-indigo-300 text-xs font-medium mb-1.5 block">เลือกหมอดู</label>
                            <div className="grid grid-cols-2 gap-2">
                                {GENDERS.map((g) => (
                                    <button key={g.id} onClick={() => setFormGender(g.id)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${formGender === g.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' : 'bg-white/5 text-indigo-300 border border-white/10 hover:bg-white/10'}`}>
                                        <span className="text-lg">{g.emoji}</span>
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="mb-4">
                            <label className="text-indigo-300 text-xs font-medium mb-1.5 block">เรื่องที่อยากดูดวง</label>
                            <div className="grid grid-cols-3 gap-2">
                                {TOPICS.map((t) => (
                                    <button key={t.id} onClick={() => setFormTopic(t.id)} className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 ${formTopic === t.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' : 'bg-white/5 text-indigo-300 border border-white/10 hover:bg-white/10'}`}>
                                        <span className="text-lg">{t.emoji}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optional question */}
                        <div className="mb-5">
                            <label className="text-indigo-300 text-xs font-medium mb-1.5 block">คำถามเพิ่มเติม <span className="text-indigo-500">(ไม่จำเป็น)</span></label>
                            <input type="text" value={formQuestion} onChange={(e) => setFormQuestion(e.target.value)} placeholder="เช่น ปีนี้จะได้เลื่อนตำแหน่งไหม" className="w-full bg-white/10 text-white placeholder-indigo-300/40 px-4 py-2.5 rounded-xl text-sm border border-indigo-500/20 focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/30 transition-all" />
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

                        {/* Resume active session card */}
                        {resumableSession && (
                            <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
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
                            <div className="mb-4 flex items-center justify-center gap-2 text-indigo-400 text-xs">
                                <div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                ตรวจสอบ Session...
                            </div>
                        )}

                        {/* Submit */}
                        <button onClick={handleFormSubmit} disabled={!canSubmit || isLoading} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:scale-100">
                            <Sparkles size={18} /> เริ่มดูดวงใหม่ <ChevronRight size={16} />
                        </button>

                        {/* History link */}
                        {user && (
                            <button onClick={() => { setScreen('history'); loadHistory(); }} className="w-full mt-3 px-4 py-2.5 rounded-xl bg-white/5 text-indigo-300 text-sm hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2">
                                <History size={16} /> ดูประวัติการดูดวง
                            </button>
                        )}

                        <p className="text-indigo-400/30 text-[10px] text-center mt-3">คำทำนายเป็นเพียงความบันเทิง โปรดใช้วิจารณญาณ</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── History List ───
    if (screen === 'history') {
        return (
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative w-full sm:w-[420px] h-[85vh] sm:h-[600px] sm:max-h-[85vh] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-indigo-500/20 animate-in zoom-in-95 slide-in-from-bottom-[10%] sm:slide-in-from-bottom-0 duration-300">
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setScreen('form')} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <ArrowLeft size={18} className="text-white" />
                            </button>
                            <h3 className="text-white font-bold text-sm flex items-center gap-2"><History size={16} /> ประวัติการดูดวง</h3>
                        </div>
                        <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
                                    <button key={session.id} onClick={() => { setViewingSession(session); setScreen('viewSession'); }} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{preview}{firstUserMsg?.text?.length > 60 ? '...' : ''}</p>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <span className="text-indigo-400 text-xs">{dateStr} {timeStr}</span>
                                                    <span className="text-slate-600">•</span>
                                                    <span className="text-indigo-400 text-xs">{msgCount} คำถาม</span>
                                                    {session.is_premium_session && (
                                                        <><span className="text-slate-600">•</span><span className="text-amber-400 text-xs flex items-center gap-0.5"><Crown size={10} /> ฟรี</span></>
                                                    )}
                                                    {!session.is_premium_session && session.credit_cost > 0 && (
                                                        <><span className="text-slate-600">•</span><span className="text-yellow-400 text-xs">{session.credit_cost} เครดิต</span></>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-indigo-500 text-xs mt-0.5">ดู →</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─── Viewing Past Session ───
    if (screen === 'viewSession' && viewingSession) {
        const viewMsgs = viewingSession.messages || [];
        return (
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
                <div className="relative w-full sm:w-[420px] h-[85vh] sm:h-[600px] sm:max-h-[85vh] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-indigo-500/20 animate-in zoom-in-95 slide-in-from-bottom-[10%] sm:slide-in-from-bottom-0 duration-300">
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20">
                        <div className="flex items-center gap-3">
                            <button onClick={() => { setViewingSession(null); setScreen('history'); }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <ArrowLeft size={18} className="text-white" />
                            </button>
                            <div>
                                <h3 className="text-white font-bold text-sm">ประวัติดูดวง</h3>
                                <p className="text-indigo-300 text-xs">{new Date(viewingSession.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {viewMsgs.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0 shadow-md">🔮</div>}
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md' : 'bg-white/10 text-indigo-100 rounded-bl-md border border-white/5'}`}>{msg.text}</div>
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
    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative w-full sm:w-[420px] h-[85vh] sm:h-[600px] sm:max-h-[85vh] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-indigo-500/20 animate-in zoom-in-95 slide-in-from-bottom-[10%] sm:slide-in-from-bottom-0 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-indigo-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">🔮</div>
                        <div>
                            <h3 className="text-white font-bold text-sm">หมอดูศาสตร์ดวงดาว</h3>
                            <p className="text-indigo-300 text-xs flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> ออนไลน์ พร้อมให้คำปรึกษา
                            </p>
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
                        <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                    {messages.map((msg, idx) => {
                        const isLastModel = msg.role === 'model' && idx === messages.length - 1;
                        const displayText = (isLastModel && isTyping) ? fullReplyText.slice(0, typingIndex) : msg.text;

                        return (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0 shadow-md">🔮</div>}
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md shadow-lg shadow-indigo-500/20' : 'bg-white/10 text-indigo-100 rounded-bl-md border border-white/5'}`}>
                                    {displayText}{isLastModel && isTyping && <span className="inline-block w-0.5 h-4 bg-indigo-300 ml-0.5 animate-pulse align-middle" />}
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0">🔮</div>
                            <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    <span className="text-indigo-300 text-xs ml-2">กำลังดูดวง...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
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
                    <div className="px-4 py-4 pb-24 sm:pb-4 bg-slate-900/80 border-t border-indigo-500/20 text-center space-y-3">
                        <p className="text-indigo-300 text-sm">✨ หมดคำถามสำหรับ Session นี้แล้วค่ะ</p>
                        <div className="flex gap-2">
                            <button onClick={handleClose} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
                                🔮 ดูดวงใหม่
                            </button>
                            <button onClick={handleClose} className="px-4 py-2.5 rounded-xl bg-white/5 text-indigo-300 text-sm border border-white/10 hover:bg-white/10 transition-colors">
                                ปิด
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="px-4 py-3 pb-24 sm:pb-3 bg-slate-900/80 border-t border-indigo-500/20">
                        <div className="flex items-center gap-2">
                            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="ถามเพิ่มเติมเกี่ยวกับดวงชะตา..." disabled={isLoading || isTyping} className="flex-1 bg-white/10 text-white placeholder-indigo-300/50 px-4 py-2.5 rounded-full text-sm border border-indigo-500/20 focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/30 disabled:opacity-50 transition-all" />
                            <button onClick={handleSend} disabled={!input.trim() || isLoading || isTyping} className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100 shadow-lg shadow-indigo-500/30">
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-center text-indigo-400/50 text-[10px] mt-2">
                            เหลืออีก {remainingMessages} คำถาม • คำทำนายเป็นเพียงความบันเทิง
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FortuneChatModal;
