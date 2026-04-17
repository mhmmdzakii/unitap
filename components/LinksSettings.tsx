// components/LinksSettings.tsx
"use client";
import { useState, useEffect } from 'react';
import { 
  Plus, Trash, Music, Video, ShoppingBag, Link2, X, BarChart2, GripVertical, Image as ImageIcon, Layout as LayoutIcon,
  Globe, Mail, MessageCircle, Camera, Gamepad2, Briefcase, Utensils, Plane, Coffee, Heart, Star, Book, Sparkles
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const AVAILABLE_ICONS = [
  { id: 'globe', icon: Globe }, { id: 'mail', icon: Mail }, { id: 'message', icon: MessageCircle },
  { id: 'camera', icon: Camera }, { id: 'gamepad', icon: Gamepad2 }, { id: 'briefcase', icon: Briefcase },
  { id: 'utensils', icon: Utensils }, { id: 'plane', icon: Plane }, { id: 'coffee', icon: Coffee },
  { id: 'heart', icon: Heart }, { id: 'star', icon: Star }, { id: 'book', icon: Book },
  { id: 'sparkles', icon: Sparkles }, { id: 'music', icon: Music }, { id: 'video', icon: Video },
  { id: 'shop', icon: ShoppingBag }, { id: 'link', icon: Link2 }
];

export default function LinksSettings() {
  const { links, addNewLink, updateLinkDB, deleteLinkDB } = useAdmin();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedType, setSelectedType] = useState('standard');
  const [expandedLinkId, setExpandedLinkId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'layout' | 'thumbnail'>('settings');

  const linkTypes = [
    { id: 'standard', icon: Link2, label: 'Standard' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'video', icon: Video, label: 'Video' },
    { id: 'store', icon: ShoppingBag, label: 'Store' },
  ];

  useEffect(() => {
    const url = newUrl.toLowerCase();
    if (url.includes('spotify.com') || url.includes('apple.com')) setSelectedType('music');
    else if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('tiktok.com')) setSelectedType('video');
    else if (url.includes('tokopedia') || url.includes('shopee')) setSelectedType('store');
    else setSelectedType('standard');
  }, [newUrl]);

  // LOGIKA BARU: Validasi HTTPS Otomatis
  const handleSaveNewLink = async () => {
    if (!newTitle || !newUrl) return;

    // Bersihkan spasi berlebih
    let formattedUrl = newUrl.trim();
    
    // Paksa menjadi HTTPS jika belum ada
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    } else if (formattedUrl.startsWith('http://')) {
      // Ubah http biasa menjadi https yang aman
      formattedUrl = formattedUrl.replace('http://', 'https://');
    }

    await addNewLink(newTitle, formattedUrl, selectedType);
    setNewTitle(''); setNewUrl(''); setSelectedType('standard'); setIsAdding(false);
  };

  const toggleExpand = (id: number, tab: 'settings' | 'layout' | 'thumbnail') => {
    if (expandedLinkId === id && activeTab === tab) setExpandedLinkId(null);
    else { setExpandedLinkId(id); setActiveTab(tab); }
  };

  return (
    <div className="p-8 max-w-[760px] mx-auto w-full animate-in fade-in duration-300 pb-32">
      
      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="w-full bg-[#7949F6] text-white py-4 rounded-full font-black text-[15px] flex items-center justify-center gap-2 mb-8 shadow-sm hover:bg-[#683cd4] transition-all">
          <Plus size={20} strokeWidth={3} /> Add New Link
        </button>
      )}

      {isAdding && (
        <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden mb-8 animate-in slide-in-from-top-4">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
             <h3 className="font-extrabold text-gray-900 text-[15px]">Add New Link</h3>
             <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={16} className="text-gray-500" /></button>
          </div>
          <div className="p-6">
            <div className="bg-gray-100/80 p-1.5 rounded-[16px] flex items-center mb-6">
               {linkTypes.map((t) => (
                 <button key={t.id} onClick={() => setSelectedType(t.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[13px] font-bold transition-all duration-300 ${selectedType === t.id ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                   <t.icon size={16} /> {t.label}
                 </button>
               ))}
            </div>
            <div className="flex flex-col gap-4 mb-6">
               <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="URL" className="w-full px-5 py-4 bg-[#F9FAFB] border border-gray-200 focus:border-black focus:bg-white rounded-2xl outline-none font-medium text-gray-900 text-[15px] transition-all" autoFocus/>
               <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" className="w-full px-5 py-4 bg-[#F9FAFB] border border-gray-200 focus:border-black focus:bg-white rounded-2xl outline-none font-bold text-gray-900 text-[15px] transition-all" />
            </div>
            <button onClick={handleSaveNewLink} disabled={!newTitle || !newUrl} className={`w-full py-4 rounded-full font-black text-[15px] transition-all ${newTitle && newUrl ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              Save Link
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {links.map((link: any) => {
          const typeIconMap: Record<string, any> = { music: Music, video: Video, store: ShoppingBag, standard: Link2 };
          const TypeIcon = typeIconMap[link.type || 'standard'];
          const isExpanded = expandedLinkId === link.id;
          const isStandard = link.type === 'standard' || !link.type;

          return (
            <div key={link.id} className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
              <div className="p-5 flex items-start gap-3 relative z-10 bg-white">
                <div className="mt-2 cursor-grab text-gray-300 hover:text-gray-500"><GripVertical size={20} /></div>
                <div className="flex-1 flex flex-col gap-1.5">
                   <input type="text" value={link.title} onChange={(e) => updateLinkDB(link.id, 'title', e.target.value)} placeholder="Title" className="font-black text-[16px] text-gray-900 outline-none w-full bg-transparent"/>
                   <input type="text" value={link.url} onChange={(e) => updateLinkDB(link.id, 'url', e.target.value)} placeholder="URL" className="text-[13px] text-gray-500 font-medium outline-none w-full bg-transparent"/>
                </div>
                <div onClick={() => updateLinkDB(link.id, 'isActive', !link.isActive)} className={`w-12 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 flex-shrink-0 ${link.isActive ? 'bg-[#39E09B]' : 'bg-gray-200'}`}>
                   <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${link.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="px-5 pb-4 flex items-center justify-between bg-white relative z-10 border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100"><TypeIcon size={14} /></div>
                   
                   {!isStandard && (
                     <button onClick={() => toggleExpand(link.id, 'layout')} className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors ${isExpanded && activeTab === 'layout' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 bg-gray-50'}`}>
                        <LayoutIcon size={14}/> Layout
                     </button>
                   )}
                   
                   {isStandard && (
                     <button onClick={() => toggleExpand(link.id, 'thumbnail')} className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors ${isExpanded && activeTab === 'thumbnail' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 bg-gray-50'}`}>
                        <ImageIcon size={14}/> Thumbnail
                     </button>
                   )}
                </div>
                <button onClick={() => deleteLinkDB(link.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash size={18} /></button>
              </div>

              {/* LACI LAYOUT (Music, Video, Store) DENGAN OPSI MINIMAL */}
              {isExpanded && activeTab === 'layout' && !isStandard && (
                <div className="border-t border-gray-100 bg-white p-6 animate-in slide-in-from-top-2">
                   <h4 className="font-bold text-gray-900 text-[14px] mb-4">Choose a layout</h4>
                   <div className="flex flex-col gap-4">
                     
                     <div onClick={() => updateLinkDB(link.id, 'layout', 'classic')} className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col gap-4 ${link.layout === 'classic' || !link.layout ? 'border-black bg-white' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${link.layout === 'classic' || !link.layout ? 'border-black' : 'border-gray-300'}`}>
                               {(link.layout === 'classic' || !link.layout) && <div className="w-3 h-3 bg-black rounded-full"></div>}
                            </div>
                            <div>
                               <p className="font-bold text-[15px] text-gray-900">Classic</p>
                               <p className="text-[13px] text-gray-500 font-medium">Efficient and compact.</p>
                            </div>
                        </div>
                     </div>
                     
                     <div onClick={() => updateLinkDB(link.id, 'layout', 'featured')} className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col gap-4 ${link.layout === 'featured' ? 'border-black bg-white' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${link.layout === 'featured' ? 'border-black' : 'border-gray-300'}`}>
                               {link.layout === 'featured' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                            </div>
                            <div>
                               <p className="font-bold text-[15px] text-gray-900">Featured (iOS Style)</p>
                               <p className="text-[13px] text-gray-500 font-medium">Large, attractive media display.</p>
                            </div>
                        </div>
                     </div>

                     {/* TAMBAHAN BARU: MINIMAL (ICON ONLY) */}
                     <div onClick={() => updateLinkDB(link.id, 'layout', 'minimal')} className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col gap-4 ${link.layout === 'minimal' ? 'border-black bg-white' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${link.layout === 'minimal' ? 'border-black' : 'border-gray-300'}`}>
                               {link.layout === 'minimal' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                            </div>
                            <div>
                               <p className="font-bold text-[15px] text-gray-900">Minimal (Icon Only)</p>
                               <p className="text-[13px] text-gray-500 font-medium">Simple text and icon, no album image.</p>
                            </div>
                        </div>
                     </div>

                   </div>
                </div>
              )}

              {/* LACI THUMBNAIL (Standard Only) */}
              {isExpanded && activeTab === 'thumbnail' && isStandard && (
                <div className="border-t border-gray-100 bg-white p-6 animate-in slide-in-from-top-2">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-900 text-[14px]">Choose an Icon</h4>
                      {link.custom_icon && (
                        <button onClick={() => updateLinkDB(link.id, 'custom_icon', null)} className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                      )}
                   </div>
                   <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                     {AVAILABLE_ICONS.map((item) => (
                       <button 
                         key={item.id} 
                         onClick={() => updateLinkDB(link.id, 'custom_icon', item.id)}
                         className={`aspect-square rounded-xl flex items-center justify-center transition-all ${link.custom_icon === item.id ? 'bg-gray-900 text-white shadow-md scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'}`}
                       >
                         <item.icon size={20} strokeWidth={1.5} />
                       </button>
                     ))}
                   </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}