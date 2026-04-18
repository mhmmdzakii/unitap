// app/admin/profile/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save } from 'lucide-react';

// Custom SVG Icons
const BrandLogos = {
  instagram: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  tiktok: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.5c0 1.34-.23 2.75-.92 3.9-1.28 2.37-4.04 3.84-6.72 3.58-2.91-.21-5.5-2.58-5.91-5.46-.38-2.61.9-5.46 3.16-6.85.83-.54 1.79-.84 2.77-.9V16.8c-.8.14-1.58.54-2.1 1.18-.54.67-.74 1.58-.52 2.42.27 1.25 1.52 2.16 2.79 2.01 1.29-.08 2.35-1.16 2.43-2.45.03-2.68.01-18.78.01-19.94z"/></svg>,
  whatsapp: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  x: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  facebook: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  youtube: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
};

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // State Notif Toast Elegan (Kayak Foto)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    instagram: '',
    tiktok: '',
    whatsapp_profile: '',
    x_profile: '',
    facebook: '',
    youtube: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setFormData({
          instagram: data.instagram || '',
          tiktok: data.tiktok || '',
          whatsapp_profile: data.whatsapp_profile || '',
          x_profile: data.x_profile || '',
          facebook: data.facebook || '',
          youtube: data.youtube || '',
        });
      }
    }
    setLoading(false);
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id);
    if (!error) showToast("Perubahan berhasil disimpan ✨");
    else showToast("Gagal menyimpan: " + error.message, 'error');
    setLoading(false);
  };

  if (loading) return <div className="p-10 text-center font-medium text-gray-400">Memuat data...</div>;

  const inputGroupClass = "flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-200 focus-within:border-black transition-all";

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900 font-sans relative">
      
      {/* 🚀 TOAST NOTIFIKASI PERSIS FOTO LOGIN LO */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-[#39E09B]' : 'bg-red-500'}`}></div>
          <span className="text-[13px] font-semibold text-gray-700">{toast.message}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black tracking-tight">Koneksi Sosial</h1>
          <button onClick={handleSave} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
            <Save size={18} /> Simpan
          </button>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-4">
          
          <div className={inputGroupClass}>
            <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <BrandLogos.instagram />
            </div>
            <div className="flex flex-1 items-center text-sm font-semibold">
              <span className="text-gray-400">instagram.com/</span>
              <input type="text" placeholder="username" className="w-full bg-transparent outline-none text-black pl-1" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
            </div>
          </div>

          <div className={inputGroupClass}>
            <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <BrandLogos.tiktok />
            </div>
            <div className="flex flex-1 items-center text-sm font-semibold">
              <span className="text-gray-400">tiktok.com/@</span>
              <input type="text" placeholder="username" className="w-full bg-transparent outline-none text-black pl-1" value={formData.tiktok} onChange={(e) => setFormData({...formData, tiktok: e.target.value})} />
            </div>
          </div>

          <div className={inputGroupClass}>
            <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <BrandLogos.whatsapp />
            </div>
            <div className="flex flex-1 items-center text-sm font-semibold">
              <span className="text-gray-400">wa.me/</span>
              <input type="text" placeholder="6281234..." className="w-full bg-transparent outline-none text-black pl-1" value={formData.whatsapp_profile} onChange={(e) => setFormData({...formData, whatsapp_profile: e.target.value})} />
            </div>
          </div>

          <div className={inputGroupClass}>
            <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <BrandLogos.x />
            </div>
            <div className="flex flex-1 items-center text-sm font-semibold">
              <span className="text-gray-400">x.com/</span>
              <input type="text" placeholder="username" className="w-full bg-transparent outline-none text-black pl-1" value={formData.x_profile} onChange={(e) => setFormData({...formData, x_profile: e.target.value})} />
            </div>
          </div>

          <div className={inputGroupClass}>
            <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <BrandLogos.facebook />
            </div>
            <div className="flex flex-1 items-center text-sm font-semibold">
              <span className="text-gray-400">fb.com/</span>
              <input type="text" placeholder="username" className="w-full bg-transparent outline-none text-black pl-1" value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} />
            </div>
          </div>

          <div className={inputGroupClass}>
            <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <BrandLogos.youtube />
            </div>
            <div className="flex flex-1 items-center text-sm font-semibold">
              <span className="text-gray-400">youtube.com/@</span>
              <input type="text" placeholder="channel" className="w-full bg-transparent outline-none text-black pl-1" value={formData.youtube} onChange={(e) => setFormData({...formData, youtube: e.target.value})} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}