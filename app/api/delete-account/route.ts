// app/api/delete-account/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
    }

    // 🔥 Panggil Kunci Master dari .env.local
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // 1. Bersihkan Ruang Tamu (Database)
    await supabaseAdmin.from('links').delete().eq('user_id', userId);
    await supabaseAdmin.from('profiles').delete().eq('id', userId);

    // 2. BOM NUKLIR: Musnahkan dari Brankas (Auth)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Account wiped completely." });
    
  } catch (error: any) {
    console.error("API Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}