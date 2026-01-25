import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, History, LogOut, ArrowLeft, Home } from 'lucide-react';
import { PendingApprovals } from '../components/admin/PendingApprovals';
import { ApprovalHistory } from '../components/admin/ApprovalHistory';

export const AdminPage = ({ isDark }) => {
    const { user, isAdmin, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) return null;

    const navItems = [
        { path: '/admin', label: 'รอตรวจสอบ', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/history', label: 'ประวัติการอนุมัติ', icon: <History size={20} /> },
    ];

    const isActive = (path) => {
        if (path === '/admin' && (location.pathname === '/admin' || location.pathname === '/admin/')) return true;
        return location.pathname === path;
    };

    return (
        <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-purple-50 text-slate-900 font-sans'}`}>
            {/* Sidebar / Header */}
            <aside className={`w-full md:w-64 flex-shrink-0 flex flex-col border-r ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="p-6 border-b border-inherit">
                    <h1 className={`text-xl font-bold font-serif flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Admin Panel
                    </h1>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Logged in as {user?.email}
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-visible flex md:block gap-2 md:gap-0">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${isActive(item.path)
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                    : isDark
                                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-inherit space-y-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <Home size={20} />
                        <span>กลับหน้าหลัก</span>
                    </Link>
                    <button
                        onClick={() => signOut()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all ${isDark ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                        <LogOut size={20} />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden h-screen flex flex-col">
                <Routes>
                    <Route path="/" element={<PendingApprovals isDark={isDark} />} />
                    <Route path="/history" element={<ApprovalHistory isDark={isDark} />} />
                </Routes>
            </main>
        </div>
    );
};
