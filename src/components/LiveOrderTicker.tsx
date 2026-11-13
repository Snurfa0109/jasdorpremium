'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Coffee, Smartphone, MessageCircle, X, CheckCircle2 } from 'lucide-react';

interface TickerNotification {
  id: string;
  service: 'kopi' | 'premium' | 'jascur';
  title: string;
  item: string;
  location: string;
  timeAgo: string;
}

const SAMPLE_ACTIVITIES: TickerNotification[] = [
  {
    id: 'act-1',
    service: 'kopi',
    title: 'Rian M.',
    item: 'Kopi Kenangan Mantan 50%',
    location: 'Cabang Kota Kasablanka',
    timeAgo: '2 menit lalu',
  },
  {
    id: 'act-2',
    service: 'premium',
    title: 'Fikri A.',
    item: 'Netflix 1 Bulan Private 4K',
    location: 'Langganan Streaming',
    timeAgo: '5 menit lalu',
  },
  {
    id: 'act-3',
    service: 'jascur',
    title: 'Klien Anonim #38',
    item: 'Sesi Curhat Voice Call 1 Jam',
    location: 'Teman Curhat Aman',
    timeAgo: '11 menit lalu',
  },
  {
    id: 'act-4',
    service: 'kopi',
    title: 'Dinda P.',
    item: '2x Roti Daging Asap Manis 50%',
    location: 'Cabang Senayan City',
    timeAgo: '16 menit lalu',
  },
  {
    id: 'act-5',
    service: 'premium',
    title: 'Sarah K.',
    item: 'Canva Pro 1 Tahun Edu',
    location: 'Katalog Desain & Creative',
    timeAgo: '22 menit lalu',
  },
  {
    id: 'act-6',
    service: 'kopi',
    title: 'Bintang A.',
    item: 'Americano Ice + Less Sugar 50%',
    location: 'Cabang Grand Indonesia',
    timeAgo: '28 menit lalu',
  },
];

export default function LiveOrderTicker() {
  const pathname = usePathname();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Do not show on Admin or Order Tracking pages
  const isExcludedPage = pathname?.startsWith('/admin') || pathname?.startsWith('/order');

  useEffect(() => {
    if (isExcludedPage || isDismissed) return;

    // Initial appearance after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Periodic rotation
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % SAMPLE_ACTIVITIES.length);
        setIsVisible(true);
      }, 800);
    }, 18000); // changes every 18 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isExcludedPage, isDismissed]);

  if (isExcludedPage || isDismissed) return null;

  const current = SAMPLE_ACTIVITIES[currentIdx];

  return (
    <div
      className={`fixed bottom-24 sm:bottom-6 left-3 sm:left-6 z-30 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-[#eae2d9] shadow-xl flex items-center gap-3 max-w-[320px] sm:max-w-[340px]">
        {/* Service Icon Badge */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            current.service === 'kopi'
              ? 'bg-amber-100 text-amber-800'
              : current.service === 'premium'
              ? 'bg-rose-100 text-rose-700'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {current.service === 'kopi' ? (
            <Coffee className="w-4 h-4" />
          ) : current.service === 'premium' ? (
            <Smartphone className="w-4 h-4" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-[#382820] truncate">{current.title}</span>
            <span title="Pesanan Terverifikasi">
              <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0" />
            </span>
            <span className="text-[10px] text-[#7a665b] shrink-0">• {current.timeAgo}</span>
          </div>
          <div className="text-[11px] font-semibold text-[#059669] truncate">
            {current.item}
          </div>
          <div className="text-[10px] text-[#7a665b] truncate">
            {current.location}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="w-5 h-5 rounded-full hover:bg-stone-100 text-[#7a665b] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Tutup Notifikasi"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
