// context/AdminContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import CelebrationOverlay from '@/components/CelebrationOverlay';

// ==========================================
// 🎨 THEMES DATA
// ==========================================
export const THEMES_DATA: Record<string, any> = {
  custom: { id: 'custom', name: 'Custom', isPro: false, bgTheme: 'bg-gray-100', textTheme: 'text-gray-900', btnTheme: 'bg-white text-black shadow-sm', font: 'sans' },
  light: { id: 'light', name: 'Minimal Light', isPro: false, bgTheme: 'bg-white', textTheme: 'text-gray-900', btnTheme: 'bg-[#F6F7F5] text-black border border-gray-200', font: 'sans' },
  dark: { id: 'dark', name: 'Minimal Dark', isPro: false, bgTheme: 'bg-[#111111]', textTheme: 'text-white', btnTheme: 'bg-[#222222] text-white', font: 'mono' },
  ocean: { id: 'ocean', name: 'Ocean Blue', isPro: false, bgTheme: 'bg-gradient-to-b from-blue-50 to-blue-100', textTheme: 'text-blue-900', btnTheme: 'bg-white text-blue-900 shadow-sm', font: 'sans' },
  matcha: { id: 'matcha', name: 'Matcha Green', isPro: false, bgTheme: 'bg-[#E8F5E9]', textTheme: 'text-[#1B5E20]', btnTheme: 'bg-white text-[#2E7D32] shadow-sm', font: 'serif' },
  apa: { id: 'apa', name: 'Orange Ahay', isPro: false, bgTheme: 'bg-[#3E2F26]', textTheme: 'text-[#F5E6CA]', btnTheme: 'bg-[#E6D3A3] text-[#3E2F26] border-2 border-[#3E2F26] shadow-[4px_4px_0px_#3E2F26] rounded-xl', bgImage: '/apa.png', font: 'Courier Prime' },
  uni: { id: 'uni', name: 'uni 90s', bgTheme: 'bg-[#efe6d8]', textTheme: 'text-pink-500 drop-shadow-lg', btnTheme: 'bg-pink-500/80 hover:bg-pink-600 text-white border border-pink-300', bgImage: '/uni.gif', isPro: false },
  glass: { id: 'glass', name: 'Glassmorphism', isPro: true, bgTheme: 'bg-gradient-to-br from-purple-500 to-pink-500', textTheme: 'text-white drop-shadow-md', btnTheme: 'bg-white/20 border border-white/30 text-white backdrop-blur-md shadow-lg', bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600', font: 'sans' },
  cyber: { id: 'cyber', name: 'Cyberpunk', isPro: true, bgTheme: 'bg-black', textTheme: 'text-[#00ff9f] drop-shadow-[0_0_8px_rgba(0,255,159,0.8)]', btnTheme: 'bg-transparent border border-[#00ff9f] text-[#00ff9f] hover:bg-[#00ff9f] hover:text-black shadow-[0_0_10px_rgba(0,255,159,0.3)]', font: 'mono' },
  luxury: { id: 'luxury', name: 'Luxury Gold', isPro: true, bgTheme: 'bg-[#1a1a1a]', textTheme: 'text-[#D4AF37]', btnTheme: 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black shadow-lg font-extrabold', font: 'serif' },
  retro_cafe: { id: 'retro_cafe', name: 'Retro Cafe', isPro: true, bgTheme: 'bg-[#4A3B32]', textTheme: 'text-white drop-shadow-lg', btnTheme: 'bg-[#FDF6E3]/80 text-[#4A3B32] backdrop-blur-md border border-white/50 shadow-xl', bgImage: '/retro_cafe.png', font: 'Special Elite' }
};

const AdminContext = createContext<any>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<'pro' | 'premium' | null>(null);

  const [profile, setProfile] = useState({ 
    username: 'Loading...', bio: 'Link in bio',
    instagram: '', tiktok: '', twitter: '', x: '', facebook: '',
    plan_type: 'free', is_verified: false
  });
  
  const [links, setLinks] = useState<any[]>([]); 
  const [activeTheme, setActiveTheme] = useState('light');
  const [customBg, setCustomBg] = useState('');
  const [designConfig, setDesignConfig] = useState({
    fontFamily: 'sans', buttonShape: 'rounded', buttonStyle: 'fill', colorBg: '', colorBtn: '', colorText: ''
  });

  // 1. FETCH DATA AWAL
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!user || error) return router.push('/login');

        setUserId(user.id);
        let { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        if (pData) {
          setProfile({ 
            username: pData.username, bio: pData.bio || 'Link in bio',
            instagram: pData.instagram || '', tiktok: pData.tiktok || '', twitter: pData.twitter || '',
            x: pData.x || '', facebook: pData.facebook || '',
            plan_type: pData.plan_type || 'free', is_verified: pData.is_verified || false
          });
          setActiveTheme(pData.active_theme || 'light');
          setCustomBg(pData.custom_bg_url || '');
          setDesignConfig({
            fontFamily: pData.font_family || THEMES_DATA[pData.active_theme || 'light'].font || 'sans',
            buttonShape: pData.button_shape || 'rounded', buttonStyle: pData.button_style || 'fill',
            colorBg: pData.color_bg || '', colorBtn: pData.color_btn || '', colorText: pData.color_text || ''
          });
        }
        const { data: linksData } = await supabase.from('links').select('*').eq('user_id', user.id).order('id', { ascending: false });
        if (linksData) setLinks(linksData.map(l => ({ ...l, isActive: l.is_active })));
      } catch (err) { console.error("Error fetching data:", err); }
    };
    fetchUserData();
  }, [router]);

  // 2. RADAR CCTV REAL-TIME (Profiles Only)
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('realtime-profile')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, 
        (payload) => {
           const newPlan = payload.new.plan_type;
           setProfile(prev => {
              if (prev.plan_type !== newPlan && (newPlan === 'pro' || newPlan === 'premium')) {
                  setCelebration(newPlan); 
              }
              return { ...prev, plan_type: newPlan, is_verified: payload.new.is_verified };
           });
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // UTILITIES - 🔥 FULL LOGIC FIXED
  const updateThemeInDB = async (themeId: string, customBgUrl: string = '') => {
    const selectedTheme = THEMES_DATA[themeId];
    const newFont = selectedTheme?.font || 'sans';
    setActiveTheme(themeId);
    if (customBgUrl) setCustomBg(customBgUrl);
    setDesignConfig(prev => ({ ...prev, fontFamily: newFont }));
    if (userId) await supabase.from('profiles').update({ active_theme: themeId, custom_bg_url: customBgUrl || customBg, font_family: newFont }).eq('id', userId);
  };

  const updateDesignConfigDB = async (field: string, value: string) => {
    setDesignConfig(prev => ({ ...prev, [field]: value }));
    const dbField = field.replace(/([A-Z])/g, "_$1").toLowerCase();
    if (userId) await supabase.from('profiles').update({ [dbField]: value }).eq('id', userId);
  };

  const addNewLink = async (title: string, url: string, type: string) => {
    if (!userId) return;
    const { data, error } = await supabase.from('links').insert([{ user_id: userId, title, url, type, is_active: true }]).select().single();
    if (error) return console.error(error);
    if (data) setLinks(prev => [{ ...data, isActive: data.is_active }, ...prev]);
  };

  const updateLinkDB = async (id: number, field: string, value: any) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    const dbField = field === 'isActive' ? 'is_active' : field;
    await supabase.from('links').update({ [dbField]: value }).eq('id', id);
  };

  const deleteLinkDB = async (id: number) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    await supabase.from('links').delete().eq('id', id);
  };

  const setupTasks = [
    { id: 'link', label: 'Add your first link', completed: links.length > 0 },
    { id: 'bio', label: 'Write your bio', completed: profile.bio && profile.bio.trim() !== '' && profile.bio !== 'Link in bio' },
    { id: 'theme', label: 'Customize theme', completed: activeTheme !== 'light' || customBg !== '' }
  ];
  const setupProgress = Math.round((setupTasks.filter(t => t.completed).length / setupTasks.length) * 100);
  const currentThemeData = { ...THEMES_DATA[activeTheme], ...(activeTheme === 'custom' && customBg ? { bgImage: customBg } : {}) };

  return (
    <AdminContext.Provider value={{ 
      profile, setProfile, links, addNewLink, updateLinkDB, deleteLinkDB,
      activeTheme, setActiveTheme, customBg, THEMES_DATA, currentThemeData, updateThemeInDB,
      designConfig, updateDesignConfigDB, setupTasks, setupProgress
    }}>
      <AnimatePresence>
        {celebration && (
            <CelebrationOverlay celebration={celebration} onClose={() => setCelebration(null)} />
        )}
      </AnimatePresence>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);