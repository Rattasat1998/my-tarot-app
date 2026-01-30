import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Share2, Sparkles } from 'lucide-react';
import {
    getZodiacFromDate,
    getLuckyNumbers,
    getMemberLevel,
    generateCardNumber,
    getCardExpiry,
    formatThaiDate
} from '../utils/zodiacUtils';

export const MysticalIdCard = ({
    user,
    profile,
    onClose,
    isDark = false
}) => {
    const cardRef = useRef(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Calculate all mystical data
    const zodiac = getZodiacFromDate(profile?.birthdate);
    const luckyNumbers = getLuckyNumbers(profile?.birthdate);
    const memberLevel = getMemberLevel(profile?.credits || 0);
    const cardNumber = generateCardNumber(user?.id);
    const cardExpiry = getCardExpiry();
    const issueDate = formatThaiDate(new Date());

    // Full name
    const fullName = [profile?.first_name, profile?.last_name]
        .filter(Boolean)
        .join(' ') || 'ไม่ระบุชื่อ';

    // Download card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);
        try {
            // Temporarily unflip for front capture
            const wasFlipped = isFlipped;
            if (wasFlipped) setIsFlipped(false);

            await new Promise(r => setTimeout(r, 300));

            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `mystical-id-${cardNumber}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            if (wasFlipped) setIsFlipped(true);
        } catch (error) {
            console.error('Error downloading card:', error);
        }
        setIsDownloading(false);
    };

    // Share card
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'บัตรสายมูของฉัน',
                    text: `ฉันคือราศี${zodiac?.thaiName || 'ไม่ทราบ'} ${zodiac?.symbol || ''} เลขนำโชค ${luckyNumbers.double}`,
                    url: window.location.origin
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            <div
                className="relative z-10 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Card Container with 3D Flip */}
                <div
                    className="perspective-1000 cursor-pointer mb-4"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: '1000px' }}
                >
                    <div
                        ref={cardRef}
                        className="relative transition-transform duration-700"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                    >
                        {/* Front Side */}
                        <div
                            className="w-full aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            {/* Card Background - Mystical Design */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950">
                                {/* Golden border glow */}
                                <div className="absolute inset-0 rounded-2xl" style={{
                                    background: 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, transparent 30%, transparent 70%, rgba(255,215,0,0.2) 100%)',
                                    boxShadow: 'inset 0 0 30px rgba(255,215,0,0.1)'
                                }}></div>

                                {/* Mandala/Sacred geometry pattern */}
                                <div className="absolute inset-0 opacity-10" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Cpath d='M30 30m-28 0a28 28 0 1 1 56 0a28 28 0 1 1 -56 0M30 30m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0M30 30m-12 0a12 12 0 1 1 24 0a12 12 0 1 1 -24 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                    backgroundSize: '60px 60px'
                                }}></div>

                                {/* Glowing orbs */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
                                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                                </div>

                                {/* Stars pattern */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>

                                {/* Golden corner ornaments */}
                                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-amber-500/50 rounded-tl-lg"></div>
                                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-amber-500/50 rounded-tr-lg"></div>
                                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-amber-500/50 rounded-bl-lg"></div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-amber-500/50 rounded-br-lg"></div>
                            </div>

                            {/* Card Content */}
                            <div className="relative h-full p-5 flex flex-col justify-between text-white">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">🪬</span>
                                            <span className="text-xs uppercase tracking-widest opacity-70">บัตรประจำตัว</span>
                                            {/* Member Badge - inline */}
                                            <div
                                                className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ml-2"
                                                style={{ backgroundColor: memberLevel.color + '30', color: memberLevel.color }}
                                            >
                                                {memberLevel.icon} {memberLevel.thaiName}
                                            </div>
                                        </div>
                                        <h2 className="text-lg font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                                            สายมู
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl mb-1">{zodiac?.symbol || '✨'}</div>
                                        <div className="text-xs opacity-70">{zodiac?.name || 'ไม่ทราบราศี'}</div>
                                    </div>
                                </div>

                                {/* Middle - Photo & Info */}
                                <div className="flex gap-4 items-center">
                                    {/* Photo */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-lg bg-slate-800 flex-shrink-0">
                                        {profile?.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : user?.user_metadata?.avatar_url ? (
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                {fullName[0]?.toUpperCase() || '?'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-lg font-bold truncate">{fullName}</div>
                                        <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                                            <span>ธาตุ{zodiac?.element || '-'}</span>
                                            <span>{zodiac?.elementEmoji || ''}</span>
                                            <span className="opacity-50">|</span>
                                            <span style={{ color: zodiac?.color }}>สี{zodiac?.colorName || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs opacity-50 mb-1">หมายเลขบัตร</div>
                                        <div className="font-mono text-sm tracking-wider">{cardNumber}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="text-xs opacity-50">เลขนำโชค</div>
                                            <div className="text-2xl font-bold text-amber-400">{luckyNumbers.double}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div
                            className="absolute inset-0 w-full aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }}
                        >
                            {/* Card Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                            </div>

                            {/* Back Content */}
                            <div className="relative h-full p-5 flex flex-col justify-between text-white">
                                {/* QR Code */}
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="bg-white p-3 rounded-xl">
                                        <QRCodeSVG
                                            value={`${window.location.origin}/card/${user?.id}`}
                                            size={100}
                                            level="M"
                                        />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <div className="opacity-50">วันที่ออกบัตร</div>
                                        <div className="font-medium">{issueDate}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="opacity-50">หมดอายุ</div>
                                        <div className="font-medium">{cardExpiry}</div>
                                    </div>
                                </div>

                                {/* Barcode style */}
                                <div className="mt-3 h-8 bg-gradient-to-r from-white/10 via-white/30 to-white/10 rounded flex items-center justify-center">
                                    <span className="font-mono text-xs tracking-widest opacity-70">
                                        {cardNumber.replace(/-/g, ' ')}
                                    </span>
                                </div>

                                {/* Footer */}
                                <div className="text-center text-xs opacity-50 mt-2">
                                    satduangdao.com
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flip hint */}
                <div className="text-center text-white/50 text-sm mb-4 flex items-center justify-center gap-2">
                    <RotateCcw size={14} />
                    แตะบัตรเพื่อพลิก
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Download size={18} />
                        {isDownloading ? 'กำลังดาวน์โหลด...' : 'บันทึกรูป'}
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Close hint */}
                <div className="text-center text-white/30 text-xs mt-4">
                    แตะพื้นหลังเพื่อปิด
                </div>
            </div>
        </div>
    );
};

export default MysticalIdCard;
