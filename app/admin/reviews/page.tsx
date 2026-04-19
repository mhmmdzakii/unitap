// app/admin/reviews/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, MessageSquare, Award, Send, Loader2, Quote, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // State untuk form
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setReviews(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error('Sistem sedang memuat ID. Coba lagi.');
    if (!name || !comment) return toast.error('Isi nama dan ulasan!');

    setSubmitLoading(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: userId,
      reviewer_name: name,
      rating: rating,
      comment: comment,
      is_approved: true // Otomatis tayang
    });

    if (!error) {
      toast.success('Rating berhasil ditambahkan!');
      setName(''); setComment(''); setRating(5);
      fetchReviews(); // Refresh daftar ulasan seketika
    } else {
      toast.error(`Gagal: ${error.message}`);
    }
    setSubmitLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus testimoni ini?")) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews(reviews.filter(r => r.id !== id));
      toast.success('Testimoni Dihapus!');
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading data...</div>;

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Award className="text-[#7949F6]" size={32} /> Halaman Rating & Testimoni
          </h1>
          <p className="text-gray-500 font-medium mt-1">Input rating baru dan lihat semua ulasan di sini.</p>
        </div>

        {/* KOTAK 1: FORM INPUT RATING */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <MessageSquare size={20}/> Beri Rating Baru
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-gray-500 mr-2">Pilih Rating:</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} type="button" onClick={() => setRating(num)} className="hover:scale-110 active:scale-95 transition-transform">
                  <Star size={32} fill={num <= rating ? "#FFC107" : "none"} stroke={num <= rating ? "#FFC107" : "#CBD5E1"} strokeWidth={2} />
                </button>
              ))}
            </div>

            <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#7949F6] transition-all" />
            <textarea placeholder="Tulis ulasan..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#7949F6] transition-all h-28 resize-none" />

            <button disabled={submitLoading} className="w-full py-4 bg-[#7949F6] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#683cd4] transition-all">
              {submitLoading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Kirim Rating</>}
            </button>
          </form>
        </div>

        {/* KOTAK 2: DAFTAR RATING YANG MASUK */}
        <div className="space-y-4">
          <h3 className="text-lg font-black mb-2">Daftar Rating Masuk ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div className="bg-white p-10 rounded-[32px] text-center border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-bold">Belum ada rating.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden group flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex-1">
                  <Quote size={24} className="absolute -top-2 -right-2 text-black/5 rotate-12" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-[15px] text-gray-900">{rev.reviewer_name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? "#FFC107" : "none"} stroke={i < rev.rating ? "#FFC107" : "#CBD5E1"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{rev.comment}"</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                {/* Tombol Hapus */}
                <button onClick={() => handleDelete(rev.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}