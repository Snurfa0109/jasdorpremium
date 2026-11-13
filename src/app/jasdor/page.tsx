'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { KOPKEN_OUTLETS, POPULAR_CITIES } from '@/data/outlets';
import {
  Search,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Coffee,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function getWIBMinutes() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 3600000 * 7);
  return wib.getHours() * 60 + wib.getMinutes();
}

function parseOutletStatus(hoursStr?: string, curMins: number = 720): { isOpen: boolean; label: string } {
  if (!hoursStr) return { isOpen: true, label: 'Buka s/d 22:00' };
  const parts = hoursStr.split(/[–\-]/);
  if (parts.length < 2) return { isOpen: true, label: 'Buka' };

  const [openStr, closeStr] = parts.map((s) => s.trim());
  const [oH, oM] = openStr.split(':').map(Number);
  const [cH, cM] = closeStr.split(':').map(Number);
  if (isNaN(oH) || isNaN(cH)) return { isOpen: true, label: 'Buka' };

  const openMins = oH * 60 + (oM || 0);
  const closeMins = cH * 60 + (cM || 0);

  let isOpen = false;
  if (closeMins > openMins) {
    isOpen = curMins >= openMins && curMins <= closeMins;
  } else {
    // Overnight operational hours (e.g. 07:30 - 01:10)
    isOpen = curMins >= openMins || curMins <= closeMins;
  }

  return {
    isOpen,
    label: isOpen ? `Buka s/d ${closeStr}` : `Tutup • Buka ${openStr}`,
  };
}

