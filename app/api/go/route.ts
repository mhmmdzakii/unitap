// app/api/go/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Pake koneksi supabase bawaan lo

export async function GET(request: Request) {
  // 1. Ambil ID link dari URL (Misal: ?id=46)
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Kalau aneh-aneh (gak ada ID), balikin ke halaman depan
  if (!id) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // 2. Cari URL asli produknya di database
    const { data: link, error } = await supabase
      .from('links')
      .select('url, clicks')
      .eq('id', id)
      .single();

    // Kalau linknya udah dihapus/gak ketemu
    if (error || !link || !link.url) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. 🔥 BONUS: Tambahin angka klik +1 buat halaman Analytics lo!
    const currentClicks = link.clicks || 0;
    await supabase.from('links').update({ clicks: currentClicks + 1 }).eq('id', id);

    // 4. TERBANGKAN USER KE SHOPEE/TOKPED! 🚀
    // Pake 301 Redirect biar loadingnya super ngebut
    return NextResponse.redirect(link.url, { status: 301 });

  } catch (err) {
    console.error("Error redirect:", err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}