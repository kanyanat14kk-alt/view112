'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // หน่วงเวลา 2 วินาทีแล้วพาไปยังหน้า /home
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="animate-bounce rounded-full bg-primary/10 p-6">
        <ShoppingBag className="h-16 w-16 text-primary" />
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Campus Market</h1>
      <p className="mt-1 text-sm text-muted-foreground">แหล่งรวมสินค้าสไตล์เด็กวิทยาลัย</p>
    </div>
  );
}