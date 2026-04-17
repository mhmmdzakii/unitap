// app/[username]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 0;

// 🔥 DATA TEMA DITANAM DI SINI BIAR SERVER AMAN & GAK CRASH LAGI
const THEMES_DATA: Record<string, any> = {
  custom: { id: 'custom', name: 'Custom', bgTheme: 'bg-gray-100', textTheme: 'text-gray-900', btnTheme: 'bg-white text-black shadow-sm', font: 'sans' },
  light: { id: 'light', name: 'Minimal Light', bgTheme: 'bg-white', textTheme: 'text-gray-900', btnTheme: 'bg-[#F6F7F5] text-black border border-gray-200 hover:bg-gray-100', font: 'sans' },
  dark: { id: 'dark', name: 'Minimal Dark', bgTheme: 'bg-[#111111]', textTheme: 'text-white', btnTheme: 'bg-[#222222] text-white hover:bg-[#333333]', font: 'mono' },
  ocean: { id: 'ocean', name: 'Ocean Blue', bgTheme: 'bg-gradient-to-b from-blue-50 to-blue-100', textTheme: 'text-blue-900', btnTheme: 'bg-white text-blue-900 shadow-sm hover:shadow-md', font: 'sans' },
  matcha: { id: 'matcha', name: 'Matcha Green', bgTheme: 'bg-[#E8F5E9]', textTheme: 'text-[#1B5E20]', btnTheme: 'bg-white text-[#2E7D32] shadow-sm hover:shadow-md', font: 'serif' },
  apa: { id: 'apa', name: 'Orange Ahay', bgTheme: 'bg-[#3E2F26]', textTheme: 'text-[#F5E6CA]', btnTheme: 'bg-[#E6D3A3] text-[#3E2F26] border-2 border-[#3E2F26] shadow-[4px_4px_0px_#3E2F26] rounded-xl hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#3E2F26]', font: 'Courier Prime' },
  uni: { id: 'uni', name: 'uni 90s', bgTheme: 'bg-[#efe6d8]', textTheme: 'text-pink-500 drop-shadow-lg', btnTheme: 'bg-pink-500/80 hover:bg-pink-600 text-white border border-pink-300', font: 'sans' },
  glass: { id: 'glass', name: 'Glassmorphism', bgTheme: 'bg-gradient-to-br from-purple-500 to-pink-500', textTheme: 'text-white drop-shadow-md', btnTheme: 'bg-white/20 border border-white/30 text-white backdrop-blur-md shadow-lg hover:bg-white/30', font: 'sans' },
  cyber: { id: 'cyber', name: 'Cyberpunk', bgTheme: 'bg-black', textTheme: 'text-[#00ff9f] drop-shadow-[0_0_8px_rgba(0,255,159,0.8)]', btnTheme: 'bg-transparent border border-[#00ff9f] text-[#00ff9f] hover:bg-[#00ff9f] hover:text-black shadow-[0_0_10px_rgba(0,255,159,0.3)]', font: 'mono' },
  luxury: { id: 'luxury', name: 'Luxury Gold', bgTheme: 'bg-[#1a1a1a]', textTheme: 'text-[#D4AF37]', btnTheme: 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black shadow-lg font-extrabold hover:scale-105', font: 'serif' },
  retro_cafe: { id: 'retro_cafe', name: 'Retro Cafe', bgTheme: 'bg-[#4A3B32]', textTheme: 'text-white drop-shadow-lg', btnTheme: 'bg-[#FDF6E3]/80 text-[#4A3B32] backdrop-blur-md border border-white/50 shadow-xl hover:bg-[#FDF6E3]', font: 'sans' }
};

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  try {
    // 1. Cek DB Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profile) return notFound();

    // 2. Cek DB Links
    const { data: links } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('id', { ascending: false });

    // 3. Setup Tema & Style
    const activeTheme = profile.active_theme || 'light';
    const theme = THEMES_DATA[activeTheme] || THEMES_DATA.light;
    const fontFamily = profile.font_family || theme.font || 'sans';
    
    // Background Custom
    const bgStyle = activeTheme === 'custom' && profile.custom_bg_url
      ? { backgroundImage: `url(${profile.custom_bg_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
      : {};

    return (
      <div 
        className={`min-h-screen w-full flex flex-col items-center py-12 px-4 transition-all duration-500 ${theme.bgTheme}`}
        style={{ ...bgStyle, fontFamily }}
      >
        <div className="max-w-[680px] w-full flex flex-col items-center relative z-10">
          
          {/* FOTO PROFIL */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 overflow-hidden border-[3px] border-white shadow-xl bg-white/50 backdrop-blur-sm">
             <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                alt={`@${username} avatar`} 
                className="w-full h-full object-cover"
             />
          </div>
          
          {/* NAMA & BIO */}
          <h1 className={`text-xl sm:text-2xl font-black mb-2 tracking-tight flex items-center gap-1.5 ${theme.textTheme}`}>
            @{profile.username}
            {profile.is_verified && (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
            )}
          </h1>
          
          <p className={`text-center text-[15px] sm:text-base mb-10 font-medium ${theme.textTheme} opacity-90 max-w-md leading-relaxed`}>
            {profile.bio || 'Welcome to my official page!'}
          </p>

          {/* LIST LINK ALA LINKTREE */}
          <div className="w-full space-y-4 flex flex-col items-center">
            {links && links.length > 0 ? (
              links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative block w-full max-w-[550px] py-4 px-6 rounded-full text-center font-bold text-[15px] sm:text-[16px] transition-all transform active:scale-[0.98] ${theme.btnTheme}`}
                >
                  {link.title}
                </a>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-center w-full max-w-[550px]">
                <p className={`font-bold ${theme.textTheme}`}>Belum ada link yang ditambahkan.</p>
              </div>
            )}
          </div>

          {/* WATERMARK KEREN */}
          <div className="mt-24 pb-8">
             <a href="/" className={`text-[12px] font-black tracking-[0.2em] uppercase transition-opacity opacity-50 hover:opacity-100 ${theme.textTheme}`}>
               Powered by UniTap<span className="text-[#7949F6]">*</span>
             </a>
          </div>

        </div>
      </div>
    );

  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold">
        Failed to load profile. Please try again later.
      </div>
    );
  }
}