export default function JasdorOutletPickerPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [customOutletInput, setCustomOutletInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  const [currentWibMinutes, setCurrentWibMinutes] = useState(720);
  const [jasdorOpen, setJasdorOpen] = useState(true);
  const [jasdorAnnouncement, setJasdorAnnouncement] = useState('');
  const [jasdorEstimatedOpen, setJasdorEstimatedOpen] = useState('');
  const [jasdorClosedSchedule, setJasdorClosedSchedule] = useState('');
  const [queueOpen, setQueueOpen] = useState(true);
  const [queueLockReason, setQueueLockReason] = useState('');
  const [queueEstimatedOpen, setQueueEstimatedOpen] = useState('');

  useEffect(() => {
    setCurrentWibMinutes(getWIBMinutes());
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings?.store) {
          const st = d.settings.store;
          setJasdorOpen(st.jasdorOpen ?? true);
          setJasdorAnnouncement(st.jasdorAnnouncement || '');
          setJasdorEstimatedOpen(st.jasdorEstimatedOpen || '');
          setJasdorClosedSchedule(st.jasdorClosedSchedule || '');
          setQueueOpen(st.queueOpen ?? true);
          setQueueLockReason(st.queueLockReason || '');
          setQueueEstimatedOpen(st.queueEstimatedOpen || '');
        }
      })
      .catch(() => {});
  }, []);

  const getDisplayName = (rawName: string) => {
    return rawName.replace(/^Kopi Kenangan\s*[-–]\s*/i, '').trim();
  };

  const openCount = useMemo(() => {
    return KOPKEN_OUTLETS.filter((o) => parseOutletStatus(o.hours, currentWibMinutes).isOpen).length;
  }, [currentWibMinutes]);

  const filteredOutlets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return KOPKEN_OUTLETS.filter((outlet) => {
      if (selectedCity !== 'Semua') {
        const inCity =
          outlet.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
          outlet.address.toLowerCase().includes(selectedCity.toLowerCase());
        if (!inCity) return false;
      }

      if (onlyOpen) {
        const status = parseOutletStatus(outlet.hours, currentWibMinutes);
        if (!status.isOpen) return false;
      }

      if (q) {
        const matchName = outlet.name.toLowerCase().includes(q);
        const matchAddr = outlet.address.toLowerCase().includes(q);
        const matchCity = outlet.city.toLowerCase().includes(q);
        if (!matchName && !matchAddr && !matchCity) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, onlyOpen, currentWibMinutes]);

  const isJasdorAvailable = jasdorOpen && queueOpen;

  const handleSelectOutlet = (outletName: string) => {
    if (!isJasdorAvailable) {
      const reason = !jasdorOpen
        ? (jasdorAnnouncement || 'Layanan Jasdor Kopi Kenangan sedang ditutup sementara oleh admin.')
        : (queueLockReason || 'Antrian toko sedang ditahan sementara.');
      const est = jasdorEstimatedOpen || queueEstimatedOpen || 'Segera';
      const sched = jasdorClosedSchedule || '08:00 - 21:30 WIB';
      alert(`⚠️ PEMESANAN DITUTUP SEMENTARA\n\n${reason}\n\n⏰ Estimasi Buka: ${est}\n🕒 Jadwal Kasir: ${sched}`);
      return;
    }
    try {
      localStorage.setItem('saoirse_cabang_kopken', outletName);
    } catch (e) {
      // silent
    }
    router.push('/jasdor/kopi-kenangan');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOutletInput.trim()) return;
    const cleanName = customOutletInput.trim().startsWith('Kopi Kenangan')
      ? customOutletInput.trim()
      : `Kopi Kenangan - ${customOutletInput.trim()}`;
    handleSelectOutlet(cleanName);
  };

  const handleNearestDetect = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setSelectedCity('Jakarta');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setSelectedCity('Jakarta');
      },
      () => {
        setIsLocating(false);
        setSelectedCity('Jakarta');
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#382820] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a665b] hover:text-[#382820] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <span className="text-[11px] font-semibold text-[#7a665b]">
            Total <strong className="text-[#059669]">{KOPKEN_OUTLETS.length.toLocaleString('id-ID')}</strong> Outlet Terdaftar
          </span>
        </div>

        {/* Global Jasdor Announcement Banner */}
        {!isJasdorAvailable && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs shadow-md space-y-2 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm sm:text-base text-amber-950">
                    Layanan Jastip Kopi Kenangan Sedang Tutup Sementara 🛑
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                    Pemesanan Nonaktif
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                  {!jasdorOpen
                    ? (jasdorAnnouncement || 'Mohon maaf, antrian jastip order Kopi Kenangan diskon 50% sedang ditutup sementara oleh admin.')
                    : (queueLockReason || 'Antrian toko sedang ditahan sementara oleh admin.')}
                </p>
                <div className="mt-2.5 pt-2 border-t border-amber-200 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] font-bold text-amber-900">
                  <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>⏰ Estimasi Buka: <strong>{jasdorEstimatedOpen || queueEstimatedOpen || 'Segera'}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    <span>🕒 Jadwal Kasir: <strong>{jasdorClosedSchedule || '08:00 - 21:30 WIB'}</strong></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section: Signature Modern Studio Header */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae2d9] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ebf7f3]/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebf7f3] border border-[#bde5d8] text-[11px] font-bold text-[#059669] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span>saoirse. coffee pass</span>
              <span className="text-[#bae5d6]">•</span>
              <span>Diskon 50% All Menu</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#382820] tracking-tight leading-[1.12]">
              Pilih Outlet &amp; Ambil di Kasir.
            </h1>

            <p className="mt-3 text-xs sm:text-base text-[#7a665b] leading-relaxed">
              Cari cabang Kopi Kenangan terdekatmu. Katalog resmi otomatis terbuka dengan harga diskon 50%, tinggal pesan dan sebutkan nama kamu saat mengambil di kasir tanpa antre.
            </p>

            {/* 3 Steps Mini Timeline */}
            <div className="mt-6 pt-6 border-t border-[#eae2d9] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#382820] text-[#fbf9f5] flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <span className="font-semibold text-[#382820]">Tentukan Cabang</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#059669] text-[#bae5d6] flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <span className="font-semibold text-[#382820]">Pilih Menu Diskon 50%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#bae5d6] text-[#059669] flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <span className="font-semibold text-[#382820]">Ambil di Kasir / Barista</span>
              </div>
            </div>

            {/* Subtle Policy Note */}
            <div className="mt-4 pt-3 border-t border-[#eae2d9]/60 flex items-center gap-2 text-[11px] text-[#7a665b]">
              <Clock className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>
                <strong className="text-[#382820]">Estimasi Proses 5–30 Menit:</strong> Sistem antrian pre-order teratur (No Rush Order) agar pesanan terverifikasi rapi di kasir outlet.
              </span>
            </div>
          </div>
        </section>

        {/* Search, Filter & City Hub */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7a665b] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(30);
                }}
                placeholder="Ketik nama mall, jalan, atau area (contoh: Kasablanka, Sudirman, Dago)..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#7a665b] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] focus:outline-hidden shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7a665b] hover:text-[#382820] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleNearestDetect}
                disabled={isLocating}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-[#ebf7f3] border border-[#eae2d9] hover:border-[#bde5d8] text-xs font-bold text-[#059669] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Navigation className="w-3.5 h-3.5 text-[#059669]" />
                <span>{isLocating ? 'Mendeteksi...' : 'Terdekat'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyOpen(!onlyOpen);
                  setVisibleCount(30);
                }}
                className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95 ${
                  onlyOpen
                    ? 'bg-[#059669] text-[#fbf9f5] border-[#059669]'
                    : 'bg-white hover:bg-[#ebf7f3] border-[#eae2d9] text-[#382820]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${onlyOpen ? 'bg-[#bae5d6]' : 'bg-emerald-500'}`} />
                <span>Hanya yang Buka ({openCount})</span>
              </button>
            </div>
          </div>

          {/* Quick City Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            {POPULAR_CITIES.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setVisibleCount(30);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border shadow-2xs ${
                    isSelected
                      ? 'bg-[#382820] border-[#382820] text-[#fbf9f5]'
                      : 'bg-white hover:bg-[#ebf7f3] border-[#eae2d9] text-[#7a665b] hover:text-[#382820]'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2-Column Responsive Outlets Grid (Signature Layout) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7a665b]">
            <span>
              Menampilkan <strong>{filteredOutlets.length}</strong> outlet {selectedCity !== 'Semua' ? `di ${selectedCity}` : ''}
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#059669] font-bold hover:underline"
              >
                Hapus Pencarian
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredOutlets.slice(0, visibleCount).map((outlet) => {
              const status = parseOutletStatus(outlet.hours, currentWibMinutes);
              const displayName = getDisplayName(outlet.name);

              return (
                <div
                  key={outlet.id}
                  onClick={() => handleSelectOutlet(outlet.name)}
                  className={`border rounded-3xl p-5 transition-all flex flex-col justify-between gap-4 group shadow-xs ${
                    isJasdorAvailable
                      ? 'bg-white hover:bg-[#fbf9f5] border-[#eae2d9] hover:border-[#059669] cursor-pointer active:scale-[0.99] hover:shadow-md'
                      : 'bg-[#faf8f5] border-stone-200 opacity-75 cursor-not-allowed'
                  }`}
                >
                  <div>
                    {/* Top Row: City Tag & Live Status Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-bold text-[#059669] bg-[#ebf7f3] px-2.5 py-0.5 rounded-lg border border-[#bde5d8] truncate">
                        {outlet.city}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 ${
                          status.isOpen
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                          }`}
                        />
                        <span>{status.label}</span>
                      </span>
                    </div>

                    {/* Outlet Title */}
                    <h3 className="font-bold text-base text-[#382820] group-hover:text-[#059669] transition-colors leading-snug">
                      {displayName}
                    </h3>

                    {/* Address */}
                    <p className="text-xs text-[#7a665b] mt-1.5 line-clamp-2 leading-relaxed">
                      {outlet.address}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-[#eae2d9] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#7a665b] flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-[#059669]" />
                      <span>83 Menu Diskon 50%</span>
                    </span>

                    <span className="font-bold text-[#059669] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Pilih Cabang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOutlets.length === 0 && (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#eae2d9] shadow-xs">
              <MapPin className="w-10 h-10 text-[#7a665b] mx-auto mb-3" />
              <div className="font-bold text-base text-[#382820]">Tidak ada outlet yang sesuai pencarian</div>
              <p className="text-xs text-[#7a665b] mt-1.5 max-w-sm mx-auto">
                Coba gunakan kata kunci lain, ganti filter kota, atau masukkan cabang khusus kamu di bawah.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {filteredOutlets.length > visibleCount && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 30)}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-[#ebf7f3] border border-[#eae2d9] hover:border-[#bde5d8] text-xs font-bold text-[#382820] hover:text-[#059669] transition-colors cursor-pointer shadow-2xs"
              >
                Muat lebih banyak ({filteredOutlets.length - visibleCount} outlet lagi)
              </button>
            </div>
          )}
        </section>

        {/* Custom Outlet Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#eae2d9] shadow-xs text-center max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] mx-auto mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-[#382820]">
            Cabang yang kamu tuju belum terdaftar?
          </h3>
          <p className="text-xs text-[#7a665b] mt-1 mb-4">
            Tulis nama cabang resmi Kopi Kenangan yang kamu inginkan, sistem kami akan langsung menghubungkannya.
          </p>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customOutletInput}
              onChange={(e) => setCustomOutletInput(e.target.value)}
              placeholder="Contoh: Kopi Kenangan - Mall Bassura"
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#7a665b] focus:border-[#059669] focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Gunakan
            </button>
          </form>
        </section>

        {/* Ketentuan Antrian & Estimasi Proses */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white border border-[#eae2d9] text-xs shadow-xs max-w-xl mx-auto space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-[#382820] text-sm">
            <Clock className="w-4 h-4 text-[#059669]" />
            <span>Ketentuan Sistem Antrian Jasdor (Pre-Order Tertib)</span>
          </div>
          <p className="text-[11px] text-[#7a665b] leading-relaxed">
            • <b>Estimasi Proses 5–30 Menit</b>: Seluruh pesanan disinkronkan secara berkala ke kasir outlet resmi. Mohon menunggu dengan tertib dan hindari pesanan mendesak (<i>no rush order</i>).
          </p>
          <p className="text-[11px] text-[#7a665b] leading-relaxed">
            • <b>Pesanan Hemat (&lt; Rp35.000)</b>: Diproses mengikuti kloter antrian sistem berikutnya sehingga disarankan untuk memesan beberapa saat sebelum waktu konsumsi.
          </p>
          <p className="text-[11px] text-[#7a665b] leading-relaxed">
            • <b>Alokasi Siap Saji</b>: Waktu pemrosesan dapat jauh lebih singkat apabila admin telah memasukkan alokasi slot kuota ready pada jam tersebut.
          </p>
        </section>
      </main>
    </div>
  );
}
