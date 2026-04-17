// app/admin/premium/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Star, Landmark, MessageCircle, Copy, CheckCircle2, Loader2, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { profile } = useAdmin();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // 🔥 GANTI DATA REKENING LO DI SINI
  const ADMIN_WA = "6281234567890"; 
  const NO_REK = "1234567890";
  const BANK = "BCA / GoPay";
  const ATAS_NAMA = "NAMA LO DISINI";

  const handleCopyRekening = () => {
    navigator.clipboard.writeText(NO_REK);
    setCopied(true);
    toast.success('Nomor disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmWA = () => {
    setStatus('processing');
    const toastId = toast.loading('Memproses konfirmasi...');

    setTimeout(() => {
      setStatus('success');
      toast.success('Pesta dimulai! 💎', { id: toastId });
      
      // 🔥 TRIGER HUJAN CONFETTI ESTETIK 🔥
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#7949F6', '#39E09B', '#FFFFFF', '#FFD700'] });

      const msg = `Halo Admin UniTap! 💎\n\nSaya konfirmasi pembayaran *PREMIUM* (Rp 15.000).\n\nUsername: @${profile?.username || 'user'}\n\n[Lampirkan bukti transfer]`;
      window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`, '_blank');
    }, 2000);
  };

  // ============================================================
  // 🔥 TAMPILAN PESTA SELEBRASI PREMIUM (FULL SCREEN GELAP) 🔥
  // ============================================================
  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center p-6 overflow-hidden">
        
        {/* Glowing Background Effect (Lampu Ungu/Hijau) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7949F6] blur-[150px] opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#39E09B] blur-[100px] opacity-30 animate-pulse delay-500"></div>

        <div className="relative z-10 text-center animate-in zoom-in duration-700">
          
          {/* Main Icon Celebration (Badge Muter) */}
          <div className="relative w-48 h-48 mx-auto mb-12">
            <div className="absolute inset-0 border-4 border-dashed border-[#7949F6] rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
            <div className="absolute inset-4 bg-gradient-to-tr from-purple-500 to-[#7949F6] rounded-[3rem] flex items-center justify-center shadow-[0_0_80px_rgba(121,73,246,0.7)] transform rotate-12">
              <BadgeCheck size={80} className="text-white drop-shadow-lg" />
            </div>
             {/* Sparkle Icon */}
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-5 -right-5 text-[#7949F6]">
                <Sparkles size={50} />
            </motion.div>
          </div>
          
          {/* 🔥 UCAPAN SELAMAT PREMIUM 🔥 */}
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic drop-shadow-md leading-tight">ELEGAN! 💎</h1>
          <p className="text-gray-300 font-bold text-xl md:text-3xl mb-20 max-w-2xl mx-auto leading-relaxed">
            Selamat! Anda telah berlangganan paket <span className="text-[#7949F6]">Premium</span>. Mohon <span className="text-white border-b-2 border-[#7949F6]">kirimkan bukti transfer</span> di WhatsApp Admin agar tema segera diaktifkan.
          </p>
          
          {/* 🔥 TOMBOL KEMBALI KE DASHBOARD 🔥 */}
          <button 
            onClick={() => router.push('/admin')}
            className="px-16 py-7 bg-[#7949F6] text-white rounded-3xl font-black text-3xl hover:scale-110 hover:-rotate-2 transition-all shadow-[0_0_40px_rgba(121,73,246,0.5)] active:scale-95"
          >
            KEMBALI KE DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // ⬇️ TAMPILAN HALAMAN PEMBAYARAN BIASA ⬇️
  // ============================================================
  return (
    <div className="max-w-2xl mx-auto py-10 lg:py-20 px-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-[3rem] p-8 lg:p-10 shadow-2xl border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform">
           <Star size={80} className="text-[#7949F6] opacity-10 fill-current" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2">Checkout Premium</h2>
        <p className="text-gray-500 font-bold mb-8">Selesaikan transfer untuk tema estetik.</p>

        {/* METODE PEMBAYARAN */}
        <div className="p-6 bg-[#F6F7F5] rounded-3xl border border-gray-200 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Landmark size={32} className="text-[#7949F6]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-black text-gray-900 text-xl tracking-widest">{NO_REK}</p>
            <p className="text-sm font-bold text-gray-500">{BANK} a.n {ATAS_NAMA}</p>
            <p className="text-xs font-black text-white bg-[#7949F6] inline-block px-3 py-1 rounded-full mt-2 uppercase tracking-wider shadow">TOTAL: Rp 15.000</p>
          </div>
          <button onClick={handleCopyRekening} className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
             {copied ? <CheckCircle2 size={16} className="text-[#39E09B]"/> : <Copy size={16}/>} Salin
          </button>
        </div>

        <button 
          onClick={handleConfirmWA}
          disabled={status === 'processing'}
          className="w-full py-5 bg-[#7949F6] text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl hover:shadow-[#7949F6]/30"
        >
          {status === 'processing' ? <Loader2 className="animate-spin" /> : <MessageCircle fill="currentColor" />} 
          {status === 'processing' ? 'Memproses Konfirmasi...' : 'Konfirmasi via WhatsApp & Mulai Pesta'}
        </button>
      </div>
    </div>
  );
}