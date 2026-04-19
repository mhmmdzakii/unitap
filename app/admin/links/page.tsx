// app/admin/links/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Trash2, BarChart2, Loader2, ArrowUp, ArrowDown, Link2, 
  Music, Video, Store, Image as ImageIcon, LayoutTemplate, X,
  Globe, Mail, MessageCircle, Camera, Gamepad2, Briefcase, Utensils, Plane, Coffee, Heart, Star, Book, Sparkles, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LinksPage() {
  const { links, addNewLink, updateLinkDB, deleteLinkDB } = useAdmin();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState('standard');
  const [isSaving, setIsSaving] = useState(false);

  // 🔥 STATE UNTUK PLAN TYPE & UPLOAD FOTO
  const [planType, setPlanType] = useState('free');
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // 🔥 STATE UNTUK MODAL LAYOUT & THUMBNAIL
  const [activeLayoutModal, setActiveLayoutModal] = useState<number | null>(null);
  const [activeThumbnailModal, setActiveThumbnailModal] = useState<number | null>(null);

  useEffect(() => {
    // Cek status plan_type saat halaman dimuat
    const checkUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('plan_type').eq('id', user.id).single();
        if (data) setPlanType(data.plan_type || 'free');
      }
    };
    checkUserPlan();
  }, []);

  // Variabel penentu apakah user berhak pakai fitur premium (Pro / Premium)
  const isPremiumUser = planType === 'pro' || planType === 'premium';

  // Kamus Ikon buat Modal Thumbnail
  const ICON_OPTIONS = [
    { id: 'globe', icon: Globe }, { id: 'mail', icon: Mail }, { id: 'message', icon: MessageCircle },
    { id: 'camera', icon: Camera }, { id: 'gamepad', icon: Gamepad2 }, { id: 'briefcase', icon: Briefcase },
    { id: 'utensils', icon: Utensils }, { id: 'plane', icon: Plane }, { id: 'coffee', icon: Coffee },
    { id: 'heart', icon: Heart }, { id: 'star', icon: Star }, { id: 'book', icon: Book }, { id: 'sparkles', icon: Sparkles }
  ];

  const categories = [
    { id: 'standard', label: 'Standard', icon: Link2 },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'store', label: 'Store', icon: Store },
  ];

  const handleSmartInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const cleanUrl = val.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
    setNewUrl(cleanUrl);

    const lowerUrl = cleanUrl.toLowerCase();
    if (lowerUrl.includes('spotify.com') || lowerUrl.includes('apple.com/music') || lowerUrl.includes('soundcloud.com')) {
      setNewType('music');
    } 
    else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('vimeo.com')) {
      setNewType('video');
    } 
    else if (lowerUrl.includes('shopee.') || lowerUrl.includes('tokopedia.com') || lowerUrl.includes('amazon.')) {
      setNewType('store');
    }
  };

  const handleSave = async () => {
    if (!newTitle || !newUrl) {
      toast.error('Title and URL are required!'); return;
    }
    setIsSaving(true);
    const toastId = toast.loading('Adding new link...');
    const finalUrl = `https://${newUrl}`;
    
    try {
      await addNewLink(newTitle, finalUrl, newType); 
      toast.success('Link added successfully! ✨', { id: toastId });
      setNewTitle(''); setNewUrl(''); setNewType('standard'); setIsAdding(false);
    } catch (error) {
      toast.error('Failed to add link.', { id: toastId });
    }
    setIsSaving(false);
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const currentLink = links[index];
    const targetLink = links[newIndex];
    const toastId = toast.loading('Updating order...');

    try {
      await supabase.from('links').update({ position: targetLink.position || newIndex }).eq('id', currentLink.id);
      await supabase.from('links').update({ position: currentLink.position || index }).eq('id', targetLink.id);
      updateLinkDB(currentLink.id, 'position', targetLink.position || newIndex);
      updateLinkDB(targetLink.id, 'position', currentLink.position || index);
      toast.success('Order updated!', { id: toastId });
    } catch (error) {
      toast.error('Failed to update order.', { id: toastId });
    }
  };

  const handleDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-gray-900 text-sm">Delete this link?</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-md hover:bg-gray-200" onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600" 
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('Deleting...');
              await deleteLinkDB(id);
              toast.success('Link deleted!', { id: toastId });
            }}>Delete</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleUpdateLinkField = async (id: number, field: string, value: string | null) => {
    const toastId = toast.loading('Saving changes...');
    try {
      await updateLinkDB(id, field, value);
      setActiveLayoutModal(null);
      setActiveThumbnailModal(null);
      toast.success('Saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save.', { id: toastId });
    }
  };

  const handleUploadCustomPhoto = async (id: number, file: File) => {
    if (!isPremiumUser) {
      toast.error('Fitur Premium! Upgrade ke Pro untuk membuka fitur ini.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran maksimal gambar 2MB');
      return;
    }

    const toastId = toast.loading('Mengunggah gambar...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-link-${id}-${Date.now()}.${fileExt}`;
      const filePath = `links/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const imageUrl = publicUrlData.publicUrl;

      await updateLinkDB(id, 'image_url', imageUrl);
      toast.success('Foto custom berhasil diperbarui!', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal mengunggah gambar', { id: toastId });
      console.error(error);
    }
  };

  const handleRemoveCustomPhoto = async (id: number) => {
    const toastId = toast.loading('Menghapus foto...');
    try {
      await updateLinkDB(id, 'image_url', null);
      toast.success('Foto custom dihapus', { id: toastId });
    } catch (error) {
      toast.error('Gagal menghapus foto', { id: toastId });
    }
  };

  return (
    <>
      <div className="max-w-3xl w-full mx-auto pb-20 animate-in fade-in duration-500 relative z-10 p-4 sm:p-6 lg:p-10">
        
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="w-full bg-[#7949F6] text-white py-4 rounded-full font-bold shadow-[0_8px_24px_rgba(121,73,246,0.25)] hover:bg-[#683cd4] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mb-8">
            <Plus size={18} strokeWidth={3} /> Add New Link
          </button>
        )}

        {isAdding && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8 animate-in slide-in-from-top-4 relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-1"><X size={16} /></button>
            <h3 className="font-bold text-gray-900 mb-4 ml-1">Add New Link</h3>
            
            <div className="flex bg-gray-50 p-1 rounded-xl mb-5">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setNewType(cat.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${newType === cat.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  <cat.icon size={14} /> <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex overflow-hidden rounded-xl border-2 border-transparent focus-within:border-gray-300 bg-gray-50 transition-all">
                <span className="flex items-center pl-4 pr-1 text-gray-400 font-semibold select-none text-[13px]">https://</span>
                <input type="text" placeholder="url" value={newUrl} onChange={handleSmartInput} className="flex-1 py-3 pr-4 bg-transparent outline-none font-semibold text-gray-900 text-[13px]"/>
              </div>
              <div className="flex overflow-hidden rounded-xl border-2 border-transparent focus-within:border-gray-300 bg-gray-50 transition-all">
                <input type="text" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full py-3 px-4 bg-transparent outline-none font-semibold text-gray-900 text-[13px]"/>
              </div>
              <button onClick={handleSave} disabled={isSaving || !newTitle || !newUrl} className={`w-full py-3.5 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${newTitle && newUrl ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Link'}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {links.length === 0 && !isAdding && (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
              <h3 className="font-bold text-gray-900">No links yet</h3>
              <p className="text-sm text-gray-500 mt-1">Add your first link to get started.</p>
            </div>
          )}

          {links.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)).map((link: any, index: number) => (
            <div key={link.id} className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col gap-4">
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex flex-col items-center justify-center text-gray-300 gap-1 w-6 mt-1 shrink-0">
                   <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="hover:text-black hover:bg-gray-100 rounded p-0.5 transition-colors disabled:opacity-30"><ArrowUp size={14} /></button>
                   <button onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1} className="hover:text-black hover:bg-gray-100 rounded p-0.5 transition-colors disabled:opacity-30"><ArrowDown size={14} /></button>
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <input type="text" value={link.title} onChange={(e) => updateLinkDB(link.id, 'title', e.target.value)} className="font-bold text-[15px] text-gray-900 outline-none w-full bg-transparent hover:bg-gray-50 focus:bg-gray-50 rounded px-1 -ml-1 transition-colors truncate" />
                  <input type="text" value={link.url} onChange={(e) => updateLinkDB(link.id, 'url', e.target.value)} className="text-[13px] font-medium text-gray-500 outline-none w-full bg-transparent hover:bg-gray-50 focus:bg-gray-50 rounded px-1 -ml-1 mt-0.5 transition-colors truncate" />
                </div>
                
                <div className="flex items-center mt-2 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={link.isActive} onChange={(e) => updateLinkDB(link.id, 'isActive', e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39E09B]"></div>
                  </label>
                </div>
              </div>

              {/* BARIS TINDAKAN BAWAH */}
              <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                
                <div className="flex items-center justify-between">
                   <div className="flex flex-wrap items-center gap-2">
                     <button onClick={() => setActiveThumbnailModal(link.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${link.custom_icon ? 'bg-[#7949F6]/10 text-[#7949F6]' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}>
                       <ImageIcon size={14} /> Thumbnail
                     </button>
                     <button onClick={() => setActiveLayoutModal(link.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${link.layout && link.layout !== 'classic' ? 'bg-[#7949F6]/10 text-[#7949F6]' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}>
                       <LayoutTemplate size={14} /> Layout {link.layout && link.layout !== 'classic' ? `(${link.layout})` : ''}
                     </button>
                   </div>

                   <div className="flex items-center gap-2 shrink-0">
                     <div className="px-3 py-1.5 bg-gray-50 rounded-lg flex items-center gap-1.5 text-gray-500" title="Total Clicks">
                       <BarChart2 size={14} /> <span className="text-xs font-bold">{link.clicks || 0}</span>
                     </div>
                     <button onClick={() => handleDelete(link.id)} className="px-3 py-1.5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                       <Trash2 size={16} />
                     </button>
                   </div>
                </div>

                {/* 2. PREMIUM: UPLOAD FOTO CUSTOM */}
                <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-md border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {link.image_url ? (
                      <img src={link.image_url} alt="Custom" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={16} />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Custom Photo</span>
                      {!isPremiumUser && <span className="bg-gray-900 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest flex items-center gap-1"><Lock size={8} /> Pro</span>}
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          if (!isPremiumUser) {
                            toast.error('Fitur Premium! Ubah status akun Anda (Pro/Premium) untuk mengaktifkan fitur ini.');
                            return;
                          }
                          fileInputRefs.current[link.id]?.click();
                        }}
                        className={`text-[10px] font-bold py-1 px-3 rounded flex items-center gap-1.5 transition-all ${isPremiumUser ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        <Camera size={12} /> Upload Image
                      </button>
                      
                      {link.image_url && isPremiumUser && (
                        <button onClick={() => handleRemoveCustomPhoto(link.id)} className="text-[10px] font-bold py-1 px-3 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={el => { fileInputRefs.current[link.id] = el; }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleUploadCustomPhoto(link.id, e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                      accept="image/jpeg,image/png"
                      className="hidden"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL LAYOUT */}
      {activeLayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900">Choose Layout</h3>
              <button onClick={() => setActiveLayoutModal(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={16}/></button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleUpdateLinkField(activeLayoutModal, 'layout', 'classic')} className="flex flex-col items-center gap-3 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#7949F6] focus:border-[#7949F6] transition-all">
                <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center px-2 gap-2"><div className="w-6 h-6 bg-gray-300 rounded-md"></div><div className="h-2 w-12 bg-gray-300 rounded-full"></div></div>
                <span className="text-xs font-bold text-gray-700">Classic</span>
              </button>
              <button onClick={() => handleUpdateLinkField(activeLayoutModal, 'layout', 'featured')} className="flex flex-col items-center gap-3 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#7949F6] focus:border-[#7949F6] transition-all">
                <div className="w-full h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1"><div className="w-8 h-6 bg-gray-300 rounded-md"></div><div className="h-1.5 w-8 bg-gray-300 rounded-full"></div></div>
                <span className="text-xs font-bold text-gray-700">Featured</span>
              </button>
              <button onClick={() => handleUpdateLinkField(activeLayoutModal, 'layout', 'minimal')} className="flex flex-col items-center gap-3 p-4 border-2 border-gray-100 rounded-2xl hover:border-[#7949F6] focus:border-[#7949F6] transition-all">
                <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center"><div className="w-6 h-6 bg-gray-300 rounded-full"></div></div>
                <span className="text-xs font-bold text-gray-700">Icon Only</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THUMBNAIL */}
      {activeThumbnailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900">Choose Icon</h3>
              <button onClick={() => setActiveThumbnailModal(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={16}/></button>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6 max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
              {ICON_OPTIONS.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => handleUpdateLinkField(activeThumbnailModal, 'custom_icon', item.id)}
                  className="aspect-square bg-gray-50 hover:bg-[#7949F6] hover:text-white text-gray-600 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-gray-100"
                >
                  <item.icon size={24} strokeWidth={1.5} />
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleUpdateLinkField(activeThumbnailModal, 'custom_icon', null)}
              className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
            >
              Remove Icon
            </button>
          </div>
        </div>
      )}
    </>
  );
}