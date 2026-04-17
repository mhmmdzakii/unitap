// app/admin/pricing/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Check, Star, Crown, Zap, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const router = useRouter();
  const { profile } = useAdmin();
  const currentPlan = profile?.plan_type || 'free';

  // Logika buat pindah ke halaman kasir (checkout)
  const handleUpgrade = (planName: string) => {
    if (currentPlan === planName) {
      toast('Anda sudah berada di paket ini!', { icon: '👏' });
      return;
    }
    
    // Langsung arahkan ke /admin/premium atau /admin/pro
    router.push(`/admin/${planName}`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10 relative overflow-hidden">
      
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4">
          Pilih Kekuatan Magis Anda ✨
        </h1>
        <p className="text-gray-500 font-bold text-lg">
          Dapatkan fitur eksklusif dan mulai panen cuan hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* PAKET FREE */}
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-gray-100 shadow-sm flex flex-col h-full opacity-80">
          <div className="mb-8">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">FREE</span>
            <div className="text-5xl font-black text-gray-900 mt-2 mb-1">Rp 0</div>
            <p className="text-sm font-bold text-gray-500">Dasar untuk semua</p>
          </div>
          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700"><Check size={18} className="text-[#39E09B]"/> Tip Jar / Donasi QRIS 💰</div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700"><Check size={18} className="text-[#39E09B]"/> Tautan Tanpa Batas</div>
          </div>
          <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-sm cursor-not-allowed">
            {currentPlan === 'free' ? 'Paket Saat Ini' : 'Terbuka'}
          </button>
        </div>

        {/* PAKET PREMIUM */}
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#7949F6] shadow-xl relative flex flex-col h-full transform md:-translate-y-4">
          <div className="mb-8">
            <span className="text-[11px] font-black text-[#7949F6] uppercase tracking-widest flex items-center gap-1.5"><Star size={14}/> PREMIUM</span>
            <div className="text-5xl font-black text-gray-900 mt-2 mb-1">Rp 15k<span className="text-lg text-gray-400 font-bold">/bln</span></div>
            <p className="text-sm font-bold text-gray-500">Gaya Sultan & Centang Biru</p>
          </div>
          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-900"><Check size={18} className="text-[#7949F6]"/> Centang Biru 💎</div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-900"><Check size={18} className="text-[#7949F6]"/> Tema Premium Eksklusif</div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-900"><Check size={18} className="text-[#7949F6]"/> Custom Font & Warna</div>
          </div>
          <button 
            onClick={() => handleUpgrade('premium')}
            className="w-full py-4 bg-[#7949F6] text-white rounded-2xl font-black text-sm hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
             {currentPlan === 'premium' ? 'Paket Aktif' : 'Upgrade Premium'}
          </button>
        </div>

        {/* PAKET PRO SULTAN */}
        <div className="bg-black rounded-[2.5rem] p-8 border-2 border-gray-800 shadow-2xl relative flex flex-col h-full overflow-hidden">
          <div className="mb-8 relative z-10">
            <span className="text-[11px] font-black text-[#d2e823] uppercase tracking-widest flex items-center gap-1.5"><Crown size={14}/> PRO SULTAN</span>
            <div className="text-5xl font-black text-white mt-2 mb-1">Rp 29k<span className="text-lg text-gray-400 font-bold">/bln</span></div>
            <p className="text-sm font-bold text-gray-400">Bisnis & Etalase Produk</p>
          </div>
          <div className="space-y-4 mb-10 flex-1 relative z-10">
            <div className="flex items-center gap-3 text-sm font-bold text-white"><Check size={18} className="text-[#d2e823]"/> Etalase Affiliate 🛍️</div>
            <div className="flex items-center gap-3 text-sm font-bold text-white"><Check size={18} className="text-[#d2e823]"/> SEO & Google Analytics</div>
            <div className="flex items-center gap-3 text-sm font-bold text-white"><Check size={18} className="text-[#d2e823]"/> Custom Domain 🌐</div>
          </div>
          <button 
            onClick={() => handleUpgrade('pro')}
            className="w-full py-4 bg-[#d2e823] text-[#254f1a] rounded-2xl font-black text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 relative z-10"
          >
             {currentPlan === 'pro' ? 'Paket Aktif' : 'Jadi Pro Sultan'}
          </button>
        </div>

      </div>
    </div>
  );
}