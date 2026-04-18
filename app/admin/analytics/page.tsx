// app/admin/analytics/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MousePointer2, Smartphone, Monitor, Globe } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, mobile: 0, desktop: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    // 1. Ambil data dari tabel mata-mata kita
    const { data: clicks, error } = await supabase
      .from('link_analytics')
      .select('*, links(title)')
      .order('created_at', { ascending: false });

    if (!error && clicks) {
      setData(clicks);
      
      // 2. Itung Statistik Cepat
      const total = clicks.length;
      const mobile = clicks.filter(c => c.device_type === 'Mobile').length;
      const desktop = total - mobile;
      setStats({ total, mobile, desktop });
    }
    setLoading(false);
  };

  // Ngolah data buat Grafik Bar (Klik per Link)
  const chartData = data.reduce((acc: any[], curr) => {
    const title = curr.links?.title || 'Unknown';
    const existing = acc.find(a => a.name === title);
    if (existing) existing.clicks++;
    else acc.push({ name: title, clicks: 1 });
    return acc;
  }, []).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  if (loading) return <div className="p-10 text-center font-bold opacity-50">Mengambil data dari pusat komando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8 tracking-tighter">Command Center Analytics 🛰️</h1>

        {/* 🏆 KARTU STATISTIK UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MousePointer2 size={24} /></div>
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Total Klik</span>
            </div>
            <h2 className="text-4xl font-black">{stats.total}</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">Interaksi real-time</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Smartphone size={24} /></div>
              <span className="text-xs font-black text-purple-500 uppercase tracking-widest">Mobile</span>
            </div>
            <h2 className="text-4xl font-black">{stats.mobile}</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">{Math.round((stats.mobile/stats.total)*100) || 0}% Pengguna HP</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Monitor size={24} /></div>
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Desktop</span>
            </div>
            <h2 className="text-4xl font-black">{stats.desktop}</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">{Math.round((stats.desktop/stats.total)*100) || 0}% Pengguna PC</p>
          </div>
        </div>

        {/* 📊 GRAFIK UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" /> Link Paling Rame
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="clicks" fill="#3B82F6" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 📜 LOG AKTIVITAS TERAKHIR */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6">Aktivitas Terakhir</h3>
            <div className="space-y-4">
              {data.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-sm">Klik di "{log.links?.title}"</p>
                    <p className="text-xs text-gray-400">{log.device_type} • {log.referrer}</p>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}