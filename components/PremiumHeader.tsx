// components/PremiumHeader.tsx
"use client";
import { Globe, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PremiumHeader({ 
  profileImage, 
  username, 
  customStyle 
}: { 
  profileImage: string | null, 
  username: string, 
  customStyle: any 
}) {
  
  const handleShare = async () => {
    // Otomatis ngikutin domain Vercel lo
    const link = `https://unitap-iota.vercel.app/${username.replace('@', '')}`;
    
    // Kalau dibuka di HP, bakal muncul popup Share bawaan HP (WA, IG, dll)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username} | UniTap`,
          text: `Cek profil UniTap gue nih!`,
          url: link
        });
      } catch (err) {
        console.log("Share dibatalkan");
      }
    } else {
      // Kalau dibuka di Laptop, otomatis nge-copy link
      navigator.clipboard.writeText(link);
      toast.success('Link profil disalin ke clipboard! 🚀');
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-2 mb-8 z-50">
      
      {/* KIRI: LOGIKA KEMUNGKINAN (FOTO vs ICON) */}
      <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
        {profileImage ? (
          <img src={profileImage} alt={username} className="w-full h-full object-cover shadow-sm border border-black/10" />
        ) : (
          <Globe size={22} className="opacity-80" style={customStyle} />
        )}
      </div>

      {/* TENGAH: NAMA USERNAME */}
      <span className="font-bold text-[15px] tracking-wide" style={customStyle}>
        {username}
      </span>

      {/* KANAN: TOMBOL MENU SHARE */}
      <button 
        onClick={handleShare} 
        className="w-8 h-8 flex items-center justify-end hover:scale-110 active:scale-95 transition-all opacity-80 hover:opacity-100" 
        style={customStyle}
      >
        <MoreVertical size={22} />
      </button>
      
    </div>
  );
}