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

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('ตำราเรียน');
  const [image, setImage] = useState('');

  // ดึงข้อมูลสินค้าจาก localStorage เมื่อเข้าหน้าเว็บ
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('my_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // บันทึกสินค้าลง localStorage ทุกครั้งที่รายการเปลี่ยน
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('my_products', JSON.stringify(products));
    }
  }, [products, mounted]);

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

  // เพิ่มสินค้าใหม่
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
    alert('เพิ่มสินค้าสำเร็จ!');
  };

  // ลบสินค้า
  const handleDeleteProduct = (id: number) => {
    if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 font-sans">
      <div className="max-w-xl mx-auto space-y-5">
        
        {/* Header แอดมิน */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              ⚙️ ระบบจัดการหลังบ้าน (Admin)
            </h1>
            <p className="text-xs text-slate-500">จัดการเพิ่ม/ลบ สินค้าในระบบ</p>
          </div>
          <Link 
            href="/home" 
            className="text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-3 py-2 rounded-xl shadow-sm transition-all"
          >
            ← ไปหน้าหน้าร้าน
          </Link>
        </div>

        {/* ฟอร์มเพิ่มสินค้าใหม่ */}
        <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-fuchsia-600 border-b pb-2">➕ เพิ่มสินค้าใหม่</h2>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">รูปภาพสินค้า</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 cursor-pointer border rounded-xl p-1" 
            />
            {image && (
              <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">ชื่อสินค้า</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="เช่น หนังสือ แคลคูลัส 1" 
              required 
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">ราคา (บาท)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="250" 
                required 
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">หมวดหมู่</label>
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
            บันทึกและเพิ่มสินค้า
          </button>
        </form>

        {/* รายการสินค้าที่มีในระบบ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">
            📦 รายการสินค้าทั้งหมด ({products.length})
          </h2>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {products.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">ยังไม่มีสินค้าในระบบ</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{product.name}</p>
                      <p className="text-[10px] text-fuchsia-600 font-semibold">฿{product.price} ({product.category})</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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