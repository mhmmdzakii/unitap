// app/admin/qrcode/page.tsx
"use client";
import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Download, Copy, Check, QrCode as QrIcon, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QrCodePage() {
  const { profile } = useAdmin();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Ambil username dan bikin URL asli
  const username = profile?.username?.replace('@', '').toLowerCase() || 'username';
  const profileUrl = `https://unitap-iota.vercel.app/${username}`;
  
  // API Pintar untuk generate QR Code Real-Time tanpa install library tambahan
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(profileUrl)}&margin=20`;

  // Fungsi Copy Link
  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success('Tautan berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Fungsi Download QR Code
  const handleDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading('Menyiapkan QR Code...');
    
    try {
      // Ambil gambar dari API
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      
      // Bikin link download rahasia
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `UniTap-QR-${username}.png`;
      
      // Klik otomatis untuk download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('QR Code berhasil diunduh! 🎉', { id: toastId });
    } catch (error) {
      // Kalau kena blokir browser, buka di tab baru sebagai alternatif
      window.open(qrImageUrl, '_blank');
      toast.success('QR Code dibuka. Silakan klik kanan dan Save Image.', { id: toastId });
    }
    
    setIsDownloading(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-[#d2e823] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_30px_rgba(210,232,35,0.4)] transform rotate-3">
          <QrIcon size={40} className="text-[#254f1a]" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-3">
          QR Code Profil Anda
        </h1>
        <p className="text-gray-500 font-bold text-sm max-w-md mx-auto">
          Bagikan profil Anda ke dunia nyata. Unduh QR code ini dan cetak di kartu nama, poster, atau meja kasir Anda.
        </p>
      </div>

      <div className="bg-white max-w-sm mx-auto rounded-[3rem] p-8 shadow-2xl border border-gray-100 relative overflow-hidden group">
        {/* Glow Halus di Belakang */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#7949F6] blur-[80px] opacity-10 pointer-events-none"></div>

        {/* BINGKAI POLAROID QR CODE */}
        <div className="bg-[#F6F7F5] p-5 rounded-[2rem] border-2 border-gray-100 mb-8 relative z-10 shadow-inner group-hover:border-[#d2e823] transition-colors duration-500">
          <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden shadow-sm flex items-center justify-center relative p-2">
            {/* Gambar QR Code Real */}
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-full h-full object-contain mix-blend-multiply"
              crossOrigin="anonymous"
            />
            {/* Logo Tengah (Opsional, ilusi optik) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-gray-100">
              <span className="font-black text-[#7949F6] text-lg">U</span>
            </div>
          </div>
          <div className="text-center mt-5">
            <p className="font-black text-gray-900 tracking-tight text-lg">@{username}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Scan to connect</p>
          </div>
        </div>

        {/* TOMBOL AKSI */}
        <div className="space-y-3 relative z-10">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 bg-black text-white rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl"
          >
            {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            Unduh QR Code
          </button>
          
          <button 
            onClick={handleCopy}
            className="w-full py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-200 transition-all"
          >
            {copied ? <Check size={20} className="text-[#39E09B]" /> : <Copy size={20} className="text-gray-400" />}
            {copied ? 'Tersalin!' : 'Salin Tautan Profil'}
          </button>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <a href={profileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7949F6] hover:underline">
          Buka profil di tab baru <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}