// context/AdminContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import { THEMES_DATA } from '@/lib/constants'; // 🔥 INI IMPORT DARI GUDANG

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
            fontFamily: pData.font_family || THEMES_DATA[pData.active_theme || 'light']?.font || 'sans',
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