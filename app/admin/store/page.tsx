// app/admin/store/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Plus, Trash2, ExternalLink, Loader2, Image as ImageIcon, Zap, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function StorePage() {
  const { profile } = useAdmin();
  const isPro = profile?.plan_type === 'pro'; // KHUSUS PRO SULTAN
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchProducts();
    }
  }, [profile?.id]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Gagal memuat produk: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !imageFile) {
      toast.error('Nama produk, link, dan foto wajib diisi!');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Mengunggah produk ke etalase...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Sesi login hilang!");

      // 1. Upload Gambar
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `product-${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Kita numpang di bucket avatars biar ga ribet bikin baru
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const finalImageUrl = publicUrlData.publicUrl;

      // 2. Simpan ke Database
      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          user_id: userId,
          title,
          price,
          url,
          image_url: finalImageUrl
        }]);

      if (insertError) throw insertError;

      toast.success('Produk berhasil ditambahkan! 🛍️', { id: toastId });
      
      // Reset Form
      setTitle('');
      setPrice('');
      setUrl('');
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh Data
      fetchProducts();

    } catch (error: any) {
      toast.error('Gagal menambahkan produk: ' + error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Yakin mau menghapus produk ini?');
    if (!confirmDelete) return;

    const toastId = toast.loading('Menghapus produk...');
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
      toast.success('Produk terhapus!', { id: toastId });
    } catch (error: any) {
      toast.error('Gagal menghapus: ' + error.message, { id: toastId });
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10 relative">
      
      {!isPro && (
        <div className="absolute inset-0 z-50 bg-[#F6F7F5]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-[3rem]">
           <div className="w-24 h-24 bg-[#d2e823] rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transform rotate-6 border-4 border-white">
             <ShoppingBag size={48} className="text-[#254f1a]" />
           </div>
           <h3 className="font-black text-gray-900 text-4xl mb-4 tracking-tight">Etalase Sultan 🛍️</h3>
           <p className="text-base font-bold text-gray-600 mb-8 max-w-md leading-relaxed">
             Jual produk Anda, tampilkan link affiliate Shopee/TikTok, dan biarkan audiens berbelanja langsung dari profil Anda.
           </p>
           <Link href="/admin/pricing" className="px-10 py-5 bg-black text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
             <Zap size={24} className="text-[#d2e823]" fill="currentColor" /> BUKA KUNCI FITUR PRO
           </Link>
        </div>
      )}

      <div className={`transition-all ${!isPro ? 'opacity-10 pointer-events-none blur-md' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
              Etalase Produk <ShoppingBag className="text-[#7949F6]" size={32} />
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-1">Tambahkan katalog produk atau link affiliate Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM TAMBAH PRODUK */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-2">
                <Plus size={20} className="text-[#39E09B]"/> Tambah Baru
              </h3>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                {/* UPLOAD FOTO */}
                <div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#7949F6] hover:bg-purple-50 transition-all overflow-hidden relative group"
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                           <span className="text-white font-bold text-sm">Ganti Foto</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-gray-400 mb-2 group-hover:text-[#7949F6] transition-colors" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-[#7949F6]">Upload Foto Produk</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                </div>

                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nama Produk</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Misal: Sepatu Sneakers Kece" className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#7949F6] rounded-xl outline-none font-bold text-sm text-gray-900 transition-all" required/>
                </div>

                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Harga (Opsional)</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Misal: Rp 150.000" className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#7949F6] rounded-xl outline-none font-bold text-sm text-gray-900 transition-all"/>
                </div>

                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Link Shopee/Tokotik</label>
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://shope.ee/..." className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#7949F6] rounded-xl outline-none font-bold text-sm text-gray-900 transition-all" required/>
                </div>

                <button type="submit" disabled={isSaving} className="w-full py-4 bg-black text-white rounded-xl font-black text-sm shadow-md hover:scale-105 transition-all flex justify-center items-center gap-2 mt-4">
                  {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Simpan Produk
                </button>
              </form>
            </div>
          </div>

          {/* DAFTAR PRODUK (GRID) */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-gray-300" /></div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><ShoppingBag size={32} className="text-gray-300"/></div>
                <h3 className="font-black text-gray-900 text-xl mb-2">Etalase Masih Kosong</h3>
                <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">Tambahkan produk pertama Anda di form sebelah kiri untuk mulai menghasilkan cuan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="w-full aspect-square relative bg-gray-50 overflow-hidden">
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(product.id)} className="w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:scale-110 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-black text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">{product.title}</h4>
                      {product.price && <p className="font-extrabold text-[#7949F6] text-sm mb-3 mt-auto">{product.price}</p>}
                      <a href={product.url} target="_blank" rel="noreferrer" className="mt-auto w-full py-2.5 bg-gray-50 text-gray-900 rounded-xl font-black text-xs flex justify-center items-center gap-1.5 hover:bg-[#d2e823] hover:text-[#254f1a] transition-colors border border-gray-200 hover:border-transparent">
                        Buka Link <ExternalLink size={12}/>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}