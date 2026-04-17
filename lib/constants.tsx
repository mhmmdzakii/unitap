// lib/constants.tsx
import { 
  Globe, Mail, MessageCircle, Camera, Gamepad2, Briefcase, 
  Utensils, Plane, Coffee, Heart, Star, Book, Sparkles,
  Music, Video, ShoppingBag, Link2
} from 'lucide-react';

export const THEMES_DATA: Record<string, any> = {
  custom: { id: 'custom', name: 'Custom', bgTheme: 'bg-gray-100', textTheme: 'text-gray-900', btnTheme: 'bg-white text-black shadow-sm' },
  light: { id: 'light', name: 'Minimal Light', bgTheme: 'bg-white', textTheme: 'text-gray-900', btnTheme: 'bg-[#F6F7F5] text-black border border-gray-200 hover:bg-gray-100' },
  dark: { id: 'dark', name: 'Minimal Dark', bgTheme: 'bg-[#111111]', textTheme: 'text-white', btnTheme: 'bg-[#222222] text-white hover:bg-[#333333]' },
  ocean: { id: 'ocean', name: 'Ocean Blue', bgTheme: 'bg-gradient-to-b from-blue-50 to-blue-100', textTheme: 'text-blue-900', btnTheme: 'bg-white text-blue-900 shadow-sm hover:shadow-md' },
  matcha: { id: 'matcha', name: 'Matcha Green', bgTheme: 'bg-[#E8F5E9]', textTheme: 'text-[#1B5E20]', btnTheme: 'bg-white text-[#2E7D32] shadow-sm hover:shadow-md' },
  glass: { id: 'glass', name: 'Glassmorphism', bgTheme: 'bg-gradient-to-br from-purple-500 to-pink-500', textTheme: 'text-white drop-shadow-md', btnTheme: 'bg-white/20 border border-white/30 text-white backdrop-blur-md shadow-lg hover:bg-white/30' },
  cyber: { id: 'cyber', name: 'Cyberpunk', bgTheme: 'bg-black', textTheme: 'text-[#00ff9f] drop-shadow-[0_0_8px_rgba(0,255,159,0.8)]', btnTheme: 'bg-transparent border border-[#00ff9f] text-[#00ff9f] shadow-[0_0_10px_rgba(0,255,159,0.3)] hover:bg-[#00ff9f] hover:text-black' },
  luxury: { id: 'luxury', name: 'Luxury Gold', bgTheme: 'bg-[#1a1a1a]', textTheme: 'text-[#D4AF37]', btnTheme: 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black shadow-lg font-extrabold hover:scale-[1.02]' },
  retro_cafe: { id: 'retro_cafe', name: 'Retro Cafe', bgTheme: 'bg-[#4A3B32]', textTheme: 'text-white drop-shadow-lg', btnTheme: 'bg-[#FDF6E3]/80 text-[#4A3B32] backdrop-blur-md border border-white/50 shadow-xl hover:bg-[#FDF6E3]' },
  apa: { id: 'apa', name: 'Orange Ahay', bgTheme: 'bg-[#3E2F26]', bgImage: '/apa.png', textTheme: 'text-[#F5E6CA]', btnTheme: 'bg-[#E6D3A3] text-[#3E2F26] border-2 border-[#3E2F26] shadow-[4px_4px_0px_#3E2F26] rounded-xl hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#3E2F26]' },
  uni: { id: 'uni', name: 'uni 90s', bgTheme: 'bg-[#efe6d8]',  bgImage: '/uni.gif', textTheme: 'text-pink-500 drop-shadow-lg', btnTheme: 'bg-pink-500/80 hover:bg-pink-600 text-white border border-pink-300' },
  vintage_diary: { 
    id: 'vintage_diary', 
    name: 'Vintage Diary', 
    bgTheme: 'bg-[#F4F1EA]', 
    bgImage: '/retro_cafe.png', // 🔥 INI DIA KUNCI MASUKIN FOTONYA!
    textTheme: 'text-white drop-shadow-md', // Teks gue ganti putih + shadow biar kebaca di atas foto
    btnTheme: 'bg-[#F4F1EA]/80 backdrop-blur-md border-[1.5px] border-[#3C352D] text-[#3C352D] shadow-[4px_4px_0px_rgba(0,0,0,0.5)] rounded-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_rgba(0,0,0,0.5)] transition-all', 
    font: 'Courier Prime' 
  }
};

export const ICON_MAP: Record<string, any> = {
  globe: Globe, mail: Mail, message: MessageCircle, camera: Camera, gamepad: Gamepad2,
  briefcase: Briefcase, utensils: Utensils, plane: Plane, coffee: Coffee, heart: Heart,
  star: Star, book: Book, sparkles: Sparkles, music: Music, video: Video, shop: ShoppingBag, link: Link2
};

export const BrandIcons = {
  spotify: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 9.3C15.24 7.02 8.88 6.84 5.16 7.98c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.539.3.719 1.02.419 1.56-.299.48-1.02.659-1.559.24z"/></svg>,
  youtube: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  tiktok: () => <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>,
  instagram: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  x: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.051z"/></svg>,
  facebook: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
};