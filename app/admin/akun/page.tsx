// app/admin/profile/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Save, Loader2, Camera, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // State Data Profil
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  // State Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase.from('profiles').select('username, bio, profile_image').eq('id', user.id).single();
        if (data) {
          setUsername(data.username || '');
          setBio(data.bio || '');
          setProfileImageUrl(data.profile_image || '');
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
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Maksimal ukuran foto 2MB bosku!');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setProfileImageUrl('');
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    let finalImageUrl = profileImageUrl;

    try {
      // Kalau ada foto baru yang dipilih, upload ke Supabase Storage
      if (selectedFile) {
        toast.loading('Mengunggah foto profil...', { id: 'upload' });
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${userId}-avatar-${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        // Upload ke bucket 'avatars'
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Ambil link publik fotonya
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
        toast.success('Foto berhasil diunggah!', { id: 'upload' });
      }

      // Update data text (Bio & Foto) ke tabel Profiles
      const { error: updateError } = await supabase.from('profiles').update({
        bio: bio,
        profile_image: finalImageUrl
      }).eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Profil berhasil diupdate! 🚀');
      setProfileImageUrl(finalImageUrl);
      setSelectedFile(null);
      setPreviewUrl('');

    } catch (error: any) {
      console.error(error);
      toast.error(`Gagal menyimpan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const imageToDisplay = previewUrl || profileImageUrl;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 bg-[#F6F7F5]">Memuat Profil...</div>;

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <User className="text-[#7949F6]" size={32} /> Edit Profil
          </h1>
          <p className="text-gray-500 font-medium mt-1">Sesuaikan foto dan bio untuk halaman publik Anda.</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
          
          {/* UPLOAD FOTO PROFIL */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-gray-50">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-gray-50 flex items-center justify-center overflow-hidden bg-gray-100 shadow-inner">
                {imageToDisplay ? (
                  <img src={imageToDisplay} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-300" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-all border-2 border-white shadow-md"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/gif" className="hidden" />
            </div>

            <div className="flex flex-col items-center sm:items-start justify-center flex-1 pt-2">
              <h3 className="font-black text-lg mb-1">Foto Profil</h3>
              <p className="text-xs text-gray-400 mb-4 text-center sm:text-left">Format JPG, PNG max 2MB. Foto ini akan muncul di Header Premium Anda.</p>
              
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all">
                  Ubah Foto
                </button>
                {(previewUrl || profileImageUrl) && (
                  <button onClick={handleRemovePhoto} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1">
                    <Trash2 size={14} /> Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FORM BIO & USERNAME */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username (Tidak bisa diubah di sini)</label>
              <input 
                type="text" 
                value={`@${username}`}
                disabled
                className="w-full bg-gray-100 text-gray-400 p-4 rounded-2xl text-sm font-bold outline-none border-2 border-transparent cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Bio Singkat</label>
              <textarea 
                placeholder="Ceritakan sedikit tentang Anda atau bisnis Anda..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#7949F6] transition-all h-28 resize-none"
              />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-4 mt-4 bg-[#7949F6] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#683cd4] transition-all active:scale-95 shadow-xl shadow-[#7949F6]/20">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Simpan Perubahan</>}
          </button>

        </div>
      </div>
    </div>
  );
}