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

// รูปภาพและข้อมูลสำหรับหมวดหมู่สวยๆ
const CATEGORIES = [
  { name: 'ตำราเรียน', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80' },
  { name: 'ยูนิฟอร์ม', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
  { name: 'ไอที/อุปกรณ์', img: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&auto=format&fit=crop&q=80' },
  { name: 'ของใช้หอ', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80' },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'หนังสือ Calculus 1 สำหรับวิศวะ',
    price: 250,
    category: 'ตำราเรียน',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'เสื้อช็อปเด็กวิศวะ ไซส์ L (สภาพดี)',
    price: 190,
    category: 'ยูนิฟอร์ม',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'iPad Air 4 (64GB) สี Space Gray',
    price: 9900,
    category: 'ไอที/อุปกรณ์',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'พัดลมตั้งโต๊ะ Minimal สีขาว',
    price: 220,
    category: 'ของใช้หอ',
    image: 'https://images.unsplash.com/photo-1618941709602-92849f611096?w=500&auto=format&fit=crop&q=80',
  },
];

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);

    const savedProducts = localStorage.getItem('my_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
      } catch (error) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextState = !prev;
      localStorage.setItem('theme', nextState ? 'dark' : 'light');
      return nextState;
    });
  };

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

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-pink-50/50 text-slate-800'}`}>
      <div className="flex flex-col gap-5 pb-20 pt-4 px-4 max-w-md mx-auto">
        
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="ค้นหาหนังสือ, อุปกรณ์..." 
              className={`w-full rounded-full border py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-fuchsia-400 shadow-sm ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-pink-200 text-slate-800'
              }`}
            />
          </div>

          <Link
            href="/admin"
            className={`px-3 py-2 rounded-full border text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-pink-300' : 'bg-white border-pink-200 text-fuchsia-600'
            }`}
          >
            ⚙️ แอดมิน
          </Link>

          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-200'}`}
          >
            {mounted && isDarkMode ? '☀️' : '🌙'}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2 rounded-full border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-fuchsia-400' : 'bg-white border-pink-200 text-fuchsia-600'}`}
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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

        {/* หมวดหมู่พร้อมรูปภาพ */}
        <div>
          <h3 className={`mb-2.5 text-sm font-semibold ${isDarkMode ? 'text-pink-200' : 'text-fuchsia-900'}`}>
            หมวดหมู่ยอดนิยม
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {CATEGORIES.map((cat, i) => (
              <div 
                key={i} 
                className={`rounded-xl border overflow-hidden transition-all shadow-sm group cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-pink-200 text-slate-700'
                }`}
              >
                <div className="h-14 overflow-hidden relative">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-1.5 font-medium text-[10px] truncate">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* รายการสินค้าที่ถูกดึงมาจาก Admin */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-pink-200' : 'text-fuchsia-900'}`}>
              🛍️ สินค้าแนะนำ ({products.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.id} className={`rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-200'}`}>
                <div>
                  <div className="h-32 overflow-hidden bg-pink-50">
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
                    onClick={() => addToCart(product)} 
                    className={`w-full py-1.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                      isDarkMode ? 'bg-slate-700 text-pink-300 hover:bg-slate-600' : 'bg-pink-100 text-fuchsia-700 hover:bg-pink-200'
                    }`}
                  >
                    + ใส่ตะกร้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Drawer ตะกร้าสินค้า */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className={`w-full max-w-md h-full p-5 flex flex-col justify-between shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-base font-bold">🛒 ตะกร้าสินค้า ({totalItems})</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-sm">✕</button>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center py-8 text-xs opacity-50">ตะกร้ายังว่างอยู่</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-xl border">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-semibold truncate max-w-[100px]">{item.name}</p>
                          <p className="text-xs text-fuchsia-500 font-bold">฿{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border px-2 py-0.5 rounded-lg text-xs">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>ยอดรวม:</span>
                <span className="text-fuchsia-500">฿{totalPrice}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full py-2.5 bg-fuchsia-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50"
              >
                สั่งซื้อสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}