// components/MobilePreview.tsx
"use client";
import { BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  Copy, Check, Upload, Store, MoreVertical, Music, Video, Link2, ShoppingBag, 
  Globe, Mail, MessageCircle, Camera, Gamepad2, Briefcase, Utensils, Plane, Coffee, Heart, Star, Book, Sparkles 
} from 'lucide-react';

// KAMUS ICON
const ICON_MAP: Record<string, any> = {
  globe: Globe, mail: Mail, message: MessageCircle, camera: Camera, gamepad: Gamepad2,
  briefcase: Briefcase, utensils: Utensils, plane: Plane, coffee: Coffee, heart: Heart,
  star: Star, book: Book, sparkles: Sparkles, music: Music, video: Video, shop: ShoppingBag, link: Link2
};

// SVG KUSTOM BRAND ASLI
const BrandIcons = {
  spotify: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 9.3C15.24 7.02 8.88 6.84 5.16 7.98c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.539.3.719 1.02.419 1.56-.299.48-1.02.659-1.559.24z"/></svg>,
  youtube: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  tiktok: () => <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>,
  instagram: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  x: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.051z"/></svg>,
  facebook: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
};

function PreviewLinkCard({ link, theme, designConfig, isOutline, getCustomBtnStyle }: any) {
  const defaultPlaceholder = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";
  
  const [meta, setMeta] = useState({ img: defaultPlaceholder, cat: link.type || 'standard', title: link.title || 'Loading...' });
  
  // 🔥 STATE UNTUK EMOJI BETERBANGAN
  const [hypes, setHypes] = useState<{id: number, emoji: string, offset: number}[]>([]); 

  useEffect(() => {
    let isMounted = true;
    const fetchRealData = async () => {
      let currentCat = link.type || 'standard';
      let currentImg = defaultPlaceholder;
      let currentTitle = link.title;
      const url = (link.url || '').toLowerCase();

      if (currentCat === 'music' || url.includes('spotify.com') || url.includes('apple.com')) {
        currentCat = 'music';
        currentImg = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80"; 
        if (url.includes('spotify.com')) {
          try {
            const targetUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(link.url)}`;
            const res = await fetch(targetUrl);
            if (res.ok) {
               const data = await res.json();
               if (data.thumbnail_url) currentImg = data.thumbnail_url; 
               if (!link.title && data.title) currentTitle = data.title; 
            }
          } catch(e) {}
        }
      } else if (currentCat === 'video' || url.includes('youtube.com') || url.includes('youtu.be')) {
        currentCat = 'video';
        const ytMatch = link.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch) currentImg = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
      } else if (currentCat === 'store' || url.includes('tokopedia.com') || url.includes('shopee.co')) {
        currentCat = 'store';
        currentImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80";
      }

      if (isMounted) setMeta({ img: currentImg, cat: currentCat, title: currentTitle || 'My Link' });
    };
    
    fetchRealData();
    return () => { isMounted = false; };
  }, [link.url, link.title, link.type]);

  // ==========================================
  // 🔥 FUNGSI HYPE REACTION (EMOJI TERBANG)
  // ==========================================
  const handleHype = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const emojis = ['🔥', '✨', '💖', '🚀', '💯'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    // Bikin posisi terbangnya agak acak ke kiri/kanan biar natural
    const randomOffset = Math.floor(Math.random() * 40) - 20; 
    
    const newHype = { id: Date.now(), emoji: randomEmoji, offset: randomOffset };
    setHypes((prev) => [...prev, newHype]);

    // Bersihkan emoji dari memori setelah 1 detik (animasi selesai)
    setTimeout(() => {
      setHypes((prev) => prev.filter((h) => h.id !== newHype.id));
    }, 1000);
  };

  const isFeatured = link.layout === 'featured';
  const isMinimal = link.layout === 'minimal';
  
  const featuredClasses = `block w-full transition-all hover:scale-[1.02] cursor-pointer shadow-md backdrop-blur-md rounded-[24px] overflow-hidden ${isOutline && !designConfig.colorBtn ? 'border-2 border-current bg-transparent' : theme.btnTheme}`;
  const classicClasses = `block w-full transition-all hover:scale-[1.02] cursor-pointer shadow-sm backdrop-blur-md rounded-${designConfig?.buttonShape || 'xl'} ${isOutline && !designConfig.colorBtn ? 'border-2 border-current bg-transparent' : theme.btnTheme}`;

  // Komponen untuk me-render Emoji Terbang
  const ReactionButton = () => (
    <div className="relative w-8 flex justify-center items-center z-10">
      {hypes.map((hype) => (
        <span
          key={hype.id}
          className="absolute pointer-events-none text-xl float-anim drop-shadow-md z-50"
          style={{ left: `${hype.offset}px`, bottom: '20px' }}
        >
          {hype.emoji}
        </span>
      ))}
      <button onClick={handleHype} className="p-1.5 opacity-40 hover:opacity-100 hover:bg-black/5 hover:scale-110 active:scale-90 rounded-full transition-all">
         <MoreVertical size={16} />
      </button>
    </div>
  );

  if (isFeatured && meta.cat !== 'standard') {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${featuredClasses} p-3 flex flex-col gap-3 relative`} style={getCustomBtnStyle()}>
         <div className="w-full aspect-square rounded-[16px] overflow-hidden shadow-sm relative bg-black/5 flex items-center justify-center">
            {meta.img ? <img src={meta.img} className="w-full h-full object-cover" alt="Featured Cover" /> : <div className="w-full h-full animate-pulse bg-gray-200"></div>}
         </div>
         <div className="px-2 pb-2 text-left relative flex justify-between items-end">
            <div className="flex-1 overflow-hidden pr-2">
              <h4 className="font-extrabold text-[15px] truncate leading-tight">{meta.title}</h4>
              <div className="flex items-center gap-1.5 mt-1 opacity-70">
                 {meta.cat === 'music' && <Music size={12} />}
                 {meta.cat === 'video' && <Video size={12} />}
                 {meta.cat === 'store' && <ShoppingBag size={12} />}
                 <span className="text-[11px] font-bold uppercase tracking-wider">
                   {meta.cat === 'music' ? 'Listen Now' : meta.cat === 'video' ? 'Watch Video' : 'Shop Now'}
                 </span>
              </div>
            </div>
            <ReactionButton />
         </div>
      </a>
    );
  }

  if (meta.cat !== 'standard' && !isMinimal) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${classicClasses} p-2 flex justify-between items-center overflow-hidden`} style={getCustomBtnStyle()}>
         <div className="w-[46px] h-[46px] rounded-[10px] bg-black/5 overflow-hidden flex-shrink-0 shadow-sm border border-black/5 z-10 flex items-center justify-center">
            {meta.img ? <img src={meta.img} className="w-full h-full object-cover" alt="Thumbnail" /> : <div className="w-full h-full animate-pulse bg-gray-200"></div>}
         </div>
         <div className="flex-1 flex flex-col items-center justify-center px-2 z-0 overflow-hidden">
            <span className="font-bold text-[14px] truncate leading-tight text-center w-full">{meta.title}</span>
            <span className="text-[11px] font-medium truncate opacity-70 mt-0.5 capitalize flex items-center justify-center gap-1 w-full">
               {meta.cat === 'music' && <Music size={10} />}
               {meta.cat === 'video' && <Video size={10} />}
               {meta.cat === 'store' && <ShoppingBag size={10} />}
               {meta.cat}
            </span>
         </div>
         <div className="w-[46px] flex justify-center items-center flex-shrink-0 z-10">
            <ReactionButton />
         </div>
      </a>
    );
  }

  const renderIcon = () => {
    if (link.custom_icon) {
      const CustomIcon = ICON_MAP[link.custom_icon];
      return CustomIcon ? <CustomIcon size={20} strokeWidth={1.5} /> : null;
    }
    const url = (link.url || '').toLowerCase();
    
    if (url.includes('spotify.com')) return <BrandIcons.spotify />;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return <BrandIcons.youtube />;
    if (url.includes('tiktok.com')) return <BrandIcons.tiktok />;
    if (url.includes('instagram.com')) return <BrandIcons.instagram />;

    if (meta.cat === 'music') return <Music size={20} strokeWidth={1.5} />;
    if (meta.cat === 'video') return <Video size={20} strokeWidth={1.5} />;
    if (meta.cat === 'store') return <ShoppingBag size={20} strokeWidth={1.5} />;
    return null;
  };

  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${classicClasses} py-[16px] px-3 flex justify-between items-center`} style={getCustomBtnStyle()}>
       <div className="w-8 flex justify-center items-center opacity-90 z-10">
         {renderIcon() ? renderIcon() : <div className="w-5"></div>}
       </div>
       <span className="flex-1 font-bold text-[14px] truncate text-center px-2 z-0">
         {meta.title}
       </span>
       <ReactionButton />
    </a>
  );
}

