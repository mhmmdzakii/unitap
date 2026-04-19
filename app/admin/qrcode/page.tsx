// app/admin/qrcode/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QrCode, Download, Copy, Share2, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRCodePage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single();
        if (data && data.username) {
          setUsername(data.username);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INI YANG DIGANTI! KITA KUNCI MATI PAKE DOMAIN VERCEL LO!
  const profileLink = username ? `https://unitap-iota.vercel.app/${username.replace('@', '')}` : '';
  
  const qrUrl = profileLink 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(profileLink)}` 
    : '';

  const handleCopy = () => {
    if (!profileLink) return;
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    toast.success('Link profil berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    const toastId = toast.loading('Sedang menyiapkan file QR Code...');
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-UniTap-${username}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('QR Code berhasil diunduh!', { id: toastId });
    } catch (error) {
      toast.error('Gagal mengunduh gambar.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F7F5] gap-3">
        <Loader2 className="animate-spin text-[#7949F6]" size={40} />
        <p className="font-bold text-gray-400">Menyiapkan QR Code Anda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F5] p-6 lg:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
            <QrCode className="text-[#7949F6]" size={32} /> QR Code & Share
          </h1>
          <p className="text-gray-500 font-medium mt-1">Satu QR Code untuk semua link sosial media Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BOX QR CODE */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-56 h-56 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-6 overflow-hidden p-3 relative">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code Profil" className="w-full h-full object-contain rounded-2xl" crossOrigin="anonymous" />
              ) : (
                <div className="text-gray-300 flex flex-col items-center gap-2">
                  <QrCode size={48} />
                  <span className="text-[10px] font-bold">Username Belum Set</span>
                </div>
              )}
            </div>
            <h3 className="font-black text-xl mb-1">Scan Me!</h3>
            <p className="text-xs text-gray-400 mb-8 font-bold uppercase tracking-widest">@{username || 'unknown'}</p>
            
            <button 
              onClick={handleDownload} 
              disabled={!qrUrl}
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <Download size={18} /> Download PNG
            </button>
          </div>

          {/* BOX SHARE LINK */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="w-14 h-14 bg-[#7949F6]/10 rounded-2xl flex items-center justify-center text-[#7949F6] mb-6">
              <Share2 size={28} />
            </div>
            <h3 className="font-black text-xl mb-2">Salin Link Profil</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Gunakan link ini di bio Instagram, TikTok, atau kirim langsung lewat chat.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 flex items-center justify-between gap-3 overflow-hidden">
              <span className="text-xs font-bold text-gray-900 truncate flex-1">{profileLink || 'Menunggu data...'}</span>
              <button 
                onClick={handleCopy} 
                className="p-3 bg-white text-gray-900 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all shrink-0"
              >
                {copied ? <Check size={18} className="text-[#39E09B]" /> : <Copy size={18} />}
              </button>
            </div>
            
            <div className="text-[11px] font-bold text-gray-400 border-l-4 border-[#7949F6] pl-4 italic">
              Link ini sudah terhubung permanen ke server Vercel. QR Code yang Anda bagikan akan langsung menuju ke website publik Anda.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}