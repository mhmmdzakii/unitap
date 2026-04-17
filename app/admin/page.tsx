import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // Langsung alihkan pengunjung ke halaman Links saat membuka /admin
  redirect('/admin/links');
}