// components/PublicLinkCard.tsx
"use client";
import { useState } from 'react';
import { MoreVertical, Music, Video, ShoppingBag, X, Loader2, Lock } from 'lucide-react';
import { ICON_MAP, BrandIcons } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function PublicLinkCard({ 
  link, 
  theme, 
  designConfig, 
  isOutline, 
  shapeClass, 
  profileId 
}: { 
  link: any; 
  theme: any; 
  designConfig: any; 
  isOutline: boolean; 
  shapeClass: string; 
  profileId: any; 
}) {
  const cat = link.processedCat || 'standard';
  const img = link.processedImg; // Akan terisi otomatis oleh custom foto / logo web
  const title = link.title || 'My Link';
  const rawUrl = (link.url || '').toLowerCase().trim();
  
  const isFeatured = link.layout === 'featured';
  const isMinimal = link.layout === 'minimal';

  // 🔥 STATE POPUP GEMBOK
  const [showLeadsForm, setShowLeadsForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadWa, setLeadWa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const btnStyleStr = designConfig.colorBtn ? (isOutline ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '2px' } : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' }) : {};
  
  const baseClasses = `relative z-[50] block w-full transition-all active:scale-[0.96] shadow-sm backdrop-blur-md cursor-pointer select-none touch-manipulation ${isOutline && !designConfig.colorBtn ? 'border-2 border-current bg-transparent' : theme.btnTheme}`;

 // =========================================================
  // 🔗 FORMATTER URL PINTAR (ANTI-ERROR LOCALHOST & PENCEGAT WA)
  // =========================================================
  const getSafeUrl = () => {
    let finalUrl = link.url || '#';
    
    // 🔥 CEK APAKAH ADA KODE AFFILIATE DI HP PENGUNJUNG
    let refCode = '';
    if (typeof window !== 'undefined') {
      refCode = localStorage.getItem('unitap_ref') || '';
    }
    
    if (finalUrl.includes('wa.me') || finalUrl.includes('api.whatsapp')) {
      let phone = '';
      if (finalUrl.includes(',')) {
        let cleanStr = finalUrl.replace(/^https?:\/\//i, '');
        const numbers = cleanStr.split(',');
        const randomIndex = Math.floor(Math.random() * numbers.length);
        phone = numbers[randomIndex].trim();
      } else {
        phone = finalUrl;
      }
      
      phone = phone.replace(/^https?:\/\//i, '').replace(/^wa\.me\//i, '').replace(/^api\.whatsapp\.com\/send\?phone=/i, '').replace(/\D/g, ''); 
      
      // 🔥 LOGIKA PENCEGAT WA
      if (refCode) {
        // Kalau link WA-nya udah ada teks bawaan, kita tambahin di belakangnya
        const existingTextMatch = finalUrl.match(/[?&]text=([^&]+)/);
        let message = existingTextMatch ? decodeURIComponent(existingTextMatch[1]) + ` (Referensi: ${refCode})` : `Halo, saya tertarik dengan produk di Link Anda. (Referensi: ${refCode})`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      } else {
        return `https://wa.me/${phone}`; 
      }
    }

    if (finalUrl !== '#' && !finalUrl.startsWith('http')) {
      if (finalUrl.includes('localhost') || finalUrl.startsWith('/')) {
        finalUrl = `http://${finalUrl.replace('http://', '')}`;
      } else {
        finalUrl = `https://${finalUrl}`;
      }
    }
    return finalUrl;
  };
  // =========================================================
  // 🔥 FUNGSI KLIK & GEMBOK
  // =========================================================
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    // 🔒 LOGIKA GEMBOK
    if (cat === 'store' || link.is_locked) {
      setShowLeadsForm(true);
      return; 
    }

    openLinkAndTrack(getSafeUrl());
  };

  const openLinkAndTrack = (safeUrl: string) => {
    if (safeUrl !== '#') {
      window.open(safeUrl, '_blank');
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const device = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ? 'Mobile' : 'Desktop';
    const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct / Link di Bio';

    supabase.from('link_analytics').insert({ 
      link_id: link.id, 
      user_id: profileId, 
      device_type: device, 
      referrer: referrer 
    }).then(({ error }) => {
      if (error) console.error("Analytics Error:", error);
    });
  };

  const handleLeadsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!leadName || !leadWa) return;
    setIsSubmitting(true);

    const { error } = await supabase.from('leads').insert({
      user_id: profileId,
      name: leadName,
      whatsapp_number: leadWa
    });

    setIsSubmitting(false);

    if (!error) {
      setShowLeadsForm(false); 
      openLinkAndTrack(getSafeUrl()); 
      setLeadName('');
      setLeadWa('');
    } else {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };


  // =========================================================
  // 🎨 TAMPILAN KARTU LINK
  // =========================================================
  
  const renderCard = () => {
    // 🔥 SYARAT TAMBAHAN: HARUS ADA 'img' BIAR GAK MUNCULIN KOTAK KOSONG
    
    // 1. LAYOUT FEATURED
    if (isFeatured && img) {
      return (
        <div onClick={handleLinkClick} className={`${baseClasses} rounded-[24px] p-3 flex flex-col gap-3 overflow-hidden`} style={btnStyleStr}>
          <div className="w-full aspect-[2/1] rounded-[16px] overflow-hidden shadow-sm relative bg-black/5 flex items-center justify-center">
            <img src={img} className="w-full h-full object-cover pointer-events-none" alt="Cover" />
          </div>
          <div className="px-2 pb-2 text-left relative flex justify-between items-end">
             <div className="flex-1 overflow-hidden pr-2">
               <h4 className="font-extrabold text-[16px] truncate leading-tight">{title}</h4>
               <div className="flex items-center gap-1.5 mt-1 opacity-70">
                  {cat === 'music' && <Music size={14} />}
                  {cat === 'video' && <Video size={14} />}
                  {cat === 'store' && <Lock size={14} />} 
                  <span className="text-[12px] font-bold uppercase tracking-wider">
                    {cat === 'music' ? 'Listen Now' : cat === 'video' ? 'Watch Video' : 'Buka Link'}
                  </span>
               </div>
             </div>
             <div className="p-2 opacity-50"><MoreVertical size={18} /></div>
          </div>
        </div>
      );
    }

    // 2. LAYOUT BERGAMBAR (THUMBNAIL) - HARUS ADA 'img'
    if (!isMinimal && img) {
      return (
        <div onClick={handleLinkClick} className={`${baseClasses} ${shapeClass} p-2 flex justify-between items-center overflow-hidden`} style={btnStyleStr}>
          <div className="w-[52px] h-[52px] rounded-[12px] bg-black/5 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
            <img src={img} className="w-full h-full object-cover pointer-events-none" alt="Thumb" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-3 overflow-hidden">
             <span className="font-bold text-[15px] truncate leading-tight text-center w-full">{title}</span>
             <span className="text-[12px] font-medium truncate opacity-70 mt-0.5 capitalize flex items-center justify-center gap-1 w-full">
                {cat === 'music' && <Music size={12} />}
                {cat === 'video' && <Video size={12} />}
                {cat === 'store' && <Lock size={12} />}
                {cat === 'store' ? 'Locked' : cat}
             </span>
          </div>
          <div className="w-[52px] flex justify-center items-center flex-shrink-0 opacity-50"><MoreVertical size={18} /></div>
        </div>
      );
    }

    // 3. LAYOUT STANDAR (ICON SAJA ATAU POLOS) -> JATUH KESINI KALAU GAK ADA GAMBAR
    let IconToRender = null;
    if (link.custom_icon && ICON_MAP[link.custom_icon]) { 
      const CustomIcon = ICON_MAP[link.custom_icon]; 
      IconToRender = <CustomIcon size={22} strokeWidth={1.5} />; 
    } 
    else if (rawUrl.includes('spotify') || rawUrl.includes('apple.com')) IconToRender = <BrandIcons.spotify />;
    else if (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')) IconToRender = <BrandIcons.youtube />;
    else if (rawUrl.includes('tiktok.com')) IconToRender = <BrandIcons.tiktok />;
    else if (rawUrl.includes('instagram.com')) IconToRender = <BrandIcons.instagram />;
    else if (rawUrl.includes('maps.google') || rawUrl.includes('goo.gl/maps')) IconToRender = <BrandIcons.google_maps />;
    else if (rawUrl.includes('wa.me') || rawUrl.includes('whatsapp.com')) IconToRender = <BrandIcons.whatsapp />;
    else if (cat === 'music') IconToRender = <Music size={22} strokeWidth={1.5} />;
    else if (cat === 'video') IconToRender = <Video size={22} strokeWidth={1.5} />;
    else if (cat === 'store') IconToRender = <Lock size={22} strokeWidth={1.5} />;
    
    return (
      <div onClick={handleLinkClick} className={`${baseClasses} ${shapeClass} py-4 px-4 flex justify-between items-center`} style={btnStyleStr}>
         <div className="w-10 flex justify-center items-center opacity-90">{IconToRender ? IconToRender : <div className="w-5"></div>}</div>
         <span className="flex-1 font-bold text-[15px] truncate text-center px-2">{title}</span>
         <div className="w-10 flex justify-center items-center flex-shrink-0 opacity-50"><MoreVertical size={18} /></div>
      </div>
    );
  };

  return (
    <>
      {renderCard()}

      {/* 🔥 RENDER POPUP GEMBOK */}
      {showLeadsForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all" onClick={() => setShowLeadsForm(false)}>
          <div 
            className="bg-white w-full max-w-sm p-6 rounded-[28px] shadow-2xl relative text-gray-900 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setShowLeadsForm(false)} 
              className="absolute top-4 right-4 bg-gray-100 text-gray-500 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20">
              <Lock size={20} />
            </div>
            
            <h3 className="text-xl font-black text-center mb-1 tracking-tight">Buka Kunci Tautan</h3>
            <p className="text-xs font-medium text-gray-500 text-center mb-6 px-4">
              Silakan masukkan nama dan WhatsApp Anda untuk melanjutkan ke tujuan.
            </p>

            <form onSubmit={handleLeadsSubmit} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
              />
              <input 
                type="number" 
                placeholder="No. WhatsApp (Contoh: 0812...)" 
                required
                value={leadWa}
                onChange={(e) => setLeadWa(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold outline-none transition-all placeholder:text-gray-400 placeholder:font-semibold"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !leadName || !leadWa}
                className={`w-full py-4 mt-2 rounded-xl font-black flex items-center justify-center gap-2 text-sm transition-all shadow-lg ${leadName && leadWa ? 'bg-[#39E09B] text-black hover:bg-[#2FCA8A] hover:shadow-[#39E09B]/40' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Lanjutkan 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}