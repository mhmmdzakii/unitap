// app/[username]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { BadgeCheck, ShoppingBag, Mail } from 'lucide-react';
import { THEMES_DATA, BrandIcons } from '@/lib/constants'; 
import { unstable_noStore as noStore } from 'next/cache'; 
import PublicLinkCard from '@/components/PublicLinkCard'; 
import PremiumHeader from '@/components/PremiumHeader'; // 🔥 BUG IMPORT UDAH DIBENERIN

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  
  // 🔥 SEKARANG KITA TARIK JUGA DATA SEO_TITLE, SEO_DESC, SEO_IMAGE
  const { data: profile } = await supabase.from('profiles')
    .select('username, bio, profile_image, seo_title, seo_desc, seo_image')
    .eq('username', username).single();
  
  // 🔥 LOGIKA SULTAN: Kalo SEO diisi, pake SEO. Kalo kosong, pake default profil!
  const title = profile?.seo_title || (profile ? `@${profile.username} | UniTap` : 'UniTap Profile');
  const description = profile?.seo_desc || profile?.bio || 'Check out my UniTap profile!';
  const image = profile?.seo_image || profile?.profile_image || '/og-image.jpg'; 

  return {
    title: title,
    description: description,
    openGraph: { title: title, description: description, images: [image], type: 'website' },
    twitter: { card: 'summary_large_image', title: title, description: description, images: [image] },
  };
}

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  noStore(); 
  
  const resolvedParams = await params;
  const username = resolvedParams.username;

  try {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('username', username).single();
    if (profileError || !profile) return notFound();

    const { data: links } = await supabase.from('links').select('*').eq('user_id', profile.id).eq('is_active', true).order('id', { ascending: false });

    const activeTheme = profile.active_theme || 'light';
    const theme = THEMES_DATA[activeTheme] || THEMES_DATA.light;
    
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

    const etalaseLinks = links?.filter((l) => l.layout === 'etalase') || [];
    const regularLinksRaw = links?.filter((l) => l.layout !== 'etalase') || [];
    const shapeClass = designConfig.buttonShape === 'rounded-full' ? 'rounded-full' : designConfig.buttonShape === 'rounded-none' ? 'rounded-none' : 'rounded-xl';

    // =========================================================================================
    // 🔥 JURUS DEWA: STORE AUTO-POLOS, MUSIC & VIDEO TETAP TARIK GAMBAR ASLI 🔥
    // =========================================================================================
    const regularLinks = await Promise.all(regularLinksRaw.map(async (link) => {
      let cat = link.type || 'standard'; 
      let originalUrl = link.url || '';
      let trueDestinationUrl = originalUrl;

      // Bersihkan proxy googleusercontent
      if (originalUrl.includes('googleusercontent.com')) {
        const parts = originalUrl.split('/http');
        if (parts.length > 1) {
          trueDestinationUrl = decodeURIComponent('http' + parts[1]);
        }
      }

      let img = link.image_url || null; // 🔥 Mulai dengan KOSONG (null)

      // 1. STORE: AUTO-POLOS (Sesuai titah CEO!)
      if (cat === 'store') {
        // Nggak usah ngapa-ngapain. Biarin aja img tetep null. 
        // Nanti PublicLinkCard.tsx bakal nampilin versi POLOS/ICON doang.
      }
      // 2. MUSIC: Spotify
      else if (cat === 'music' || (cat === 'standard' && (trueDestinationUrl.includes('spotify') || trueDestinationUrl.includes('apple.com')))) {
        cat = 'music'; 
        if (!img && trueDestinationUrl.includes('spotify')) {
          try {
            const res = await fetch(`https://open.spotify.com/oembed?url=$$${encodeURIComponent(trueDestinationUrl)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.thumbnail_url) img = data.thumbnail_url;
            }
          } catch (e) {}
        }
      } 
      // 3. VIDEO: YouTube
      else if (cat === 'video' || (cat === 'standard' && (trueDestinationUrl.includes('youtube.com') || trueDestinationUrl.includes('youtu.be')))) {
        cat = 'video'; 
        const ytMatch = trueDestinationUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch && !img) {
          img = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`; 
        }
      }

      return { 
        ...link, 
        processedCat: cat, 
        processedImg: img, 
        url: trueDestinationUrl
      };
    }));

    return (
      <div className={`min-h-screen w-full flex flex-col items-center py-6 px-4 sm:px-0 transition-all duration-300 relative ${theme.bgTheme}`} style={{ ...customBgStyle, ...getFontFamily() }}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Space+Mono:wght@400;700${customFontName}&display=swap');
        `}} />

        {profile?.ga_id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${profile.ga_id}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${profile.ga_id}');`}</Script>
          </>
        )}

        {/* 🔥 BISA PAKE BACKGROUND VIDEO .MP4 🔥 */}
        {activeTheme === 'custom' && profile?.custom_bg_url?.includes('.mp4') ? (
           <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-all duration-700">
             <source src={profile.custom_bg_url} type="video/mp4" />
           </video>
        ) : activeTheme === 'custom' && profile?.custom_bg_url?.length > 5 ? (
          <img key="custom-bg" src={profile.custom_bg_url} alt="Bg" className="fixed inset-0 w-full h-full object-cover z-0 transition-all duration-700" />
        ) : theme?.bgImage ? (
          <img key="theme-bg" src={theme.bgImage} alt="Bg" className="fixed inset-0 w-full h-full object-cover z-0 transition-all duration-700" />
        ) : null}
        
        {theme?.redup === true && <div className="fixed inset-0 bg-black/40 z-[5] transition-all duration-700"></div>}

        <div className="w-full max-w-[480px] flex flex-col items-center relative z-10 mx-auto">
          
          {/* 🔥 LOGIKA GEMBOK PREMIUM: Cuma muncul kalo is_premium = true 🔥 */}
          {profile.is_premium && (
            <PremiumHeader 
              profileImage={profile.profile_image} 
              username={profile.username} 
              customStyle={customTextStyle} 
            />
          )}

          <div className="w-[96px] h-[96px] shrink-0 bg-white rounded-full mb-4 flex items-center justify-center shadow-lg border-[3px] border-white/60 overflow-hidden relative mt-2">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt={`@${username}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white font-bold text-4xl uppercase tracking-widest">{profile.username?.charAt(0) || 'U'}</div>
            )}
          </div>

          <div className="flex justify-center items-center w-full mb-1.5 relative">
            <div className="relative flex items-center">
              <h3 className={`font-bold text-[20px] tracking-tight drop-shadow-md ${theme.textTheme}`} style={customTextStyle}>@{profile.username}</h3>
              {profile.is_verified && <div className="absolute left-full ml-1.5 flex items-center top-1/2 -translate-y-1/2"><BadgeCheck size={20} className="text-blue-500 fill-[#E0E7FF] drop-shadow-sm" /></div>}
            </div>
          </div>
          
          <p className={`text-[15px] mt-1 mb-6 text-center font-medium opacity-90 drop-shadow-md max-w-sm ${theme.textTheme}`} style={customTextStyle}>{profile.bio || 'Welcome to my page!'}</p>
          

          <div className={`flex items-center justify-center gap-5 mb-8 ${theme.textTheme}`} style={customTextStyle}>
             {profile.instagram && <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.instagram /></a>}
             {profile.tiktok && <a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.tiktok /></a>}
             {profile.whatsapp_profile && <a href={`https://wa.me/${profile.whatsapp_profile.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.whatsapp /></a>}
             {profile.x_profile && <a href={`https://x.com/${profile.x_profile.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.x /></a>}
             {profile.facebook && <a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.facebook /></a>}
             {profile.youtube && <a href={`https://youtube.com/@${profile.youtube.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><BrandIcons.youtube /></a>}
             
             {!profile.instagram && !profile.tiktok && !profile.whatsapp_profile && !profile.x_profile && !profile.facebook && !profile.youtube && (
               <a href={`mailto:hello@${profile.username}.com`} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform opacity-50"><Mail size={22} /></a>
             )}
          </div>

          {/* 🔥 GRID ETALASE 🔥 */}
          {etalaseLinks.length > 0 && (
            <div className="w-full mb-8 px-1">
              <h3 className={`font-black text-[15px] tracking-wide mb-4 pl-1 flex items-center gap-2 ${theme.textTheme}`} style={customTextStyle}>
                <ShoppingBag size={18} /> Etalase Pilihan
              </h3>
              <div className="grid grid-cols-2 gap-3">
               {etalaseLinks.map((product) => {
                 const btnStyleStr = designConfig.colorBtn ? (isOutline ? { borderColor: designConfig.colorBtn, color: designConfig.colorBtn, backgroundColor: 'transparent', borderWidth: '2px' } : { backgroundColor: designConfig.colorBtn, color: '#fff', borderColor: 'transparent' }) : {};
                 const etalaseShapeClass = designConfig.buttonShape === 'rounded-full' ? 'rounded-[24px]' : designConfig.buttonShape === 'rounded-none' ? 'rounded-none' : 'rounded-2xl';

                 return (
                    <a key={product.id} href={`/api/go?id=${product.id}`} target="_blank" rel="noopener noreferrer" className={`block w-full transition-all hover:scale-[1.02] shadow-sm backdrop-blur-md cursor-pointer overflow-hidden flex flex-col ${isOutline && !designConfig.colorBtn ? 'border-2 border-current bg-transparent' : theme.btnTheme} ${etalaseShapeClass}`} style={btnStyleStr}>
                      <div className="w-full aspect-square relative bg-black/5 flex items-center justify-center overflow-hidden border-b border-black/5">
                        {product.image_url ? (<img src={product.image_url} alt={product.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />) : (<ShoppingBag className="opacity-20" size={32}/>)}
                        {product.promo_label && (<div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg animate-pulse uppercase tracking-tighter">{product.promo_label}</div>)}
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-[13px] leading-tight line-clamp-2 w-full text-left mb-2">{product.title}</span>
                          <div className="flex flex-wrap items-center gap-1.5">
                             {product.price && (<span className="font-black text-[14px] text-green-500 tracking-tighter">Rp{product.price}</span>)}
                             {product.price_sale && (<span className="text-[10px] font-bold opacity-50 line-through">Rp{product.price_sale}</span>)}
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-3 block border-t border-black/5 pt-2">Beli Sekarang →</span>
                      </div>
                    </a>
                 );
               })}
              </div>
            </div>
          )}

          {/* 🔥 LIST LINK BIASA PAKE KOMPONEN MATA-MATA (PublicLinkCard) 🔥 */}
          <div className="w-full flex flex-col gap-4 mb-16 px-1">
            {regularLinks.length > 0 && etalaseLinks.length > 0 && (
              <h3 className={`font-black text-[15px] tracking-wide mt-2 mb-1 pl-1 ${theme.textTheme}`} style={customTextStyle}>Link Lainnya</h3>
            )}

            {regularLinks.map((link) => (
              <PublicLinkCard 
                key={link.id} 
                link={link} 
                theme={theme} 
                designConfig={designConfig} 
                isOutline={isOutline} 
                shapeClass={shapeClass} 
                profileId={profile.id} 
              />
            ))}
          </div>

          <div className={`mt-auto pt-4 pb-8 flex items-center justify-center gap-2 opacity-70 font-bold text-[12px] uppercase tracking-widest ${theme.textTheme}`} style={customTextStyle}>
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