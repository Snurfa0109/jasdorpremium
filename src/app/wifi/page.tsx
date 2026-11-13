'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  WIFI_SSID,
  WIFI_PASSWORDS,
  getWIBDate,
} from '@/data/wifi';
import {
  Wifi,
  Copy,
  Check,
  Coffee,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';

const DEFAULT_WIB = {
  day: 10,
  month: 10,
  year: 2026,
  dayName: 'Hari Ini',
  monthName: 'November',
  formattedFull: 'Waktu Indonesia Barat (WIB)',
};

export default function WifiPage() {
  const [currentWIB, setCurrentWIB] = useState(DEFAULT_WIB);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchDay, setSearchDay] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute live client-side date inside useEffect to satisfy Next.js static prerender
  useEffect(() => {
    setCurrentWIB(getWIBDate());
    const timer = setInterval(() => {
      setCurrentWIB(getWIBDate());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayPassword = WIFI_PASSWORDS[currentWIB.day] || WIFI_PASSWORDS[1];
  const tomorrowDay = currentWIB.day >= 31 ? 1 : currentWIB.day + 1;

  const handleCopy = (text: string, key: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setToastMessage(`${label} "${text}" berhasil disalin!`);

      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);

      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  const daysList = Array.from({ length: 31 }, (_, i) => i + 1).filter((day) => {
    if (!searchDay.trim()) return true;
    const q = searchDay.trim().toLowerCase();
    const pass = WIFI_PASSWORDS[day] || '';
    return String(day).includes(q) || pass.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#4e403b]">
      <Navbar />

      {/* Floating Copied Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4e403b] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <Check className="w-4 h-4 text-[#bae5d6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Breadcrumb pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eae2d9] text-xs font-semibold text-[#4e403b] shadow-2xs mb-5">
          <Wifi className="w-3.5 h-3.5 text-[#059669]" />
          <span>WiFi Kopi Kenangan</span>
          <span className="text-[#bae5d6]">•</span>
          <span className="font-bold text-[#059669]">Update Otomatis Harian</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#4e403b] font-serif leading-[1.16]">
          Password WiFi{' '}
          <span className="relative inline-block italic font-normal text-[#059669]">
            Hari Ini.
            <svg
              className="absolute -bottom-1 left-0 w-full h-2.5 text-[#bae5d6]"
              viewBox="0 0 200 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 6C60 1.5 140 1.5 198 6"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-[#7d6b63] max-w-xl mx-auto leading-relaxed">
          Pilih jaringan sesuai SSID di bawah, lalu masukkan password hari ini. Password berganti otomatis setiap tanggal pukul 00.00 WIB di seluruh outlet Kopi Kenangan.
        </p>
      </section>

      {/* Main Content: Split Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Featured Today Card & Promos (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Card 1: Today's Active Password */}
            <div className="bg-white rounded-3xl p-6 border border-[#eae2d9] shadow-sm relative overflow-hidden group">
              {/* Soft decorative glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#bae5d6]/30 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] shadow-2xs">
                      <Wifi className="w-5 h-5 text-[#059669]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#4e403b]">
                        WIFI Kopi Kenangan
                      </div>
                      <div className="text-[10px] text-[#7d6b63]">
                        {currentWIB.formattedFull}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                    Hari Ini
                  </span>
                </div>

                {/* SSID Box */}
                <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b63]">
                      SSID / Nama WiFi
                    </span>
                    <button
                      onClick={() => handleCopy(WIFI_SSID, 'ssid', 'SSID')}
                      className="text-[10px] font-bold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'ssid' ? (
                        <>
                          <Check className="w-3 h-3 text-[#059669]" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin SSID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-black text-base text-[#4e403b]">
                    {WIFI_SSID}
                  </div>
                </div>

                {/* Password Box */}
                <div className="p-4 rounded-2xl bg-[#4e403b] text-[#fbf9f5] border border-[#372b27] shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#bae5d6] mb-1">
                    <span>Password Tanggal {currentWIB.day}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 00.00 WIB
                    </span>
                  </div>

                  <div className="font-mono font-black text-lg sm:text-xl text-white tracking-wide break-all my-1.5">
                    {todayPassword}
                  </div>

                  <button
                    onClick={() => handleCopy(todayPassword, 'today', 'Password hari ini')}
                    className="mt-3 w-full py-2.5 rounded-xl bg-[#bae5d6] hover:bg-[#a6d8c7] text-[#059669] font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {copiedKey === 'today' ? (
                      <>
                        <Check className="w-4 h-4 text-[#059669]" />
                        <span>Password Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#059669]" />
                        <span>Salin Password Hari Ini</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#7d6b63]">
                  <Clock className="w-3 h-3 text-[#7d6b63]" />
                  <span>Password berganti otomatis setiap tanggal pukul 00.00 WIB.</span>
                </div>
              </div>
            </div>

            {/* Card 2: Call to Action: Sudah di Outlet? Pesan Jasdor Diskon 50% */}
            <div className="bg-gradient-to-br from-[#ebf7f3] to-white rounded-3xl p-6 border border-[#bde5d8] shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-black text-[#059669] uppercase tracking-wider mb-2">
                <Coffee className="w-4 h-4 text-[#059669]" />
                <span>Sudah Berada di Outlet?</span>
              </div>

              <h3 className="font-serif font-black text-lg text-[#4e403b]">
                Pesan Kopinya Lewat Kami Diskon 50%
              </h3>

              <p className="text-xs text-[#7d6b63] mt-2 leading-relaxed">
                Tinggal duduk santai sambil nikmatin WiFi! Admin kami langsung pesankan ke kasir/bar, kamu tinggal ambil pesananmu tanpa perlu antre bayar harga normal.
              </p>

              <div className="mt-4 pt-3 border-t border-[#bde5d8]/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#7d6b63]">Mulai dari:</div>
                  <div className="text-xs font-black text-[#059669]">Rp 9.500 / cup</div>
                </div>

                <Link
                  href="/jasdor/kopi-kenangan"
                  className="px-4 py-2.5 rounded-xl bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                >
                  <span>Pilih Menu Kopi</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#bae5d6]" />
                </Link>
              </div>
            </div>

            {/* Card 3: Quick Connect Steps */}
            <div className="bg-white rounded-3xl p-5 border border-[#eae2d9] shadow-2xs text-xs text-[#7d6b63] space-y-2.5">
              <div className="font-bold text-[#4e403b] flex items-center gap-1.5 text-xs">
                <Info className="w-3.5 h-3.5 text-[#059669]" />
                <span>Cara Konek ke WiFi Kopi Kenangan:</span>
              </div>
              <ul className="space-y-1.5 pl-5 list-decimal text-[11px] leading-relaxed">
                <li>Aktifkan WiFi di HP atau laptop kamu.</li>
                <li>Pilih jaringan bernama <strong>Teman Kenangan</strong>.</li>
                <li>Masukkan password tanggal hari ini di atas.</li>
                <li>Jika browser membuka login landing page, klik <em>Lanjutkan / Connect</em>.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Full 31-Day Calendar Grid (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#eae2d9] shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#eae2d9]">
                <div>
                  <h2 className="font-serif font-black text-xl text-[#4e403b]">
                    Semua Tanggal (1 - 31)
                  </h2>
                  <p className="text-[11px] text-[#7d6b63] mt-0.5">
                    Ketuk salah satu kartu tanggal untuk menyalin password ke clipboard.
                  </p>
                </div>

                {/* Quick filter by day or name */}
                <div className="relative w-full sm:w-44">
                  <Search className="w-3.5 h-3.5 text-[#7d6b63] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchDay}
                    onChange={(e) => setSearchDay(e.target.value)}
                    placeholder="Filter tanggal..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] placeholder-[#7d6b63]/60 focus:border-[#4e403b] focus:ring-1 focus:ring-[#4e403b] focus:outline-hidden"
                  />
                  {searchDay && (
                    <button
                      onClick={() => setSearchDay('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7d6b63] hover:text-[#4e403b]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 31-Days Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {daysList.map((day) => {
                  const pass = WIFI_PASSWORDS[day] || '';
                  const isToday = day === currentWIB.day;
                  const isTomorrow = day === tomorrowDay;
                  const isCopied = copiedKey === `day-${day}`;

                  return (
                    <button
                      key={day}
                      onClick={() => handleCopy(pass, `day-${day}`, `Password Tanggal ${day}`)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isToday
                          ? 'bg-[#ebf7f3] border-[#059669] shadow-xs ring-1 ring-[#059669]'
                          : 'bg-[#fbf9f5] border-[#eae2d9] hover:border-[#bde5d8] hover:bg-white text-[#4e403b]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isToday
                                ? 'bg-[#059669] text-[#fbf9f5]'
                                : 'bg-white border border-[#eae2d9] text-[#4e403b]'
                            }`}
                          >
                            {day}
                          </span>
                          <span className="text-[10px] font-bold text-[#7d6b63]">
                            {isToday ? (
                              <span className="text-[#059669] font-black uppercase">Hari ini</span>
                            ) : isTomorrow ? (
                              <span className="text-[#4e403b] font-semibold">Besok</span>
                            ) : (
                              `Tanggal ${day}`
                            )}
                          </span>
                        </div>

                        <div
                          className={`p-1 rounded-md transition-colors ${
                            isCopied
                              ? 'text-[#059669] bg-[#bae5d6]'
                              : 'text-[#7d6b63] group-hover:text-[#4e403b]'
                          }`}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="font-mono text-xs font-bold text-[#4e403b] truncate w-full mt-0.5">
                        {pass}
                      </div>

                      {isCopied && (
                        <div className="text-[9px] font-bold text-[#059669] mt-1 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Tersalin ke clipboard
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {daysList.length === 0 && (
                <div className="text-center py-8 text-xs text-[#7d6b63]">
                  Tidak ada tanggal yang sesuai dengan pencarian &quot;{searchDay}&quot;.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#eae2d9] py-8 px-4 text-center text-xs text-[#7d6b63]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#4e403b] font-serif">saoirse.</span>
            <span>•</span>
            <span>wifi kopi kenangan update otomatis setiap hari</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/jasdor/kopi-kenangan" className="text-[#4e403b] hover:underline">
              Pesan Kopi Kenangan
            </Link>
            <span>•</span>
            <Link href="/jasdor/tomoro" className="text-[#4e403b] hover:underline">
              Pesan Tomoro Coffee
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

