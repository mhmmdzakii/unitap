// app/admin/verified/page.tsx
"use client";
import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { BadgeCheck, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function VerifiedPage() {
  const { profile, setProfile } = useAdmin();
  const isPro = profile?.plan_type === 'pro';
  const [isSaving, setIsSaving] = useState(false);

  const showBadge = profile?.is_verified || false;

 const toggleBadge = async () => {
    if (!isPro) {
      toast.error("Fitur khusus Pro. Silakan upgrade terlebih dahulu 👑");
      return;
    }
    
    setIsSaving(true);
    const newValue = !showBadge;

    // 🔥 JALUR BYPASS: Ambil ID langsung dari sesi Auth, bukan dari Profile!
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      toast.error("Sesi login hilang, coba refresh halaman!");
      setIsSaving(false);
      return;
    }

    // Optimistic Update UI
    setProfile({ ...profile, is_verified: newValue });

    // Update ke Supabase menggunakan session.user.id
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: newValue })
      .eq('id', session.user.id); // 👈 Tembak langsung pakai ID asli!

    if (error) {
      toast.error('Error DB: ' + error.message);
      setProfile({ ...profile, is_verified: !newValue }); // Rollback kalau gagal
    } else {
      toast.success(newValue ? 'Centang Biru Diaktifkan! 💎' : 'Centang Biru Disembunyikan.');
    }
    setIsSaving(false);
  };
  return (
    <div className="max-w-4xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
          Verified Badge <BadgeCheck className="text-blue-500 fill-blue-100" size={32} />
        </h1>
        <p className="text-gray-500 font-bold text-sm mt-1">Tampilkan centang biru agar profil Anda terlihat resmi dan tepercaya.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6 relative">
          
          {/* OVERLAY PRO */}
          {!isPro && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[6px] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center border border-gray-100 shadow-sm">
               <div className="w-20 h-20 bg-[#d2e823] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg transform rotate-3">
                 <BadgeCheck size={40} className="text-[#254f1a]" />
               </div>
               <h3 className="font-black text-gray-900 text-3xl mb-3 tracking-tight">Eksklusif Pro</h3>
               <p className="text-sm font-medium text-gray-500 mb-8 max-w-[280px] leading-relaxed">
                 Hanya member Pro yang dapat menampilkan Lencana Verifikasi Resmi UniTap di profil mereka.
               </p>
               <Link href="/admin/pricing" className="px-8 py-4 bg-black text-white rounded-full font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                 <Zap size={18} className="text-[#d2e823]" fill="currentColor" /> DAPATKAN LENCANA
               </Link>
            </div>
          )}

          <div className={`bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden transition-all ${!isPro ? 'opacity-30 pointer-events-none blur-[2px]' : ''}`}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 blur-[80px] opacity-10 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black text-gray-900">Tampilkan Lencana</h3>
                <p className="text-xs font-bold text-gray-500 mt-1">Munculkan centang biru di sebelah nama Anda.</p>
              </div>
              
              <button 
                onClick={toggleBadge}
                disabled={isSaving}
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors relative ${showBadge ? 'bg-blue-500' : 'bg-gray-200'}`}
              >
                {isSaving && <Loader2 size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-spin" />}
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${showBadge ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4 relative z-10">
              <ShieldCheck size={24} className="text-blue-500 shrink-0 mt-1" />
              <div>
                <p className="font-black text-gray-900 text-sm">Jaminan Keaslian</p>
                <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">Lencana ini membantu meningkatkan kredibilitas Anda. Pengunjung akan tahu bahwa tautan ini 100% resmi milik Anda.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-2">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Pratinjau Langsung</div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-md flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-white">
             <div className="w-24 h-24 bg-gradient-to-r from-[#7949F6] to-[#d2e823] rounded-full mb-4 shadow-lg flex items-center justify-center text-white text-3xl font-black">
               {profile?.username?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div className="flex items-center gap-1.5">
               <h3 className="text-2xl font-black text-gray-900 tracking-tight">@{profile?.username || 'username'}</h3>
               {showBadge && (
                 <BadgeCheck size={24} className="text-blue-500 fill-blue-100 animate-in zoom-in duration-300" />
               )}
             </div>
             <p className="text-sm font-medium text-gray-500 mt-2">{profile?.bio || 'Kreator Konten'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}