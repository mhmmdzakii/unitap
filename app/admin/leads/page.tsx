// app/admin/leads/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Download, Trash2, Search, MessageCircle, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Ambil data leads yang user_id-nya sama dengan user yang lagi login
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setLeads(data);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus kontak ini?")) return;
    const toastId = toast.loading('Menghapus...');
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) {
      setLeads(leads.filter(lead => lead.id !== id));
      toast.success('Kontak dihapus!', { id: toastId });
    } else {
      toast.error('Gagal menghapus', { id: toastId });
    }
  };

  // 🔥 FITUR SULTAN: Export ke Excel/CSV
  const exportToCSV = () => {
    if (leads.length === 0) return toast.error('Data masih kosong!');
    
    const headers = ['Nama', 'Nomor WhatsApp', 'Tanggal Masuk'];
    const csvData = leads.map(l => `${l.name},${l.whatsapp_number},${new Date(l.created_at).toLocaleDateString('id-ID')}`);
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Database_Kontak_UniTap_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Berhasil di-export! 📊');
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.whatsapp_number.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Database className="text-[#7949F6]" size={32} /> Database Kontak
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Kumpulkan dan kelola nomor WhatsApp pelanggan Anda.</p>
          </div>
          <button 
            onClick={exportToCSV}
            className="bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* KONTEN */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          
          {/* SEARCH BAR */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama atau nomor WA..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABEL DATA */}
          {loading ? (
            <div className="p-10 text-center text-gray-400 font-medium">Memuat database...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Belum Ada Kontak</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">Gunakan fitur <b>"Link Gembok"</b> untuk mulai mengumpulkan nama dan nomor WhatsApp pengunjung Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-gray-100">Nama Pelanggan</th>
                    <th className="p-4 font-bold border-b border-gray-100">WhatsApp</th>
                    <th className="p-4 font-bold border-b border-gray-100">Tanggal</th>
                    <th className="p-4 font-bold border-b border-gray-100 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4 font-bold text-sm text-gray-900">{lead.name}</td>
                      <td className="p-4 text-sm font-medium">
                        <a href={`https://wa.me/${lead.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-green-600 hover:text-green-700">
                          <MessageCircle size={14} /> {lead.whatsapp_number}
                        </a>
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}