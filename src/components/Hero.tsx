'use client';

import React from 'react';
import { Search, Clock } from 'lucide-react';

interface HeroProps {
  activeCount: number;
  isQueueOpen: boolean;
  onSearchChange: (q: string) => void;
  searchQuery: string;
}

export default function Hero({ activeCount, isQueueOpen, onSearchChange, searchQuery }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Top Minimalist Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CCDDEB] text-xs font-semibold text-[#1E3A52] mb-5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A52]" />
          <span>saoirse digital</span>
          <span className="text-[#A6C5DE]">•</span>
          <span className="text-[#557591]">premium apps catalogue</span>
        </div>

        {/* Heading in warm editorial style */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#162836] leading-[1.12] font-serif">
          Aplikasi premium favoritmu, <br className="hidden sm:block" />
          <span className="italic font-normal text-[#6F3E18]">
            langsung aktif &amp; bergaransi.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-[#557591] max-w-xl mx-auto leading-relaxed font-normal">
          Pilih paket aplikasi premium resmi dengan harga terjangkau. Akses akun dikirim langsung ke layar kamu tanpa perlu antre chat.
        </p>

        {/* Clean Live Status Bar */}
        <div className="mt-7 max-w-md mx-auto p-3.5 sm:p-4 rounded-2xl bg-white border border-[#CCDDEB] shadow-2xs flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6EFF7] border border-[#CCDDEB] flex items-center justify-center text-[#1E3A52] shrink-0">
              <Clock className="w-4 h-4 text-[#1E3A52]" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#557591]">
                Status Pesanan
              </div>
              <div className="text-xs font-extrabold text-[#162836]">
                {isQueueOpen ? 'Aktif Siap Proses' : 'Ditunda Sementara (Batch Break)'}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-bold text-[#1E3A52] bg-[#E2EDF7] px-3 py-1.5 rounded-xl border border-[#CCDDEB] shrink-0">
            ~5-10 Menit
          </div>
        </div>

        {/* Minimal Feature Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-2.5 max-w-xl mx-auto text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-[#CCDDEB]">
            <div className="font-bold text-[#162836]">Proses Kilat</div>
            <div className="text-[11px] text-[#557591] mt-0.5">5 - 10 Menit</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#CCDDEB]">
            <div className="font-bold text-[#162836]">Garansi Penuh</div>
            <div className="text-[11px] text-[#557591] mt-0.5">Full Replace</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#CCDDEB]">
            <div className="font-bold text-[#162836]">Customer Care</div>
            <div className="text-[11px] text-[#557591] mt-0.5">Telegram CS</div>
          </div>
        </div>

        {/* Clean Minimal Searchbar */}
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-[#557591] absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2} />
          <input
            type="text"
            placeholder="Cari aplikasi... (Netflix, Canva, YouTube, Spotify)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-5 py-3 pl-11 rounded-2xl bg-white border border-[#CCDDEB] focus:border-[#1E3A52] focus:ring-1 focus:ring-[#1E3A52] focus:outline-hidden text-sm text-[#162836] placeholder-[#557591]/70 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#557591] hover:text-[#162836]"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
