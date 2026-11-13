'use client';

import React from 'react';
import { Product } from '@/types';
import { ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isUnavailable?: boolean;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, isUnavailable = false, onSelect }: ProductCardProps) {
  const allPrices = product.planGroups.flatMap((g) => g.options.map((o) => o.price));
  const minPrice = Math.min(...allPrices);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Generate clean 2-letter monogram
  const monogram = product.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`group relative rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-2xs ${
        isUnavailable
          ? 'bg-[#f4f2ee] border-[#ded7ce] opacity-60 cursor-not-allowed select-none'
          : 'bg-white border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-md'
      }`}
    >
      {/* Top monogram & badge in Matcha-Mint & Cocoa */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-xs tracking-wider font-mono ${
            isUnavailable
              ? 'bg-stone-200 text-stone-500 border-stone-300'
              : 'bg-[#ebf7f3] border-[#bde5d8] text-[#059669]'
          }`}
        >
          {monogram}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {product.hasWarranty === false && (
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs flex items-center gap-1">
              <span>⚠️</span> Non Garansi
            </span>
          )}

          {isUnavailable ? (
            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 border border-stone-300">
              Stok Habis
            </span>
          ) : product.badge ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] shadow-2xs">
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div>
        <h3
          className={`font-extrabold text-base transition-colors ${
            isUnavailable ? 'text-[#7a665b]' : 'text-[#382820] group-hover:text-[#059669]'
          }`}
        >
          {product.name}
        </h3>
        <p className="text-xs text-[#7a665b] mt-1 line-clamp-2 leading-relaxed">
          {isUnavailable ? 'Stok akun sedang kosong / dalam proses restock oleh admin.' : product.description}
        </p>

        {/* Plan variants preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.planGroups.slice(0, 2).map((group, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                isUnavailable
                  ? 'bg-stone-200 text-stone-500 border-stone-300'
                  : 'bg-[#fbf9f5] text-[#382820] border-[#eae2d9]'
              }`}
            >
              {group.groupName}
            </span>
          ))}
          {product.planGroups.length > 2 && (
            <span className="text-[10px] text-[#7a665b] px-1 self-center">
              +{product.planGroups.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Pricing & Cocoa Button Action */}
      <div className="mt-5 pt-3 border-t border-[#eae2d9] flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#7a665b]">
            {isUnavailable ? 'Status' : 'Mulai dari'}
          </div>
          <div
            className={`text-sm font-black ${
              isUnavailable ? 'text-stone-500' : 'text-[#059669]'
            }`}
          >
            {isUnavailable ? 'Menunggu Restock' : formatRupiah(minPrice)}
          </div>
        </div>

        <button
          type="button"
          disabled={isUnavailable}
          onClick={() => !isUnavailable && onSelect(product)}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition-all ${
            isUnavailable
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
              : 'bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] cursor-pointer active:scale-95'
          }`}
        >
          <span>{isUnavailable ? 'Habis' : 'Pilih'}</span>
          {!isUnavailable && <ChevronRight className="w-3.5 h-3.5 text-[#bae5d6]" />}
        </button>
      </div>
    </div>
  );
}
