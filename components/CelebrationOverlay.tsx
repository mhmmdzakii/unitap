// components/CelebrationOverlay.tsx
"use client";
import { useEffect } from 'react';
import { Crown, BadgeCheck, Sparkles, X, LayoutDashboard } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
// @ts-ignore
import confetti from 'canvas-confetti';

interface CelebrationProps {
  celebration: 'pro' | 'premium';
  onClose: () => void;
}

export default function CelebrationOverlay({ celebration, onClose }: CelebrationProps) {
  
  // Confetti otomatis meledak pas komponen ini muncul
  useEffect(() => {
    // Dikasih delay dikit (300ms) biar meledaknya pas teksnya udah mulai muncul, jadi lebih natural
    const timer = setTimeout(() => {
      confetti({ 
          particleCount: 200, spread: 100, origin: { y: 0.6 }, 
          colors: ['#7949F6', '#d2e823', '#FF0080', '#FFFFFF'] 
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 FIX TYPESCRIPT: Pakai tipe 'Variants' dan bikin jedanya lebih smooth
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    }
  };

  // 🔥 UPGRADE SMOOTHNESS: Ganti spring mantul jadi kurva cinematic (Blur to Focus)
  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0, filter: 'blur(8px)' },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } // Kurva easing super halus
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed inset-0 z-[9999] bg-[#0A0A0A]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 overflow-hidden custom-celebration-overlay"
    >
       {/* Tombol Silang */}
       <button onClick={onClose} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-all duration-300 z-[10000]">
            <X size={32} />
       </button>
       
       {/* Efek Lampu Belakang (Smooth Breathing) */}
       <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[180px] pointer-events-none ${celebration === 'pro' ? 'bg-[#7949F6]' : 'bg-purple-600'}`}
       />
       <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[120px] pointer-events-none ${celebration === 'pro' ? 'bg-[#d2e823]' : 'bg-[#39E09B]'}`}
       />

       <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 text-center flex flex-col items-center max-w-3xl">
         
         {/* Icon Utama */}
         <motion.div variants={itemVariants} className="relative w-48 h-48 mb-16">
           <div className={`absolute inset-0 border-4 border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-40 ${celebration === 'pro' ? 'border-[#d2e823]' : 'border-[#7949F6]'}`}></div>
           <div className={`absolute inset-4 rounded-[3rem] flex items-center justify-center transform rotate-12 transition-transform duration-700 hover:rotate-0 ${celebration === 'pro' ? 'bg-gradient-to-tr from-[#7949F6] to-[#d2e823] shadow-[0_0_90px_rgba(210,232,35,0.7)]' : 'bg-gradient-to-tr from-purple-500 to-[#7949F6] shadow-[0_0_90px_rgba(121,73,246,0.7)]'}`}>
             {celebration === 'pro' ? <Crown size={90} className="text-white drop-shadow-lg" /> : <BadgeCheck size={90} className="text-white drop-shadow-lg" />}
           </div>
           <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 0.8] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className={`absolute -top-6 -right-6 ${celebration === 'pro' ? 'text-[#d2e823]' : 'text-[#7949F6]'}`}>
               <Sparkles size={60} />
           </motion.div>
         </motion.div>
         
         {/* Teks */}
         <motion.h1 variants={itemVariants} className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter italic leading-none bg-clip-text text-transparent ${celebration === 'pro' ? 'bg-gradient-to-b from-[#FFFEE0] to-[#d2e823]' : 'bg-gradient-to-b from-white to-[#7949F6]'}`}>
           {celebration === 'pro' ? 'KASTA SULTAN TERBUKA!' : 'TAHTA PREMIUM AKTIF!'}
         </motion.h1>
         
         <motion.p variants={itemVariants} className="text-gray-300 font-medium text-lg md:text-2xl mb-20 max-w-2xl leading-relaxed">
           Selamat! Akun Anda kini resmi ditingkatkan. Seluruh fitur eksklusif <span className={`font-black uppercase tracking-widest ${celebration === 'pro' ? 'text-[#d2e823]' : 'text-[#7949F6]'}`}>{celebration === 'pro' ? 'Pro Sultan' : 'Premium'}</span> telah diaktifkan sepenuhnya.
         </motion.p>
         
         {/* Tombol Kembali (Smooth Hover) */}
         <motion.button 
            variants={itemVariants} 
            onClick={onClose} 
            className={`group px-12 py-6 text-black rounded-3xl font-black text-xl md:text-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 active:scale-95 flex items-center gap-4 ${celebration === 'pro' ? 'bg-[#d2e823] shadow-[0_0_40px_rgba(210,232,35,0.4)] hover:shadow-[0_0_60px_rgba(210,232,35,0.6)]' : 'bg-white shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]'}`}
         >
           <LayoutDashboard size={28} className="transition-transform duration-500 group-hover:rotate-12"/> KEMBALI KE DASHBOARD
         </motion.button>

       </motion.div>
    </motion.div>
  );
}