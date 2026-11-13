'use client';

import React, { useState, useEffect } from 'react';
import { CoffeeItem } from '@/data/coffee';
import { ShoppingBag, MapPin } from 'lucide-react';

interface CoffeeOrderModalProps {
  item: CoffeeItem | null;
  brandName: string;
  defaultOutletName?: string;
  onClose: () => void;
  onAddToCart?: (cartItem: {
    itemId: string;
    name: string;
    details: string;
    price: number;
    quantity: number;
    image?: string;
  }) => void;
}

export default function CoffeeOrderModal({
  item,
  brandName,
  defaultOutletName = '',
  onClose,
  onAddToCart,
}: CoffeeOrderModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [selectedSugar, setSelectedSugar] = useState<string>('Normal Sugar (100%)');
  const [selectedIce, setSelectedIce] = useState<string>('Normal Ice');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [outletName, setOutletName] = useState(defaultOutletName);

  useEffect(() => {
    if (defaultOutletName) {
      setOutletName(defaultOutletName);
    }
  }, [defaultOutletName]);

  if (!item) return null;

  // Calculate price with size and toppings
  const basePrice = item.discountPrice;
  const isLarge = selectedSize.includes('Large');
  const sizeExtra = isLarge ? 4000 : 0;
  const toppingsExtra = selectedToppings.reduce((total, topName) => {
    const found = item.toppingOptions.find((t) => t.name === topName);
    return total + (found ? found.price : 0);
  }, 0);
  const totalPrice = basePrice + sizeExtra + toppingsExtra;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const toggleTopping = (topName: string) => {
    if (selectedToppings.includes(topName)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topName));
    } else {
      setSelectedToppings([...selectedToppings, topName]);
    }
  };

  const getCustomizationSummary = () => {
    return [
      selectedSize,
      selectedSugar.split(' ')[0],
      selectedIce,
      selectedToppings.length > 0 ? `Topping: ${selectedToppings.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(' • ');
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart({
        itemId: item.id,
        name: `${item.name}`,
        details: getCustomizationSummary(),
        price: totalPrice,
        quantity: 1,
        image: item.image,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-[#eae2d9] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fbf9f5] text-[#382820] hover:bg-[#f2ece3] flex items-center justify-center font-bold text-sm transition-colors border border-[#eae2d9] cursor-pointer"
        >
          ✕
        </button>

        {/* Header Drink Info */}
        <div className="flex gap-4 items-start pr-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#eae2d9] bg-[#fbf9f5]">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-2.5 py-0.5 rounded-full border border-[#bde5d8] shadow-2xs">
              {brandName}
            </span>
            <h2 className="font-black text-base sm:text-lg text-[#382820] mt-1 truncate">
              {item.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-black text-[#059669]">
                {formatRupiah(item.discountPrice)}
              </span>
              <span className="text-xs line-through text-[#7a665b]">
                {formatRupiah(item.originalPrice)}
              </span>
              <span className="text-[10px] font-extrabold text-[#059669] bg-[#ebf7f3] px-1.5 py-0.2 rounded-md border border-[#bde5d8]">
                -50%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* Outlet Info */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
              Cabang Outlet Pick-up (Ambil di Kasir)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#059669] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: Mall Kota Kasablanka (Lt. LG)"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-[#eae2d9] text-xs font-semibold bg-[#fbf9f5] text-[#382820] placeholder-[#7a665b] focus:ring-1 focus:ring-[#382820] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Size Options */}
          {item.sizeOptions.length > 1 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
                Pilih Ukuran Cup
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#382820] text-[#fbf9f5] border-[#382820] shadow-xs'
                        : 'bg-[#fbf9f5] text-[#382820] border-[#eae2d9] hover:bg-[#ebf7f3]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Options */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
              Tingkat Kemanisan (Sugar)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {item.sugarOptions.map((sg) => (
                <button
                  key={sg}
                  type="button"
                  onClick={() => setSelectedSugar(sg)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold border transition-all truncate cursor-pointer ${
                    selectedSugar === sg
                      ? 'bg-[#382820] text-[#fbf9f5] border-[#382820]'
                      : 'bg-[#fbf9f5] text-[#382820] border-[#eae2d9] hover:bg-[#ebf7f3]'
                  }`}
                >
                  {sg.split(' ')[0]} {sg.includes('50%') ? '50%' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Options */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
              Takaran Es (Ice)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {item.iceOptions.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setSelectedIce(ic)}
                  className={`p-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedIce === ic
                      ? 'bg-[#382820] text-[#fbf9f5] border-[#382820]'
                      : 'bg-[#fbf9f5] text-[#382820] border-[#eae2d9] hover:bg-[#ebf7f3]'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings (if available) */}
          {item.toppingOptions.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
                Topping Tambahan (Opsional)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {item.toppingOptions.map((top) => {
                  const isChecked = selectedToppings.includes(top.name);
                  return (
                    <button
                      key={top.name}
                      type="button"
                      onClick={() => toggleTopping(top.name)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left flex justify-between items-center transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#ebf7f3] text-[#059669] border-[#bde5d8]'
                          : 'bg-[#fbf9f5] text-[#382820] border-[#eae2d9]'
                      }`}
                    >
                      <span className="truncate">{top.name}</span>
                      <span className="text-[10px] shrink-0 font-normal">+{formatRupiah(top.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Total Box */}
          <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a665b]">
                Total Bayar Diskon 50%
              </div>
              <div className="text-xl font-black text-[#059669]">
                {formatRupiah(totalPrice)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black text-[#059669] bg-[#ebf7f3] px-3 py-1 rounded-full border border-[#bde5d8] shadow-2xs">
                Diskon 50%
              </span>
            </div>
          </div>

          {/* Action Button: MASUKKAN KE KERANJANG */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddToCartClick}
              className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4 text-[#bae5d6]" />
              <span>+ Masukkan ke Keranjang {brandName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
