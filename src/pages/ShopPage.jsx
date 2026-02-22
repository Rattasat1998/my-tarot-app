import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ExternalLink, Search, ShoppingBag, Sparkles, Loader, Tag } from 'lucide-react';

const CATEGORIES = ['ทั้งหมด', 'ของมงคล', 'หินนำโชค', 'เครื่องราง', 'เทียนหอม', 'ฮวงจุ้ย', 'ทั่วไป'];

export const ShopPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('affiliate_products')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                                <ShoppingBag size={24} className="text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-amber-200 to-orange-300 bg-clip-text text-transparent">
                                    ร้านค้ามงคล
                                </h1>
                                <p className="text-xs text-slate-500">สินค้าเสริมดวง เสริมโชค</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-amber-500 text-slate-900'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader size={32} className="text-amber-400 animate-spin mb-4" />
                        <p className="text-slate-500">กำลังโหลดสินค้า...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ShoppingBag size={48} className="text-slate-700 mb-4" />
                        <p className="text-slate-500 text-lg font-medium">ไม่พบสินค้า</p>
                        <p className="text-slate-600 text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((product) => (
                            <a
                                key={product.id}
                                href={product.affiliate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="aspect-square bg-slate-800 relative overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Sparkles size={40} className="text-slate-700" />
                                        </div>
                                    )}
                                    {product.category && product.category !== 'ทั่วไป' && (
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-[10px] font-bold text-slate-900">
                                            {product.category}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                                        <span className="flex items-center gap-1 text-xs text-white bg-amber-500/80 px-3 py-1 rounded-full font-medium">
                                            <ExternalLink size={12} /> ดูสินค้า
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-amber-300 transition-colors leading-snug">
                                        {product.name}
                                    </h3>
                                    {product.description && (
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                            {product.description}
                                        </p>
                                    )}
                                    {product.price && (
                                        <div className="mt-2 flex items-center gap-1">
                                            <Tag size={12} className="text-amber-400" />
                                            <span className="text-sm font-bold text-amber-400">
                                                ฿{Number(product.price).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
