import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Loader, X, Save, ExternalLink, Eye, EyeOff, GripVertical } from 'lucide-react';

const CATEGORIES = ['ของมงคล', 'หินนำโชค', 'เครื่องราง', 'เทียนหอม', 'ฮวงจุ้ย', 'ทั่วไป'];

const emptyForm = {
    name: '',
    description: '',
    price: '',
    image_url: '',
    affiliate_url: '',
    category: 'ทั่วไป',
    is_active: true,
    sort_order: 0,
};

export const ManageProducts = ({ isDark }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setErrorMsg(null);
            const { data, error } = await supabase
                .from('affiliate_products')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (product) => {
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            image_url: product.image_url || '',
            affiliate_url: product.affiliate_url || '',
            category: product.category || 'ทั่วไป',
            is_active: product.is_active ?? true,
            sort_order: product.sort_order || 0,
        });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.affiliate_url.trim()) {
            alert('กรุณากรอกชื่อสินค้าและลิงก์ Affiliate');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim() || null,
                price: form.price ? parseFloat(form.price) : null,
                image_url: form.image_url.trim() || null,
                affiliate_url: form.affiliate_url.trim(),
                category: form.category,
                is_active: form.is_active,
                sort_order: parseInt(form.sort_order) || 0,
            };

            if (editingId) {
                const { error } = await supabase
                    .from('affiliate_products')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('affiliate_products')
                    .insert(payload);
                if (error) throw error;
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err);
            alert('บันทึกไม่สำเร็จ: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`ลบสินค้า "${name}" ใช่หรือไม่?`)) return;

        try {
            const { error } = await supabase
                .from('affiliate_products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('ลบไม่สำเร็จ: ' + err.message);
        }
    };

    const toggleActive = async (id, currentActive) => {
        try {
            const { error } = await supabase
                .from('affiliate_products')
                .update({ is_active: !currentActive })
                .eq('id', id);
            if (error) throw error;
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
            );
        } catch (err) {
            console.error('Error toggling product:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader size={24} className="animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className={`p-4 sm:p-6 overflow-y-auto h-full ${isDark ? '' : 'bg-purple-50'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className={`text-xl font-bold font-serif ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        จัดการสินค้า
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {products.length} สินค้า
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/20"
                >
                    <Plus size={18} />
                    เพิ่มสินค้า
                </button>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
                    {errorMsg}
                </div>
            )}

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">
                                {editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">ชื่อสินค้า *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="เช่น หินอเมทิสต์เสริมดวง"
                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">รายละเอียด</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="คำอธิบายสินค้า..."
                                    rows={2}
                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>

                            {/* Price + Category */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">ราคา (฿)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">หมวดหมู่</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">URL รูปสินค้า</label>
                                <input
                                    type="url"
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    placeholder="https://cf.shopee.co.th/file/..."
                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                />
                                {form.image_url && (
                                    <div className="mt-2 w-20 h-20 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                                        <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                )}
                            </div>

                            {/* Affiliate URL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Affiliate Link *</label>
                                <input
                                    type="url"
                                    value={form.affiliate_url}
                                    onChange={(e) => setForm({ ...form, affiliate_url: e.target.value })}
                                    placeholder="https://shope.ee/..."
                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Sort Order + Active */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">ลำดับ</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.is_active}
                                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-slate-300">แสดงสินค้า</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-800">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors text-sm"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                {editingId ? 'บันทึก' : 'เพิ่มสินค้า'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Table */}
            {products.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBagIcon className={`mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                    <p className={`text-lg font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>ยังไม่มีสินค้า</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มต้น</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                isDark
                                    ? `bg-slate-900 border-slate-800 ${!product.is_active ? 'opacity-50' : ''}`
                                    : `bg-white border-slate-200 ${!product.is_active ? 'opacity-50' : ''}`
                            }`}
                        >
                            {/* Image */}
                            <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <GripVertical size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {product.name}
                                    </h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                        product.is_active
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-slate-700 text-slate-500'
                                    }`}>
                                        {product.is_active ? 'แสดง' : 'ซ่อน'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {product.category}
                                    </span>
                                    {product.price && (
                                        <span className="text-xs font-bold text-amber-400">
                                            ฿{Number(product.price).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => toggleActive(product.id, product.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                                    title={product.is_active ? 'ซ่อนสินค้า' : 'แสดงสินค้า'}
                                >
                                    {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                {product.affiliate_url && (
                                    <a
                                        href={product.affiliate_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                                        title="ดูลิงก์สินค้า"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                                <button
                                    onClick={() => openEdit(product)}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-blue-50 text-blue-500'}`}
                                    title="แก้ไข"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                    title="ลบ"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ShoppingBagIcon = ({ className }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);
