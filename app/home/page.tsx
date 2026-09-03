'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State สำหรับ Modal ชำระเงิน
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cash'>('promptpay');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // ดึงข้อมูลสินค้า และ โหมดสี จาก localStorage
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);

    const savedProducts = localStorage.getItem('my_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // ฟังก์ชันสลับโหมด กลางวัน / กลางคืน
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextState = !prev;
      localStorage.setItem('theme', nextState ? 'dark' : 'light');
      return nextState;
    });
  };

  // ฟังก์ชันอัปโหลดสลิป
  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าเข้าตะกร้า
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // ฟังก์ชันปรับจำนวนในตะกร้า
  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // ฟังก์ชันกดยืนยันสั่งซื้อ
  const handleConfirmPayment = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setCart([]);
      setSlipImage(null);
    }, 2000);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-pink-50/50 text-slate-800'}`}>
      <div className="flex flex-col gap-5 pb-20 pt-4 px-4 max-w-md mx-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 relative z-20">
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-fuchsia-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาหนังสือ, อุปกรณ์..." 
              className={`w-full rounded-full border py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-fuchsia-400 shadow-sm transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-pink-200 text-slate-800'
              }`}
            />
          </div>

          {/* ปุ่มไปหน้า Admin */}
          <Link
            href="/admin"
            className={`px-3 py-2 rounded-full border text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-pink-300' : 'bg-white border-pink-200 text-fuchsia-600'
            }`}
          >
            ⚙️ แอดมิน
          </Link>

          {/* ปุ่มสลับโหมด กลางวัน / กลางคืน */}
          <button 
            type="button"
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-full border shadow-md hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer select-none ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-200'
            }`}
          >
            {mounted && isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 pointer-events-none"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-600 pointer-events-none"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          {/* ปุ่มเปิดตะกร้าสินค้า */}
          <button 
            type="button"
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-full border shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-fuchsia-400' : 'bg-white border-pink-200 text-fuchsia-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 p-5 text-white shadow-md">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm">🌸 ส่งต่อของมือสอง</span>
          <h2 className="mt-2 text-xl font-bold">ตลาดนัดเด็กวิทยาลัย</h2>
          <p className="mt-1 text-xs opacity-90">ซื้อง่าย ขายคล่อง นัดรับได้ในรั้วสถาบัน</p>
        </div>

        {/* หมวดหมู่ */}
        <div>
          <h3 className={`mb-2.5 text-sm font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-pink-200' : 'text-fuchsia-900'}`}>
            หมวดหมู่ยอดนิยม
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['ตำราเรียน', 'ยูนิฟอร์ม', 'ไอที/อุปกรณ์', 'ของใช้หอ'].map((cat, i) => (
              <div 
                key={i} 
                className={`rounded-xl border p-2.5 cursor-pointer transition-colors shadow-sm font-medium ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 hover:border-fuchsia-400 text-slate-200' 
                    : 'bg-white border-pink-200/80 hover:border-fuchsia-400 hover:text-fuchsia-600'
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* สินค้าทั้งหมด */}
        <div>
          <h3 className={`mb-3 text-sm font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-pink-200' : 'text-fuchsia-900'}`}>
            🛍️ สินค้าทั้งหมด ({products.length})
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {products.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-pink-200 dark:border-slate-700">
                <p className="text-xs opacity-60">ยังไม่มีสินค้าในร้าน</p>
                <Link href="/admin" className="text-xs text-fuchsia-500 font-bold underline mt-1 block">
                  + เพิ่มสินค้าที่หน้าแอดมิน
                </Link>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className={`relative rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-200/80'}`}>
                  <div>
                    <div className={`h-32 overflow-hidden relative ${isDarkMode ? 'bg-slate-700' : 'bg-pink-50'}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-pink-300' : 'bg-pink-100 text-fuchsia-700'}`}>
                        {product.category}
                      </span>
                      <p className="text-xs font-semibold truncate mt-1.5">{product.name}</p>
                      <p className="text-sm font-bold text-fuchsia-500 mt-1">฿{product.price}</p>
                    </div>
                  </div>

                  <div className="p-2 pt-0">
                    <button 
                      type="button"
                      onClick={() => addToCart(product)} 
                      className={`w-full py-1.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                        isDarkMode ? 'bg-slate-700 text-pink-300 hover:bg-slate-600' : 'bg-pink-100/70 text-fuchsia-700 hover:bg-pink-200/70'
                      }`}
                    >
                      + ใส่ตะกร้า
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* หน้าต่างตะกร้าสินค้า (Cart Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className={`w-full max-w-md h-full p-5 flex flex-col justify-between shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-pink-100/20">
                <h3 className="text-base font-bold flex items-center gap-2">
                  🛒 ตะกร้าสินค้าของคุณ ({totalItems})
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full opacity-60 hover:opacity-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-10 opacity-50 text-xs">
                    🛒 ตะกร้าของคุณยังว่างอยู่
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-pink-50/50 border-pink-100'}`}>
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-semibold truncate max-w-[120px]">{item.name}</p>
                          <p className="text-xs text-fuchsia-500 font-bold">฿{item.price}</p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-pink-200'}`}>
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} className="text-fuchsia-500 font-bold px-1 cursor-pointer">-</button>
                        <span className="font-semibold text-xs">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} className="text-fuchsia-500 font-bold px-1 cursor-pointer">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-pink-100/20 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>ราคารวมทั้งหมด:</span>
                <span className="text-lg text-fuchsia-500">฿{totalPrice}</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                disabled={cart.length === 0}
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal หน้าต่างชำระเงิน */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-5 shadow-2xl border relative ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-pink-100 text-slate-800'}`}>
            {isSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-base font-bold">ทำรายการสำเร็จ!</h3>
                <p className="text-xs opacity-70">ขอบคุณที่ใช้บริการตลาดนัดเด็กวิทยาลัย</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-pink-100/20">
                  <h3 className="text-sm font-bold">ชำระเงิน (ยอดรวม ฿{totalPrice})</h3>
                  <button type="button" onClick={() => setIsCheckoutOpen(false)} className="opacity-60 hover:opacity-100 text-sm cursor-pointer">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-2 my-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'promptpay'
                        ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500'
                        : 'border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <span className="text-base">📱</span>
                    PromptPay (สแกน QR)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500'
                        : 'border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <span className="text-base">💵</span>
                    เงินสด (นัดรับ)
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border text-center space-y-3 ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-pink-50/50 border-pink-100'}`}>
                  {paymentMethod === 'promptpay' ? (
                    <div>
                      <p className="text-[11px] font-medium opacity-80 mb-2">สแกน QR Code เพื่อชำระเงิน</p>
                      
                      <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PromptPay-Amount-${totalPrice}`} 
                          alt="PromptPay QR Code" 
                          className="w-32 h-32 mx-auto"
                        />
                      </div>
                      <p className="text-[10px] opacity-60 mt-2">พร้อมเพย์: 08X-XXX-XXXX</p>

                      <div className="mt-3 text-left">
                        <label className="text-[10px] opacity-70 block mb-1">แนบหลักฐานการโอน (สลิป):</label>
                        <input type="file" accept="image/*" onChange={handleSlipUpload} className="text-[10px] opacity-70 w-full file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:bg-fuchsia-100 file:text-fuchsia-700 cursor-pointer" />
                        {slipImage && <p className="text-[10px] text-emerald-500 font-semibold mt-1">✓ แนบไฟล์สลิปเรียบร้อยแล้ว</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-left space-y-2">
                      <p className="text-xs font-semibold text-fuchsia-500">📍 ข้อมูลการนัดรับสินค้า</p>
                      <p className="text-[11px] opacity-80">
                        สามารถนัดรับและชำระเงินสดได้ที่ **ใต้อาคารเรียนรวม / โรงอาหารกลาง**
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white font-bold rounded-xl text-xs shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                >
                  ยืนยันการชำระเงิน (฿{totalPrice})
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}