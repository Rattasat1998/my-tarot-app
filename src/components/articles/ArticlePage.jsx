import React from 'react';
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { getArticleById, ARTICLES } from '../../data/articles';
import { usePageSEO } from '../../hooks/usePageTitle';

export const ArticlePage = ({ articleId, resetGame, openArticle }) => {
    const article = getArticleById(articleId);
    usePageSEO({
        title: article ? article.title : 'บทความดูดวง',
        description: article ? (article.excerpt || article.title) : 'รวมบทความดูดวงและศาสตร์โบราณ ไพ่ทาโรต์ โหราศาสตร์ เลขศาสตร์ ฮวงจุ้ย และอีกมากมาย',
        keywords: 'บทความดูดวง, โหราศาสตร์, ไพ่ทาโรต์, ศาสตร์โบราณ',
    });

    if (!article) {
        return (
            <div className="w-full max-w-4xl mx-auto text-center py-20">
                <h2 className="text-2xl text-slate-400">ไม่พบบทความ</h2>
                <button onClick={resetGame} className="mt-4 text-purple-400 hover:text-purple-300">
                    กลับหน้าหลัก
                </button>
            </div>
        );
    }

    // Get related articles (same category, excluding current)
    const relatedArticles = ARTICLES
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 3);

    // Simple markdown-like parser
    const renderContent = (content) => {
        return content.split('\n\n').map((block, idx) => {
            // Headers
            if (block.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-serif text-yellow-500 mt-8 mb-4">{block.replace('## ', '')}</h2>;
            }
            if (block.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-semibold text-purple-300 mt-6 mb-3">{block.replace('### ', '')}</h3>;
            }
            // Blockquote
            if (block.startsWith('> ')) {
                return (
                    <blockquote key={idx} className="border-l-4 border-purple-500 pl-4 py-2 my-4 italic text-slate-300 bg-slate-800/30 rounded-r-lg">
                        {block.replace('> ', '')}
                    </blockquote>
                );
            }
            // Horizontal rule
            if (block.startsWith('---')) {
                return <hr key={idx} className="my-8 border-slate-700" />;
            }
            // Regular paragraph with inline formatting
            return (
                <p key={idx} className="text-slate-300 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{
                        __html: block
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-200">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/\n/g, '<br/>')
                    }}
                />
            );
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-8">
                <button onClick={resetGame} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>กลับสู่หน้าหลัก</span>
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-amber-900/30 text-amber-300 text-xs rounded-full border border-amber-500/20">
                        {article.category}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime}
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif text-yellow-500 leading-tight mb-4">
                    {article.title}
                </h1>
                <p className="text-lg text-slate-400">
                    {article.description}
                </p>
            </header>

            {/* Featured Image */}
            {article.image && (
                <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                </div>
            )}

            {/* Article Content */}
            <article className="prose prose-invert prose-lg max-w-none">
                <div className="bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800">
                    {article.content ? renderContent(article.content) : (
                        <p className="text-slate-400">{article.description}</p>
                    )}
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-lg font-serif text-purple-300 mb-4 flex items-center gap-2">
                        <BookOpen size={18} />
                        บทความที่เกี่ยวข้อง
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {relatedArticles.map(related => (
                            <button
                                key={related.id}
                                onClick={() => openArticle(related.id)}
                                className="text-left p-4 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-purple-500/30 hover:bg-slate-800/50 transition-all group"
                            >
                                {related.image && (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-3">
                                        <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="text-sm text-white font-medium group-hover:text-amber-300 transition-colors mb-2 line-clamp-2">
                                    {related.title}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">{related.readTime}</span>
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* More Articles */}
            <div className="mt-12">
                <h3 className="text-lg font-serif text-purple-300 mb-4">บทความอื่นๆ</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ARTICLES.filter(a => a.id !== article.id).slice(0, 4).map(a => (
                        <button
                            key={a.id}
                            onClick={() => openArticle(a.id)}
                            className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all text-left group"
                        >
                            <div className="text-xs text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                                {a.title}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12 text-center">
                <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-full transition-all"
                >
                    กลับหน้าหลัก
                </button>
            </div>
        </div>
    );
};