// ==========================================
// CONTAINER UTAMA MOBILE PREVIEW
// ==========================================
// ==========================================
// CONTAINER UTAMA MOBILE PREVIEW
// ==========================================
export default function MobilePreview({ profile, links, theme, designConfig }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `unitap.ee/${profile.username.replace('@', '').toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const getFontFamily = () => {
    const font = designConfig?.fontFamily;
    if (font === 'serif') return { fontFamily: "'Playfair Display', serif" };
    if (font === 'mono') return { fontFamily: "'Space Mono', monospace" };
    if (font && font !== 'sans') return { fontFamily: `'${font}', sans-serif` };
    return { fontFamily: "'Inter', sans-serif" }; 
  };
  
  const isOutline = designConfig?.buttonStyle === 'outline';
  const customBgStyle = designConfig?.colorBg ? { backgroundColor: designConfig.colorBg } : {};
  const customTextStyle = designConfig?.colorText ? { color: designConfig.colorText } : {};

  const customFontName = designConfig?.fontFamily && !['sans', 'serif', 'mono'].includes(designConfig.fontFamily) 
    ? `&family=${designConfig.fontFamily.replace(/\s+/g, '+')}:wght@400;700` 
    : '';

  return (
    <aside className="w-[400px] hidden xl:flex flex-col bg-white border-l border-gray-200/60 z-10 relative shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      {/* 🔥 INJEKSI CSS ANIMASI TERBANG */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Mono:wght@400;700${customFontName}&display=swap');
        
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.5); }
        }
        .float-anim { animation: floatUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
      `}} />
      
      <div className="w-full flex justify-between items-center px-6 py-4 bg-white z-20 border-b border-gray-100">
         <button 
           onClick={handleCopyLink}
           className="bg-[#F6F7F5] hover:bg-gray-100 active:scale-95 transition-all text-sm font-bold px-4 py-2.5 rounded-xl flex items-center justify-between gap-4 w-full text-gray-800"
         >
           <span>unitap.ee/{profile.username.replace('@', '').toLowerCase()}</span>
           {copied ? <Check size={16} className="text-[#39E09B] transition-all" /> : <Copy size={16} className="text-gray-400 transition-all"/>}
         </button>
      </div>

      <div className="flex-1 w-full flex justify-center items-center bg-[#F6F7F5] bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] overflow-y-auto py-8 relative">
         <div className="w-[320px] h-[650px] bg-black rounded-[48px] p-[8px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative border border-gray-300 z-10">
            
            <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-between px-3">
               <div className="w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            </div>

            <div className={`w-full h-full rounded-[40px] relative overflow-hidden transition-all duration-300 ${theme.bgTheme}`} style={{ ...customBgStyle, ...getFontFamily() }}>
               {theme.bgImage && <img src={theme.bgImage} alt="Bg" className="absolute inset-0 w-full h-full object-cover z-0" />}
               {theme.bgImage && <div className="absolute inset-0 bg-black/30 z-[5]"></div>}
               
               <div className="relative z-10 px-5 pt-16 flex flex-col items-center h-full pb-10 overflow-y-auto custom-scrollbar">
                  
                  {/* 🔥 INI BULATAN FOTO PROFIL YANG UDAH BENER 🔥 */}
                  <div className="w-[88px] h-[88px] shrink-0 bg-white rounded-full mb-4 flex items-center justify-center shadow-lg border-[3px] border-white/60 overflow-hidden">
                    {profile?.profile_image ? (
                      <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold text-3xl">
                        {profile?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>

                  {/* NAMA PENGGUNA TERPUSAT SEMPURNA DENGAN BADGE ABSOLUT */}
                  <div className="flex justify-center items-center w-full mb-1.5 relative">
                    <div className="relative flex items-center">
                      <h3 className={`font-bold text-[18px] tracking-tight drop-shadow-md ${theme.textTheme} whitespace-nowrap`} style={customTextStyle}>
                        {profile.username}
                      </h3>
                      {profile?.is_verified && (
                        <div className="absolute left-full ml-1.5 flex items-center top-1/2 -translate-y-1/2">
                          <BadgeCheck size={18} className="text-blue-500 fill-[#E0E7FF] drop-shadow-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-[13px] mt-1 mb-4 text-center font-medium opacity-90 drop-shadow-md ${theme.textTheme}`} style={customTextStyle}>{profile.bio}</p>

                  <div className={`flex items-center justify-center gap-5 mb-6 ${theme.textTheme}`} style={customTextStyle}>
                     {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.instagram /></a>}
                     {profile.tiktok && <a href={profile.tiktok} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.tiktok /></a>}
                     {profile.x && <a href={profile.x} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.x /></a>}
                     {profile.facebook && <a href={profile.facebook} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.facebook /></a>}
                     
                     {!profile.instagram && !profile.tiktok && !profile.x && !profile.facebook && (
                       <a href={`mailto:hello@${profile.username}.com`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform opacity-50">
                         <Mail size={22} strokeWidth={1.5} />
                       </a>
                     )}
                  </div>

                  <div className="w-full flex flex-col gap-3.5 mb-12">
                    {links.filter((l:any) => l.isActive).map((link:any) => (
                      <PreviewLinkCard key={link.id} link={link} theme={theme} designConfig={designConfig} isOutline={isOutline} getCustomBtnStyle={() => {
                        if (!designConfig?.colorBtn) return {};
                        return isOutline ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '2px' } : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' };
                      }} />
                    ))}
                  </div>

                  <div className={`mt-auto pt-8 flex items-center justify-center gap-1.5 opacity-60 font-bold text-[11px] uppercase tracking-widest ${theme.textTheme}`} style={customTextStyle}>
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