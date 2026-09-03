import Link from 'next/link';
import { Search, Flame, Tag } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-20 pt-4 px-4 max-w-md mx-auto">
      {/* Search Bar Header */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="ค้นหาหนังสือ, เสื้อผ้า, อุปกรณ์..." 
          className="w-full rounded-full bg-secondary py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white shadow-lg">
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">ส่งต่อของมือสอง</span>
        <h2 className="mt-2 text-xl font-bold">ตลาดนัดเด็กวิทยาลัย</h2>
        <p className="mt-1 text-xs opacity-90">ซื้อง่าย ขายคล่อง นัดรับได้ในรั้วสถาบัน</p>
      </div>

      {/* Quick Categories */}
      <div>
        <h3 className="mb-3 text-base font-semibold flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-primary" /> หมวดหมู่ยอดนิยม
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {['ตำราเรียน', 'ยูนิฟอร์ม', 'ไอที/อุปกรณ์', 'ของใช้หอ'].map((cat, i) => (
            <div key={i} className="rounded-xl border border-border p-3 hover:bg-accent transition-colors cursor-pointer">
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Trending Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-500" /> สินค้ามาใหม่
          </h3>
          <Link href="/product" className="text-xs text-primary font-medium">ดูทั้งหมด</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((item) => (
            <Link key={item} href={`/product/${item}`} className="rounded-xl border border-border overflow-hidden bg-card text-card-foreground shadow-sm">
              <div className="h-32 bg-muted flex items-center justify-center text-xs text-muted-foreground">รูปสินค้า</div>
              <div className="p-3">
                <p className="text-xs font-semibold truncate">เสื้อช็อปไซส์ L สภาพดี</p>
                <p className="text-sm font-bold text-primary mt-1">฿250</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}