// app/admin/domain/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { Globe2, Zap, Loader2, Save, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CustomDomainPage() {
  const { profile, setProfile } = useAdmin();
  const isPro = profile?.plan_type === 'pro';
  
  const [domain, setDomain] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Tarik data asli dari database pas halaman dimuat
  useEffect(() => {
    if (profile?.custom_domain) {
      setDomain(profile.custom_domain);
    }
  }, [profile]);

  // 🔥 FUNGSI REAL-TIME SIMPAN KE DATABASE
  const handleSaveDomain = async () => {
    if (!profile?.id) {
      toast.error("Fitur khusus Pro Sultan! Upgrade dulu 👑");
      return;
    }

    // Validasi format domain dasar
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (domain && !domainPattern.test(domain)) {
      toast.error("Format domain tidak valid! (Contoh: namaanda.com)");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyambungkan domain ke server...');

    const { error } = await supabase
      .from('profiles')
      .update({ custom_domain: domain.toLowerCase() })
      .eq('id', profile?.id);

    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`, { id: toastId });
    } else {
      setProfile({ ...profile, custom_domain: domain.toLowerCase() });
      toast.success('Domain kustom berhasil disimpan! 🌐', { id: toastId });
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
            Domain Kustom <Globe2 className="text-[#39E09B]" size={32} />
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">Gunakan domain Anda sendiri untuk tautan profil yang lebih profesional.</p>
        </div>
        
        <button 
          onClick={handleSaveDomain}
          disabled={isSaving || !isPro}
          className={`px-8 py-3.5 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2 ${
            isPro ? 'bg-black text-white hover:scale-105 hover:shadow-xl' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} 
          Simpan Domain
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6 relative">
          
          {/* OVERLAY PRO */}
          {!isPro && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[6px] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center border border-gray-100 shadow-sm">
               <div className="w-20 h-20 bg-[#d2e823] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg transform -rotate-3">
                 <Globe2 size={40} className="text-[#254f1a]" />
               </div>
               <h3 className="font-black text-gray-900 text-3xl mb-3 tracking-tight">Fitur Premium</h3>
               <p className="text-sm font-medium text-gray-500 mb-8 max-w-[280px] leading-relaxed">
                 Tinggalkan tautan default. Gunakan domain Anda sendiri seperti <strong className="text-black">namaanda.com</strong> dengan UniTap Pro.
               </p>
               <Link href="/admin/pricing" className="px-8 py-4 bg-black text-white rounded-full font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                 <Zap size={18} className="text-[#d2e823]" fill="currentColor" /> UPGRADE SEKARANG
               </Link>
            </div>
          )}

          <div className={`bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden transition-all ${!isPro ? 'opacity-30 pointer-events-none blur-[2px]' : ''}`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#39E09B] blur-[80px] opacity-10 pointer-events-none"></div>
            
            <div className="mb-6 relative z-10">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Alamat Domain Anda</label>
              <div className="flex overflow-hidden rounded-[20px] border-[2.5px] border-gray-100 bg-gray-50 focus-within:border-[#39E09B] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(57,224,155,0.15)] transition-all">
                <span className="flex items-center pl-5 pr-2 text-gray-400 font-black select-none text-[15px]">
                  https://
                </span>
                <input 
                  type="text" 
                  placeholder="contoh.com"
                  className="flex-1 py-4 pr-5 bg-transparent outline-none font-black text-gray-900 text-[16px] placeholder:text-gray-300"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value.toLowerCase().trim())}
                />
              </div>
            </div>

            <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl relative z-10">
              <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                <LinkIcon size={16} className="text-[#7949F6]" /> Pengaturan DNS
              </h4>
              <p className="text-xs font-medium text-gray-500 leading-relaxed mb-4">
                Untuk menghubungkan domain Anda, masuk ke penyedia domain Anda (misal: Niagahoster) dan tambahkan CNAME record berikut:
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</span>
                  <span className="text-sm font-black text-gray-900">CNAME</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name / Host</span>
                  <span className="text-sm font-black text-gray-900">@</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Value / Data</span>
                  <span className="text-sm font-black text-[#7949F6]">cname.unitap.ee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS DOMAIN */}
        <div className="lg:col-span-2">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Status Koneksi</div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-md">
            {profile?.custom_domain ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">Domain Terhubung</h3>
                <p className="text-sm font-bold text-gray-500 mb-4">{profile.custom_domain}</p>
                <div className="px-4 py-2 bg-green-500 text-white text-xs font-black rounded-full uppercase tracking-widest">
                  Aktif
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Globe2 size={32} className="text-gray-400" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">Belum Ada Domain</h3>
                <p className="text-sm font-bold text-gray-500">Silakan atur domain Anda di kolom samping.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}