// app/admin/seo/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Save, Loader2, Image as ImageIcon, Globe, UploadCloud, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeoSetupPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  
  // State Fallback (Buat tau foto profil asli)
  const [profilePicFallback, setProfilePicFallback] = useState('');

  // State Form SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoImageUrl, setSeoImageUrl] = useState(''); // URL yang tersimpan di DB
  
  // State Buat Upload File
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(''); // Preview sementara di browser

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase.from('profiles').select('username, profile_image, seo_title, seo_desc, seo_image').eq('id', user.id).single();
        
        if (data) {
          setUsername(data.username);
          setProfilePicFallback(data.profile_image || ''); // Simpan fallback
          setSeoTitle(data.seo_title || '');
          setSeoDesc(data.seo_desc || '');
          setSeoImageUrl(data.seo_image || ''); // Ambil URL SEO khusus jika ada
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validasi ukuran (misal max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File kegedean bos! Max 2MB aja.');
        return;
      }
      setSelectedFile(file);
      // Buat preview URL sementara di browser
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    let finalSeoImageUrl = seoImageUrl; // Pake URL lama dulu

    try {
      // 1. Logika Upload Gambar kalau ada file baru dipilih
      if (selectedFile) {
        toast.loading('Meningkatkan kualitas gambar SEO...', { id: 'upload' });
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${userId}-seo-${Date.now()}.${fileExt}`;
        const filePath = `seo_images/${fileName}`;

        // Upload ke Supabase Storage (Asumsi bucket namanya 'avatars' atau sesuaikan)
        const { error: uploadError } = await supabase.storage
          .from('avatars') 
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Ambil Public URL nya
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        finalSeoImageUrl = publicUrlData.publicUrl; // Update dengan URL baru
        toast.success('Gambar SEO berhasil diupload!', { id: 'upload' });
      }

      // 2. Update data ke tabel Profiles
      const { error: updateError } = await supabase.from('profiles').update({
        seo_title: seoTitle,
        seo_desc: seoDesc,
        seo_image: finalSeoImageUrl // Masukin URL gambar (baru/lama)
      }).eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Pengaturan SEO Sultan berhasil disimpan! 🚀');
      
      // Bersihin state upload
      setSelectedFile(null);
      setPreviewUrl('');
      setSeoImageUrl(finalSeoImageUrl); // Update URL utama

    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal menyimpan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeSeoImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setSeoImageUrl(''); // Hapus URL di state, nanti pas save bakal hapus di DB
    toast.success('Gambar SEO khusus dihapus. WhatsApp bakal pake Foto Profil.');
  };

  // Logika buat nentuin gambar mana yang muncul di preview
  // Prioritas: Preview Upload > URL SEO Tersimpan > Foto Profil Fallback
  const imageToDisplay = previewUrl || seoImageUrl || profilePicFallback;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 bg-[#F6F7F5]">Memuat Pengaturan SEO ...</div>;

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
            <Search className="text-[#7949F6]" size={32} /> SEO & Social Media Setup (PRO)
          </h1>
          <p className="text-gray-500 font-medium mt-1">Atur tampilan link Anda saat dibagikan ke WhatsApp agar terlihat profesional.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* BAGIAN FORM UPLOAD (KIRI) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              
              {/* INPUT JUDUL */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Judul Link di WhatsApp (Title)</label>
                <input 
                  type="text" 
                  placeholder={`Contoh: Promo Gila @${username} | Sikat Sekarang!`}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#7949F6] transition-all placeholder:text-gray-300"
                />
              </div>

              {/* INPUT DESKRIPSI */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Deskripsi Singkat WhatsApp</label>
                <textarea 
                  placeholder="Temukan semua link sosial media dan produk pilihan saya di sini!"
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#7949F6] transition-all h-24 resize-none placeholder:text-gray-300"
                />
              </div>

              {/* 🔥 FITUR UPLOAD GAMBAR SULTAN 🔥 */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Gambar Preview WhatsApp (Thumbnail)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  
                  {/* Container Gambar */}
                  <div className="w-24 h-24 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative shadow-inner">
                    {imageToDisplay ? (
                      <img src={imageToDisplay} alt="SEO Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-200" size={32} />
                    )}
                  </div>
                  
                  {/* Tombol Aksi */}
                  <div className="flex flex-col gap-2 w-full">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 bg-black text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95"
                    >
                      <UploadCloud size={16} /> Upload Gambar Khusus SEO
                    </button>
                    
                    {/* Muncul kalau lagi pake SEO Image khusus */}
                    {(previewUrl || seoImageUrl) && (
                       <button 
                         type="button" 
                         onClick={removeSeoImage}
                         className="w-full py-2.5 px-4 bg-red-50 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                       >
                         <Trash2 size={14} /> Hapus & Gunakan Foto Profil
                       </button>
                    )}
                  </div>
                  
                  {/* Hidden Input File */}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png" className="hidden" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2.5 ml-1 font-medium leading-relaxed">
                  💡 Tips: Gambar ini khusus buat preview WhatsApp lo. Kalau kosong, sistem otomatis pake Foto Profil lo. Format: JPG/PNG, Max 2MB.
                </p>
              </div>

              {/* TOMBOL SIMPAN SULTAN */}
              <button onClick={handleSave} disabled={saving} className="w-full py-4 mt-4 bg-[#7949F6] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#683cd4] transition-all active:scale-95 shadow-xl shadow-[#7949F6]/20">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Simpan Pengaturan</>}
              </button>

            </div>
          </div>

          {/* BAGIAN PREVIEW WHATSAPP (KANAN) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2 text-center lg:text-left">Live Preview WhatsApp</h3>
            
            {/* Mockup Chat WA Estetik */}
            <div className="bg-[#EFEAE2] p-4 sm:p-5 rounded-[32px] border border-gray-200 h-[380px] lg:h-full flex flex-col shadow-inner relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }}></div>
              
              {/* Buble Chat User */}
              <div className="bg-[#DCF8C6] text-gray-800 text-xs p-2 px-3 rounded-t-xl rounded-bl-xl rounded-br-sm w-fit max-w-[80%] self-end mb-3 relative z-10 shadow-sm border border-[#c5e1b1]">
                Cek profil UniTap aku yang baru dong! 🔥
                <div className="text-[9px] text-right text-gray-400 mt-1">10:42 ✓✓</div>
              </div>

              {/* Buble Link Preview SULTAN */}
              <div className="bg-[#f0f0f0] rounded-xl w-[90%] sm:w-4/5 self-end overflow-hidden relative z-10 shadow-md border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center overflow-hidden border-b border-gray-200 relative shadow-inner">
                  {imageToDisplay ? (
                    <img src={imageToDisplay} alt="SEO Live Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={40} />
                  )}
                  <Globe className="absolute bottom-2 left-2 text-white/60 bg-black/20 p-1 rounded-full" size={24} />
                </div>
                <div className="p-3 bg-white">
                  <h4 className="font-bold text-gray-900 text-[13px] leading-tight mb-1 line-clamp-1">{seoTitle || `@${username} | UniTap`}</h4>
                  <p className="text-gray-600 text-[11px] line-clamp-2 leading-snug">{seoDesc || 'Check out my UniTap profile!'}</p>
                  <p className="text-[#00a884] text-[10px] mt-2 uppercase tracking-widest font-black">UNITAP-IOTA.VERCEL.APP</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}