import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginModal } from '../modals/LoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, X } from 'lucide-react';

export const FloatingFortuneButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Hide on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    useEffect(() => {
        // Show greeting after 3 seconds
        const timer = setTimeout(() => {
            setShowGreeting(true);
        }, 3000);

        // Auto-hide greeting after 10 seconds
        const hideTimer = setTimeout(() => {
            setShowGreeting(false);
        }, 13000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    const handleOpen = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        setShowGreeting(false);
        navigate('/fortune-chat');
    };

    return (
        <>
            {/* Floating Container (Moved up on mobile to avoid navbar) */}
            <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[9900] flex flex-col items-end gap-3">
                
                {/* Greeting Bubble */}
                <div 
                    className={`relative bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-2xl p-3 pr-8 max-w-[200px] sm:max-w-[240px] text-sm text-indigo-100 transform origin-bottom-right transition-all duration-500 ${showGreeting ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-4 pointer-events-none'}`}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }}
                        className="absolute top-2 right-2 text-indigo-400 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                    <div className="flex items-start gap-2">
                        <span className="text-xl animate-bounce">🔮</span>
                        <div>
                            <span className="block font-bold text-amber-400 text-xs mb-0.5"><Sparkles size={10} className="inline mr-1"/>หมอดูรับเลข</span>
                            <span className="text-xs leading-snug font-medium">มีเรื่องกลุ้มใจ ให้ไพ่และดวงดาวช่วยหาคำตอบไหมคะ? ✨</span>
                        </div>
                    </div>
                </div>

                {/* Floating Button */}
                <button
                    onClick={handleOpen}
                    className="relative group flex items-center justify-center"
                    aria-label="ดูดวง"
                >
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />

                    {/* Outer glow */}
                    <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-md group-hover:opacity-80 transition-opacity" />

                    {/* Button */}
                    <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-transform text-2xl border border-white/20">
                        🔮
                    </span>

                    {/* Tooltip */}
                    <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-indigo-100 text-xs rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-indigo-500/30">
                        ✨ ถามหมอดู
                    </span>
                </button>
            </div>

            {/* Login Error Modal */}
            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                message="กรุณาเข้าสู่ระบบก่อนเริ่มดูดวง"
            />
        </>
    );
};

export default FloatingFortuneButton;
