// app/admin/layout.tsx
"use client";
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import MobilePreview from '@/components/MobilePreview';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { Sparkles, Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { profile, links, currentThemeData, designConfig } = useAdmin();
  const pathname = usePathname();
  const showMobilePreview = pathname === '/admin/links' || pathname === '/admin/design';

  return (
    <div className="h-screen flex flex-col bg-[#FDFDFD] font-sans text-gray-900 overflow-hidden">
      {/* HEADER FIXED */}
      <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50 shrink-0">
         <div className="font-extrabold text-lg text-black tracking-tight flex items-center gap-2">
           <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-[11px] shadow-lg transform -rotate-3">U</div> 
           UniTap<span className="text-[#7949F6]">*</span>
         </div>
         
         {/* Search Bar ala Dashboard Pro */}
         <div className="hidden md:flex items-center bg-[#F6F7F5] px-4 py-2 rounded-xl gap-2 w-full max-w-md border border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search features..." className="bg-transparent outline-none text-sm font-medium w-full" />
         </div>

         <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-black transition-colors relative">
              <Bell size={20}/>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
            
            {/* 🔥 Tombol Upgrade dibungkus Link ke Pricing */}
            <Link href="/admin/pricing">
              <button className="bg-gradient-to-r from-[#7949F6] to-[#d2e823] p-[2px] rounded-full hover:scale-105 transition-all shadow-md cursor-pointer">
                 <div className="bg-white rounded-full px-4 py-1.5 text-xs font-black flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#7949F6]" /> Upgrade
                 </div>
              </button>
            </Link>
         </div>
      </header>

      {/* BODY AREA */}
      <div className="flex flex-1 overflow-hidden">
         {/* SIDEBAR FIXED (Diem di tempat) */}
         <Sidebar />

         {/* MAIN CONTENT (Hanya ini yang bisa scroll) */}
         <main className="flex-1 overflow-y-auto bg-[#F9FAFB] scroll-smooth shadow-inner border-r border-gray-100 relative custom-scrollbar">
           {children}
         </main>

         {/* MOBILE PREVIEW FIXED (Diem di tempat) */}
         {showMobilePreview && (
           <MobilePreview profile={profile} links={links} theme={currentThemeData} designConfig={designConfig} />
         )}
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider><LayoutContent>{children}</LayoutContent></AdminProvider>;
}