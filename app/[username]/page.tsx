// app/[username]/page.tsx
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, X, Sparkles } from 'lucide-react';

export default function PublicProfile() {
  const [showDonation, setShowDonation] = useState(false);
  const [isThanks, setIsThanks] = useState(false);

  // 🔥 KONFIGURASI SULTAN (QRIS Paten Lo)
  const MY_QRIS_IMAGE = "https://your-supabase-url.com/storage/v1/object/public/avatars/rqs.jpeg"; // Ganti pakai link QRIS asli lo
  const MY_NAME = "UniTap Official";

  const handleDoneDonate = () => {
    // 1. Munculin Confetti Hujan Duit/Bintang
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7949F6', '#d2e823', '#FF0080']
    });

    // 2. Aktifkan mode terima kasih (Unicorn Terbang)
    setIsThanks(true);
    
    // 3. Tutup otomatis setelah 5 detik
    setTimeout(() => {
      setIsThanks(false);
      setShowDonation(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F5] flex flex-col items-center py-12 px-6 font-sans">
      
      {/* BAGIAN PROFIL SINGKAT */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 bg-black rounded-full mb-4 border-4 border-white shadow-xl overflow-hidden">
            <img src="/logo-lo.png" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">@{MY_NAME}</h1>
        <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">Creator & Developer</p>
      </div>

      {/* TOMBOL DONASI UTAMA */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDonation(true)}
        className="group relative px-8 py-5 bg-black text-white rounded-[2rem] font-black text-lg shadow-2xl overflow-hidden flex items-center gap-3"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#7949F6] to-[#d2e823] opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <Heart size={24} className="text-pink-500 fill-pink-500 group-hover:animate-ping" />
        Traktir Kopi Seikhlasnya ☕
      </motion.button>

      {/* MODAL DONASI (POP UP) */}
      <AnimatePresence>
        {showDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isThanks && setShowDonation(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden text-center"
            >
              {/* ANIMASI UNICORN TERBANG (Muncul pas beres bayar) */}
              <AnimatePresence>
                {isThanks && (
                  <motion.div 
                    initial={{ x: -200, y: 100, rotate: -20 }}
                    animate={{ x: 300, y: -300, rotate: 20 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
                  >
                     <span className="text-8xl">🦄</span>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12">
                        <motion.div animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1 }}>
                           <Sparkles className="text-[#d2e823]" size={40} />
                        </motion.div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isThanks ? (
                <>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Apresiasi Karya</h3>
                  <p className="text-sm font-bold text-gray-500 mb-8 px-4">Scan QRIS di bawah untuk kasih tips seikhlasnya langsung ke rekening gue!</p>
                  
                  <div className="bg-[#F6F7F5] p-6 rounded-[2rem] border-2 border-gray-100 mb-8 relative">
                    <img src={MY_QRIS_IMAGE} alt="QRIS" className="w-full aspect-square object-contain rounded-xl" />
                    <div className="mt-4 py-1.5 bg-green-500 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em]">QRIS Terverifikasi</div>
                  </div>

                  <button 
                    onClick={handleDoneDonate}
                    className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform"
                  >
                    SAYA SUDAH BAYAR ✨
                  </button>
                </>
              ) : (
                <div className="py-12 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-[#d2e823] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Heart size={40} className="text-[#254f1a] fill-[#254f1a]" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">MAKASIH SULTAN!</h3>
                  <p className="text-sm font-bold text-[#7949F6]">Dukungan lo berarti banget buat kelangsungan UniTap!</p>
                </div>
              )}

              {!isThanks && (
                <button onClick={() => setShowDonation(false)} className="mt-6 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
                  Nanti Aja Deh
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}