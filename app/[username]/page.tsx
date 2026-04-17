import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  try {
    // 1. Cek DB Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      return notFound();
    }

    // 2. Cek DB Links
    const { data: links } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true);

    // 3. Render Polosan Dulu
    return (
      <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">@{profile.username} (BERHASIL JALAN!)</h1>
        <p className="mb-8">{profile.bio}</p>
        
        <div className="w-full max-w-md space-y-4">
          {links?.map(link => (
            <a key={link.id} href={link.url} className="block p-4 border border-gray-300 rounded-lg text-center">
              {link.title}
            </a>
          ))}
        </div>
      </div>
    );

  } catch (error: any) {
    // Kalau Vercel gagal konek ke Supabase, errornya muncul di layar, bukan 500
    return (
      <div className="p-8 text-red-500 font-bold">
        CRASH DATABASE: {error.message || "Unknown Error"}
      </div>
    );
  }
}