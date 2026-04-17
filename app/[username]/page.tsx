// app/[username]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { THEMES_DATA } from '@/context/AdminContext'; // Pastikan path-nya bener

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = params;

  // 1. TARIK DATA PROFIL & DESIGN
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) return notFound();

  // 2. TARIK DATA LINKS
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('id', { ascending: false });

  // 3. SETTING TEMA & STYLE (Biar persis kayak di HP Dashboard)
  const activeTheme = profile.active_theme || 'light';
  const theme = THEMES_DATA[activeTheme] || THEMES_DATA.light;
  const customBg = profile.custom_bg_url;
  
  // Logika Font & Warna Custom
  const fontFamily = profile.font_family || theme.font || 'sans';
  const bgStyle = activeTheme === 'custom' && customBg 
    ? { backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center p-8 transition-all ${theme.bgTheme}`}
      style={{ ...bgStyle, fontFamily: fontFamily }}
    >
      <div className="max-w-[600px] w-full flex flex-col items-center">
        
        {/* AVATAR & USERNAME */}
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-white shadow-md">
           {/* Lo bisa ganti pake profile.avatar_url kalo udah ada fitur upload foto */}
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="avatar" />
        </div>
        
        <h1 className={`text-xl font-bold mb-2 ${theme.textTheme}`}>
          @{profile.username}
          {profile.is_verified && <span className="ml-1 text-blue-500">✅</span>}
        </h1>
        
        <p className={`text-center text-[15px] mb-8 font-medium ${theme.textTheme} opacity-80`}>
          {profile.bio || 'Link in bio'}
        </p>

        {/* LIST LINKS - BIAR PERSIS KAYAK TOMBOL DI HP */}
        <div className="w-full space-y-4">
          {links?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full py-4 px-6 rounded-full text-center font-bold text-[16px] transition-all transform hover:scale-[1.02] active:scale-[0.98] ${theme.btnTheme}`}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* FOOTER - BIAR KEREN */}
        <div className="mt-12 opacity-50">
           <p className={`text-[12px] font-bold ${theme.textTheme}`}>UNITAP 🚀</p>
        </div>
      </div>
    </div>
  );
}