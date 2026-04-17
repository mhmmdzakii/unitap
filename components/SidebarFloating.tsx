// components/SidebarFloating.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid, Layout, ChevronDown, ChevronUp, Bell, DollarSign, Users, BarChart2, Zap } from 'lucide-react';

export default function SidebarFloating({ profile }: { profile: any }) {
  const pathname = usePathname();
  const [isEarnOpen, setIsEarnOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;

  // Ikon menu lebih besar & teks lebih ringkas
  const menuClass = (path: string) => `flex flex-col items-center gap-1.5 p-3 rounded-2xl w-full text-center transition-all duration-200 ${isActive(path) ? 'bg-[#7949F6] text-white font-bold' : 'text-gray-500 font-semibold hover:bg-gray-100'}`;

  return (
    <aside className="absolute top-10 left-10 bottom-10 w-[100px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 z-20 flex flex-col items-center pt-6 pb-6 overflow-y-auto hidden md:flex custom-scrollbar animate-in slide-in-from-left duration-500 gap-6">
      
      {/* Profile */}
      <div className="flex flex-col items-center gap-1 mb-4">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner border border-white">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <span className="font-extrabold text-[12px] text-black tracking-tight">{profile.username}</span>
      </div>

      {/* Navigasi Group (Ikon Sentris) */}
      <div className="flex flex-col gap-2 w-full px-2.5">
         
         <Link href="/admin/links" className={menuClass('/admin/links')} title="Links"><Grid size={24}/> <span className="text-[11px]">Links</span></Link>
         <Link href="/admin/design" className={menuClass('/admin/design')} title="Design"><Layout size={24}/> <span className="text-[11px]">Design</span></Link>
         
         {/* Earn Dropdown (Disederhanakan) */}
         <div>
            <button onClick={() => setIsEarnOpen(!isEarnOpen)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl w-full text-center ${isEarnOpen ? 'bg-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}>
               <DollarSign size={24}/> <span className="text-[11px]">Earn</span>
               {isEarnOpen ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
            </button>
            {isEarnOpen && (
              <div className="flex flex-col mt-1 gap-1 animate-in slide-in-from-top-2 duration-200 text-[10px]">
                <Link href="/admin/earn-overview" className={`px-2 py-1.5 rounded-lg w-full ${isActive('/admin/earn-overview') ? 'font-bold bg-[#F6F7F5]' : 'hover:bg-gray-50'}`}>Overview</Link>
                <Link href="/admin/earn-earnings" className={`px-2 py-1.5 rounded-lg w-full ${isActive('/admin/earn-earnings') ? 'font-bold bg-[#F6F7F5]' : 'hover:bg-gray-50'}`}>Earnings</Link>
              </div>
            )}
         </div>

         <Link href="/admin/insights" className={menuClass('/admin/insights')} title="Insights"><BarChart2 size={24}/> <span className="text-[11px]">Insights</span></Link>
         <button className="flex flex-col items-center gap-1.5 p-3 rounded-2xl w-full text-center text-gray-500 hover:bg-gray-100"><Bell size={24}/> <span className="text-[11px]">Inbox</span></button>

      </div>
    </aside>
  );
}