// components/DesignSettings.tsx
"use client";
import { useState, useRef } from 'react';
import { Layout, User, Image as ImageOutline, Type as TypeIcon, Palette, Square, UploadCloud, Crown, RefreshCw, Lock, X, Zap, Upload } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DesignSettings() {
  const { 
    THEMES_DATA, activeTheme, profile, setProfile, customBg, updateThemeInDB,
    designConfig, updateDesignConfigDB, updateProfile
  } = useAdmin();
  
  const [activeDesignTab, setActiveDesignTab] = useState('theme');
  const [showProModal, setShowProModal] = useState(false); 
  const [isSaving, setIsSaving] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPro = profile?.plan_type === 'pro' || profile?.plan_type === 'premium';

  const designTabs = [
    { id: 'theme', icon: Layout, label: 'Tema' },
    { id: 'header', icon: User, label: 'Header' },
    { id: 'wallpaper', icon: ImageOutline, label: 'Latar' },
    { id: 'text', icon: TypeIcon, label: 'Teks' },
    { id: 'buttons', icon: Square, label: 'Tombol' },
  ];

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateThemeInDB('custom', reader.result as string);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    };
    reader.readAsDataURL(file);
  };

  // 🔥 FUNGSI TEMA SUPER AMAN (Anti Profil Hilang)
  const handleSelectTheme = async (themeId: string, isPremiumTheme: boolean) => {
    if (isPremiumTheme && !isPro) {
      setShowProModal(true);
      return;
    }
    
    if (themeId === 'custom') {
      fileInputRef.current?.click();
    } else {
      const toastId = toast.loading('Menerapkan tema baru...');
      updateThemeInDB(themeId);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .update({ custom_bg_url: "" }) 
            .eq('id', userId);

          if (error) throw error;

          // 🔥 FIX FINAL MOBILE PREVIEW: Pake "prev" biar data nama & bio GAK KEHAPUS!
          setProfile((prev: any) => ({ ...prev, active_theme: themeId, custom_bg_url: "" }));
          
          toast.success('Tema diterapkan! Foto latar dihapus. 🔥', { id: toastId });
        }
      } catch (error: any) {
        toast.error('Gagal hapus foto latar.', { id: toastId });
      }
    }
  };
  
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Mengunggah foto...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Sesi login tidak ditemukan!");

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.from('profiles').update({ profile_image: imageUrl }).eq('id', userId);
      if (updateError) throw updateError;

      setProfile((prev: any) => ({ ...prev, profile_image: imageUrl }));
      toast.success('Foto profil berhasil diperbarui! 📸', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengunggah: ' + error.message, { id: toastId });
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan profil...'); 
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) throw new Error("Sesi login hilang!");

      const { error } = await supabase
        .from('profiles')
        .update({ username: profile?.username, bio: profile?.bio })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Profil berhasil disimpan permanen! 🔥', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal simpan: ' + error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="w-full flex-1 flex flex-col animate-in fade-in duration-500">
        <input type="file" ref={fileInputRef} onChange={handleCustomBgUpload} accept="image/*" className="hidden" />

      {/* TABS NAVIGATION (ANTI KEPOTONG & ANTI SCROLLBAR) */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <div className="w-full bg-white pt-4 pb-4 px-8 sticky top-0 z-20 border-b border-gray-100 mb-6">
        <div className="flex gap-2.5 overflow-x-auto hide-scroll py-2 px-1">
          {designTabs.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveDesignTab(item.id)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[13px] whitespace-nowrap transition-all duration-300 ${
                activeDesignTab === item.id 
                ? 'bg-[#d2e823] text-[#254f1a] shadow-md scale-105 ring-2 ring-[#d2e823] ring-offset-2' 
                : 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <item.icon size={16} strokeWidth={activeDesignTab === item.id ? 3 : 2} /> 
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
        <div className="flex-1 p-8 pb-32 bg-[#F6F7F5] overflow-y-auto">
            
           {/* 1. THEMES */}
           {activeDesignTab === 'theme' && (
             <div className="max-w-[1000px] mx-auto animate-in slide-in-from-bottom-4">
                <div className="mb-8">
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Desain Profil Anda</h2>
                   <p className="text-sm text-gray-500 mt-1 font-medium">Pilih tema premium atau rancang gaya Anda sendiri.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Object.values(THEMES_DATA).map((theme: any) => {
                    const isPremiumTheme = theme.isPro; 
                    const locked = isPremiumTheme && !isPro;

                    return (
                      <div key={theme.id} className="flex flex-col items-center group relative">
                        <div 
                          onClick={() => handleSelectTheme(theme.id, isPremiumTheme)} 
                          className={`w-full aspect-[1/2.2] rounded-[30px] p-4 flex flex-col justify-between cursor-pointer border-[4px] transition-all duration-300 relative overflow-hidden ${theme.bgTheme} ${activeTheme === theme.id ? 'border-[#7949F6] scale-[1.03] shadow-[0_10px_30px_rgba(121,73,246,0.2)]' : 'border-transparent shadow-sm hover:shadow-md hover:-translate-y-1'}`}
                        >
                          {isPremiumTheme && <div className="absolute top-2 right-2 bg-[#d2e823] text-black text-[10px] font-extrabold px-2 py-1 rounded-full z-30 flex items-center gap-1"><Crown size={10}/> PRO</div>}
                          
                          {theme.id === 'custom' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 z-10 border border-gray-200 rounded-[26px]">
                              {customBg && <img src={customBg} className="absolute inset-0 w-full h-full object-cover z-0 rounded-[26px]" alt="bg" />}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md relative z-10 ${customBg ? 'bg-black/30 text-white' : 'bg-gray-100 text-gray-600'}`}><UploadCloud size={20} /></div>
                              <span className={`text-[11px] font-bold relative z-10 ${customBg ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>{customBg ? 'Ubah Gambar' : 'Unggah Galeri'}</span>
                            </div>
                          ) : (
                            <>
                              {theme.bgImage && <img src={theme.bgImage} className="absolute inset-0 w-full h-full object-cover z-0 opacity-90" alt="bg" />}
                              <div className="relative z-10 h-full flex flex-col justify-between"><div className={`font-bold text-xl drop-shadow-sm ${theme.textTheme}`}>Aa</div><div className={`w-full h-10 rounded-xl ${theme.btnTheme} mt-auto`}></div></div>
                            </>
                          )}

                          {locked && (
                            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-20 flex items-center justify-center">
                              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                <Lock size={16} className="text-gray-800" />
                              </div>
                            </div>
                          )}

                        </div>
                        <span className="text-[13px] text-gray-800 font-bold mt-4">{theme.name}</span>
                      </div>
                    );
                  })}
                </div>
             </div>
           )}

           {/* 2. HEADER - Premium UI */}
           {activeDesignTab === 'header' && (
             <div className="max-w-[600px] mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black mb-6 text-gray-900">Detail Profil</h2>
                <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                   
                   <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-md shrink-0 border-4 border-white overflow-hidden">
                     {profile?.profile_image ? (
                       <img src={profile.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       profile?.username?.charAt(0).toUpperCase() || 'U'
                     )}
                   </div>

                   <div className="flex flex-col gap-2 w-full relative">
                      <button className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold shadow-sm hover:border-gray-300 transition-colors flex items-center justify-center gap-2">
                        <Upload size={16}/> Pilih Foto Profil
                      </button>
                      <input type="file" accept="image/*" onChange={handleUploadImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Unggah foto baru" />
                   </div>
                </div>
                <div className="flex flex-col gap-5">
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nama Profil</label>
                      <input type="text" value={profile?.username || ''} onChange={e => setProfile((prev:any) => ({...prev, username: e.target.value}))} className="w-full px-5 py-4 bg-[#F6F7F5] border-transparent focus:bg-white border focus:border-[#7949F6] rounded-xl outline-none font-bold text-gray-900 transition-all"/>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bio Singkat</label>
                      <textarea value={profile?.bio || ''} onChange={e => setProfile((prev:any) => ({...prev, bio: e.target.value}))} rows={3} className="w-full px-5 py-4 bg-[#F6F7F5] border-transparent focus:bg-white border focus:border-[#7949F6] rounded-xl outline-none font-medium text-gray-700 transition-all resize-none"></textarea>
                   </div>
                   
                   <button onClick={handleSaveProfile} disabled={isSaving} className={`w-full py-4 rounded-xl font-bold text-white transition-all mt-2 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:scale-[1.02] shadow-md'}`}>
                     {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                   </button>
                </div>
             </div>
           )}

           {/* 3. WALLPAPER (Custom BG) */}
           {activeDesignTab === 'wallpaper' && (
             <div className="max-w-[600px] mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 relative overflow-hidden">
                {!isPro && (
                  <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[4px] flex flex-col items-center justify-center text-center">
                     <Lock size={32} className="text-[#7949F6] mb-4" />
                     <h3 className="font-black text-xl text-gray-900 mb-2">Latar Belakang Sultan</h3>
                     <p className="text-sm font-medium text-gray-500 mb-6 max-w-[280px]">Warna kustom dan latar belakang animasi eksklusif untuk member Pro.</p>
                     <button onClick={() => setShowProModal(true)} className="px-6 py-3 bg-[#d2e823] text-[#254f1a] font-black rounded-xl text-xs hover:scale-105 transition-all">UPGRADE SEKARANG</button>
                  </div>
                )}
                <div className={!isPro ? 'opacity-30 pointer-events-none' : ''}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900">Warna Latar Kustom</h2>
                    {designConfig.colorBg && <button onClick={() => updateDesignConfigDB('colorBg', '')} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Reset</button>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                      <input type="color" value={designConfig.colorBg || '#ffffff'} onChange={(e) => updateDesignConfigDB('colorBg', e.target.value)} className="absolute -top-4 -left-4 w-24 h-24 cursor-pointer" />
                    </div>
                    <div>
                       <p className="font-bold text-gray-900 text-sm">Pilih warna solid</p>
                       <p className="text-xs text-gray-500 font-mono mt-1">{designConfig.colorBg || 'Default'}</p>
                    </div>
                  </div>
                </div>
             </div>
           )}

           {/* 4. TEXT (Typography & Color) */}
           {activeDesignTab === 'text' && (
             <div className="max-w-[600px] mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 relative overflow-hidden">
                {!isPro && (
                  <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[4px] flex flex-col items-center justify-center text-center">
                     <Lock size={32} className="text-[#7949F6] mb-4" />
                     <h3 className="font-black text-xl text-gray-900 mb-2">Font Sultan</h3>
                     <p className="text-sm font-medium text-gray-500 mb-6 max-w-[280px]">Buka akses tipografi premium agar profil Anda semakin berkelas.</p>
                     <button onClick={() => setShowProModal(true)} className="px-6 py-3 bg-[#d2e823] text-[#254f1a] font-black rounded-xl text-xs hover:scale-105 transition-all">UPGRADE SEKARANG</button>
                  </div>
                )}
                <div className={!isPro ? 'opacity-30 pointer-events-none' : ''}>
                  <h2 className="text-xl font-black mb-6 text-gray-900">Tipografi</h2>
                  <div className="grid grid-cols-3 gap-4 mb-10">
                     {['sans', 'serif', 'mono'].map((font) => (
                       <div key={font} onClick={() => updateDesignConfigDB('fontFamily', font)} className={`p-6 rounded-[20px] border-2 cursor-pointer flex flex-col items-center gap-2 transition-all ${designConfig.fontFamily === font ? 'border-[#7949F6] bg-purple-50 text-[#7949F6]' : 'border-gray-100 hover:border-gray-300 text-gray-400 hover:text-gray-900'}`}>
                          <span className={`text-4xl font-${font} text-black`}>Ag</span>
                          <span className="text-[11px] font-bold uppercase tracking-wider">{font}</span>
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-between items-center mb-6 pt-8 border-t border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">Ubah Warna Teks</h2>
                    {designConfig.colorText && <button onClick={() => updateDesignConfigDB('colorText', '')} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Reset</button>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                      <input type="color" value={designConfig.colorText || '#000000'} onChange={(e) => updateDesignConfigDB('colorText', e.target.value)} className="absolute -top-4 -left-4 w-24 h-24 cursor-pointer" />
                    </div>
                    <div className="flex-1 px-5 py-4 bg-gray-50 rounded-xl font-mono text-sm text-gray-600 border border-gray-200">
                      {designConfig.colorText || 'Warna Bawaan Tema'}
                    </div>
                  </div>
                </div>
             </div>
           )}

           {/* 5. BUTTONS */}
           {activeDesignTab === 'buttons' && (
             <div className="max-w-[600px] mx-auto bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 relative overflow-hidden">
                {!isPro && (
                  <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[4px] flex flex-col items-center justify-center text-center">
                     <Lock size={32} className="text-[#7949F6] mb-4" />
                     <h3 className="font-black text-xl text-gray-900 mb-2">Tombol Sultan</h3>
                     <p className="text-sm font-medium text-gray-500 mb-6 max-w-[280px]">Ubah bentuk, gaya, dan warna tombol untuk menonjolkan identitas Anda.</p>
                     <button onClick={() => setShowProModal(true)} className="px-6 py-3 bg-[#d2e823] text-[#254f1a] font-black rounded-xl text-xs hover:scale-105 transition-all">UPGRADE SEKARANG</button>
                  </div>
                )}
                <div className={!isPro ? 'opacity-30 pointer-events-none' : ''}>
                  <h2 className="text-xl font-black mb-6 text-gray-900">Gaya & Bentuk Tombol</h2>
                  <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                     <button onClick={() => updateDesignConfigDB('buttonStyle', 'fill')} className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-all ${designConfig.buttonStyle === 'fill' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}>Blok Warna</button>
                     <button onClick={() => updateDesignConfigDB('buttonStyle', 'outline')} className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-all ${designConfig.buttonStyle === 'outline' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}>Garis Tepi</button>
                  </div>
                  <div className="grid grid-cols-3 gap-6 mb-10">
                     {['none', 'xl', 'full'].map((shape) => {
                        const isOutline = designConfig.buttonStyle === 'outline';
                        const active = designConfig.buttonShape === shape;
                        return (
                          <div key={shape} onClick={() => updateDesignConfigDB('buttonShape', shape)} className={`p-4 rounded-[20px] border-2 cursor-pointer flex flex-col items-center justify-center gap-4 transition-all ${active ? 'border-[#7949F6] bg-purple-50' : 'border-gray-100 hover:border-gray-300'}`}>
                             <div className={`w-full h-10 ${isOutline ? 'border-2 border-black bg-transparent' : 'bg-black'} rounded-${shape}`}></div>
                             <span className={`text-[11px] font-bold uppercase tracking-wider ${active ? 'text-[#7949F6]' : 'text-gray-500'}`}>
                               {shape === 'none' ? 'Kotak' : shape === 'xl' ? 'Melengkung' : 'Kapsul'}
                             </span>
                          </div>
                        )
                     })}
                  </div>
                  <div className="flex justify-between items-center mb-6 pt-8 border-t border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">Ubah Warna Tombol</h2>
                    {designConfig.colorBtn && <button onClick={() => updateDesignConfigDB('colorBtn', '')} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Reset</button>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                      <input type="color" value={designConfig.colorBtn || '#000000'} onChange={(e) => updateDesignConfigDB('colorBtn', e.target.value)} className="absolute -top-4 -left-4 w-24 h-24 cursor-pointer" />
                    </div>
                    <div className="flex-1 px-5 py-4 bg-gray-50 rounded-xl font-mono text-sm text-gray-600 border border-gray-200">
                      {designConfig.colorBtn || 'Warna Bawaan Tema'}
                    </div>
                  </div>
                </div>
             </div>
           )}
           
        </div>
      </div>

      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#7949F6] to-[#d2e823] rounded-full blur-3xl opacity-30"></div>
            <button onClick={() => setShowProModal(false)} className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors z-20"><X size={16}/></button>
            <div className="relative z-10 flex flex-col items-center text-center mt-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#7949F6] to-[#d2e823] rounded-3xl flex items-center justify-center mb-6 shadow-xl transform -rotate-6"><Crown size={36} className="text-white" /></div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">Desain ini <br/>terlalu Keren! 🔥</h3>
              <p className="text-sm font-medium text-gray-500 mb-8 px-2">Upgrade ke Premium untuk membuka semua tema eksklusif, font, dan latar belakang berkelas.</p>
              <Link href="/admin/pricing" onClick={() => setShowProModal(false)} className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 hover:shadow-2xl transition-all mb-3"><Zap size={16} className="text-[#d2e823]" fill="currentColor" /> UPGRADE KE PRO</Link>
              <button onClick={() => setShowProModal(false)} className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">Nanti aja deh</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}