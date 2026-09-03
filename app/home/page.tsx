'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // สลับ Dark / Light Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col gap-5 pb-20 pt-4 px-4 max-w-md mx-auto">
        
        {/* Header Bar: ปุ่ม Dark Mode & ตะกร้าสินค้า */}
        <div className="flex items-center justify-between gap-3">
          {/* ช่องค้นหา */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาหนังสือ, อุปกรณ์..." 
              className="w-full rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* ปุ่มสลับโหมดกลางวัน/กลางคืน */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="สลับโหมดกลางวัน/กลางคืน"
          >
            {isDarkMode ? (
              /* ไอคอนดวงอาทิตย์ */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              /* ไอคอนพระจันทร์ */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          {/* ปุ่มตะกร้าสินค้า */}
          <Link href="/cart" className="relative p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white shadow-md">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium">ส่งต่อของมือสอง</span>
          <h2 className="mt-2 text-xl font-bold">ตลาดนัดเด็กวิทยาลัย</h2>
          <p className="mt-1 text-xs opacity-90">ซื้อง่าย ขายคล่อง นัดรับได้ในรั้วสถาบัน</p>
        </div>

        {/* หมวดหมู่ */}
        <div>
          <h3 className="mb-2.5 text-sm font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
            หมวดหมู่ยอดนิยม
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['ตำราเรียน', 'ยูนิฟอร์ม', 'ไอที/อุปกรณ์', 'ของใช้หอ'].map((cat, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 hover:border-indigo-500 cursor-pointer transition-colors shadow-sm">
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* รายการสินค้า (พร้อมปุ่มเพิ่มสินค้าใหม่) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              สินค้าทั้งหมด
            </h3>
            <Link href="/product" className="text-xs text-indigo-500 font-medium hover:underline">ดูทั้งหมด</Link>
          </div>

          {/* พื้นที่สำหรับลงสินค้าใหม่ */}
          <div className="grid grid-cols-2 gap-3">
            {/* ปุ่มกดลงขายสินค้าใหม่ */}
            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50 h-44 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">เพิ่มสินค้าของคุณ</p>
              <p className="text-[10px] text-slate-400 mt-0.5">กดที่นี่เพื่อเพิ่มสินค้าลงขาย</p>
            </div>
          </div>
        </div>

        {/* วิธีการชำระเงิน */}
        <div className="mt-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">ช่องทางการชำระเงิน</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">QR</div>
              <div>
                <p className="font-semibold text-xs">PromptPay</p>
                <p className="text-[10px] text-slate-400">สแกนจ่ายทันที</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">💵</div>
              <div>
                <p className="font-semibold text-xs">เงินสด</p>
                <p className="text-[10px] text-slate-400">นัดรับในวิทยาลัย</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}