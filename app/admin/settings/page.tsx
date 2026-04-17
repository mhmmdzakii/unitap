// app/admin/settings/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { LogOut, User, Mail, ShieldAlert, KeyRound, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { profile } = useAdmin();
  
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!'); 
      return;
    }
    
    setIsUpdatingPass(true);
    const toastId = toast.loading('Updating password...'); 
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Password updated successfully! ✨', { id: toastId }); 
      setNewPassword(''); 
    }
    setIsUpdatingPass(false);
  };

  const handleLogout = async () => {
    toast.loading('Logging out...', { duration: 1000 });
    await supabase.auth.signOut();
    setTimeout(() => router.push('/login'), 1000);
  };

  const confirmDeleteAccount = async () => {
    setShowDeleteModal(false); 
    setIsDeleting(true);
    const toastId = toast.loading('Initiating account destruction...'); 
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      try {
        const res = await fetch('/api/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id })
        });

        if (!res.ok) throw new Error("Gagal menghapus akun di server");

        await supabase.auth.signOut();
        toast.success('Account permanently wiped out! 👋', { id: toastId });
        router.push('/login');
        
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete account. Please try again.', { id: toastId });
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="max-w-3xl w-full mx-auto pb-20 animate-in fade-in duration-700 p-6 lg:p-10 relative">
        
        {/* 🦄 UNICORN GLOW BACKGROUND */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7949F6] blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-3">
            Settings <Sparkles size={24} className="text-[#7949F6]" />
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">Manage your UniTap preferences and security.</p>
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          
          {/* Section 1: Account Details */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-black text-gray-900 mb-6 flex items-center gap-2 text-xl"><User size={20} className="text-[#7949F6]" /> Account Details</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                <div className="w-full bg-[#F6F7F5] px-5 py-4 rounded-2xl border border-transparent font-bold text-gray-900">
                  unitap.bio/<span className="text-[#7949F6]">{profile?.username}</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 font-bold text-gray-400 flex items-center gap-2 cursor-not-allowed">
                  <Mail size={16} /> Connected securely to your session
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Security (Ganti Password) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <h2 className="font-black text-gray-900 mb-6 flex items-center gap-2 text-xl"><KeyRound size={20} className="text-[#d2e823]" /> Security</h2>
            <div className="flex flex-col gap-3">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-[#7949F6] transition-colors">Change Password</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password" 
                  className="flex-1 bg-[#F6F7F5] px-5 py-4 rounded-2xl border-2 border-transparent focus:border-[#7949F6] focus:bg-white focus:shadow-[0_0_20px_rgba(121,73,246,0.1)] outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
                />
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPass || !newPassword}
                  className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center min-w-[140px] shadow-sm ${
                    newPassword 
                    ? 'bg-gradient-to-r from-[#7949F6] to-[#d2e823] text-white hover:scale-[1.02] hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUpdatingPass ? <Loader2 size={18} className="animate-spin" /> : 'Update Key'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Danger Zone */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-red-50 shadow-sm mt-4 relative overflow-hidden">
            {/* Glow Merah Halus */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500 blur-[80px] opacity-10 pointer-events-none"></div>
            
            <h2 className="font-black text-red-500 mb-6 flex items-center gap-2 text-xl relative z-10"><ShieldAlert size={20} /> Danger Zone</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 border border-red-100 rounded-[24px] bg-red-50/30 relative z-10">
              <div>
                <p className="font-black text-gray-900 text-lg">Delete Account</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Permanently remove your account and all data.</p>
              </div>
              <button 
                onClick={() => setShowDeleteModal(true)} 
                disabled={isDeleting}
                className="px-6 py-4 bg-white text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 text-sm font-black rounded-2xl transition-all w-full sm:w-auto flex items-center justify-center gap-2 min-w-[160px] shadow-sm"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete Account'}
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full mt-6 px-6 py-4 bg-gray-50 text-gray-500 hover:text-gray-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors relative z-10"
            >
              <LogOut size={18} /> Log Out from Device
            </button>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 🔥 CUSTOM MODAL UNTUK KONFIRMASI DELETE (DARK MODE DRAMATIS) */}
      {/* ========================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-[#111111] rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-red-500/20 relative overflow-hidden">
            {/* Glow Merah di Modal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600 blur-[80px] opacity-20 pointer-events-none"></div>

            <div className="w-16 h-16 rounded-[1.2rem] bg-red-500/10 flex items-center justify-center text-red-500 mb-6 mx-auto relative z-10 border border-red-500/20">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-white mb-3 relative z-10">Delete Account?</h3>
            <p className="text-center text-gray-400 text-[14px] font-medium leading-relaxed mb-8 relative z-10 px-2">
              This action is permanent. All your links, themes, and data will be <strong className="text-red-400">destroyed</strong>.
            </p>
            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-4 bg-white/5 text-gray-300 font-black rounded-2xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteAccount}
                className="flex-1 px-4 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}