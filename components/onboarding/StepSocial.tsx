// components/onboarding/StepSocial.tsx
"use client";
import { ArrowRight, ArrowLeft, Globe } from 'lucide-react';

const BrandIcons = {
  instagram: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  tiktok: () => <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>,
  x: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.051z"/></svg>,
  facebook: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
};

export default function StepSocial({ data, updateData, onNext, onBack }: any) {
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: <BrandIcons.instagram /> },
    { id: 'tiktok', name: 'TikTok', icon: <BrandIcons.tiktok /> },
    { id: 'x', name: 'X', icon: <BrandIcons.x /> },
    { id: 'facebook', name: 'Facebook', icon: <BrandIcons.facebook /> }
  ];

  const handleSmartInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
    updateData({ socialLink: val, socialPlatform: data.socialPlatform || 'instagram' });
  };

  const handleNext = () => {
    if (data.socialLink) updateData({ socialLink: `https://${data.socialLink}` });
    onNext();
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-500 relative">
      {/* 🦄 UNICORN GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#7949F6] to-[#d2e823] blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-2">Add your socials</h2>
        <p className="text-gray-500 font-medium text-[15px]">Help your audience find you on other platforms.</p>
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => updateData({ socialPlatform: p.id })}
              className={`p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all border-[2.5px] ${
                data.socialPlatform === p.id 
                ? 'border-[#7949F6] bg-white shadow-[0_10px_25px_rgba(121,73,246,0.1)] text-[#7949F6] scale-105' 
                : 'border-white bg-white text-gray-400 hover:border-gray-100 hover:text-gray-600 shadow-sm'
              }`}
            >
              <div className={data.socialPlatform === p.id ? 'animate-bounce-slow' : ''}>{p.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4 group">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#7949F6] transition-colors">Profile Link</label>
          <div className="flex overflow-hidden rounded-[22px] border-[2.5px] border-white bg-white shadow-sm focus-within:border-[#7949F6] focus-within:shadow-[0_0_25px_rgba(121,73,246,0.15)] transition-all">
            <span className="flex items-center pl-6 pr-1 text-gray-400 font-black select-none text-[15px]">
              https://
            </span>
            <input 
              type="text" 
              placeholder={`${data.socialPlatform || 'instagram'}.com/username`}
              className="flex-1 py-5 pr-6 bg-transparent outline-none font-black text-gray-900 text-[16px] placeholder:text-gray-300"
              value={data.socialLink?.replace(/^https?:\/\//i, '').replace(/^www\./i, '') || ''}
              onChange={handleSmartInput}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-12 relative z-10">
        <button onClick={onBack} className="w-16 h-16 flex items-center justify-center rounded-[20px] font-black bg-white border-2 border-gray-50 text-gray-400 shadow-sm hover:text-gray-900 transition-all"><ArrowLeft size={22} /></button>
        <button 
          onClick={handleNext} disabled={!data.socialLink}
          className={`flex-1 py-5 rounded-[20px] font-black shadow-xl transition-all flex items-center justify-center gap-2 ${data.socialLink ? 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          Next Step <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}