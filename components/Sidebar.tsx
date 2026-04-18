// components/Sidebar.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Heart, BadgeCheck, Globe, Globe2, LineChart, Link2, Palette, QrCode, Search, ShoppingBag, Settings, Layout, Zap, Crown, BarChart2, Check, Copy, Target } from 'lucide-react';

// Tambahin props isMobileView biar bisa di-tweak dikit style-nya kalau lg di HP
export default function Sidebar({ isMobileView = false }: { isMobileView?: boolean }) {
  const pathname = usePathname();
  const { profile, links } = useAdmin();
  const userPlan = profile?.plan_type || 'free'; 
  const [copied, setCopied] = useState(false);

  // Menu Categories
  const buildNav = [
    { name: 'Links', path: '/admin/links', icon: Link2 },
    { name: 'Design', path: '/admin/design', icon: Palette },
  ];

  // 🔥 LADANG CUAN: Monetize Section
  const monetizeNav = [
    { id: 'tips', name: 'Tip Jar', icon: Heart, path: '/admin/tips', pro: false }, 
    { id: 'store', name: 'Etalase', icon: ShoppingBag, path: '/admin/etalase', pro: true },
    { id: 'verified', name: 'Verified Badge', icon: BadgeCheck, path: '/admin/verified', pro: true },
  ];

  // 🔥 GROWTH: Tambah Custom Domain
  const growthNav = [
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2, badge: 'New' },
    { name: 'Custom Domain', path: '/admin/domain', icon: Globe2, badge: 'Pro' },
    { name: 'SEO Setup', path: '/admin/seo', icon: Globe, badge: 'Pro' },
    { name: 'QR Code', path: '/admin/qrcode', icon: QrCode },
  ];

  // Hitung total klik untuk Progress Bar
  const totalClicks = links.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);
  const nextGoal = 100; 
  const progressPercent = Math.min((totalClicks / nextGoal) * 100, 100);

 // 🔥 TIMPA FUNGSI LAMA LO PAKE INI 🔥
const handleCopy = (e: React.MouseEvent) => {
  e.stopPropagation(); // Biar gak nutup menu hp
  
  // Kita ambil username, bersihin @, dan bikin huruf kecil semua biar rapi
  const username = profile?.username?.replace('@', '').toLowerCase() || 'you';
  
  // 🔥 INI DIA: Kita suruh dia nyalin link Vercel asli
  navigator.clipboard.writeText(`https://unitap-iota.vercel.app/${username}`);
  
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.path;
    return (
      <Link href={item.path}
        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all mb-1.5 ${
          isActive ? 'bg-black text-white shadow-lg shadow-black/10 scale-[1.02]' : 'text-gray-500 hover:bg-[#F6F7F5] hover:text-black'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#d2e823]" : ""} />
          {item.name}
        </div>
        {item.badge && (
          <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black ${
            item.badge === 'Pro' ? 'bg-[#d2e823] text-[#254f1a]' : 'bg-[#7949F6] text-white'
          }`}>{item.badge}</span>
        )}
      </Link>
    );
  };

  return (
    <aside className={`w-[280px] bg-white p-5 flex flex-col h-full z-40 overflow-y-auto custom-scrollbar shrink-0 ${!isMobileView ? 'border-r border-gray-100' : ''}`}>
      
      {/* QUICK ACTION CARD */}
      <div className="bg-[#F6F7F5] p-3 rounded-2xl mb-6 border border-gray-100 flex items-center justify-between group">
        <div className="overflow-hidden pr-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Your Link</p>
          <p className="text-xs font-bold text-gray-900 truncate">unitap.ee/{profile?.username?.replace('@', '') || 'you'}</p>
        </div>
        <button onClick={handleCopy} className="w-8 h-8 shrink-0 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:text-black hover:shadow-sm border border-gray-100 transition-all">
          {copied ? <Check size={14} className="text-[#39E09B]" /> : <Copy size={14} />}
        </button>
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-4">Build</div>
        {buildNav.map((item) => <NavLink key={item.name} item={item} />)}
      </div>

      {/* 🔥 MONETIZE SECTION */}
      <div className="mb-6">
        <div className="text-[10px] font-black text-[#7949F6] uppercase tracking-[0.2em] mb-3 ml-4">Monetize</div>
        {monetizeNav.map((item) => <NavLink key={item.name} item={item} />)}
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-4">Growth</div>
        {growthNav.map((item) => <NavLink key={item.name} item={item} />)}
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-4">Account</div>
        <NavLink item={{ name: 'Settings', path: '/admin/settings', icon: Settings }} />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 relative">
        
        {/* GAMIFICATION: MILESTONE TRACKER */}
        <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-3 relative overflow-hidden group cursor-default" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-2 relative z-10">
            <div className="flex items-center gap-1.5 text-gray-900 font-bold text-xs"><Target size={14} className="text-[#7949F6]"/> Goal</div>
            <span className="text-[10px] font-black text-gray-400">{totalClicks} / {nextGoal}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-gradient-to-r from-[#7949F6] to-[#d2e823] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-[9px] text-gray-400 font-bold mt-2 relative z-10">{nextGoal - totalClicks} clicks to next milestone! 🚀</p>
        </div>

        {/* UPGRADE / BADGE PLAN */}
        <div onClick={e => e.stopPropagation()}>
          {userPlan === 'pro' ? (
            <div className="p-4 bg-gradient-to-br from-[#7949F6] to-[#d2e823] rounded-2xl text-black shadow-xl relative overflow-hidden flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5"><Crown size={14} /><span className="font-black text-[11px] uppercase tracking-widest">Pro</span></div>
                <p className="text-[9px] font-bold text-black/70">All features unlocked</p>
              </div>
              <Crown size={32} className="opacity-20 transform rotate-12 -mr-2" />
            </div>
          ) : userPlan === 'premium' ? (
            <div className="p-4 bg-gradient-to-br from-purple-500 to-[#7949F6] rounded-2xl text-white shadow-xl relative overflow-hidden flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5"><BadgeCheck size={14} /><span className="font-black text-[11px] uppercase tracking-widest">Premium</span></div>
                <p className="text-[9px] font-bold text-white/70">Verified & Estetik</p>
              </div>
              <BadgeCheck size={32} className="opacity-20 transform rotate-12 -mr-2" />
            </div>
          ) : (
            <Link href="/admin/pricing" className="block w-full">
              <button className="w-full py-3 bg-gradient-to-r from-[#7949F6] to-[#d2e823] text-white rounded-2xl text-[11px] font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md">
                <Zap size={14} fill="currentColor" /> UNLOCK PRO
              </button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}