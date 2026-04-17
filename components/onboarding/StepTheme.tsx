// components/onboarding/StepTheme.tsx
"use client";
import { Sparkles, ArrowLeft, Crown, Lock } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import toast from 'react-hot-toast';


export default function StepTheme({ data, updateData, onFinish, onBack, loading }: any) {
  const { THEMES_DATA } = useAdmin();
  const availableThemes = Object.values(THEMES_DATA).filter((t: any) => t.id !== 'custom');

  const handleSelectTheme = (theme: any) => {
    // 🔥 GEMBOK NYA DISINI!
    if (theme.isPro) {
      toast.error("Unlock Pro themes in your dashboard later! 🦄", {
        icon: '🔒',
        style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '14px', fontWeight: 'bold' }
      });
      return; 
    }
    
    // Kalau gratis, baru boleh update
    updateData({ theme: theme.id });
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-500">
      
      {/* 🔥 BAGIAN JUDUL DENGAN GLOW UNICORN 🔥 */}
      <div className="text-center mb-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-[#7949F6] to-[#d2e823] blur-[50px] opacity-20 pointer-events-none"></div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#7949F6] to-[#d2e823] drop-shadow-sm">
          Pick your vibe
        </h1>
        <p className="text-gray-500 font-medium text-[15px] relative z-10">Start with a free theme. You can unlock premium designs later.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto p-4 custom-scrollbar">
          {availableThemes.map((theme: any) => {
            const isActive = data.theme === theme.id;
            const isLocked = theme.isPro; 
            
            const dynamicStyle: any = {};
            if (theme.bgImage) {
               dynamicStyle.backgroundImage = `url(${theme.bgImage})`;
               dynamicStyle.backgroundSize = 'cover';
               dynamicStyle.backgroundPosition = 'center';
            }

            return (
              <div key={theme.id} onClick={() => handleSelectTheme(theme)} className={`transition-all duration-300 flex flex-col gap-3 group ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
                 <div 
                    className={`w-full aspect-[9/16] rounded-[24px] border-[3px] p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isActive ? 'border-transparent ring-4 ring-[#7949F6] ring-offset-2 scale-105 shadow-[0_10px_30px_rgba(121,73,246,0.3)]' : 'border-gray-200 shadow-sm hover:border-[#d2e823]'} ${theme.bgTheme}`}
                    style={dynamicStyle}
                 >
                    {/* Badge PRO untuk Onboarding */}
                    {isLocked && <div className="absolute top-2 right-2 bg-black text-[#d2e823] text-[9px] font-black px-2 py-1 rounded-full z-20 flex items-center gap-1 shadow-md"><Crown size={10}/> PRO</div>}
                    
                    <span className={`font-black text-xl ${theme.textTheme} relative z-10`}>Aa</span>
                    <div className={`w-full h-8 rounded-[10px] ${theme.btnTheme} opacity-90 shadow-sm relative z-10`}></div>

                    {/* Overlay Gembok Hitam kalau Pro */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Lock size={16} className="text-gray-800" />
                        </div>
                      </div>
                    )}
                 </div>
                 <span className={`text-center font-black text-[12px] ${isActive ? 'text-[#7949F6]' : 'text-gray-600'}`}>
                   {theme.name}
                 </span>
              </div>
            );
          })}
      </div>
      
      {/* Tombol Navigasi di bawah - LIME YELLOW UNICORN STYLE */}
      <div className="flex gap-3 mt-2 pt-4 border-t border-gray-100">
          <button onClick={onBack} disabled={loading} className="w-16 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex-shrink-0 shadow-sm"><ArrowLeft size={20} /></button>
          <button onClick={onFinish} disabled={loading} className="flex-1 py-4 rounded-2xl font-black text-[16px] bg-[#d2e823] text-[#254f1a] shadow-[0_8px_30px_rgba(210,232,35,0.4)] hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
            {loading ? 'Finalizing...' : <><Sparkles size={18} /> Finish Setup</>}
          </button>
      </div>
    </div>
  );
}