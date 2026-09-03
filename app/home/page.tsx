import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-20 pt-4 px-4 max-w-md mx-auto">
      <div className="relative">
        <div className="absolute left-3 top-3 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input 
          type="text" 
          placeholder="ค้นหาหนังสือ, เสื้อผ้า, อุปกรณ์..." 
          className="w-full rounded-full bg-secondary py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white shadow-lg">
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">ส่งต่อของมือสอง</span>
        <h2 className="mt-2 text-xl font-bold">ตลาดนัดเด็กวิทยาลัย</h2>
        <p className="mt-1 text-xs opacity-90">ซื้อง่าย ขายคล่อง นัดรับได้ในรั้วสถาบัน</p>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
          หมวดหมู่ยอดนิยม
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {['ตำราเรียน', 'ยูนิฟอร์ม', 'ไอที/อุปกรณ์', 'ของใช้หอ'].map((cat, i) => (
            <div key={i} className="rounded-xl border border-border p-3 hover:bg-accent transition-colors cursor-pointer">
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            สินค้ามาใหม่
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