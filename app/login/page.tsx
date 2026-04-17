// app/login/page.tsx
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast'; 

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔥 LOGIKA AUTH DENGAN TOAST ESTETIK (BAHASA INDONESIA)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Bikin ID toast biar pop-up nya bisa update (gak numpuk)
    const toastId = toast.loading(isLogin ? 'Memeriksa data masuk...' : 'Menyiapkan akun Anda...');
    
    if (isLogin) {
      // JALUR AKUN LAMA (LOGIN)
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error('Email atau kata sandi salah. Coba lagi ya!', { id: toastId }); 
      } else {
        toast.success('Selamat datang kembali, Sultan! ✨', { id: toastId }); 
        router.push('/admin/links');
      }
    } else {
      // JALUR AKUN BARU (SIGN UP)
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success('Akun berhasil dibuat! Mari atur profilmu 🚀', { id: toastId });
        router.push('/onboarding'); 
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#7949F6] selection:text-white">
      {/* 🔥 PASANG SPEAKER NOTIFIKASI DI SINI */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Kolom Kiri: Branding + Gambar Estetik */}
      <div className="hidden lg:flex w-1/2 bg-[#d2e823] p-10 flex-col relative overflow-hidden">
        
        {/* Header / Logo */}
        <div className="relative z-20 mb-auto">
          <Link href="/" className="font-extrabold text-2xl text-[#254f1a] tracking-tight flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-[#254f1a] rounded-xl flex items-center justify-center text-[#d2e823] text-sm transform -rotate-3 shadow-md">U</div> 
            UniTap*
          </Link>
        </div>

        {/* Gambar Center Estetik */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center my-8">
           <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-[#b8cc1c]/30 transform -rotate-2 hover:rotate-0 transition-transform duration-700 relative group">
               
               {/* URL Gambar (Bisa lo ganti sama foto produk/dashboard lo) */}
               <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000" 
                  alt="UniTap Creators" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               />
               
               {/* Overlay Gradasi Hitam di Bawah Buat Teks */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"></div>
               
               {/* Teks di dalam gambar */}
               <div className="absolute bottom-8 left-8 right-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d2e823] text-[#254f1a] text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
                     <Sparkles size={14} /> Kembangkan Audiens
                  </div>
                  <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-3 tracking-tight">Kuasai dunia digitalmu.</h1>
                  <p className="text-gray-300 font-medium text-base xl:text-lg">Bergabunglah dengan ribuan kreator, merek, dan bisnis yang menggunakan UniTap.</p>
               </div>
           </div>
        </div>
        
        {/* Dekorasi Blob Kanan Bawah */}
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#b8cc1c] rounded-full blur-3xl opacity-50 z-0"></div>
      </div>

      {/* Kolom Kanan: Form Auth */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative overflow-hidden">
        {/* Dekorasi Halus di Form */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7949F6] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="w-full max-w-[440px] relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              {isLogin ? 'Selamat datang' : 'Mulai perjalananmu'}
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              {isLogin ? 'Masuk kembali ke dasbor UniTap Anda.' : 'Klaim tautan impianmu sekarang juga.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Alamat Email</label>
              <input 
                type="email" placeholder="nama@contoh.com" required
                className="w-full px-5 py-4 bg-[#F6F7F5] border-transparent focus:bg-white border-2 focus:border-[#7949F6] rounded-2xl outline-none font-bold text-gray-900 transition-all focus:shadow-[0_0_20px_rgba(121,73,246,0.15)]"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Kata Sandi</label>
                 {isLogin && <a href="#" className="text-xs font-bold text-[#7949F6] hover:underline">Lupa sandi?</a>}
              </div>
              <input 
                type="password" placeholder="••••••••" required
                className="w-full px-5 py-4 bg-[#F6F7F5] border-transparent focus:bg-white border-2 focus:border-[#7949F6] rounded-2xl outline-none font-bold text-gray-900 transition-all focus:shadow-[0_0_20px_rgba(121,73,246,0.15)]"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#7949F6] text-white py-4.5 rounded-2xl font-black text-lg shadow-lg shadow-[#7949F6]/25 hover:bg-[#683cd4] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7949F6]/30 transition-all mt-4 flex justify-center items-center gap-3 h-[60px]"
            >
              {/* 🔥 ANIMASI SPINNER & TEXT DINAMIS */}
              {loading ? <Loader2 size={24} className="animate-spin" /> : (isLogin ? 'Masuk Dasbor' : 'Daftar Sekarang')} 
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-[#7949F6] font-black hover:underline ml-1">
                {isLogin ? 'Daftar Gratis' : 'Masuk Saja'}
              </button>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}