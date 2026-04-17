// app/admin/layout.tsx
"use client";
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import MobilePreview from '@/components/MobilePreview';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { Sparkles, Bell, Search, Menu, X, Layout } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { profile, links, currentThemeData, designConfig } = useAdmin();
  const pathname = usePathname();
  const showMobilePreview = pathname === '/admin/links' || pathname === '/admin/design';
  
  // 🔥 State buat ngatur buka-tutup Sidebar di HP
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#FDFDFD] font-sans text-gray-900 overflow-hidden">
      
      {/* HEADER FIXED */}
      <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-50 shrink-0 relative">
         
         <div className="flex items-center gap-3">
           {/* 🔥 Tombol Hamburger (Cuma Muncul di HP) */}
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="md:hidden p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
           >
             <Menu size={24} />
           </button>
           
           {/* Logo */}
           <div className="font-extrabold text-lg text-black tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-[11px] shadow-lg transform -rotate-3">U</div> 
             <span className="hidden sm:block">UniTap<span className="text-[#7949F6]">*</span></span>
           </div>
         </div>
         
         {/* Search Bar ala Dashboard Pro (Sembunyi di HP kecil) */}
         <div className="hidden md:flex items-center bg-[#F6F7F5] px-4 py-2 rounded-xl gap-2 w-full max-w-md border border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search features..." className="bg-transparent outline-none text-sm font-medium w-full" />
         </div>

         <div className="flex items-center gap-3 md:gap-4">
            <button className="text-gray-400 hover:text-black transition-colors relative">
              <Bell size={20}/>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden sm:block h-8 w-[1px] bg-gray-100 mx-1"></div>
            
            {/* Tombol Upgrade */}
            <Link href="/admin/pricing">
              <button className="bg-gradient-to-r from-[#7949F6] to-[#d2e823] p-[2px] rounded-full hover:scale-105 transition-all shadow-md cursor-pointer">
                 <div className="bg-white rounded-full px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-black flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#7949F6]" /> <span className="hidden sm:block">Upgrade</span>
                 </div>
              </button>
            </Link>
         </div>
      </header>

      {/* BODY AREA */}
      <div className="flex flex-1 overflow-hidden relative">
         
         {/* 🔥 SIDEBAR RESPONSIVE */}
         {/* Di Layar Gede: Selalu Muncul. Di Layar HP: Ngumpet dulu */}
         <div className="hidden md:block shrink-0">
           <Sidebar />
         </div>

         {/* 🔥 SIDEBAR OVERLAY UNTUK HP */}
         <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Latar Belakang Gelap */}
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
                />
                
                {/* Sidebar Slide-in */}
                <motion.div 
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="md:hidden fixed inset-y-0 left-0 z-[100] w-[280px] bg-white shadow-2xl flex flex-col"
                >
                  <div className="p-4 flex justify-between items-center border-b border-gray-100">
                    <div className="font-extrabold text-lg text-black tracking-tight flex items-center gap-2">
                       <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-[11px] transform -rotate-3">U</div> 
                       UniTap<span className="text-[#7949F6]">*</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full">
                       <X size={20} />
                    </button>
                  </div>
                  {/* Gunakan komponen Sidebar, dengan aksi klik menutup sidebar */}
                  <div className="flex-1 overflow-y-auto" onClick={() => setIsSidebarOpen(false)}>
                     <Sidebar isMobileView={true} />
                  </div>
                </motion.div>
              </>
            )}
         </AnimatePresence>

         {/* MAIN CONTENT (Hanya ini yang bisa scroll) */}
         <main className="flex-1 overflow-y-auto bg-[#F9FAFB] scroll-smooth shadow-inner md:border-r border-gray-100 relative custom-scrollbar">
           {children}
         </main>

         {/* MOBILE PREVIEW FIXED (Diem di tempat) - Cuma muncul di layar gede! */}
         {showMobilePreview && (
           <div className="hidden lg:block shrink-0">
             <MobilePreview profile={profile} links={links} theme={currentThemeData} designConfig={designConfig} />
           </div>
         )}

         {/* Tombol Preview Mengambang buat di HP kalau lagi di halaman Links/Design */}
         {showMobilePreview && (
            <div className="lg:hidden fixed bottom-6 right-6 z-[80]">
               <button onClick={() => window.open(`/${profile?.username?.replace('@', '') || 'demo'}`, '_blank')} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  <Layout size={24} />
               </button>
            </div>
         )}
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider><LayoutContent>{children}</LayoutContent></AdminProvider>;
}