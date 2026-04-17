// app/onboarding/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin, AdminProvider } from '@/context/AdminContext';
import StepProfile from '@/components/onboarding/StepProfile';
import StepSocial from '@/components/onboarding/StepSocial';
import StepTheme from '@/components/onboarding/StepTheme';
import { supabase } from '@/lib/supabase'; 

function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setProfile, updateThemeInDB } = useAdmin(); 

  const [formData, setFormData] = useState({
    username: '', bio: '', socialPlatform: '', socialLink: '', theme: 'light' 
  });

  const updateData = (newData: Partial<typeof formData>) => setFormData({ ...formData, ...newData });

  const handleFinish = async () => {
    setLoading(true);
    
    // 1. Update Context (Biar UI langsung berubah tanpa nunggu lama)
    if (setProfile) {
      setProfile((prev: any) => ({
        ...prev,
        username: formData.username,
        bio: formData.bio,
        [formData.socialPlatform]: formData.socialLink 
      }));
    }
    if (updateThemeInDB) { updateThemeInDB(formData.theme); }

    // 2. SIMPAN KE SUPABASE (🔥 PAKAI UPSERT BIAR AKUN BARU NGGAK ERROR)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await supabase.from('profiles').upsert({
          id: session.user.id, // 🔥 Ini kunci utamanya!
          username: formData.username,
          bio: formData.bio,
          [formData.socialPlatform]: formData.socialLink, 
          active_theme: formData.theme
        });
      }
    } catch (error) {
      console.error("Gagal menyimpan data onboarding:", error);
    }

    // 3. Lempar ke Dashboard
    setTimeout(() => {
      router.push('/admin/links'); 
    }, 1500);
  };

  const getBgColor = () => {
    if (step === 1) return 'from-purple-50 via-white to-blue-50'; 
    if (step === 2) return 'from-orange-50 via-white to-pink-50'; 
    return 'from-emerald-50 via-white to-teal-50'; 
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBgColor()} transition-all duration-1000 flex flex-col font-sans`}>
      <header className="px-8 pt-8 pb-4 flex items-center justify-between">
         <div className="font-extrabold text-xl tracking-tight text-black flex items-center gap-2">
           <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-[12px] shadow-lg transform -rotate-6">U</div> 
           UnikLink<span className="text-[#7949F6]">.</span>
         </div>
         <div className="text-sm font-bold text-gray-500 bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-200/50 shadow-sm">Step {step} of 3</div>
      </header>

      <div className="w-full h-1 bg-gray-200/50">
        <div className="h-full bg-black transition-all duration-700 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-12 md:pt-20 p-6">
        <div className="w-full max-w-[540px] z-10">
          {step === 1 && <StepProfile data={formData} updateData={updateData} onNext={() => setStep(2)} />}
          {step === 2 && <StepSocial data={formData} updateData={updateData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepTheme data={formData} updateData={updateData} onFinish={handleFinish} onBack={() => setStep(2)} loading={loading} />}
        </div>
      </div>
      
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#7949F6]/5 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AdminProvider>
      <OnboardingWizard />
    </AdminProvider>
  );
}