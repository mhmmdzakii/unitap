// app/[username]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BadgeCheck, MoreVertical, Music, Video, ShoppingBag, Mail } from 'lucide-react';
import { THEMES_DATA, ICON_MAP, BrandIcons } from '@/lib/constants'; // 🔥 INI IMPORT DARI GUDANG

export const revalidate = 0;

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  try {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('username', username).single();
    if (profileError || !profile) return notFound();

    const { data: links } = await supabase.from('links').select('*').eq('user_id', profile.id).eq('is_active', true).order('id', { ascending: false });

    // SETTING TEMA
    const activeTheme = profile.active_theme || 'light';
    const theme = THEMES_DATA[activeTheme] || THEMES_DATA.light;
    
    // CUSTOM CONFIG DARI DATABASE
    const designConfig = {
      fontFamily: profile.font_family || theme.font || 'sans',
      buttonShape: profile.button_shape || 'rounded',
      buttonStyle: profile.button_style || 'fill',
      colorBg: profile.color_bg || '',
      colorBtn: profile.color_btn || '',
      colorText: profile.color_text || ''
    };

    const isOutline = designConfig.buttonStyle === 'outline';
    const customBgStyle = designConfig.colorBg ? { backgroundColor: designConfig.colorBg } : {};
    const customTextStyle = designConfig.colorText ? { color: designConfig.colorText } : {};
    
    const getFontFamily = () => {
      const font = designConfig.fontFamily;
      if (font === 'serif') return { fontFamily: "'Playfair Display', serif" };
      if (font === 'mono') return { fontFamily: "'Space Mono', monospace" };
      if (font && font !== 'sans') return { fontFamily: `'${font}', sans-serif` };
      return { fontFamily: "'Inter', sans-serif" }; 
    };

    const customFontName = designConfig.fontFamily && !['sans', 'serif', 'mono'].includes(designConfig.fontFamily) 
      ? `&family=${designConfig.fontFamily.replace(/\s+/g, '+')}:wght@400;700` : '';

    return (
      <div 
        className={`min-h-screen w-full flex flex-col items-center py-16 px-5 transition-all duration-300 relative ${theme.bgTheme}`} 
        style={{ ...customBgStyle, ...getFontFamily() }}
      >
        {/* INJEK FONT */}
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Mono:wght@400;700${customFontName}&display=swap');
        `}} />

        {/* BACKGROUND IMAGE KALO ADA */}
        {profile.custom_bg_url ? (
           <>
             <img src={profile.custom_bg_url} alt="Bg" className="fixed inset-0 w-full h-full object-cover z-0" />
             <div className="fixed inset-0 bg-black/30 z-[5]"></div>
           </>
        ) : theme.bgImage ? (
           <>
             <img src={theme.bgImage} alt="Bg" className="fixed inset-0 w-full h-full object-cover z-0" />
             <div className="fixed inset-0 bg-black/30 z-[5]"></div>
           </>
        ) : null}

        <div className="max-w-[600px] w-full flex flex-col items-center relative z-10">
          
          {/* FOTO PROFIL */}
          <div className="w-[96px] h-[96px] shrink-0 bg-white rounded-full mb-4 flex items-center justify-center shadow-lg border-[3px] border-white/60 overflow-hidden">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="Avatar" className="w-full h-full object-cover bg-gray-100" />
            )}
          </div>

          {/* USERNAME & VERIFIED */}
          <div className="flex justify-center items-center w-full mb-1.5 relative">
            <div className="relative flex items-center">
              <h3 className={`font-bold text-[20px] tracking-tight drop-shadow-md ${theme.textTheme}`} style={customTextStyle}>
                @{profile.username}
              </h3>
              {profile.is_verified && (
                <div className="absolute left-full ml-1.5 flex items-center top-1/2 -translate-y-1/2">
                  <BadgeCheck size={20} className="text-blue-500 fill-[#E0E7FF] drop-shadow-sm" />
                </div>
              )}
            </div>
          </div>
          
          {/* BIO */}
          <p className={`text-[15px] mt-1 mb-6 text-center font-medium opacity-90 drop-shadow-md max-w-md ${theme.textTheme}`} style={customTextStyle}>
            {profile.bio || 'Welcome to my page!'}
          </p>

          {/* SOCIAL ICONS */}
          <div className={`flex items-center justify-center gap-5 mb-8 ${theme.textTheme}`} style={customTextStyle}>
             {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.instagram /></a>}
             {profile.tiktok && <a href={profile.tiktok} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.tiktok /></a>}
             {profile.x && <a href={profile.x} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.x /></a>}
             {profile.facebook && <a href={profile.facebook} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.facebook /></a>}
             {!profile.instagram && !profile.tiktok && !profile.x && !profile.facebook && (
               <a href={`mailto:hello@${profile.username}.com`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform opacity-50"><Mail size={22} /></a>
             )}
          </div>

          {/* LIST LINKS */}
          <div className="w-full flex flex-col gap-4 mb-16">
            {links?.map((link) => {
              let cat = link.type || 'standard';
              let img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";
              const url = (link.url || '').toLowerCase();
              const title = link.title || 'My Link';

              if (cat === 'music' || url.includes('spotify.com') || url.includes('apple.com')) {
                cat = 'music'; img = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80";
              } else if (cat === 'video' || url.includes('youtube.com') || url.includes('youtu.be')) {
                cat = 'video';
                const ytMatch = link.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                if (ytMatch) img = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
              } else if (cat === 'store' || url.includes('tokopedia.com') || url.includes('shopee.co')) {
                cat = 'store'; img = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80";
              }

              const isFeatured = link.layout === 'featured';
              const isMinimal = link.layout === 'minimal';
              
              const btnStyleStr = designConfig.colorBtn ? (
                isOutline 
                  ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '2px' } 
                  : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' }
              ) : {};

              const baseClasses = `block w-full transition-all hover:scale-[1.02] shadow-sm backdrop-blur-md cursor-pointer ${isOutline && !designConfig.colorBtn ? 'border-2 border-current bg-transparent' : theme.btnTheme}`;
              const shapeClass = designConfig.buttonShape === 'rounded-full' ? 'rounded-full' : designConfig.buttonShape === 'rounded-none' ? 'rounded-none' : 'rounded-xl';

              if (isFeatured && cat !== 'standard') {
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} rounded-[24px] p-3 flex flex-col gap-3 relative overflow-hidden`} style={btnStyleStr}>
                    <div className="w-full aspect-[2/1] sm:aspect-[2.5/1] rounded-[16px] overflow-hidden shadow-sm relative bg-black/5 flex items-center justify-center">
                       <img src={img} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                    <div className="px-2 pb-2 text-left relative flex justify-between items-end">
                       <div className="flex-1 overflow-hidden pr-2">
                         <h4 className="font-extrabold text-[16px] truncate leading-tight">{title}</h4>
                         <div className="flex items-center gap-1.5 mt-1 opacity-70">
                            {cat === 'music' && <Music size={14} />}
                            {cat === 'video' && <Video size={14} />}
                            {cat === 'store' && <ShoppingBag size={14} />}
                            <span className="text-[12px] font-bold uppercase tracking-wider">
                              {cat === 'music' ? 'Listen Now' : cat === 'video' ? 'Watch Video' : 'Shop Now'}
                            </span>
                         </div>
                       </div>
                       <div className="p-2 opacity-50"><MoreVertical size={18} /></div>
                    </div>
                  </a>
                );
              }

              if (cat !== 'standard' && !isMinimal) {
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${shapeClass} p-2 flex justify-between items-center overflow-hidden`} style={btnStyleStr}>
                    <div className="w-[52px] h-[52px] rounded-[12px] bg-black/5 overflow-hidden flex-shrink-0 shadow-sm z-10 flex items-center justify-center">
                       <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                    </div>
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
                  </a>
                );
              }

              let IconToRender = null;
              if (link.custom_icon && ICON_MAP[link.custom_icon]) {
                const CustomIcon = ICON_MAP[link.custom_icon];
                IconToRender = <CustomIcon size={22} strokeWidth={1.5} />;
              } else if (url.includes('spotify.com')) IconToRender = <BrandIcons.spotify />;
              else if (url.includes('youtube.com') || url.includes('youtu.be')) IconToRender = <BrandIcons.youtube />;
              else if (url.includes('tiktok.com')) IconToRender = <BrandIcons.tiktok />;
              else if (url.includes('instagram.com')) IconToRender = <BrandIcons.instagram />;
              else if (cat === 'music') IconToRender = <Music size={22} strokeWidth={1.5} />;
              else if (cat === 'video') IconToRender = <Video size={22} strokeWidth={1.5} />;
              else if (cat === 'store') IconToRender = <ShoppingBag size={22} strokeWidth={1.5} />;

              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${shapeClass} py-4 px-4 flex justify-between items-center`} style={btnStyleStr}>
                   <div className="w-10 flex justify-center items-center opacity-90 z-10">
                     {IconToRender ? IconToRender : <div className="w-5"></div>}
                   </div>
                   <span className="flex-1 font-bold text-[15px] truncate text-center px-2 z-0">
                     {title}
                   </span>
                   <div className="w-10 flex justify-center items-center flex-shrink-0 z-10 opacity-50">
                     <MoreVertical size={18} />
                   </div>
                </a>
              );
            })}
          </div>

          {/* WATERMARK BAWAH */}
          <div className={`mt-auto pt-8 flex items-center justify-center gap-2 opacity-70 font-bold text-[12px] uppercase tracking-widest ${theme.textTheme}`} style={customTextStyle}>
             <div className="w-4 h-4 bg-current rounded-sm flex items-center justify-center text-[10px] text-white" style={customBgStyle.backgroundColor ? { backgroundColor: customTextStyle.color, color: customBgStyle.backgroundColor } : {}}>U</div>
             <a href="/" className="hover:opacity-100 transition-opacity">Powered by UniTap</a>
          </div>

        </div>
      </div>
    );

  } catch (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold">Failed to load profile.</div>;
  }
}