// app/admin/seo/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { Search, Loader2, Save, Zap, Globe, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SeoPage() {
  const { profile, setProfile } = useAdmin();
  
  // 🔥 INI PENJAGA PINTUNYA: Hanya buat Pro Sultan
  const isPro = profile?.plan_type === 'pro'; 
  
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [gaId, setGaId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setSeoTitle(profile.seo_title || '');
      setSeoDesc(profile.seo_desc || '');
      setGaId(profile.ga_id || '');
    }
  }, [profile]);

  const handleSaveSettings = async () => {
    if (!isPro) {
      toast.error("Fitur khusus Pro Sultan. Silakan upgrade terlebih dahulu 👑");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan pengaturan SEO...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Sesi login hilang!");

      const { error } = await supabase
        .from('profiles')
        .update({ 
          seo_title: seoTitle,
          seo_desc: seoDesc,
          ga_id: gaId
        })
        .eq('id', userId);

      if (error) throw error;

      setProfile({ ...profile, seo_title: seoTitle, seo_desc: seoDesc, ga_id: gaId });
      toast.success('Pengaturan SEO berhasil disimpan! 🚀', { id: toastId });

    } catch (error: any) {
      toast.error('Gagal menyimpan: ' + error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10 relative">
      
      {/* 🔥 OVERLAY GEMBOK SULTAN 🔥 */}
      {!isPro && (
        <div className="absolute inset-0 z-50 bg-[#F6F7F5]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-[3rem]">
           <div className="w-24 h-24 bg-[#d2e823] rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transform rotate-6 border-4 border-white">
             <Search size={48} className="text-[#254f1a]" />
           </div>
           <h3 className="font-black text-gray-900 text-4xl mb-4 tracking-tight">Kuasai Google 🚀</h3>
           <p className="text-base font-bold text-gray-600 mb-8 max-w-md leading-relaxed">
             Tampil di halaman pertama Google dan pantau pengunjung Anda secara real-time dengan Google Analytics. Eksklusif untuk Pro Sultan.
           </p>
           <Link href="/admin/pricing" className="px-10 py-5 bg-black text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
             <Zap size={24} className="text-[#d2e823]" fill="currentColor" /> BUKA KUNCI FITUR PRO
           </Link>
        </div>
      )}

      {/* KONTEN HALAMAN (Di-blur kalau gratisan) */}
      <div className={`transition-all ${!isPro ? 'opacity-10 pointer-events-none blur-md' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
              SEO & Analytics <Globe className="text-[#39E09B]" size={32} />
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-1">Optimalkan profil Anda untuk mesin pencari dan pantau trafik.</p>
          </div>
          
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving || !isPro}
            className="px-8 py-3.5 bg-black text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} 
            Simpan Pengaturan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BAGIAN SEO */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Search className="text-blue-500" size={20} />
              </div>
              <h3 className="font-black text-xl text-gray-900">Meta Tags Google</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Meta Title (Judul Web)</label>
                <input 
                  type="text" 
                  value={seoTitle} 
                  onChange={(e) => setSeoTitle(e.target.value)} 
                  placeholder={`Misal: ${profile?.username || 'Akun'} | Link di Bio`} 
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#7949F6] rounded-xl outline-none font-bold text-sm text-gray-900 transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Meta Description</label>
                <textarea 
                  value={seoDesc} 
                  onChange={(e) => setSeoDesc(e.target.value)} 
                  rows={3}
                  placeholder="Deskripsi singkat yang akan muncul di bawah judul saat orang mencari Anda di Google..." 
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#7949F6] rounded-xl outline-none font-medium text-sm text-gray-900 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* BAGIAN ANALYTICS */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <BarChart2 className="text-orange-500" size={20} />
              </div>
              <h3 className="font-black text-xl text-gray-900">Google Analytics</h3>
            </div>

            <p className="text-sm font-medium text-gray-500 mb-6">
              Lacak berapa banyak orang yang mengunjungi profil Anda, dari mana mereka berasal, dan tautan mana yang paling sering di-klik.
            </p>

            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Tracking ID (G-XXXXXXX)</label>
              <input 
                type="text" 
                value={gaId} 
                onChange={(e) => setGaId(e.target.value.toUpperCase())} 
                placeholder="G-1234567890" 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#7949F6] rounded-xl outline-none font-mono font-bold text-sm text-gray-900 transition-all uppercase"
              />
              <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1">Buka dasbor Google Analytics Anda untuk mendapatkan ID ini.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}