'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // หน่วงเวลา 2 วินาที แล้วเปิดไปยังหน้า /home
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 text-rose-900 transition-colors duration-300 relative overflow-hidden">
      
      {/* วงกลมแสงฟุ้งสีชมพูด้านหลัง */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* ไอคอนกล่องช้อปปิ้งการ์ตูนสีชมพู */}
      <div className="relative animate-bounce rounded-3xl bg-white/80 p-7 shadow-xl shadow-pink-200/50 backdrop-blur-md border border-pink-200">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-pink-500 drop-shadow"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        
        {/* ไอคอนดาววิ้งๆ มุมไอคอน */}
        <span className="absolute -top-1 -right-1 text-lg">✨</span>
      </div>

      {/* ข้อความชื่อเว็บ */}
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
        Campus Market
      </h1>
      <p className="mt-2 text-xs font-medium text-pink-500 bg-white/60 px-3 py-1 rounded-full border border-pink-200/60 shadow-sm backdrop-blur-sm">
        🌸 แหล่งรวมสินค้าสไตล์เด็กวิทยาลัย
      </p>

      {/* โหลดดิ้งจุดไข่ปลาสีชมพู */}
      <div className="mt-8 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse delay-150" />
      </div>

    </div>
  );
}