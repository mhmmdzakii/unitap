// app/[username]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { THEMES_DATA } from '@/context/AdminContext';

// Biar datanya selalu fresh tiap dibuka (Gak kena cache lama)
export const revalidate = 0;

export default async function PublicProfile({ params }: { params: { username: string } }) {
  // 1. Ambil username dari URL
  const { username } = params;

  // 2. QUERY KE SUPABASE (Cari berdasarkan kolom 'username'!)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username) // 🔥 INI KUNCINYA: Harus cari pake username
    .single();

  // Kalau data gak ada atau error, langsung lempar ke halaman 404
  if (profileError || !profile) {
    console.log("User tidak ditemukan di DB:", username);
    return notFound();
  }

  // 3. AMBIL LINKS MILIK USER TERSEBUT
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('id', { ascending: false });

  // 4. SETUP TEMA (Biar tampilannya persis kayak simulasi HP)
  const activeTheme = profile.active_theme || 'light';
  const theme = THEMES_DATA[activeTheme] || THEMES_DATA.light;
  
  // Logika Font & Background
  const fontFamily = profile.font_family || theme.font || 'sans';
  const bgStyle = activeTheme === 'custom' && profile.custom_bg_url
    ? { backgroundImage: `url(${profile.custom_bg_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center p-8 transition-all ${theme.bgTheme}`}
      style={{ ...bgStyle, fontFamily: fontFamily }}
    >
      <div className="max-w-[500px] w-full flex flex-col items-center">
        
        {/* AVATAR */}
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-white shadow-lg">
           <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
              alt="avatar" 
              className="w-full h-full object-cover"
           />
        </div>
        
        {/* USERNAME & BIO */}
        <h1 className={`text-xl font-black mb-1 ${theme.textTheme}`}>
          @{profile.username}
          {profile.is_verified && <span className="ml-1 text-blue-500 text-sm">✅</span>}
        </h1>
        
        <p className={`text-center text-[15px] mb-10 font-medium ${theme.textTheme} opacity-80 leading-relaxed`}>
          {profile.bio || 'Welcome to my page!'}
        </p>

        {/* LIST TOMBOL LINKS */}
        <div className="w-full space-y-4">
          {links && links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-4 px-6 rounded-full text-center font-bold text-[16px] shadow-sm transition-all transform hover:scale-[1.03] active:scale-[0.97] ${theme.btnTheme}`}
              >
                {link.title}
              </a>
            ))
          ) : (
            <p className="text-center opacity-50 text-sm">Belum ada link yang ditambahkan.</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-20 opacity-40">
           <p className={`text-[11px] font-black tracking-widest ${theme.textTheme}`}>UNITAP 🚀</p>
        </div>
      </div>
    </div>
  );
}