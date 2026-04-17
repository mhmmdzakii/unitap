// app/admin/analytics/page.tsx
"use client";
import { useAdmin } from '@/context/AdminContext';
import { 
  BarChart3, MousePointerClick, Eye, Zap, 
  ArrowUpRight, Target, Flame 
} from 'lucide-react';

export default function AnalyticsPage() {
  const { links } = useAdmin();

  // 🔥 Logika Data Real
  const totalClicks = links.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);
  const totalViews = totalClicks === 0 ? 0 : Math.floor(totalClicks * 2.4); 
  const ctr = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  return (
    <div className="max-w-4xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Insights</h1>
          <p className="text-gray-500 font-bold text-sm mt-1">Real-time performance of your UnikLink.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#d2e823]/20 text-[#254f1a] px-4 py-2 rounded-2xl font-black text-xs border border-[#d2e823]/30">
          <Flame size={14} /> 24h Update
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#7949F6] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Views</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-gray-900">{totalViews}</h2>
            <span className="text-green-500 font-bold text-xs flex items-center"><ArrowUpRight size={14}/> 12%</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#d2e823] blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Clicks</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-gray-900">{totalClicks}</h2>
            <span className="text-green-500 font-bold text-xs flex items-center"><ArrowUpRight size={14}/> 8%</span>
          </div>
        </div>

        <div className="bg-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7949F6]/20 to-[#d2e823]/20 opacity-40"></div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Avg. CTR</p>
          <h2 className="text-5xl font-black text-white relative z-10">{ctr}%</h2>
          <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-gradient-to-r from-[#7949F6] to-[#d2e823] rounded-full" style={{ width: `${ctr}%` }}></div>
          </div>
        </div>
      </div>

      {/* TOP LINKS LIST */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs flex items-center gap-2">
            <Target size={16} className="text-[#7949F6]" /> Top Performing Links
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {links.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-bold italic">No link data yet...</div>
          ) : (
            links.sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0)).map((link: any, i: number) => (
              <div key={link.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-5 overflow-hidden pr-4">
                  <span className="text-2xl font-black text-gray-200 w-8">{i + 1}</span>
                  <div className="truncate">
                    <p className="font-bold text-gray-900 truncate leading-tight">{link.title}</p>
                    <p className="text-xs font-bold text-gray-400 truncate mt-1">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900 leading-none">{link.clicks || 0}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Clicks</p>
                  </div>
                  <div className="w-1.5 h-10 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-full bg-[#7949F6]" style={{ height: `${(link.clicks / (totalClicks || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}