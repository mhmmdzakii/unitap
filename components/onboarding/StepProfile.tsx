// components/onboarding/StepProfile.tsx
import { ArrowRight, User, FileText, Sparkles } from 'lucide-react';

export default function StepProfile({ data, updateData, onNext }: any) {
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-500 relative overflow-visible">
      
      {/* 🦄 UNICORN GLOW BACKGROUND */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#7949F6] blur-[80px] opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d2e823] blur-[80px] opacity-20 pointer-events-none"></div>

      <div className="text-center mb-4 relative z-10">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#7949F6] to-[#d2e823]">
          Claim your space
        </h1>
        <p className="text-gray-500 font-medium text-[15px]">Let's set up your unique profile handle and bio.</p>
      </div>
      
      <div className="flex flex-col gap-5 relative z-10">
        <div className="group">
          <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-[#7949F6] transition-colors">
            <User size={12} /> Username
          </label>
          <div className="flex items-center bg-white border-[2.5px] border-gray-100 rounded-[22px] overflow-hidden focus-within:border-[#7949F6] focus-within:shadow-[0_0_25px_rgba(121,73,246,0.15)] transition-all">
            <span className="pl-6 pr-1 text-gray-400 font-black select-none">uniklink.ee/</span>
            <input 
              type="text" 
              value={data.username} 
              onChange={(e) => updateData({username: e.target.value.toLowerCase()})} 
              placeholder="yourname" 
              className="w-full py-5 pr-6 bg-transparent outline-none font-black text-gray-900 text-[17px]" 
              autoFocus
            />
          </div>
        </div>

        <div className="group">
          <label className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-[#7949F6] transition-colors">
            <FileText size={12} /> Short Bio
          </label>
          <textarea 
            value={data.bio} 
            onChange={(e) => updateData({bio: e.target.value})} 
            placeholder="Tell the world about yourself..." 
            rows={3} 
            className="w-full p-6 bg-white border-[2.5px] border-gray-100 focus:border-[#7949F6] focus:shadow-[0_0_25px_rgba(121,73,246,0.15)] rounded-[22px] outline-none font-bold text-gray-900 text-[15px] resize-none transition-all placeholder:text-gray-300"
          ></textarea>
        </div>
      </div>

      <button 
        onClick={onNext} 
        disabled={!data.username} 
        className={`w-full py-5 rounded-2xl font-black text-[16px] flex justify-center items-center gap-2 transition-all mt-4 relative z-10 ${
          data.username 
          ? 'bg-black text-white shadow-xl hover:scale-[1.03] hover:shadow-black/20' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue <ArrowRight size={18} />
      </button>
    </div>
  );
}