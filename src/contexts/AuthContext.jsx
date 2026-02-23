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

            // Fetch profile data including premium status
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin, is_premium, subscription_status, premium_until')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    setIsAdmin(data.is_admin || false);
                    
                    // Attach premium data to user object for easy access throughout the app
                    const enhancedUser = {
                        ...session.user,
                        user_metadata: {
                            ...session.user.user_metadata,
                            is_premium: data.is_premium || false,
                            subscription_status: data.subscription_status || 'inactive',
                            premium_until: data.premium_until || null
                        }
                    };
                    setUser(enhancedUser);
                } else {
                    setUser(session.user);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setUser(session.user);
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

    // Function to refresh user profile data (e.g. after payment)
    const refreshProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('is_admin, is_premium, subscription_status, premium_until')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    setIsAdmin(data.is_admin || false);
                    setUser({
                        ...session.user,
                        user_metadata: {
                            ...session.user.user_metadata,
                            is_premium: data.is_premium || false,
                            subscription_status: data.subscription_status || 'inactive',
                            premium_until: data.premium_until || null
                        }
                    });
                }
            } catch (err) {
                console.error('Error refreshing profile:', err);
            }
        }
    };

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

    const signInWithLine = () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
        window.location.href = `${supabaseUrl}/functions/v1/line-auth?action=login`;
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
        <AuthContext.Provider value={{ user, isAdmin, signInWithGoogle, signInWithLine, signOut, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
