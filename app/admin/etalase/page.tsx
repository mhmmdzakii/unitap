// app/admin/etalase/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import toast from 'react-hot-toast';
import { ShoppingBag, Upload, Plus, Trash2, Loader2, ExternalLink, Tag } from 'lucide-react';

export default function EtalasePage() {
  const { profile } = useAdmin();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // State untuk Form Tambah Produk
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState(''); // 🔥 HARGA PROMO
  const [priceSale, setPriceSale] = useState(''); // 🔥 HARGA CORET
  const [promoLabel, setPromoLabel] = useState(''); // 🔥 PITA LABEL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. AMBIL DATA ETALASE DARI DATABASE (VERSI ANTI MUTER-MUTER)
  const fetchProducts = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .eq('layout', 'etalase')
      .order('id', { ascending: false });

    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. HANDLE PREVIEW GAMBAR
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 3. FUNGSI SIMPAN PRODUK (VERSI PREMIUM: HARGA + LABEL)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !imageFile) {
      toast.error('Judul, URL, dan Foto wajib diisi!');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Menambahkan produk sultan...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) throw new Error("Sesi login hilang! Refresh halaman.");

      // A. Upload Foto
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `etalase-${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      // B. Ambil URL Publik
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;

      // C. Simpan ke Database
      const { error: insertError } = await supabase.from('links').insert([
        {
          user_id: userId,
          title: title,
          url: url,
          type: 'store',
          layout: 'etalase',
          image_url: imageUrl,
          price: price, // 🔥 BARU
          price_sale: priceSale, // 🔥 BARU
          promo_label: promoLabel, // 🔥 BARU
          is_active: true
        }
      ]);

      if (insertError) throw insertError;

      // Reset Form
      setTitle('');
      setUrl('');
      setPrice('');
      setPriceSale('');
      setPromoLabel('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      fetchProducts();
      toast.success('Produk berhasil dipajang! 🛒', { id: toastId });

    } catch (error: any) {
      toast.error('Gagal: ' + error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // 4. FUNGSI HAPUS PRODUK
 // 4. FUNGSI HAPUS PRODUK (BASMI ZOMBIE SAMPAI KE AKAR) 🧟‍♂️🔫
  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!window.confirm('Yakin mau hapus produk ini sampai ke akar-akarnya?')) return;
    const toastId = toast.loading('Membasmi produk & foto zombie...');

    try {
      // LANGKAH 1: BAKAR FOTONYA DI STORAGE DULU
      if (imageUrl) {
        // Ekstrak nama file dari URL panjangnya
        // (Misal dari https://.../avatars/etalase-123.jpg -> kita ambil "etalase-123.jpg")
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        if (fileName) {
          const { error: storageError } = await supabase.storage.from('avatars').remove([fileName]);
          if (storageError) console.error("Gagal bakar foto zombie:", storageError);
        }
      }

      // LANGKAH 2: HAPUS CATATANNYA DARI DATABASE
      const { error: dbError } = await supabase.from('links').delete().eq('id', id);
      if (dbError) throw dbError;

      // LANGKAH 3: HILANGKAN DARI LAYAR
      setProducts(products.filter(p => p.id !== id));
      toast.success('Produk & Foto Zombie hangus terbakar! 🔥', { id: toastId });

    } catch (error: any) {
      toast.error('Gagal menghapus: ' + error.message, { id: toastId });
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
          Etalase Produk <ShoppingBag className="text-[#7949F6]" size={32} />
        </h1>
        <p className="text-gray-500 font-bold text-sm mt-1">Gunakan fitur premium Harga Coret dan Label Promo untuk menarik pembeli.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORM TAMBAH PRODUK */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddProduct} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="font-black text-lg text-gray-900 mb-6 flex items-center gap-2"><Plus size={18}/> Tambah Produk</h2>
            
            <div className="mb-5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Foto Produk (Wajib)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#7949F6] transition-all overflow-hidden relative"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-500">Upload Foto</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Nama Produk</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Misal: Sepatu Nike Air" className="w-full px-4 py-3 bg-[#F6F7F5] border-2 border-transparent focus:border-[#7949F6] focus:bg-white rounded-xl outline-none font-bold text-sm text-gray-900 transition-all"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Harga Promo</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99rb" className="w-full px-4 py-3 bg-[#F6F7F5] border-2 border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none font-bold text-sm text-green-600 transition-all"/>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Harga Coret</label>
                  <input type="text" value={priceSale} onChange={(e) => setPriceSale(e.target.value)} placeholder="150rb" className="w-full px-4 py-3 bg-[#F6F7F5] border-2 border-transparent focus:border-red-400 focus:bg-white rounded-xl outline-none font-medium text-sm text-gray-400 line-through transition-all"/>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Pita Label (Optional)</label>
                <input type="text" value={promoLabel} onChange={(e) => setPromoLabel(e.target.value)} placeholder="Misal: BEST SELLER" className="w-full px-4 py-3 bg-[#F6F7F5] border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-xl outline-none font-bold text-sm text-orange-600 transition-all uppercase"/>
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Link Afiliasi</label>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://shope.ee/..." className="w-full px-4 py-3 bg-[#F6F7F5] border-2 border-transparent focus:border-[#7949F6] focus:bg-white rounded-xl outline-none font-medium text-sm text-gray-900 transition-all"/>
              </div>
            </div>

            <button type="submit" disabled={isUploading} className={`w-full mt-6 py-4 rounded-xl font-black text-white transition-all flex items-center justify-center gap-2 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:scale-[1.02] shadow-lg active:scale-95'}`}>
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : 'Pajang Produk'}
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR PRODUK */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm min-h-[500px]">
            <h2 className="font-black text-lg text-gray-900 mb-6 flex items-center gap-2"><Tag size={18}/> Preview Etalase</h2>
            
            {loading ? (
              <div className="w-full h-40 flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
            ) : products.length === 0 ? (
              <div className="w-full py-20 flex flex-col items-center text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <ShoppingBag size={48} className="text-gray-200 mb-4" />
                <p className="font-bold text-gray-400 italic text-sm">Belum ada produk yang dipajang.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative flex flex-col">
                   <button onClick={() => handleDelete(product.id, product.image_url)} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-500 hover:text-white"><Trash2 size={14}/></button>
                    
                    <div className="w-full aspect-square bg-gray-50 relative overflow-hidden">
                      {product.promo_label && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded z-10 uppercase tracking-tighter">
                          {product.promo_label}
                        </div>
                      )}
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-3 flex-1 flex flex-col">
                      <p className="font-bold text-[13px] text-gray-900 leading-tight line-clamp-2 h-8">{product.title}</p>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 min-h-[20px]">
                        {product.price && <span className="text-green-600 font-black text-sm">Rp{product.price}</span>}
                        {product.price_sale && <span className="text-gray-400 text-[10px] line-through font-bold">Rp{product.price_sale}</span>}
                      </div>

                      <a href={product.url} target="_blank" rel="noreferrer" className="mt-3 w-full py-1.5 bg-gray-50 text-gray-900 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 hover:bg-gray-100">
                        <ExternalLink size={10} /> TEST LINK
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