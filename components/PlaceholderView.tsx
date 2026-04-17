// components/PlaceholderView.tsx
import { Hammer } from 'lucide-react';

export default function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200 shadow-inner">
        <Hammer size={32} className="text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{title}</h2>
      <p className="text-gray-500 max-w-md">
        Halaman pengaturan untuk <span className="font-semibold">{title}</span> sedang dalam tahap pengembangan. Nanti kamu bisa mengaturnya di sini!
      </p>
    </div>
  );
}