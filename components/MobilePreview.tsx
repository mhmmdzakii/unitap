// components/MobilePreview.tsx
"use client";
import { useState, useEffect } from 'react';
import {
  Copy, Check, BadgeCheck, MoreVertical, Music, Video, ShoppingBag, Mail
} from 'lucide-react';
import { THEMES_DATA, ICON_MAP, BrandIcons } from '@/lib/constants';

// =========================================================================
// 🔥 KOMPONEN RADAR SAKTI (AUTO-FETCH THUMBNAIL SPOTIFY & YOUTUBE) 🔥
// =========================================================================
function PreviewLinkItem({ link, theme, designConfig, isOutline, shapeClass }: any) {
  const url = (link.url || '').toLowerCase();
  let initialCat = link.type || 'standard';
  
  if (url.includes('spotify') || url.includes('apple')) initialCat = 'music';
  if (url.includes('youtube') || url.includes('youtu.be')) initialCat = 'video';
  if (url.includes('tokopedia') || url.includes('shopee')) initialCat = 'store';

  const defaultImg = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";
  
  // STATE BUAT REAL-TIME FETCHING
  const [imgData, setImgData] = useState<string>(link.image_url || defaultImg);
  const [titleData, setTitleData] = useState<string>(link.title || 'My Link');

  useEffect(() => {
    let isMounted = true;
    
    // Kalau user udah capek-capek upload gambar sendiri, jangan ditimpa!
    if (link.image_url) return;

    // 1. RADAR YOUTUBE (Pake Regex)
    if (initialCat === 'video') {
      const ytMatch = link.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (ytMatch) {
        setImgData(`https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`);
      } else {
        setImgData("https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80");
      }
    } 
    // 2. RADAR SPOTIFY (Pake API oEmbed Resmi Spotify)
    else if (initialCat === 'music') {
      if (url.includes('spotify.com')) {
        fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(link.url)}`)
          .then(res => res.json())
          .then(data => {
            if (isMounted && data.thumbnail_url) setImgData(data.thumbnail_url);
          })
          .catch(() => {
            if (isMounted) setImgData("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80");
          });
      } else {
        setImgData("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80");
      }
    }
    // 3. E-COMMERCE (Tas Belanja)
    else if (initialCat === 'store') {
      setImgData("https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80");
    }

    return () => { isMounted = false; };
  }, [link.url, link.image_url, initialCat, url]);

  const isFeatured = link.layout === 'featured';
  const isMinimal = link.layout === 'minimal';
  const btnStyleStr = designConfig.colorBtn ? (isOutline ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '1.5px' } : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' }) : {};
  const baseClasses = `w-full relative ${isOutline && !designConfig.colorBtn ? 'border-[1.5px] border-current bg-transparent' : theme.btnTheme}`;

  // TAMPILAN FEATURED (GEDE)
  if (isFeatured && initialCat !== 'standard') {
    return (
      <div className={`${baseClasses} rounded-[20px] p-2 flex flex-col gap-2`} style={btnStyleStr}>
        <div className="w-full aspect-[2/1] rounded-[12px] bg-black/5 overflow-hidden">
          <img src={imgData} className="w-full h-full object-cover" alt="Cover" />
        </div>
        <div className="px-1.5 pb-1 text-left">
           <h4 className="font-extrabold text-[13px] truncate">{titleData}</h4>
        </div>
      </div>
    );
  }

  // TAMPILAN CLASSIC (KOTAK KECIL DI KIRI)
  if (initialCat !== 'standard' && !isMinimal) {
    return (
      <div className={`${baseClasses} ${shapeClass} p-1.5 flex justify-between items-center`} style={btnStyleStr}>
        <div className="w-[40px] h-[40px] rounded-[10px] bg-black/5 overflow-hidden shrink-0">
          <img src={imgData} className="w-full h-full object-cover" alt="Thumb" />
        </div>
        <div className="flex-1 px-2 text-center overflow-hidden">
           <span className="font-bold text-[12px] truncate block">{titleData}</span>
           <span className="text-[10px] opacity-70 capitalize">{initialCat}</span>
        </div>
        <div className="w-[40px] flex justify-center shrink-0 opacity-50"><MoreVertical size={16} /></div>
      </div>
    );
  }

  // TAMPILAN MINIMAL (CUMA ICON)
  let IconToRender = null;
  if (link.custom_icon && ICON_MAP[link.custom_icon]) { const CustomIcon = ICON_MAP[link.custom_icon]; IconToRender = <CustomIcon size={18} strokeWidth={1.5} />; }
  else if (url.includes('spotify.com')) IconToRender = <BrandIcons.spotify />;
  else if (url.includes('youtube.com') || url.includes('youtu.be')) IconToRender = <BrandIcons.youtube />;
  else if (url.includes('tiktok.com')) IconToRender = <BrandIcons.tiktok />;
  else if (url.includes('instagram.com')) IconToRender = <BrandIcons.instagram />;
  else if (url.includes('maps.google') || url.includes('goo.gl/maps')) IconToRender = <BrandIcons.google_maps />;
  else if (url.includes('wa.me') || url.includes('whatsapp.com')) IconToRender = <BrandIcons.whatsapp />;
  else if (initialCat === 'music') IconToRender = <Music size={18} strokeWidth={1.5} />;
  else if (initialCat === 'video') IconToRender = <Video size={18} strokeWidth={1.5} />;
  else if (initialCat === 'store') IconToRender = <ShoppingBag size={18} strokeWidth={1.5} />;

  return (
    <div className={`${baseClasses} ${shapeClass} py-3 px-3 flex justify-between items-center`} style={btnStyleStr}>
       <div className="w-8 flex justify-center opacity-90">{IconToRender ? IconToRender : <div className="w-4 h-4 bg-black/10 rounded-sm"></div>}</div>
       <span className="flex-1 font-bold text-[13px] truncate text-center px-1">{titleData}</span>
       <div className="w-8 flex justify-center opacity-50"><MoreVertical size={16} /></div>
    </div>
  );
}


// =========================================================================
// WADAH HP BOONGAN UTAMA
// =========================================================================
export default function MobilePreview({ profile, links }: any) {
  const [copied, setCopied] = useState(false);

  const activeTheme = profile?.active_theme || 'light';
  const theme = THEMES_DATA[activeTheme] || THEMES_DATA.light;

  const designConfig = {
    fontFamily: profile?.font_family || theme.font || 'sans',
    buttonShape: profile?.button_shape || 'rounded',
    buttonStyle: profile?.button_style || 'fill',
    colorBg: profile?.color_bg || '',
    colorBtn: profile?.color_btn || '',
    colorText: profile?.color_text || ''
  };

  const isOutline = designConfig.buttonStyle === 'outline';
  const customBgStyle = designConfig.colorBg ? { backgroundColor: designConfig.colorBg } : {};
  const customTextStyle = designConfig.colorText ? { color: designConfig.colorText } : {};
  const shapeClass = designConfig.buttonShape === 'rounded-full' ? 'rounded-[24px]' : designConfig.buttonShape === 'rounded-none' ? 'rounded-none' : 'rounded-xl';

  const getFontFamily = () => {
    const font = designConfig.fontFamily;
    if (font === 'serif') return { fontFamily: "'Playfair Display', serif" };
    if (font === 'mono') return { fontFamily: "'Space Mono', monospace" };
    if (font && font !== 'sans') return { fontFamily: `'${font}', sans-serif` };
    return { fontFamily: "'Inter', sans-serif" };
  };

  const customFontName = designConfig.fontFamily && !['sans', 'serif', 'mono'].includes(designConfig.fontFamily)
    ? `&family=${designConfig.fontFamily.replace(/\s+/g, '+')}:wght@400;700`
    : '';

  const safeLinks = links || [];
  const regularLinks = safeLinks.filter((l: any) => l.layout !== 'etalase' && l.is_active !== false);
  const etalaseLinks = safeLinks.filter((l: any) => l.layout === 'etalase' && l.is_active !== false);

  const handleCopyLink = () => {
    if (!profile?.username) return;
    const url = `https://unitap-iota.vercel.app/${profile.username.replace('@', '').toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-[400px] hidden xl:flex flex-col bg-white border-l border-gray-200/60 z-10 relative shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Mono:wght@400;700${customFontName}&display=swap');
      `}} />

      <div className="w-full flex justify-between items-center px-6 py-4 bg-white z-20 border-b border-gray-100">
         <button onClick={handleCopyLink} className="bg-[#F6F7F5] hover:bg-gray-100 active:scale-95 transition-all text-sm font-bold px-4 py-2.5 rounded-xl flex items-center justify-between gap-4 w-full text-gray-800">
           <span>unitap.ee/{profile?.username?.replace('@', '').toLowerCase() || 'username'}</span>
           {copied ? <Check size={16} className="text-[#39E09B] transition-all" /> : <Copy size={16} className="text-gray-400 transition-all"/>}
         </button>
      </div>

      <div className="flex-1 w-full flex justify-center items-center bg-[#F6F7F5] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] overflow-y-auto py-8 relative">
         <div className="w-[320px] h-[650px] bg-black rounded-[48px] p-[8px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative border border-gray-300 z-10 flex flex-col">

            <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-between px-3">
               <div className="w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>

            <div className={`w-full h-full rounded-[40px] relative overflow-hidden transition-all duration-300 flex flex-col ${theme.bgTheme}`} style={{ ...customBgStyle, ...getFontFamily() }}>
               
               {activeTheme === 'custom' && profile?.custom_bg_url?.length > 5 ? (
                 <img key="custom-bg" src={profile.custom_bg_url} alt="Bg" className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700" />
               ) : theme?.bgImage ? (
                 <img key="theme-bg" src={theme.bgImage} alt="Bg" className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700" />
               ) : null}

               {theme?.redup === true && <div className="absolute inset-0 bg-black/40 z-[5] transition-all duration-700"></div>}

               <div className="relative z-10 px-4 pt-16 flex flex-col items-center h-full pb-10 overflow-y-auto custom-scrollbar">

                 <div className="w-[88px] h-[88px] shrink-0 bg-white rounded-full mb-4 flex items-center justify-center shadow-lg border-[3px] border-white/60 overflow-hidden relative">
                   {profile?.profile_image ? (
                     <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold text-3xl">{profile?.username?.charAt(0).toUpperCase() || 'U'}</div>
                   )}
                 </div>

                 <div className="flex justify-center items-center w-full mb-1.5 relative">
                   <div className="relative flex items-center">
                     <h3 className={`font-bold text-[18px] tracking-tight drop-shadow-md ${theme.textTheme} whitespace-nowrap`} style={customTextStyle}>@{profile?.username || 'username'}</h3>
                     {profile?.is_verified && <div className="absolute left-full ml-1.5 flex items-center top-1/2 -translate-y-1/2"><BadgeCheck size={18} className="text-blue-500 fill-[#E0E7FF] drop-shadow-sm" /></div>}
                   </div>
                 </div>

                 <p className={`text-[13px] mt-1 mb-4 text-center font-medium opacity-90 drop-shadow-md ${theme.textTheme}`} style={customTextStyle}>{profile?.bio || 'Tulis bio Anda di sini...'}</p>

                 {/* SOCIALS */}
                 <div className={`flex items-center justify-center gap-4 mb-6 ${theme.textTheme}`} style={customTextStyle}>
                    {profile?.instagram && <BrandIcons.instagram />}
                    {profile?.tiktok && <BrandIcons.tiktok />}
                    {profile?.x && <BrandIcons.x />}
                    {profile?.facebook && <BrandIcons.facebook />}
                    {!profile?.instagram && !profile?.tiktok && !profile?.x && !profile?.facebook && (<Mail size={18} strokeWidth={1.5} className="opacity-50" />)}
                 </div>

                 {/* 🔥 GRID ETALASE PREVIEW (2x2) 🔥 */}
                 {etalaseLinks.length > 0 && (
                   <div className="w-full mb-6 px-1">
                     <h3 className={`font-black text-[13px] mb-3 flex items-center gap-1.5 ${theme.textTheme}`} style={customTextStyle}><ShoppingBag size={14} /> Etalase</h3>
                     <div className="grid grid-cols-2 gap-2">
                       {etalaseLinks.map((product: any) => {
                         const btnStyleStr = designConfig.colorBtn ? (isOutline ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '1.5px' } : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' }) : {};
                         const etalaseShapeClass = designConfig.buttonShape === 'rounded-full' ? 'rounded-[16px]' : designConfig.buttonShape === 'rounded-none' ? 'rounded-none' : 'rounded-xl';

                         return (
                           <div key={product.id} className={`block w-full overflow-hidden flex flex-col ${isOutline && !designConfig.colorBtn ? 'border-[1.5px] border-current bg-transparent' : theme.btnTheme} ${etalaseShapeClass}`} style={btnStyleStr}>
                             <div className="w-full aspect-square relative bg-black/5 flex items-center justify-center overflow-hidden border-b border-black/5">
                               {product.image_url ? (<img src={product.image_url} alt="Product" className="w-full h-full object-cover" />) : (<ShoppingBag className="opacity-20" size={24}/>)}
                               {product.promo_label && (<div className="absolute top-1 left-1 bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm shadow-sm uppercase tracking-tighter z-10">{product.promo_label}</div>)}
                             </div>
                             <div className="p-2 flex-1 flex flex-col justify-between">
                               <div>
                                 <span className="font-bold text-[11px] leading-tight line-clamp-2 w-full text-left mb-1">{product.title}</span>
                                 <div className="flex flex-wrap items-center gap-1">
                                    {product.price && <span className="font-black text-[12px] text-green-500 leading-none">Rp{product.price}</span>}
                                    {product.price_sale && <span className="text-[9px] font-bold opacity-50 line-through leading-none">Rp{product.price_sale}</span>}
                                 </div>
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}

                 {/* 🔥 LIST LINK BIASA PREVIEW SAKTI (AUTO THUMBNAIL REALTIME) 🔥 */}
                 <div className="w-full flex flex-col gap-3 pb-10 px-1">
                   {regularLinks.map((link: any) => (
                     <PreviewLinkItem 
                       key={link.id} 
                       link={link} 
                       theme={theme} 
                       designConfig={designConfig} 
                       isOutline={isOutline} 
                       shapeClass={shapeClass} 
                     />
                   ))}
                 </div>

                 {/* WATERMARK */}
                 <div className={`mt-auto pt-4 flex items-center justify-center gap-1.5 opacity-60 font-bold text-[10px] uppercase tracking-widest ${theme.textTheme}`} style={customTextStyle}>
                    <div className="w-3.5 h-3.5 bg-current rounded-sm flex items-center justify-center text-[8px] text-white" style={customBgStyle.backgroundColor ? { backgroundColor: customTextStyle.color, color: customBgStyle.backgroundColor } : {}}>U</div>
                    Powered by UniTap
                 </div>

               </div>
            </div>
         </div>
      </div>
    </aside>
  );
}