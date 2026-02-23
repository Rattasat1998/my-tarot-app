import React, { useState } from 'react';
import { MembershipCard } from '../components/ui/MembershipCard';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const MembershipPage = ({ isDark, setIsDark }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent('showLoginModal'));
            return;
        }

        try {
            setIsLoading(true);
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            
            // Get fresh session
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                console.error('No valid session:', error);
                window.dispatchEvent(new CustomEvent('showLoginModal'));
                return;
            }
            
            // Try to refresh session if needed
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                console.error('Session refresh failed:', refreshError);
                window.dispatchEvent(new CustomEvent('showLoginModal'));
                return;
            }
            
            const tokenToUse = refreshedSession?.access_token || session.access_token;
            
            const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`,
                    'apikey': anonKey
                },
                body: JSON.stringify({
                    packageId: 'premium_monthly',
                    userId: user.id,
                    userEmail: user.email
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error starting checkout:', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อระบบชำระเงิน กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                {/* Back Button */}
                <div className="p-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all"
                    >
                        <ArrowLeft size={20} />
                        กลับ
                    </button>
                </div>

                {/* Membership Content */}
                <div className="pb-12">
                    <MembershipCard 
                        isDark={isDark} 
                        onUpgrade={handleUpgrade}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};
