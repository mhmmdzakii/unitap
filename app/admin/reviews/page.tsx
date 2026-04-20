// app/admin/affiliate/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Megaphone, Users, Plus, Trash2, Award, Copy, Check, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AffiliateDashboard() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Form Tambah Affiliate
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRefCode, setNewRefCode] = useState('');
  const [newCommission, setNewCommission] = useState('10000');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
      if (profile) setUsername(profile.username);

      const { data } = await supabase.from('affiliates').select('*').eq('user_id', user.id).order('conversions', { ascending: false });
      if (data) setAffiliates(data);
    }
    setLoading(false);
  };

  const handleAddAffiliate = async () => {
    if (!newName || !newRefCode) { toast.error('Nama dan Kode Wajib diisi!'); return; }
    const code = newRefCode.toLowerCase().replace(/\s+/g, ''); // Hapus spasi

    const toastId = toast.loading('Menambahkan Affiliate...');
    try {
      const { data, error } = await supabase.from('affiliates').insert({
        user_id: userId,
        name: newName,
        ref_code: code,
        commission_rate: parseInt(newCommission) || 10000
      }).select().single();

      if (error) throw error;
      
      setAffiliates([...affiliates, data].sort((a, b) => b.conversions - a.conversions));
      setShowAdd(false);
      setNewName(''); setNewRefCode('');
      toast.success('Pasukan Jualan berhasil ditambah! 🚀', { id: toastId });
    } catch (err: any) {
      toast.error('Gagal! Mungkin kode affiliate sudah dipakai orang lain.', { id: toastId });
    }
  };

  const handleDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-gray-900 text-sm">Pecat affiliate ini permanen?</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-gray-100 text-xs font-bold rounded-md hover:bg-gray-200" onClick={() => toast.dismiss(t.id)}>Batal</button>
          <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-md hover:bg-red-600" 
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('Memecat affiliate...');
              try {
                await supabase.from('affiliates').delete().eq('id', id);
                setAffiliates(affiliates.filter(a => a.id !== id));
                toast.success('Affiliate berhasil dipecat!', { id: toastId });
              } catch (error) {
                toast.error('Gagal menghapus.', { id: toastId });
              }
            }}>Pecat!</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const copyLink = (refCode: string, id: number) => {
    const link = `https://unitap-iota.vercel.app/${username}?ref=${refCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Link Affiliate disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalClicks = affiliates.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalConversions = affiliates.reduce((acc, curr) => acc + curr.conversions, 0);
  const totalPayout = affiliates.reduce((acc, curr) => acc + (curr.conversions * curr.commission_rate), 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold bg-[#F6F7F5]">Memuat Markas Affiliate...</div>;

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900 pb-32">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Megaphone className="text-[#FF5722]" size={32} /> Smart Affiliate
            </h1>
            <p className="text-gray-500 font-medium mt-1">Bangun pasukan jualan dan lacak performa mereka otomatis.</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="py-3 px-6 bg-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg">
            {showAdd ? <Trash2 size={18} /> : <Plus size={18} />} {showAdd ? 'Batal' : 'Tambah Pasukan'}
          </button>
        </div>

        {/* KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0"><Users size={28} /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Klik Link</p><h2 className="text-3xl font-black">{totalClicks}</h2></div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0"><TrendingUp size={28} /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Closing</p><h2 className="text-3xl font-black">{totalConversions}</h2></div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0"><DollarSign size={28} /></div>
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimasi Komisi</p><h2 className="text-2xl font-black text-green-600">Rp{totalPayout.toLocaleString('id-ID')}</h2></div>
          </div>
        </div>

        {/* FORM TAMBAH AFFILIATE */}
        {showAdd && (
          <div className="bg-white p-8 rounded-[32px] border-2 border-gray-100 shadow-xl animate-in slide-in-from-top-4">
            <h3 className="font-black text-xl mb-4">Daftarkan Affiliate Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Nama Lengkap (Cth: Udin Petot)" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-black" />
              <input type="text" placeholder="Kode Unik (Cth: udin99)" value={newRefCode} onChange={(e) => setNewRefCode(e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-black" />
              <input type="number" placeholder="Komisi per Closing (Rp)" value={newCommission} onChange={(e) => setNewCommission(e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-black" />
            </div>
            <button onClick={handleAddAffiliate} className="w-full py-4 bg-[#7949F6] text-white rounded-xl font-black hover:bg-[#683cd4] transition-all shadow-md">Simpan Affiliate Baru 🚀</button>
          </div>
        )}

        {/* LEADERBOARD AFFILIATE */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
          <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Award className="text-yellow-500" /> Leaderboard Pasukan</h3>
          
          {affiliates.length === 0 ? (
            <div className="text-center py-10 font-bold text-gray-400">Belum ada affiliate yang terdaftar.</div>
          ) : (
            <div className="space-y-4">
              {affiliates.map((aff, index) => (
                <div key={aff.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all gap-4">
                  
                  {/* Info Affiliate */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black shadow-sm ${index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-orange-300 text-white' : 'bg-white border border-gray-200 text-gray-400'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{aff.name}</h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mt-1">
                        ?ref={aff.ref_code} 
                        <button onClick={() => copyLink(aff.ref_code, aff.id)} className="text-blue-500 hover:text-blue-700">
                          {copiedId === aff.id ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Statistik Individual */}
                  <div className="flex items-center gap-6 w-full md:w-auto bg-white p-3 rounded-xl border border-gray-100">
                    <div className="text-center"><p className="text-[10px] font-black uppercase text-gray-400">Klik</p><p className="font-bold text-sm">{aff.clicks}</p></div>
                    <div className="text-center"><p className="text-[10px] font-black uppercase text-gray-400">Closing</p><p className="font-bold text-sm text-green-500">{aff.conversions}</p></div>
                    <div className="text-center border-l pl-4"><p className="text-[10px] font-black uppercase text-gray-400">Komisi</p><p className="font-black text-sm text-gray-900">Rp{(aff.conversions * aff.commission_rate).toLocaleString('id-ID')}</p></div>
                  </div>

                  {/* Aksi */}
                  <button onClick={() => handleDelete(aff.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"><Trash2 size={18} /></button>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}