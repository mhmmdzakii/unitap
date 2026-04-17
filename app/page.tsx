// app/page.tsx
import Link from 'next/link';
import { ArrowRight, Sparkles, Layout, BarChart2, DollarSign, Smartphone, Globe, Zap, CheckCircle2, Check, Crown } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#7949F6] selection:text-white">
      
      {/* NAVBAR STICKY (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all">
        <div className="font-extrabold text-2xl text-black tracking-tight flex items-center gap-2">
           <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-sm transform -rotate-3 shadow-md">U</div> 
           UniTap*
        </div>
        <div className="flex items-center gap-4 font-bold text-sm">
           <Link href="/login" className="text-gray-600 hover:text-black transition-colors px-4 py-2 hidden md:block">Masuk</Link>
           <Link href="/login" className="bg-[#7949F6] text-white px-6 py-3 rounded-full hover:bg-[#683cd4] transition-all hover:shadow-lg hover:-translate-y-0.5">
             Daftar Gratis
           </Link>
        </div>
      </nav>

      {/* 🔥 SECTION 1: HERO (SESUAI SCREENSHOT - GRADASI UNICORN) */}
      <section className="pt-40 pb-20 px-6 flex flex-col items-center text-center bg-[#FDFDFD] min-h-[90vh] justify-center relative overflow-hidden">
        {/* Dekorasi Background Halus */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-[#7949F6] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-[#d2e823] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7949F6]/10 text-[#7949F6] text-sm font-bold mb-8 shadow-sm relative z-10 animate-in slide-in-from-bottom-4">
           <Sparkles size={16} /> Baru: Analitik Lanjutan telah hadir!
        </div>
        <h1 className="text-6xl md:text-[80px] lg:text-[100px] font-black text-gray-900 tracking-tighter leading-[1.05] mb-8 relative z-10 animate-in slide-in-from-bottom-6 max-w-5xl">
          Semua tentang Anda. <br className="hidden md:block"/> Dalam satu, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7949F6] to-[#d2e823]">tautan simpel.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-[700px] mb-12 leading-relaxed relative z-10 animate-in slide-in-from-bottom-8">
          Bergabunglah dengan ribuan kreator yang menggunakan UniTap untuk membagikan konten, membangun audiens, dan menghasilkan cuan dari *passion* mereka.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md relative z-10 animate-in zoom-in-95 delay-150">
           <Link href="/login" className="bg-[#d2e823] text-[#254f1a] px-10 py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_8px_30px_rgba(210,232,35,0.4)] w-full">
             Klaim Tautan UniTap <ArrowRight size={20} />
           </Link>
        </div>
      </section>

      {/* SECTION 2: LIME YELLOW (CUSTOMIZATION) */}
      <section className="py-32 bg-[#d2e823] px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
               <h2 className="text-5xl md:text-7xl font-black text-[#254f1a] tracking-tight leading-tight mb-6">Kreasikan Sesukamu.</h2>
               <p className="text-xl text-[#254f1a] font-medium mb-8 opacity-80 leading-relaxed">
                 Sesuaikan UniTap dengan *brand* Anda. Pilih dari tema premium, unggah galeri khusus, dan desain tombol yang mengubah pengunjung menjadi pelanggan.
               </p>
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 /> Wallpaper & Font Kustom</div>
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 /> Latar Belakang Animasi</div>
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 /> Kontrol Penuh Tampilan</div>
               </div>
            </div>
            <div className="flex-1 w-full flex justify-center">
               <div className="w-[300px] h-[600px] bg-black rounded-[40px] p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-[#7949F6] to-pink-500 rounded-[32px] p-6 flex flex-col items-center relative overflow-hidden">
                     {/* Efek Gradasi di dalam HP */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#d2e823] blur-3xl opacity-50 rounded-full"></div>
                     <div className="w-20 h-20 bg-white rounded-full mb-4 relative z-10"></div>
                     <div className="w-32 h-6 bg-white/30 rounded-full mb-8 relative z-10"></div>
                     <div className="w-full h-14 bg-white/20 rounded-xl mb-3 relative z-10 border border-white/10 backdrop-blur-sm"></div>
                     <div className="w-full h-14 bg-white/20 rounded-xl mb-3 relative z-10 border border-white/10 backdrop-blur-sm"></div>
                     <div className="w-full h-14 bg-white/20 rounded-xl mb-3 relative z-10 border border-white/10 backdrop-blur-sm"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 🔥 SECTION 3: DARK MODE (ANALYTICS) - GRADASI DISAMAKAN */}
      <section className="py-32 bg-[#111111] text-white px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1">
               {/* Teks gradasi konsisten */}
               <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7949F6] to-[#d2e823]">Pahami Audiensmu.</h2>
               <p className="text-xl text-gray-400 font-medium mb-8 leading-relaxed">
                 Pantau interaksi Anda seiring waktu, periksa pendapatan, dan pelajari apa yang menarik minat pengunjung. Buat keputusan cerdas untuk mengembangkan merek Anda lebih cepat.
               </p>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#222222] p-6 rounded-3xl border border-gray-800">
                     <BarChart2 className="text-[#d2e823] mb-4" size={32} />
                     <h4 className="font-bold text-xl mb-1">Statistik Langsung</h4>
                     <p className="text-sm text-gray-500">Data klik waktu nyata.</p>
                  </div>
                  <div className="bg-[#222222] p-6 rounded-3xl border border-gray-800">
                     <Globe className="text-[#7949F6] mb-4" size={32} />
                     <h4 className="font-bold text-xl mb-1">Lokasi Pengunjung</h4>
                     <p className="text-sm text-gray-500">Ketahui asal audiens Anda.</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 w-full">
               <div className="bg-[#222] p-8 rounded-[40px] shadow-2xl border border-gray-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-8">
                     <div>
                        <p className="text-gray-400 font-bold mb-1">Total Tayangan</p>
                        <p className="text-5xl font-black">2.4M</p>
                     </div>
                     <div className="bg-[#d2e823]/20 text-[#d2e823] px-4 py-2 rounded-full font-bold">+14%</div>
                  </div>
                  <div className="flex items-end gap-3 h-40">
                     {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                       <div key={i} className="flex-1 bg-gradient-to-t from-[#7949F6] to-[#d2e823] rounded-t-lg" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 4: PURPLE (MONETIZATION) */}
      <section className="py-32 bg-[#7949F6] text-white px-6">
         <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">Cuan dari Karya Anda.</h2>
            <p className="text-xl text-purple-200 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
               Jual produk digital, kumpulkan uang tip, atau hubungkan etalase jualan Anda hanya dengan satu klik. Tanpa perlu paham koding.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-white/10 p-10 rounded-[40px] backdrop-blur-md border border-white/20 hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-[#d2e823] rounded-2xl flex items-center justify-center text-[#254f1a] mx-auto mb-6"><DollarSign size={32}/></div>
                  <h3 className="text-2xl font-bold mb-3">Terima Uang Tip</h3>
                  <p className="text-purple-200 font-medium">Beri kesempatan pada penggemar setia untuk mendukung perjalanan kreatif Anda.</p>
               </div>
               <div className="bg-white/10 p-10 rounded-[40px] backdrop-blur-md border border-white/20 hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-[#d2e823] rounded-2xl flex items-center justify-center text-[#254f1a] mx-auto mb-6"><Smartphone size={32}/></div>
                  <h3 className="text-2xl font-bold mb-3">Jual Produk</h3>
                  <p className="text-purple-200 font-medium">Unggah e-book, preset, atau layanan Anda dan mulai berjualan seketika.</p>
               </div>
               <div className="bg-white/10 p-10 rounded-[40px] backdrop-blur-md border border-white/20 hover:-translate-y-2 transition-transform">
                  <div className="w-16 h-16 bg-[#d2e823] rounded-2xl flex items-center justify-center text-[#254f1a] mx-auto mb-6"><Zap size={32}/></div>
                  <h3 className="text-2xl font-bold mb-3">Tautan Super Cepat</h3>
                  <p className="text-purple-200 font-medium">Pengunjung tidak perlu menunggu *loading* lama untuk mengakses konten Anda.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 🔥 SECTION 5: PRICING (UNICORN THEME 100%) */}
      <section className="py-32 bg-[#0A0A0A] px-6 border-t border-white/5 relative overflow-hidden" id="pricing">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7949F6] blur-[150px] opacity-20 rounded-full pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">Pilih Paket Kesuksesanmu.</h2>
            <p className="text-xl text-gray-400 font-medium">Mulai gratis, tingkatkan saat *brand* Anda mulai meroket.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* TIER 1: FREE (DARK GLASS) */}
            <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">Gratis</h3>
              <p className="text-gray-500 font-medium mb-6 h-12">Semua fitur dasar untuk memulai karir Anda.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">Rp 0</span>
                <span className="text-gray-500 font-bold">/ selamanya</span>
              </div>
              <Link href="/login" className="w-full block text-center py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors mb-8">Mulai Sekarang</Link>
              <ul className="flex flex-col gap-4">
                {[
                  'Tautan tanpa batas', 
                  'Fitur Tip Jar (Uang Tip)', 
                  'Fitur Etalase Produk', 
                  'Tema & Tampilan Standar'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] font-bold text-gray-400">
                    <Check size={20} className="text-white shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* TIER 2: PREMIUM (GLOWING PURPLE) */}
            <div className="bg-[#7949F6] p-10 rounded-[2.5rem] border border-[#8B5CF6] shadow-[0_0_80px_rgba(121,73,246,0.3)] relative transform md:-translate-y-6">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d2e823] text-[#254f1a] font-black text-xs px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Paling Laris</div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Sparkles size={24} className="text-[#d2e823]" /> Premium</h3>
              <p className="text-purple-200 font-medium mb-6 h-12">Untuk kreator yang ingin tampil lebih estetik dan profesional.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">15rb</span>
                <span className="text-purple-200 font-bold">/ bulan</span>
              </div>
              <Link href="/login" className="w-full block text-center py-4 bg-[#d2e823] text-[#254f1a] rounded-2xl font-black hover:scale-105 transition-all mb-8 shadow-xl">Upgrade ke Premium</Link>
              <ul className="flex flex-col gap-4">
                {[
                  'Lencana Centang Biru (Verified)', 
                  'Akses Semua Tema Premium', 
                  'Bebas Pilih Font Kustom', 
                  'Semua Fitur di Paket Gratis'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] font-bold text-white">
                    <Check size={20} className="text-[#d2e823] shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* TIER 3: PRO (LIME YELLOW) */}
            <div className="bg-[#d2e823] p-10 rounded-[2.5rem] border border-[#b8cc1c] shadow-[0_0_80px_rgba(210,232,35,0.15)]">
              <h3 className="text-2xl font-black text-[#254f1a] mb-2 flex items-center gap-2"><Crown size={24} className="text-[#254f1a]" /> Pro Sultan</h3>
              <p className="text-[#254f1a]/70 font-bold mb-6 h-12">Fitur hardcore untuk bisnis dan dominasi pencarian.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-[#254f1a]">29rb</span>
                <span className="text-[#254f1a]/70 font-bold">/ bulan</span>
              </div>
              <Link href="/login" className="w-full block text-center py-4 bg-[#254f1a] text-[#d2e823] rounded-2xl font-black hover:bg-black transition-colors mb-8 shadow-lg">Ambil Pro Sultan</Link>
              <ul className="flex flex-col gap-4">
                {[
                  'Gunakan Domain Sendiri (Custom)', 
                  'Pengaturan SEO (Masuk Google)', 
                  'Semua Fitur Premium', 
                  'Dukungan Prioritas'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] font-bold text-[#254f1a]">
                    <Check size={20} className="text-[#254f1a] shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: BOTTOM CTA */}
      <section className="py-32 bg-[#FDFDFD] px-6 text-center border-t border-gray-100 relative overflow-hidden">
         {/* Dekorasi Glow Ringan */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#7949F6] to-[#d2e823] rounded-full filter blur-[120px] opacity-10 pointer-events-none"></div>
         <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 relative z-10">Siap membuat tautan Anda?</h2>
         <Link href="/login" className="relative z-10 inline-flex items-center justify-center gap-2 bg-[#d2e823] text-[#254f1a] px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-[0_8px_30px_rgba(210,232,35,0.4)]">
           Daftar Sekarang <ArrowRight size={24} />
         </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-8">
            <div className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
               <div className="w-8 h-8 bg-[#7949F6] rounded-xl flex items-center justify-center text-[#d2e823] text-sm transform -rotate-3">U</div> 
               UniTap*
            </div>
            <div className="flex gap-8 font-bold text-gray-400">
               <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
               <Link href="#pricing" className="hover:text-white transition-colors">Harga</Link>
               <Link href="#" className="hover:text-white transition-colors">Bantuan</Link>
            </div>
            <p className="text-gray-600 font-medium text-sm">© 2026 UniTap. Didesain untuk kreator Indonesia.</p>
         </div>
      </footer>

    </div>
  );
}