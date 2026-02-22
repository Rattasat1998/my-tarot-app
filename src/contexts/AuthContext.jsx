import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Function to get user with profile data
        const getUserProfile = async (session) => {
            if (!session?.user) {
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            setUser(session.user);

            // Check admin status
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    setIsAdmin(data.is_admin || false);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            getUserProfile(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            getUserProfile(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account'
                    }
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error signing in:', error.message);
            alert(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`);

            // Fallback for demo/dev without backend: simulate login
            if (import.meta.env.DEV) {
                console.log('Simulating login for demo due to error');
                const mockUser = {
                    id: 'mock-user-123',
                    email: 'demo@example.com',
                    user_metadata: {
                        name: 'Demo User',
                        avatar_url: 'https://ui-avatars.com/api/?name=Demo+User'
                    }
                };
                setUser(mockUser);
            }
        }
    };

    const signInWithPhone = async (phone) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone,
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error sending OTP:', error.message);
            return { success: false, error: error.message };
        }
    };

    const verifyPhoneOTP = async (phone, token) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone,
                token,
                type: 'sms',
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error verifying OTP:', error.message);
            return { success: false, error: error.message };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error.message);
            // Fallback for demo
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, signInWithGoogle, signInWithPhone, verifyPhoneOTP, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
