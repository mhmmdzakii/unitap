// components/PublicLinkCard.tsx
"use client";
import { MoreVertical, Music, Video, ShoppingBag } from 'lucide-react';
import { ICON_MAP, BrandIcons } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function PublicLinkCard({ link, theme, designConfig, isOutline, shapeClass, profileId }: any) {
  const cat = link.processedCat || 'standard';
  const img = link.processedImg;
  const title = link.title || 'My Link';
  const url = (link.url || '').toLowerCase();
  
  const isFeatured = link.layout === 'featured';
  const isMinimal = link.layout === 'minimal';

  const btnStyleStr = designConfig.colorBtn ? (isOutline ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '2px' } : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' }) : {};
  const baseClasses = `block w-full transition-all hover:scale-[1.02] shadow-sm backdrop-blur-md cursor-pointer ${isOutline && !designConfig.colorBtn ? 'border-2 border-current bg-transparent' : theme.btnTheme}`;

 // =========================================================
  // 🔥 MESIN SULTAN: WA ROTATOR ANTI-BADAI & ANALYTICS 🔥
  // =========================================================
  const handleLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault(); 

    // 1. Tembak Data ke Analytics
    try {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const device = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ? 'Mobile' : 'Desktop';
      const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct / Link di Bio';
      await supabase.from('link_analytics').insert({ link_id: link.id, user_id: profileId, device_type: device, referrer: referrer });
    } catch (error) {}

    // 2. Mesin WA Rotator (FIXED)
    let finalUrl = link.url;
    let decodedUrl = decodeURIComponent(link.url || ''); // 🔥 Cairin kode %2C balik jadi koma
    
    if (decodedUrl.includes('wa.me') || decodedUrl.includes('api.whatsapp')) {
      if (decodedUrl.includes(',')) {
        // Bersihin http/https biar gampang dipecah
        let cleanStr = decodedUrl.replace(/^https?:\/\//i, '');
        const numbers = cleanStr.split(',');
        const randomIndex = Math.floor(Math.random() * numbers.length);
        
        // Ambil 1 nomor acak, terus bersihin semua huruf, sisain angkanya doang!
        let picked = numbers[randomIndex].trim();
        picked = picked.replace(/^wa\.me\//i, '').replace(/^api\.whatsapp\.com\/send\?phone=/i, '').replace(/\D/g, ''); 
        
        finalUrl = `https://wa.me/${picked}`; // Rakit ulang jadi link WA yang sempurna
      }
    }

    // 3. Buka Linknya
    if (!finalUrl.startsWith('http')) finalUrl = `https://${finalUrl}`;
    window.open(finalUrl, '_blank');
  };

  // =========================================================
  // 🎨 TAMPILAN KARTU LINK (SAMA KAYAK KEMAREN TAPI BERSIH)
  // =========================================================
  if (isFeatured && cat !== 'standard') {
    return (
      <div onClick={handleLinkClick} className={`${baseClasses} rounded-[24px] p-3 flex flex-col gap-3 relative overflow-hidden`} style={btnStyleStr}>
        <div className="w-full aspect-[2/1] rounded-[16px] overflow-hidden shadow-sm relative bg-black/5 flex items-center justify-center"><img src={img} className="w-full h-full object-cover" alt="Cover" /></div>
        <div className="px-2 pb-2 text-left relative flex justify-between items-end">
           <div className="flex-1 overflow-hidden pr-2">
             <h4 className="font-extrabold text-[16px] truncate leading-tight">{title}</h4>
             <div className="flex items-center gap-1.5 mt-1 opacity-70">
                {cat === 'music' && <Music size={14} />}
                {cat === 'video' && <Video size={14} />}
                {cat === 'store' && <ShoppingBag size={14} />}
                <span className="text-[12px] font-bold uppercase tracking-wider">{cat === 'music' ? 'Listen Now' : cat === 'video' ? 'Watch Video' : 'Shop Now'}</span>
             </div>
           </div>
           <div className="p-2 opacity-50"><MoreVertical size={18} /></div>
        </div>
      </div>
    );
  }

  if (cat !== 'standard' && !isMinimal) {
    return (
      <div onClick={handleLinkClick} className={`${baseClasses} ${shapeClass} p-2 flex justify-between items-center overflow-hidden`} style={btnStyleStr}>
        <div className="w-[52px] h-[52px] rounded-[12px] bg-black/5 overflow-hidden flex-shrink-0 shadow-sm z-10 flex items-center justify-center"><img src={img} className="w-full h-full object-cover" alt="Thumb" /></div>
        <div className="flex-1 flex flex-col items-center justify-center px-3 z-0 overflow-hidden">
           <span className="font-bold text-[15px] truncate leading-tight text-center w-full">{title}</span>
           <span className="text-[12px] font-medium truncate opacity-70 mt-0.5 capitalize flex items-center justify-center gap-1 w-full">
              {cat === 'music' && <Music size={12} />}
              {cat === 'video' && <Video size={12} />}
              {cat === 'store' && <ShoppingBag size={12} />}
              {cat}
           </span>
        </div>
        <div className="w-[52px] flex justify-center items-center flex-shrink-0 z-10 opacity-50"><MoreVertical size={18} /></div>
      </div>
    );
  }

  let IconToRender = null;
  if (link.custom_icon && ICON_MAP[link.custom_icon]) { const CustomIcon = ICON_MAP[link.custom_icon]; IconToRender = <CustomIcon size={22} strokeWidth={1.5} />; } 
  else if (url.includes('spotify') || url.includes('apple.com')) IconToRender = <BrandIcons.spotify />;
  else if (url.includes('youtube.com') || url.includes('youtu.be')) IconToRender = <BrandIcons.youtube />;
  else if (url.includes('tiktok.com')) IconToRender = <BrandIcons.tiktok />;
  else if (url.includes('instagram.com')) IconToRender = <BrandIcons.instagram />;
  else if (url.includes('maps.google') || url.includes('goo.gl/maps')) IconToRender = <BrandIcons.google_maps />;
  else if (url.includes('wa.me') || url.includes('whatsapp.com')) IconToRender = <BrandIcons.whatsapp />;
  else if (cat === 'music') IconToRender = <Music size={22} strokeWidth={1.5} />;
  else if (cat === 'video') IconToRender = <Video size={22} strokeWidth={1.5} />;
  else if (cat === 'store') IconToRender = <ShoppingBag size={22} strokeWidth={1.5} />;
  
  return (
    <div onClick={handleLinkClick} className={`${baseClasses} ${shapeClass} py-4 px-4 flex justify-between items-center`} style={btnStyleStr}>
       <div className="w-10 flex justify-center items-center opacity-90 z-10">{IconToRender ? IconToRender : <div className="w-5"></div>}</div>
       <span className="flex-1 font-bold text-[15px] truncate text-center px-2 z-0">{title}</span>
       <div className="w-10 flex justify-center items-center flex-shrink-0 z-10 opacity-50"><MoreVertical size={18} /></div>
    </div>
  );
}