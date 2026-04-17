// app/admin/tips/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { Heart, Loader2, Save, QrCode, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TipsPage() {
  const { profile, setProfile } = useAdmin();
  
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [qrisUrl, setQrisUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsActive(profile.tip_enabled || false);
      setMessage(profile.tip_message || 'Dukung karyaku dengan traktir kopi! ☕');
      setQrisUrl(profile.tip_qris || '');
    }
  }, [profile]);

  const handleUploadQris = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Mengunggah gambar QRIS...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Sesi login hilang!");

      const fileExt = file.name.split('.').pop();
      const fileName = `qris-${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setQrisUrl(publicUrlData.publicUrl);
      toast.success('QRIS berhasil diunggah! Jangan lupa klik Simpan.', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengunggah QRIS: ' + error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (isActive && !qrisUrl) {
      toast.error("Anda harus mengunggah gambar QRIS untuk menerima donasi!");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan pengaturan donasi...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Sesi login hilang!");

      const { error } = await supabase
        .from('profiles')
        .update({ 
          tip_enabled: isActive,
          tip_message: message,
          tip_qris: qrisUrl
        })
        .eq('id', userId);

      if (error) throw error;

      setProfile({ ...profile, tip_enabled: isActive, tip_message: message, tip_qris: qrisUrl });
      toast.success('Toples Donasi QRIS siap digunakan! 💸', { id: toastId });

    } catch (error: any) {
      toast.error('Gagal menyimpan: ' + error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
            Donasi Langsung <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={32} />
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">Terima dana seikhlasnya via QRIS. Gratis untuk semua pengguna!</p>
        </div>
        
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-8 py-3.5 bg-black text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} 
          Simpan Pengaturan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 blur-[80px] opacity-10 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-black text-gray-900">Aktifkan Donasi QRIS</h3>
                <p className="text-xs font-bold text-gray-500 mt-1">Munculkan tombol apresiasi di halaman profil Anda.</p>
              </div>
              <div 
                onClick={() => setIsActive(!isActive)}
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors shadow-inner ${isActive ? 'bg-[#7949F6]' : 'bg-gray-200'}`}
              >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>

            <div className={`space-y-6 transition-all ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Pesan Ajakan</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Contoh: Boleh dong traktir aku kopi seikhlasnya! ☕"
                  className="w-full font-bold text-gray-900 bg-gray-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#7949F6] outline-none transition-all resize-none shadow-sm"
                ></textarea>
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Unggah Barcode QRIS Anda</label>
                <div className="flex items-center gap-4">
                   <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                      {qrisUrl ? (
                        <img src={qrisUrl} alt="QRIS" className="w-full h-full object-cover" />
                      ) : (
                        <QrCode size={24} className="text-gray-400" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleUploadQris}
                        disabled={isUploading}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={20}/></div>}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black text-gray-900">Screenshot QRIS Bank / E-Wallet</p>
                      <p className="text-xs font-bold text-gray-500 mt-1">Dukung GoPay, DANA, OVO, ShopeePay.</p>
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-1 rounded w-fit">
                         <UploadCloud size={12} /> Klik kotak untuk {qrisUrl ? 'mengganti' : 'mengunggah'}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Pratinjau Halaman Publik</div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-md">
            <div className="bg-[#F6F7F5] rounded-[2rem] p-6 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-[#7949F6] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Heart className="text-white fill-white" size={24}/>
              </div>
              <p className="font-black text-gray-900 mb-6 leading-tight">{message || 'Dukung karyaku dengan traktir kopi! ☕'}</p>
              {qrisUrl ? (
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 inline-block">
                   <img src={qrisUrl} alt="QRIS" className="w-32 h-32 object-contain rounded-lg" />
                 </div>
              ) : (
                 <div className="w-32 h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <QrCode size={32} className="text-gray-400 opacity-50"/>
                 </div>
              )}
              <p className="text-xs font-bold text-gray-500">Scan untuk berdonasi seikhlasnya.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}