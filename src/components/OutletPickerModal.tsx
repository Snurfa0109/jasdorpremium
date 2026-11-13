'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, Check, Store } from 'lucide-react';
import { OutletItem, POPULAR_CITIES } from '@/data/outlets';

interface OutletPickerModalProps {
  brandName: string;
  outlets: OutletItem[];
  selectedOutlet: string;
  onSelect: (outletName: string) => void;
  onClose: () => void;
}

export default function OutletPickerModal({
  brandName,
  outlets,
  selectedOutlet,
  onSelect,
  onClose,
}: OutletPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua');
  const [customOutlet, setCustomOutlet] = useState('');

  const filteredOutlets = useMemo(() => {
    let list = outlets;

    if (selectedCity !== 'Semua') {
      const cityLower = selectedCity.toLowerCase();
      list = list.filter((o) =>
        o.city.toLowerCase().includes(cityLower) ||
        o.address.toLowerCase().includes(cityLower) ||
        o.name.toLowerCase().includes(cityLower)
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((o) =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }

    return list.slice(0, 100); // render max 100 at a time for buttery smooth performance
  }, [outlets, search, selectedCity]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOutlet.trim()) return;
    onSelect(customOutlet.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#eae2d9] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#eae2d9] bg-[#fbf9f5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] shadow-2xs">
              <Store className="w-5 h-5 text-[#059669]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-[#4e403b]">
                Pilih Cabang {brandName}
              </h3>
              <p className="text-[11px] text-[#7d6b63]">
                Total {outlets.length.toLocaleString('id-ID')} cabang resmi terverifikasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#eae2d9] text-[#7d6b63] hover:text-[#4e403b] flex items-center justify-center transition-colors cursor-pointer border border-[#eae2d9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & City Filter Bar */}
        <div className="p-4 border-b border-[#eae2d9] space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7d6b63] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari cabang, mall, jalan, atau kota..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] placeholder-[#7d6b63]/60 focus:border-[#4e403b] focus:ring-1 focus:ring-[#4e403b] focus:outline-hidden transition-all"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7d6b63] hover:text-[#4e403b]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#4e403b] text-[#fbf9f5] shadow-2xs'
                    : 'bg-[#fbf9f5] text-[#7d6b63] hover:text-[#4e403b] border border-[#eae2d9]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Outlets List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 bg-[#fbf9f5]/50">
          {filteredOutlets.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MapPin className="w-8 h-8 text-[#7d6b63]/40 mx-auto mb-2" />
              <div className="text-xs font-bold text-[#4e403b]">Cabang tidak ditemukan</div>
              <p className="text-[11px] text-[#7d6b63] mt-1 max-w-xs mx-auto">
                Coba gunakan kata kunci lain atau masukkan nama cabang secara manual di bawah.
              </p>
            </div>
          ) : (
            filteredOutlets.map((outlet) => {
              const isSelected = selectedOutlet.toLowerCase().trim() === outlet.name.toLowerCase().trim();
              return (
                <button
                  key={outlet.id}
                  onClick={() => {
                    onSelect(outlet.name);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#ebf7f3] border-[#059669] text-[#059669] shadow-xs'
                      : 'bg-white border-[#eae2d9] hover:border-[#bce5d8] hover:bg-[#fbf9f5] text-[#4e403b]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#059669] text-[#fbf9f5]'
                          : 'bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm leading-snug">
                        {outlet.name}
                      </div>
                      <div className="text-[10px] text-[#7d6b63] mt-0.5 line-clamp-2 leading-relaxed">
                        {outlet.address}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fbf9f5] text-[#7d6b63] border border-[#eae2d9]">
                          {outlet.city}
                        </span>
                        {outlet.hours && (
                          <span className="text-[9px] text-[#7d6b63]">
                            Buka: {outlet.hours}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="shrink-0 p-1 rounded-full bg-[#059669] text-[#fbf9f5]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer: Custom Outlet Input */}
        <div className="p-3.5 sm:p-4 border-t border-[#eae2d9] bg-white">
          <form onSubmit={handleCustomSubmit} className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#7d6b63]">
              Cabang yang kamu mau gada dipilihan? Ketik disini:
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customOutlet}
                onChange={(e) => setCustomOutlet(e.target.value)}
                placeholder={`Contoh: ${brandName} Rest Area KM 57...`}
                className="flex-1 px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] focus:border-[#4e403b] focus:ring-1 focus:ring-[#4e403b] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!customOutlet.trim()}
                className="px-4 py-2 rounded-xl bg-[#4e403b] hover:bg-[#372b27] disabled:opacity-40 text-[#fbf9f5] text-xs font-bold transition-all cursor-pointer"
              >
                Gunakan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

