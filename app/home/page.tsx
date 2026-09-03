'use client';

import { useState, useEffect } from 'react';

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
  const [showAddForm, setShowAddForm] = useState(false);

  // State สำหรับ Modal ชำระเงิน
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cash'>('promptpay');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // State สำหรับ Form ลงขาย
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('ตำราเรียน');
  const [image, setImage] = useState('');

  // 1. อ่านค่าธีมจาก localStorage เมื่อ Client โหลดเสร็จ
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      // ถ้าไม่มีค่าบันทึกไว้ ให้เช็คตาม OS System Preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // 2. อัปเดต HTML Class 'dark' และ localStorage ทุกครั้งที่ isDarkMode เปลี่ยน
  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  // ฟังก์ชันกดสลับโหมด กลางวัน / กลางคืน
  const toggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDarkMode((prev) => !prev);
  };

  // ฟังก์ชันแปลงรูปภาพเป็น Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  // ฟังก์ชันเพิ่มสินค้าลงระบบ
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct: Product = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    };

    setProducts([newProduct, ...products]);
    setName('');
    setPrice('');
    setImage('');
    setShowAddForm(false);
  };

  // ฟังก์ชันลบสินค้าออกจากระบบ
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setCart(cart.filter((item) => item.id !== id));
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
    <div className="min-h-screen bg-pink-50/50 dark:bg-slate-900 text-slate-800 dark:text-pink-50 transition-colors duration-300">
      <div className="flex flex-col gap-5 pb-20 pt-4 px-4 max-w-md mx-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 relative z-20">
          <div className="relative flex-1">
            <div className="absolute left-3 top-3 text-fuchsia-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาหนังสือ, อุปกรณ์..." 
              className="w-full rounded-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-fuchsia-400 shadow-sm transition-colors"
            />
          </div>

          {/* 🔘 ปุ่มสลับโหมด กลางวัน / กลางคืน 🔘 */}
          <button 
            type="button"
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 shadow-md hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer select-none"
            title={isDarkMode ? "เปลี่ยนเป็นโหมดกลางวัน" : "เปลี่ยนเป็นโหมดกลางคืน"}
          >
            {mounted && isDarkMode ? (
              /* ไอคอนดวงอาทิตย์ */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 pointer-events-none"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              /* ไอคอนดวงจันทร์ */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-600 pointer-events-none"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          {/* ปุ่มเปิดตะกร้าสินค้า */}
          <button 
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 shadow-md text-fuchsia-600 dark:text-fuchsia-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="เปิดตะกร้าสินค้า"
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
        <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 p-5 text-white shadow-md shadow-fuchsia-200 dark:shadow-none">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm">🌸 ส่งต่อของมือสอง</span>
          <h2 className="mt-2 text-xl font-bold">ตลาดนัดเด็กวิทยาลัย</h2>
          <p className="mt-1 text-xs opacity-90">ซื้อง่าย ขายคล่อง นัดรับได้ในรั้วสถาบัน</p>
        </div>

        {/* หมวดหมู่ */}
        <div>
          <h3 className="mb-2.5 text-sm font-semibold flex items-center gap-1.5 text-fuchsia-900 dark:text-pink-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-500"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
            หมวดหมู่ยอดนิยม
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['ตำราเรียน', 'ยูนิฟอร์ม', 'ไอที/อุปกรณ์', 'ของใช้หอ'].map((cat, i) => (
              <div key={i} className="rounded-xl border border-pink-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-2.5 hover:border-fuchsia-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 cursor-pointer transition-colors shadow-sm font-medium">
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* สินค้าทั้งหมด */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-fuchsia-900 dark:text-pink-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              สินค้าของคุณ ({products.length})
            </h3>
            <button 
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-semibold hover:underline flex items-center gap-1"
            >
              {showAddForm ? 'ปิดฟอร์ม' : '+ เพิ่มสินค้า'}
            </button>
          </div>

          {/* ฟอร์มลงขายสินค้าใหม่ */}
          {showAddForm && (
            <form onSubmit={handleAddProduct} className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-fuchsia-200 dark:border-slate-700 shadow-md space-y-3">
              <h4 className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">ลงขายสินค้าใหม่ ✨</h4>
              
              <div>
                <label className="text-[10px] text-fuchsia-900/60 dark:text-pink-300/60 block mb-1">รูปภาพสินค้า</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-pink-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-fuchsia-400 transition-colors bg-pink-50/50 dark:bg-slate-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400 mb-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span className="text-[10px] text-fuchsia-700 dark:text-pink-300">กดเพื่อเลือกรูปภาพจากเครื่อง</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {image && (
                  <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border border-pink-200 dark:border-slate-700">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImage('')} 
                      className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-1 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-fuchsia-900/60 dark:text-pink-300/60 block mb-1">ชื่อสินค้า</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="เช่น หนังสือ แคลคูลัส 1" 
                  required 
                  className="w-full text-xs p-2 rounded-lg bg-pink-50/30 dark:bg-slate-700 border border-pink-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-fuchsia-900/60 dark:text-pink-300/60 block mb-1">ราคา (บาท)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="250" 
                    required 
                    className="w-full text-xs p-2 rounded-lg bg-pink-50/30 dark:bg-slate-700 border border-pink-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-fuchsia-900/60 dark:text-pink-300/60 block mb-1">หมวดหมู่</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-pink-50/30 dark:bg-slate-700 border border-pink-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                  >
                    <option value="ตำราเรียน">ตำราเรียน</option>
                    <option value="ยูนิฟอร์ม">ยูนิฟอร์ม</option>
                    <option value="ไอที/อุปกรณ์">ไอที/อุปกรณ์</option>
                    <option value="ของใช้หอ">ของใช้หอ</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:opacity-95 text-white rounded-lg text-xs font-semibold shadow-sm transition-opacity mt-2 cursor-pointer"
              >
                ยืนยันการเพิ่มสินค้า
              </button>
            </form>
          )}

          {/* รายการสินค้าที่ลงขาย */}
          <div className="grid grid-cols-2 gap-3">
            {!showAddForm && (
              <div 
                onClick={() => setShowAddForm(true)}
                className="rounded-xl border-2 border-dashed border-pink-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 h-52 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-fuchsia-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-slate-700 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
                <p className="text-xs font-semibold text-fuchsia-950 dark:text-pink-200">+ เพิ่มสินค้าใหม่</p>
                <p className="text-[10px] text-fuchsia-800/60 dark:text-pink-400/60 mt-0.5">กดที่นี่เพื่อลงขาย</p>
              </div>
            )}

            {products.map((product) => (
              <div key={product.id} className="relative rounded-xl border border-pink-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-32 bg-pink-50 dark:bg-slate-700 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <span className="text-[9px] bg-pink-100 dark:bg-slate-700 text-fuchsia-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-medium">
                      {product.category}
                    </span>
                    <p className="text-xs font-semibold truncate mt-1.5">{product.name}</p>
                    <p className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mt-1">฿{product.price}</p>
                  </div>
                </div>

                <div className="p-2 pt-0 flex gap-1">
                  <button 
                    type="button"
                    onClick={() => addToCart(product)} 
                    className="flex-1 py-1.5 bg-pink-100/70 dark:bg-slate-700 text-fuchsia-700 dark:text-pink-300 rounded-lg text-[10px] font-semibold hover:bg-pink-200/70 transition-colors cursor-pointer"
                  >
                    + ใส่ตะกร้า
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)} 
                    className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    title="ลบสินค้า"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* หน้าต่างตะกร้าสินค้า (Cart Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-fuchsia-900 dark:text-pink-100 flex items-center gap-2">
                  🛒 ตะกร้าสินค้าของคุณ ({totalItems})
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    🛒 ตะกร้าของคุณยังว่างอยู่
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/50 dark:bg-slate-800 border border-pink-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-semibold truncate max-w-[120px]">{item.name}</p>
                          <p className="text-xs text-fuchsia-600 dark:text-fuchsia-400 font-bold">฿{item.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-2 py-1 rounded-lg border border-pink-200 dark:border-slate-600 text-xs">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} className="text-fuchsia-600 dark:text-fuchsia-300 font-bold px-1 cursor-pointer">-</button>
                        <span className="font-semibold text-xs">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} className="text-fuchsia-600 dark:text-fuchsia-300 font-bold px-1 cursor-pointer">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-pink-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>ราคารวมทั้งหมด:</span>
                <span className="text-lg text-fuchsia-600 dark:text-fuchsia-400">฿{totalPrice}</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                disabled={cart.length === 0}
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
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
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-pink-100 dark:border-slate-700 relative">
            {isSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">ทำรายการสำเร็จ!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">ขอบคุณที่ใช้บริการตลาดนัดเด็กวิทยาลัย</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-pink-100">ชำระเงิน (ยอดรวม ฿{totalPrice})</h3>
                  <button type="button" onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-2 my-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'promptpay'
                        ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
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
                        ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="text-base">💵</span>
                    เงินสด (นัดรับ)
                  </button>
                </div>

                <div className="bg-pink-50/50 dark:bg-slate-700/50 p-4 rounded-2xl border border-pink-100 dark:border-slate-700 text-center space-y-3">
                  {paymentMethod === 'promptpay' ? (
                    <div>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-2">สแกน QR Code เพื่อชำระเงิน</p>
                      
                      <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-slate-100">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PromptPay-Amount-${totalPrice}`} 
                          alt="PromptPay QR Code" 
                          className="w-32 h-32 mx-auto"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">พร้อมเพย์: 08X-XXX-XXXX (ชื่อบัญชี: ตลาดนัดเด็กวิทยาลัย)</p>

                      <div className="mt-3 text-left">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">แนบหลักฐานการโอน (สลิป):</label>
                        <input type="file" accept="image/*" onChange={handleSlipUpload} className="text-[10px] text-slate-500 w-full file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:bg-fuchsia-100 file:text-fuchsia-700 hover:file:bg-fuchsia-200 cursor-pointer" />
                        {slipImage && <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ แนบไฟล์สลิปเรียบร้อยแล้ว</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-left space-y-2">
                      <p className="text-xs font-semibold text-fuchsia-900 dark:text-pink-200">📍 ข้อมูลการนัดรับสินค้า</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        สามารถนัดรับและชำระเงินสดได้ที่ **ใต้อาคารเรียนรวม / โรงอาหารกลาง**
                      </p>
                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-[10px] text-slate-500 border border-slate-200 dark:border-slate-700">
                        💡 เมื่อกดยืนยันแล้ว ผู้ขายจะติดต่อกลับทางเบอร์โทรศัพท์เพื่อยืนยันเวลานัดรับสินค้า
                      </div>
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