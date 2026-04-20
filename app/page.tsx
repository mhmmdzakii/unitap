// app/page.tsx
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, Layout, BarChart2, DollarSign, Smartphone, Globe, 
  Zap, CheckCircle2, Check, Crown, HelpCircle, Rocket, UserPlus, Megaphone, 
  Heart, ShoppingBag, Mail, Users, QrCode, Star, Quote, ShieldCheck 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#7949F6] selection:text-white bg-[#FDFDFD]">
      
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

      {/* 🔥 SECTION 1: HERO */}
      <section className="pt-40 pb-20 px-6 flex flex-col items-center text-center min-h-[95vh] justify-center relative overflow-hidden">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-[#7949F6] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-[#d2e823] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7949F6]/10 text-[#7949F6] text-sm font-bold mb-8 shadow-sm relative z-10 animate-in slide-in-from-bottom-4">
           <Sparkles size={16} /> Fitur Baru: Smart Affiliate & Database Kontak!
        </div>
        <h1 className="text-6xl md:text-[80px] lg:text-[110px] font-black text-gray-900 tracking-tighter leading-[1.05] mb-8 relative z-10 animate-in slide-in-from-bottom-6 max-w-5xl">
          Satu tautan untuk <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7949F6] to-[#d2e823]">dominasi digitalmu.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-[800px] mb-12 leading-relaxed relative z-10 animate-in slide-in-from-bottom-8">
          Berhenti membagikan banyak link yang membingungkan. Jual produk, bangun audiens, kumpulkan database WhatsApp, hingga buat pasukan *reseller* otomatis hanya dari satu tautan bio yang estetik.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md relative z-10 animate-in zoom-in-95 delay-150">
           <Link href="/login" className="bg-[#d2e823] text-[#254f1a] px-10 py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_8px_30px_rgba(210,232,35,0.4)] w-full">
             Klaim Tautan UniTap <ArrowRight size={20} />
           </Link>
        </div>
      </section>

      {/* 🔥 SECTION 1.5: LOGO CLOUD (SOCIAL PROOF) */}
      <section className="py-10 border-y border-gray-100 bg-white overflow-hidden flex flex-col items-center">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Cocok untuk kreator & pebisnis dari berbagai platform</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="font-black text-xl tracking-tighter">TikTok</div>
          <div className="font-black text-xl tracking-tighter">Instagram</div>
          <div className="font-black text-xl tracking-tighter">WhatsApp</div>
          <div className="font-black text-xl tracking-tighter">YouTube</div>
          <div className="font-black text-xl tracking-tighter">Shopee</div>
        </div>
      </section>

      {/* 🔥 SECTION 2: BENTO GRID FEATURES (PENJELASAN DALAM) */}
      <section className="py-32 bg-[#F6F7F5] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Bukan sekadar Link in Bio. <br/> Ini Markas Bisnismu.</h2>
            <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Kami merancang UniTap bukan hanya agar terlihat cantik, tapi agar bisa menghasilkan uang. Lupakan biaya langganan website mahal, semua alat pemasaran yang Anda butuhkan ada di sini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Smart Affiliate */}
            <div className="bg-white p-8 rounded-[32px] md:col-span-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6"><Megaphone size={28}/></div>
              <h3 className="text-2xl font-black mb-3">Sistem Smart Affiliate</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-6">
                Lupakan cara lama menghitung komisi di Excel! Buat link referensi khusus untuk pasukan *reseller* Anda. Saat ada yang klik dan membeli, sistem kami akan otomatis mencegat pesan WhatsApp pembeli dan menyisipkan nama afiliasi. Cuan mengalir, admin Anda pun bisa tidur tenang.
              </p>
            </div>

            {/* Bento 2: Leads Database */}
            <div className="bg-[#7949F6] text-white p-8 rounded-[32px] border border-[#8B5CF6] shadow-sm hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6"><Users size={28}/></div>
              <h3 className="text-2xl font-black mb-3">Database Kontak</h3>
              <p className="text-purple-200 font-medium leading-relaxed">
                Jangan bergantung sepenuhnya pada algoritma medsos. Kunci konten atau link eksklusif Anda, dan wajibkan pengunjung memasukkan Nama & WhatsApp.
              </p>
            </div>

            {/* Bento 3: SEO */}
            <div className="bg-[#d2e823] text-[#254f1a] p-8 rounded-[32px] shadow-sm hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 bg-[#254f1a]/10 text-[#254f1a] rounded-2xl flex items-center justify-center mb-6"><Globe size={28}/></div>
              <h3 className="text-2xl font-black mb-3">Dominasi SEO Google</h3>
              <p className="text-[#254f1a]/80 font-medium leading-relaxed">
                Atur *Meta Title* dan *Description* agar profil UniTap Anda mudah ditemukan di halaman pertama Google saat *brand* atau klien mencari nama Anda.
              </p>
            </div>

            {/* Bento 4: Newsletter */}
            <div className="bg-white p-8 rounded-[32px] md:col-span-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-6"><Mail size={28}/></div>
              <h3 className="text-2xl font-black mb-3">Newsletter & Broadcast Mulus</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-6">
                Kumpulkan email langsung dari halaman bio Anda. Ketika Anda merilis produk baru atau konten eksklusif, kirimkan pemberitahuan massal ke ribuan penggemar Anda hanya dengan satu klik dari dashboard. Pemasaran mandiri yang sangat *powerful*.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 SECTION 3: HOW IT WORKS (STEP BY STEP) */}
      <section className="py-24 bg-white px-6 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Cara Kerjanya Gimana Sih?</h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">Tiga langkah super cepat untuk menyatukan seluruh ekosistem digital Anda dalam satu tautan bio yang elegan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>

            <div className="bg-white p-8 rounded-[32px] border-2 border-gray-100 shadow-sm relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-[#F6F7F5] rounded-full flex items-center justify-center text-gray-900 font-black text-2xl mb-6 shadow-sm border border-gray-200">1</div>
              <div className="w-12 h-12 bg-purple-100 text-[#7949F6] rounded-2xl flex items-center justify-center mb-4"><UserPlus size={24}/></div>
              <h3 className="text-xl font-bold mb-2">Klaim Username</h3>
              <p className="text-gray-500 text-sm font-medium">Daftar secara gratis dan amankan nama unik / nama *brand* Anda (contoh: unitap.ee/namakamu) sebelum diambil orang lain.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border-2 border-[#d2e823] shadow-md relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-transform transform md:-translate-y-4">
              <div className="w-16 h-16 bg-[#d2e823] text-[#254f1a] rounded-full flex items-center justify-center font-black text-2xl mb-6 shadow-sm">2</div>
              <div className="w-12 h-12 bg-[#254f1a]/10 text-[#254f1a] rounded-2xl flex items-center justify-center mb-4"><Layout size={24}/></div>
              <h3 className="text-xl font-bold mb-2">Desain & Tambah Link</h3>
              <p className="text-gray-500 text-sm font-medium">Pilih tema premium, sesuaikan palet warna, lalu masukkan katalog toko, WhatsApp, dan link sosial media Anda.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border-2 border-gray-100 shadow-sm relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-[#F6F7F5] rounded-full flex items-center justify-center text-gray-900 font-black text-2xl mb-6 shadow-sm border border-gray-200">3</div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Rocket size={24}/></div>
              <h3 className="text-xl font-bold mb-2">Sebar & Nikmati Cuan!</h3>
              <p className="text-gray-500 text-sm font-medium">Taruh link UniTap di Bio IG/TikTok Anda. Pantau analitik pengunjung yang datang dan mulailah menghasilkan pendapatan!</p>
            </div>
          </div>
        </div>
      </section>

     {/* SECTION 4: LIME YELLOW (CUSTOMIZATION LIVE MOCKUP) */}
      <section className="py-32 bg-[#d2e823] px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
               <h2 className="text-5xl md:text-7xl font-black text-[#254f1a] tracking-tight leading-tight mb-6">Desain Bio Sesukamu.</h2>
               <p className="text-xl text-[#254f1a] font-medium mb-8 opacity-80 leading-relaxed">
                 Jujur, fitur desain ini hasil ngoding dan trial error berhari-hari hehe. Walau aku masih mahasiswa dan terus belajar, aku usahain banget supaya kamu bisa ganti tema, warna, sampai pasang animasi latar belakang buat brand kamu dengan gampang!
               </p>
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 className="shrink-0 mt-0.5" /> Ganti warna dan tema dengan satu klik</div>
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 className="shrink-0 mt-0.5" /> Latar belakang animasi efek kaca yang elegan</div>
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 className="shrink-0 mt-0.5" /> Lebih dari 20+ thema Gratis</div>
                  <div className="flex items-center gap-3 text-[#254f1a] font-bold text-lg"><CheckCircle2 className="shrink-0 mt-0.5" /> Kustomisasi bentuk dan gaya tombol sesukamu</div>
               </div>
            </div>
            
            {/* WADAH MOCKUP HP */}
            <div className="flex-1 w-full flex justify-center">
               <div className="w-[300px] h-[600px] bg-black rounded-[40px] p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 relative ring-4 ring-black/10">
                  
                  {/* Poni HP (Notch Kamera iPhone) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30 flex items-center justify-center gap-2">
                     <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                     <div className="w-1 h-1 bg-blue-900/50 rounded-full"></div>
                  </div>

                  {/* Tombol Samping HP */}
                  <div className="absolute top-24 -left-1 w-1 h-10 bg-gray-800 rounded-l-md"></div>
                  <div className="absolute top-36 -left-1 w-1 h-16 bg-gray-800 rounded-l-md"></div>
                  <div className="absolute top-40 -right-1 w-1 h-16 bg-gray-800 rounded-r-md"></div>

                  {/* 🔥 LAYAR MOCKUP ASLI (MURNI KODINGAN) 🔥 */}
                  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-900 to-black rounded-[32px] p-5 flex flex-col items-center relative overflow-hidden z-10">
                     
                     {/* Efek Cahaya Animasi di Background Layar */}
                     <div className="absolute top-0 -left-10 w-40 h-40 bg-[#d2e823] rounded-full mix-blend-screen filter blur-[60px] opacity-20 animate-pulse"></div>
                     <div className="absolute bottom-10 -right-10 w-48 h-48 bg-[#7949F6] rounded-full mix-blend-screen filter blur-[60px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

                     {/* Foto Profil Estetik */}
                     <div className="w-24 h-24 bg-gradient-to-tr from-[#d2e823] to-[#7949F6] p-1 rounded-full mt-10 mb-4 shadow-2xl relative z-10">
                        <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center border-4 border-gray-900 overflow-hidden">
                           <span className="text-4xl font-black text-white">U</span>
                        </div>
                     </div>

                     {/* Nama & Deskripsi */}
                     <h3 className="text-white font-black text-xl mb-1 relative z-10 flex items-center gap-1">
                        Kreator Lokal <CheckCircle2 size={16} className="text-blue-400" fill="currentColor" />
                     </h3>
                     <p className="text-gray-300 text-xs font-medium mb-8 text-center px-2 relative z-10 leading-relaxed">
                        Mahasiswa pejuang cuan. Semua tautan portofolio dan produk jualanku ada di bawah ya!
                     </p>

                     {/* Tombol-tombol Link (Glassmorphism Effect) */}
                     <div className="w-full space-y-3 relative z-10">
                        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-sm shadow-sm">
                           <ShoppingBag size={18} className="opacity-80" /> Etalase Skincare
                        </div>
                        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-sm shadow-sm">
                           <Smartphone size={18} className="opacity-80" /> Konsultasi WhatsApp
                        </div>
                        
                        {/* Tombol Highlight / Paling Menonjol */}
                        <div className="w-full bg-gradient-to-r from-[#7949F6] to-[#d2e823] border border-transparent py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-black font-black text-sm shadow-lg shadow-[#d2e823]/20 mt-2">
                           <Megaphone size={18} /> Join Affiliate Pasukan
                        </div>
                     </div>

                     {/* Logo Watermark Kecil di Bawah */}
                     <div className="mt-auto pb-2 font-bold text-[10px] text-white/40 tracking-widest uppercase relative z-10">
                        Powered by UniTap
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 5: DARK MODE (ANALYTICS) */}
      <section className="py-32 bg-[#111111] text-white px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1">
               <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7949F6] to-[#d2e823]">Pahami Audiensmu.</h2>
               <p className="text-xl text-gray-400 font-medium mb-8 leading-relaxed">
                 Pantau interaksi audiens secara real-time. Command Center Analytics kami memberi Anda wawasan mendalam: mulai dari perangkat yang mereka gunakan, hingga tautan jualan mana yang paling laku diklik!
               </p>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#222222] p-6 rounded-3xl border border-gray-800">
                     <BarChart2 className="text-[#d2e823] mb-4" size={32} />
                     <h4 className="font-bold text-xl mb-1">Statistik Cerdas</h4>
                     <p className="text-sm text-gray-500">Hitung konversi & CTR dengan presisi.</p>
                  </div>
                  <div className="bg-[#222222] p-6 rounded-3xl border border-gray-800">
                     <Smartphone className="text-[#7949F6] mb-4" size={32} />
                     <h4 className="font-bold text-xl mb-1">Analitik Perangkat</h4>
                     <p className="text-sm text-gray-500">Tahu pasti audiens Mobile vs PC.</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 w-full">
               <div className="bg-[#222] p-8 rounded-[40px] shadow-2xl border border-gray-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-8">
                     <div>
                        <p className="text-gray-400 font-bold mb-1">Total Klik Bulan Ini</p>
                        <p className="text-5xl font-black">12,408</p>
                     </div>
                     <div className="bg-[#d2e823]/20 text-[#d2e823] px-4 py-2 rounded-full font-bold">+24%</div>
                  </div>
                  <div className="flex items-end gap-3 h-40">
                     {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                       <div key={i} className="flex-1 bg-gradient-to-t from-[#7949F6] to-[#d2e823] rounded-t-lg hover:opacity-80 transition-opacity" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 🔥 SECTION 6: TESTIMONI (MOCKUP SOCIAL PROOF) */}
      <section className="py-32 bg-[#FDFDFD] px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Kreator Mempercayai UniTap.</h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">Lihat bagaimana mereka meroketkan pendapatan hanya dari perubahan kecil di bio mereka.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* TESTIMONI 1 */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <Quote className="text-gray-200 mb-6" size={40} />
              <p className="text-gray-700 font-medium leading-relaxed mb-8">"Semenjak pakai fitur Etalase dan Smart Affiliate dari UniTap, jualan *skincare* gue naik 3x lipat! Ga nyangka *manage* reseller via WA bisa seotomatis ini."</p>
              <div className="flex items-center gap-4">
                {/* Ambil file sarah.jpg dari folder public */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-pink-100 bg-gray-50">
                  <img src="/bimo.jpeg" alt="Sarah" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Bimo Wk.</h4>
                  <p className="text-xs text-gray-500 font-medium">Beauty Influencer</p>
                </div>
              </div>
            </div>

            {/* TESTIMONI 2 */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <Quote className="text-gray-200 mb-6" size={40} />
              <p className="text-gray-700 font-medium leading-relaxed mb-8">"Fitur Database Kontak itu *game changer* banget! Gue ngunci link modul desain gue, sekarang gue dapet ratusan email gratis buat promosi *course* bulan depan."</p>
              <div className="flex items-center gap-4">
                {/* Ambil file arif.jpg dari folder public */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-blue-100 bg-gray-50">
                  <img src="/ucup.jpeg" alt="Arif" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Yusuf .</h4>
                  <p className="text-xs text-gray-500 font-medium">Graphic Designer</p>
                </div>
              </div>
            </div>

            {/* TESTIMONI 3 */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <Quote className="text-gray-200 mb-6" size={40} />
              <p className="text-gray-700 font-medium leading-relaxed mb-8">"Tampilannya super estetik, dan badge *Verified* Premium bener-bener naikin *trust* klien waktu mau endorse gue. Worth every penny!"</p>
              <div className="flex items-center gap-4">
                {/* Ambil file mika.jpg dari folder public */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-green-100 bg-gray-50">
                  <img src="/adnan.jpeg" alt="Mika" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Hj Adnan</h4>
                  <p className="text-xs text-gray-500 font-medium">Content Creator</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 SECTION 7: PRICING (SESUAI KASTA SIDEBAR) */}
      <section className="py-32 bg-[#0A0A0A] px-6 border-t border-white/5 relative overflow-hidden" id="pricing">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7949F6] blur-[150px] opacity-20 rounded-full pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">Pilih Paket Kesuksesanmu.</h2>
            <p className="text-xl text-gray-400 font-medium">Mulai gratis, tingkatkan *level* saat bisnis Anda meroket ke puncak.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* TIER 1: FREE (DARK GLASS) */}
            <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/10 hover:border-white/30 transition-colors flex flex-col h-full">
              <h3 className="text-2xl font-bold text-white mb-2">Gratis</h3>
              <p className="text-gray-500 font-medium mb-6 h-12">Semua fitur dasar untuk memulai karir Anda.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">Rp 0</span>
                <span className="text-gray-500 font-bold">/ selamanya</span>
              </div>
              <Link href="/login" className="w-full block text-center py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors mb-8 mt-auto">Mulai Sekarang</Link>
              <ul className="flex flex-col gap-4">
                {[
                  'Tautan Standar Tanpa Batas', 
                  'Fitur Newsletter & QR Code', 
                  'Dasbor Analitik Real-Time', 
                  'Tema & Tampilan Standar'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-bold text-gray-400">
                    <Check size={18} className="text-white shrink-0 mt-0.5" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* TIER 2: PRO (LIME YELLOW - PALING LARIS) */}
            <div className="bg-[#d2e823] p-10 rounded-[2.5rem] border border-[#b8cc1c] shadow-[0_0_80px_rgba(210,232,35,0.15)] relative transform md:-translate-y-6 flex flex-col h-[105%]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white font-black text-xs px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Paling Laris</div>
              <h3 className="text-2xl font-black text-[#254f1a] mb-2 flex items-center gap-2"><Zap size={24} className="text-[#254f1a]" fill="currentColor" /> Pro</h3>
              <p className="text-[#254f1a]/70 font-bold mb-6 h-12">Buka fitur hardcore untuk bisnis dan jualan online yang otomatis.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-[#254f1a]">19rb</span>
                <span className="text-[#254f1a]/70 font-bold">/ bulan</span>
              </div>
              <Link href="/login" className="w-full block text-center py-4 bg-[#254f1a] text-[#d2e823] rounded-2xl font-black hover:bg-black transition-colors mb-8 shadow-lg mt-auto">Ambil Paket Pro</Link>
              <ul className="flex flex-col gap-4">
                {[
                  'Database Kontak (Leads)', 
                  'Sistem Smart Affiliate (Pencegat WA)', 
                  'Etalase Produk Terkunci', 
                  'Gunakan Custom Domain Sendiri',
                  'Semua Fitur di Paket Gratis'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-bold text-[#254f1a]">
                    <Check size={18} className="text-[#254f1a] shrink-0 mt-0.5" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* TIER 3: PREMIUM (GLOWING PURPLE - FULL SULTAN) */}
            <div className="bg-[#7949F6] p-10 rounded-[2.5rem] border border-[#8B5CF6] shadow-[0_0_80px_rgba(121,73,246,0.2)] flex flex-col h-full">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Crown size={24} className="text-[#d2e823]" /> Premium</h3>
              <p className="text-purple-200 font-medium mb-6 h-12">Level tertinggi. Eksklusivitas dan dominasi pencarian penuh.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">49rb</span>
                <span className="text-purple-200 font-bold">/ bulan</span>
              </div>
              <Link href="/login" className="w-full block text-center py-4 bg-[#d2e823] text-[#254f1a] rounded-2xl font-black hover:scale-105 transition-all mb-8 shadow-xl mt-auto">Upgrade Premium</Link>
              <ul className="flex flex-col gap-4">
                {[
                  'Lencana Centang Biru (Verified)', 
                  'Pengaturan SEO (Tampil di Google)', 
                  'Buka SEMUA Tema Premium Khusus', 
                  'Semua Fitur Paket Pro & Free'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-bold text-white">
                    <Check size={18} className="text-[#d2e823] shrink-0 mt-0.5" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 SECTION 8: FAQ (TANYA JAWAB) */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3"><HelpCircle className="text-[#7949F6]" size={40}/> Tanya Jawab</h2>
            <p className="text-lg text-gray-500 font-medium">Ada yang masih bingung? Cek jawaban di bawah ini ya!</p>
          </div>

          <div className="flex flex-col gap-4">
            <details className="group bg-[#F6F7F5] rounded-2xl border border-gray-100 open:bg-white open:shadow-md transition-all">
              <summary className="font-bold text-lg cursor-pointer p-6 list-none flex justify-between items-center text-gray-900">
                Apa bedanya UniTap dengan layanan link-in-bio lainnya?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 font-medium leading-relaxed">
                Platform lain hanya fokus pada desain. UniTap fokus pada <strong>Pendapatan</strong>. Kami menyediakan fitur *hardcore* seperti Smart Affiliate, Pencegat Pesan WA, Database Leads, dan Pengaturan SEO yang biasanya hanya ada di website mahal.
              </div>
            </details>

            <details className="group bg-[#F6F7F5] rounded-2xl border border-gray-100 open:bg-white open:shadow-md transition-all">
              <summary className="font-bold text-lg cursor-pointer p-6 list-none flex justify-between items-center text-gray-900">
                Apakah saya butuh kemampuan coding?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 font-medium leading-relaxed">
                Tentu tidak! Semuanya menggunakan antarmuka *Drag-and-Drop* yang super intuitif. Anda bahkan bisa mengatur toko *online* Anda dalam waktu kurang dari 5 menit langsung dari *smartphone*.
              </div>
            </details>

            <details className="group bg-[#F6F7F5] rounded-2xl border border-gray-100 open:bg-white open:shadow-md transition-all">
              <summary className="font-bold text-lg cursor-pointer p-6 list-none flex justify-between items-center text-gray-900">
                Bagaimana cara kerja fitur Affiliate?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 font-medium leading-relaxed">
                Khusus pengguna paket Pro, Anda dapat mendaftarkan teman/*reseller* dan memberi mereka kode unik. Saat ada pembeli yang mengakses melalui link mereka dan mengeklik tombol WA Anda, sistem kami akan secara otomatis menyisipkan kode rujukan tersebut ke dalam pesan WhatsApp pembeli. Anda tinggal mencatat "Closing" di dasbor untuk otomatis menghitung komisi.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* SECTION 9: BOTTOM CTA */}
      <section className="py-32 bg-[#FDFDFD] px-6 text-center border-t border-gray-100 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#7949F6] to-[#d2e823] rounded-full filter blur-[120px] opacity-10 pointer-events-none"></div>
         <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 relative z-10">Siap meledakkan cuan Anda?</h2>
         <Link href="/login" className="relative z-10 inline-flex items-center justify-center gap-2 bg-[#d2e823] text-[#254f1a] px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-[0_8px_30px_rgba(210,232,35,0.4)]">
           Gas Daftar Sekarang! <ArrowRight size={24} />
         </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white pt-16 pb-8 px-6 relative">
         <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12 mb-8">
               <div className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#7949F6] rounded-xl flex items-center justify-center text-[#d2e823] text-sm transform -rotate-3">U</div> 
                  UniTap*
               </div>
               <div className="flex flex-wrap justify-center gap-8 font-bold text-gray-400">
                  <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
                  <Link href="#pricing" className="hover:text-white transition-colors">Harga</Link>
                  <Link href="#" className="hover:text-white transition-colors">Bantuan</Link>
                  <Link href="#" className="hover:text-white transition-colors">Ketentuan</Link>
               </div>
            </div>
            
            {/* 🔥 PESAN MAHASISWA (DENGAN FOTO PEMBUAT) & COPYRIGHT */}
            <div className="flex flex-col items-center text-center gap-6">
              
              {/* Box Pesan Sultan */}
              <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-4 pr-6 rounded-full border border-white/10 hover:bg-white/10 transition-colors group">
                
                {/* 📸 FOTO PEMBUAT (Ambil dari folder public) */}
                {/* Ganti '/creator.jpg' dengan nama file foto lo di folder public, misal '/gw.png' */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#d2e823] shadow-lg group-hover:scale-110 transition-transform">
                  <img 
                    src="/zaki.jpeg" 
                    alt="Developer UniTap" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Teks Pesan - Masih Sama */}
                <p className="text-gray-400 font-medium flex items-center gap-2 text-sm leading-relaxed">
                  <Heart size={16} className="text-pink-500 shrink-0" fill="currentColor" /> Dibuat dengan penuh dedikasi oleh mahasiswa yang terus belajar. Saran & masukan sangat berarti bagi kami!
                </p>
              </div>

              {/* Copyright */}
              <p className="text-gray-600 font-bold text-sm">© {new Date().getFullYear()} UniTap Indonesia. All rights reserved.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}