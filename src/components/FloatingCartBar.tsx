'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import { CartItem } from '@/types';

interface FloatingCartBarProps {
  items: CartItem[];
  outlet?: string;
  onOpenCart: () => void;
}

export default function FloatingCartBar({ items, outlet, onOpenCart }: FloatingCartBarProps) {
  if (items.length === 0) return null;

  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 pointer-events-none animate-in slide-in-from-bottom-5">
      <div
        onClick={onOpenCart}
        className="pointer-events-auto bg-[#382820] text-[#fbf9f5] rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-[#251a14] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#251a14] transition-all active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#ebf7f3] text-[#059669] flex items-center justify-center relative shrink-0">
            <ShoppingBag className="w-5 h-5 text-[#059669]" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#bae5d6] text-[#059669] text-[10px] font-black flex items-center justify-center border-2 border-[#382820]">
              {totalCount}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[#fbf9f5]">
                {formatRupiah(totalPrice)}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#059669] bg-[#bae5d6] px-2 py-0.2 rounded-full">
                {totalCount} Item
              </span>
            </div>

            {outlet && !outlet.includes('Pilih Outlet') && (
              <div className="flex items-center gap-1 text-[11px] text-[#e5ddd3] truncate mt-0.5">
                <MapPin className="w-3 h-3 shrink-0 text-[#bae5d6]" />
                <span className="truncate">{outlet}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded-xl bg-[#ebf7f3] hover:bg-[#bae5d6] text-[#059669] font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors group-hover:translate-x-0.5 shadow-xs"
        >
          <span>Keranjang</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#059669]" />
        </button>
      </div>
    </div>
  );
}
