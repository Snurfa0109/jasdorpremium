'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Clock, ShoppingBag } from 'lucide-react';

interface CheckoutModalProps {
  product: Product | null;
  onClose: () => void;
  isQueueOpen?: boolean;
  onAddToCart?: (cartItem: {
    itemId: string;
    name: string;
    details: string;
    price: number;
    quantity: number;
  }) => void;
}

export default function CheckoutModal({
  product,
  onClose,
  onAddToCart,
}: CheckoutModalProps) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  if (!product) return null;

  const currentGroup = product.planGroups[selectedGroupIndex] || product.planGroups[0];
  const selectedOption =
    currentGroup.options.find((o) => o.id === selectedOptionId) || currentGroup.options[0];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleGroupChange = (idx: number) => {
    setSelectedGroupIndex(idx);
    setSelectedOptionId('');
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart({
        itemId: product.id,
        name: product.name,
        details: `${currentGroup.groupName} - ${selectedOption.name}${selectedOption.notes ? ` (${selectedOption.notes})` : ''}${product.hasWarranty === false ? ' • [Non Garansi]' : ''}`,
        price: selectedOption.price,
        quantity: 1,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-[#eae2d9] relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fbf9f5] text-[#382820] hover:bg-[#f2ece3] flex items-center justify-center font-bold text-sm transition-colors border border-[#eae2d9] cursor-pointer"
        >
          ✕
        </button>

        {/* Product Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#eae2d9]">
          <div className="w-11 h-11 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center font-black text-sm text-[#059669] font-mono tracking-wider shrink-0">
            {product.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-black text-lg sm:text-xl text-[#382820]">{product.name}</h2>
              {product.hasWarranty === false && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs flex items-center gap-1">
                  <span>⚠️</span> Non Garansi
                </span>
              )}
              {product.badge && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] shadow-2xs">
                  {product.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-[#7a665b] mt-0.5">{product.description}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* Step 1: Pilih Tipe Paket */}
          {product.planGroups.length > 1 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1.5">
                1. Pilih Tipe Paket
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {product.planGroups.map((group, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleGroupChange(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                      selectedGroupIndex === idx
                        ? 'bg-[#382820] text-[#fbf9f5] border-[#382820] shadow-xs'
                        : 'bg-[#fbf9f5] text-[#382820] border-[#eae2d9] hover:bg-[#ebf7f3]'
                    }`}
                  >
                    {group.groupName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pilih Durasi & Harga */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1.5">
              {product.planGroups.length > 1 ? '2. Pilih Durasi' : '1. Pilih Paket & Durasi'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
              {currentGroup.options.map((opt) => {
                const isSelected = (selectedOptionId || currentGroup.options[0].id) === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#382820] text-[#fbf9f5] border-[#382820] shadow-xs'
                        : 'bg-white text-[#382820] border-[#eae2d9] hover:border-[#bde5d8]'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{opt.name}</div>
                    <div className={`text-xs font-black mt-1 ${isSelected ? 'text-[#bae5d6]' : 'text-[#059669]'}`}>
                      {formatRupiah(opt.price)}
                    </div>
                    {opt.notes && (
                      <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-white/80' : 'text-[#7a665b]'}`}>
                        {opt.notes}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#7a665b]">Total Paket:</div>
              <div className="text-lg font-black text-[#059669]">
                {formatRupiah(selectedOption.price)}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-[#ebf7f3] px-2.5 py-0.5 rounded-full border border-[#bde5d8] shadow-2xs">
                <Clock className="w-3 h-3 text-[#059669]" /> Est. ~5 - 10 Menit
              </span>
              {product.hasWarranty === false ? (
                <div className="text-[10px] text-amber-800 font-bold mt-0.5 flex items-center justify-end gap-1">
                  <span>⚠️</span> Non Garansi (No Replace)
                </div>
              ) : (
                <div className="text-[10px] text-[#7a665b] mt-0.5">Garansi Full Replace</div>
              )}
            </div>
          </div>

          {/* Action: Add to Scoped Premium Cart */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddToCartClick}
              className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4 text-[#bae5d6]" />
              <span>+ Masukkan ke Keranjang Aplikasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
