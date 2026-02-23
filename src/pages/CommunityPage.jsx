import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Star, Crown, Search, Filter, TrendingUp, Calendar, Award, BookOpen, ArrowLeft } from 'lucide-react';
import { PremiumGate } from '../components/ui/PremiumGate';
import { usePremium } from '../hooks/usePremium';

export const CommunityPage = ({ isDark }) => {
    const { isPremium } = usePremium();
    const [activeTab, setActiveTab] = useState('discussions');
    const [searchTerm, setSearchTerm] = useState('');

    const discussions = [
        {
            id: 1,
            title: 'การเริ่มต้นสมาธิสำหรับมือใหม่',
            author: 'MindfulGuru',
            avatar: '🧘',
            category: 'meditation',
            replies: 23,
            likes: 45,
            views: 234,
            isPinned: true,
            preview: 'สวัสดีครับ ผมเพิ่งเริ่มสมาธิได้ 2 สัปดาห์ อยากขอคำแนะนำจากผู้มีประสบการณ์ครับ...',
            tags: ['สมาธิ', 'เริ่มต้น', 'คำแนะนำ'],
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 2,
            title: 'ไพ่ The Star บอกอะไรเกี่ยวกับความรักของฉัน',
            author: 'TarotSeeker',
            avatar: '🔮',
            category: 'tarot',
            replies: 18,
            likes: 32,
            views: 156,
            isPinned: false,
            preview: 'วันนี้ได้ไพ่ The Star ในการอ่านไพ่ความรัก รู้สึกว่ามันบอกถึงความหวังและการเริ่มต้นใหม่...',
            tags: ['ทาโรต์', 'ความรัก', 'The Star'],
            createdAt: new Date(Date.now() - 172800000).toISOString()
        }
    ];

    const expertAnswers = [
        {
            id: 1,
            expert: 'ครู้มานา สมาธิวิทยา',
            avatar: '👨‍🏫',
            expertise: 'สมาธิและจิตวิญญาณ',
            question: 'จะทำสมาธิอย่างไรให้ไม่ง่ง?',
            answer: 'การง่งงันเป็นเรื่องปกติครับ สิ่งสำคัญคือการยอมรับและกลับมาสู่จุดโฟกัส...',
            likes: 67,
            helpful: 45
        }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: 'Workshop: การอ่านไพ่ Celtic Cross',
            date: new Date(Date.now() + 86400000 * 3).toISOString(),
            type: 'workshop',
            participants: 12,
            maxParticipants: 20,
            instructor: 'MasterTarot'
        },
        {
            id: 2,
            title: 'Group Meditation: สมาธิเชื่อมต่อจิตวิญญาณ',
            date: new Date(Date.now() + 86400000 * 7).toISOString(),
            type: 'meditation',
            participants: 8,
            maxParticipants: 15,
            instructor: 'ZenMaster'
        }
    ];

    const categories = [
        { id: 'all', name: 'ทั้งหมด', icon: '📚' },
        { id: 'tarot', name: 'ทาโรต์', icon: '🔮' },
        { id: 'meditation', name: 'สมาธิ', icon: '🧘' },
        { id: 'zodiac', name: 'ราศี', icon: '⭐' },
        { id: 'personal-growth', name: 'พัฒนาตน', icon: '🌱' },
        { id: 'dreams', name: 'ความฝัน', icon: '💭' }
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
                {/* Header */}
                <div className="p-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all mb-6"
                    >
                        <ArrowLeft size={20} />
                        กลับ
                    </button>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                                <Users className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Expert Community
                            </h1>
                        </div>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            เชื่อมต่อกับผู้เชี่ยวชาญและชุมชนผู้มองหาการพัฒนาตนเอง
                        </p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="max-w-6xl mx-auto px-6 pb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="ค้นหาบทความ, คำถาม, หรือผู้เชี่ยวชาญ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-100 border border-slate-300'} focus:outline-none focus:border-purple-500`}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveTab(category.id)}
                                    className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                                        activeTab === category.id
                                            ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    <span>{category.icon}</span>
                                    <span className="hidden sm:inline">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-6 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Expert Answers Section */}
                            <PremiumGate 
                                feature="expertCommunity" 
                                fallback={
                                    <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-8 text-center`}>
                                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl mb-4">
                                            <Crown className="w-5 h-5 text-purple-400" />
                                            <span className="text-purple-300 font-medium">Premium Feature</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Expert Answers</h3>
                                        <p className="text-slate-400 mb-4">คำตอบจากผู้เชี่ยวชาญสำหรับสมาชิก Premium</p>
                                        <div className="space-y-3">
                                            {expertAnswers.map(answer => (
                                                <div key={answer.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl">{answer.avatar}</span>
                                                        <div>
                                                            <div className="font-medium text-white">{answer.expert}</div>
                                                            <div className="text-xs text-slate-400">{answer.expertise}</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-slate-900/50 rounded-lg mb-2">
                                                        <p className="text-slate-300 text-sm italic">Q: {answer.question}</p>
                                                    </div>
                                                    <div className="text-slate-400 text-sm line-clamp-2">
                                                        A: {answer.answer}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                            >
                                <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-400" />
                                        Expert Answers
                                    </h3>
                                    <div className="space-y-4">
                                        {expertAnswers.map(answer => (
                                            <div key={answer.id} className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-3xl">{answer.avatar}</span>
                                                    <div>
                                                        <div className="font-bold text-white">{answer.expert}</div>
                                                        <div className="text-sm text-purple-300">{answer.expertise}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <div className="text-sm text-purple-300 mb-1">คำถาม:</div>
                                                    <p className="text-white font-medium">{answer.question}</p>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <div className="text-sm text-purple-300 mb-1">คำตอบ:</div>
                                                    <p className="text-slate-200 leading-relaxed">{answer.answer}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-sm">
                                                    <button className="flex items-center gap-1 text-green-400 hover:text-green-300">
                                                        <Heart size={14} />
                                                        {answer.helpful} ช่วยเหลือ
                                                    </button>
                                                    <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
                                                        <Star size={14} />
                                                        {answer.likes} ชอบ
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PremiumGate>

                            {/* Community Discussions */}
                            <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-purple-400" />
                                    การสนทนาในชุมชน
                                </h3>
                                <div className="space-y-4">
                                    {discussions.map(discussion => (
                                        <div key={discussion.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{discussion.avatar}</span>
                                                    <div>
                                                        <div className="font-medium text-white">{discussion.author}</div>
                                                        <div className="text-xs text-slate-400">
                                                            {new Date(discussion.createdAt).toLocaleDateString('th-TH')}
                                                        </div>
                                                    </div>
                                                </div>
                                                {discussion.isPinned && (
                                                    <div className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs">
                                                        📌 ปักหมุด
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <h4 className="font-bold text-white mb-2">{discussion.title}</h4>
                                            <p className="text-slate-300 text-sm mb-3 line-clamp-2">{discussion.preview}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {discussion.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={14} />
                                                    {discussion.replies} ตอบ
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} />
                                                    {discussion.likes}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {discussion.views} อ่าน
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Upcoming Events */}
                            <PremiumGate 
                                feature="expertCommunity" 
                                fallback={
                                    <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                            Upcoming Events
                                        </h3>
                                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                                            <Crown className="w-4 h-4 text-purple-400" />
                                            <span className="text-purple-300 text-sm">Premium</span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2">Workshops และ events สำหรับสมาชิก Premium</p>
                                    </div>
                                }
                            >
                                <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-400" />
                                        Upcoming Events
                                    </h3>
                                    <div className="space-y-3">
                                        {upcomingEvents.map(event => (
                                            <div key={event.id} className="p-3 bg-slate-800/30 rounded-xl border border-slate-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        event.type === 'workshop' ? 'bg-blue-400' : 'bg-green-400'
                                                    }`} />
                                                    <span className="text-white font-medium text-sm">{event.title}</span>
                                                </div>
                                                <div className="text-xs text-slate-400 mb-2">
                                                    {new Date(event.date).toLocaleDateString('th-TH', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-purple-300">
                                                        {event.participants}/{event.maxParticipants} คน
                                                    </span>
                                                    <button className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs hover:bg-purple-500/30">
                                                        เข้าร่วม
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PremiumGate>

                            {/* Community Stats */}
                            <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-purple-400" />
                                    Community Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">สมาชิกทั้งหมด</span>
                                        <span className="text-white font-bold">2,847</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">สมาชิก Premium</span>
                                        <span className="text-purple-300 font-bold">1,234</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">บทความวันนี้</span>
                                        <span className="text-white font-bold">47</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">ผู้เชี่ยวชาญ</span>
                                        <span className="text-purple-300 font-bold">12</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expert Contributors */}
                            <div className={`rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-300'} p-6`}>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-purple-400" />
                                    Expert Contributors
                                </h3>
                                <div className="space-y-3">
                                    {['ครู้มานา สมาธิวิทยา', 'Master Tarot', 'Astrology Guru'].map((expert, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
                                                <span className="text-lg">👨‍🏫</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium text-sm">{expert}</div>
                                                <div className="text-xs text-purple-300">Expert</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
