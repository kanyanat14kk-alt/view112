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

// รายการสินค้าตั้งต้นพร้อมรูปที่แก้ไขแล้ว
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
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80',
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
    image: 'https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?w=500&auto=format&fit=crop&q=80',
  },
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('ตำราเรียน');
  const [image, setImage] = useState('');

  // ดึงข้อมูลสินค้าเดิม หรือใส่ค่าเริ่มต้นทันที
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('my_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
    }
  }, []);

  // บันทึกลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (mounted && products.length >= 0) {
      localStorage.setItem('my_products', JSON.stringify(products));
    }
  }, [products, mounted]);

  // แปลงรูปภาพเป็น Base64
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

  // เพิ่มสินค้า
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct: Product = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    };

    setProducts([newProduct, ...products]);
    setName('');
    setPrice('');
    setImage('');
    alert('เพิ่มสินค้าเรียบร้อยแล้ว!');
  };

  // ลบสินค้า
  const handleDeleteProduct = (id: number) => {
    if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // รีเซ็ตกลับไปเป็นสินค้าตั้งต้น
  const handleResetDefault = () => {
    if (confirm('ต้องการรีเซ็ตกลับเป็นสินค้าตัวอย่างเริ่มต้นหรือไม่?')) {
      setProducts(DEFAULT_PRODUCTS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 font-sans">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Header แอดมิน */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              ⚙️ แผงควบคุมแอดมิน
            </h1>
            <p className="text-[11px] text-slate-500">จัดการเพิ่ม/ลบ สินค้าหน้าร้าน</p>
          </div>
          <Link 
            href="/home" 
            className="text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-3 py-2 rounded-xl shadow-sm transition-all"
          >
            ← ดูหน้าร้าน
          </Link>
        </div>

        {/* ฟอร์มเพิ่มสินค้า */}
        <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-fuchsia-600 border-b pb-2">➕ เพิ่มสินค้าใหม่</h2>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">รูปภาพสินค้า</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 border rounded-xl p-1" 
            />
            {image && (
              <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">ชื่อสินค้า</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="เช่น หนังสือ Physics 1" 
              required 
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">ราคา (บาท)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="200" 
                required 
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">หมวดหมู่</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
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
            className="w-full py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2 cursor-pointer"
          >
            บันทึกและแสดงหน้าร้าน
          </button>
        </form>

        {/* รายการสินค้าในระบบ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xs font-bold text-slate-800">
              📦 รายการสินค้าทั้งหมด ({products.length})
            </h2>
            <button 
              onClick={handleResetDefault}
              className="text-[10px] text-fuchsia-600 underline hover:text-fuchsia-800"
            >
              ดึงสินค้าตัวอย่างกลับมา
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {products.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">ไม่มีสินค้าในระบบ</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <img src={product.image} alt={product.name} className="w-11 h-11 rounded-lg object-cover border" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{product.name}</p>
                      <p className="text-[10px] text-fuchsia-600 font-semibold">฿{product.price} ({product.category})</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    ลบ
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}