// components/AffiliateTracker.tsx
"use client";
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AffiliateTracker() {
  useEffect(() => {
    // Pastikan kode ini cuma jalan di sisi client (browser)
    if (typeof window !== 'undefined') {
      // 1. Cek apakah ada '?ref=nama_kode' di URL web lo
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      
      if (refCode) {
        // 2. Tanam Cookie Hantu (Local Storage) di HP pengunjung
        localStorage.setItem('unitap_ref', refCode);
        
        // 3. Tambahin angka 'Klik' si Affiliate di Database secara diam-diam
        const recordClick = async () => {
          const { data } = await supabase
            .from('affiliates')
            .select('id, clicks')
            .eq('ref_code', refCode)
            .single();
            
          if (data) {
            await supabase
              .from('affiliates')
              .update({ clicks: (data.clicks || 0) + 1 })
              .eq('id', data.id);
          }
        };
        
        recordClick();
      }
    }
  }, []);

  // Komponen siluman, nggak nampilin apa-apa di layar
  return null; 
}