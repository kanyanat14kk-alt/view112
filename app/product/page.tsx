import Link from 'next/link';
import { Filter } from 'lucide-react';

export default function ProductListPage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">สินค้าทั้งหมด</h1>
        <button className="flex items-center gap-1 text-xs border border-border rounded-lg px-2.5 py-1.5">
          <Filter className="h-3.5 w-3.5" /> ตัวกรอง
        </button>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <Link key={id} href={`/product/${id}`} className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
            <div className="h-36 bg-muted flex items-center justify-center text-xs text-muted-foreground">รูปภาพสินค้า</div>
            <div className="p-3">
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">มือสอง</span>
              <p className="text-xs font-medium truncate mt-1">หนังสือ Calculus 1</p>
              <p className="text-sm font-bold text-primary mt-1">฿180</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}