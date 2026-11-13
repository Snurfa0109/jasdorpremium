'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CoffeeOrderModal from '@/components/CoffeeOrderModal';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartBar from '@/components/FloatingCartBar';
import OutletPickerModal from '@/components/OutletPickerModal';
import { COFFEE_BRANDS, CoffeeItem } from '@/data/coffee';
import { KOPKEN_OUTLETS } from '@/data/outlets';
import { useScopedCart } from '@/hooks/useScopedCart';
import {
  ArrowLeft,
  Search,
  Plus,
  MapPin,
  Coffee,
  ShoppingBag,
  ShieldCheck,
  Wifi,
  AlertCircle,
  Clock,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua Menu' },
  { id: 'signature', label: '⭐ Signature & Mantan' },
  { id: 'coffee', label: '☕ Kopi & Espresso' },
  { id: 'non-coffee', label: '🍫 Non-Coffee & Frappe' },
  { id: 'tea', label: '🧋 Kenangan Tea' },
  { id: 'food', label: '🍞 Roti, Toast & Bakery' },
];

export default function KopiKenanganPage() {
  const router = useRouter();
  const brand = COFFEE_BRANDS.find((b) => b.id === 'kopken') || COFFEE_BRANDS[0];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CoffeeItem | null>(null);
  const [showOutletPicker, setShowOutletPicker] = useState(false);

  // Scoped isolated cart for Kopi Kenangan
  const cart = useScopedCart('kopken', 'Kopi Kenangan - Kota Kasablanka (Lt. LG)');

  // Ensure user has selected an outlet or redirect to outlet selector
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saoirse_cabang_kopken');
      if (!saved) {
        router.push('/jasdor');
      }
    } catch (e) {
      // silent
    }
  }, [router]);

  const [adminSettings, setAdminSettings] = useState<{
    kopkenOverrides: Record<string, { discountPrice?: number; originalPrice?: number; isUnavailable?: boolean }>;
  }>({ kopkenOverrides: {} });
  const [jasdorOpen, setJasdorOpen] = useState(true);
  const [jasdorAnnouncement, setJasdorAnnouncement] = useState('');
  const [jasdorEstimatedOpen, setJasdorEstimatedOpen] = useState('');
  const [jasdorClosedSchedule, setJasdorClosedSchedule] = useState('');
  const [queueOpen, setQueueOpen] = useState(true);
  const [queueLockReason, setQueueLockReason] = useState('');
  const [queueEstimatedOpen, setQueueEstimatedOpen] = useState('');
  const [itemNoticeToast, setItemNoticeToast] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings) {
          if (d.settings.kopkenOverrides) {
            setAdminSettings({ kopkenOverrides: d.settings.kopkenOverrides });
          }
          if (d.settings.store) {
            const st = d.settings.store;
            setJasdorOpen(st.jasdorOpen ?? true);
            setJasdorAnnouncement(st.jasdorAnnouncement || '');
            setJasdorEstimatedOpen(st.jasdorEstimatedOpen || '');
            setJasdorClosedSchedule(st.jasdorClosedSchedule || '');
            setQueueOpen(st.queueOpen ?? true);
            setQueueLockReason(st.queueLockReason || '');
            setQueueEstimatedOpen(st.queueEstimatedOpen || '');
          }
        }
      })
      .catch(() => {});
  }, []);

  const isServiceOpen = jasdorOpen && queueOpen;

  const showItemNotice = (msg: string) => {
    setItemNoticeToast(msg);
    setTimeout(() => setItemNoticeToast(''), 3000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Automated detection of outlet type (Express/Container/Booth vs Full Store)
  const isExpressOutlet = useMemo(() => {
    const o = (cart.outlet || '').toLowerCase();
    return /container|booth|spbu|stasiun|halte|shell|express|apotik|pos/i.test(o);
  }, [cart.outlet]);

  const checkItemAvailability = (item: CoffeeItem) => {
    if (!isServiceOpen) {
      const est = jasdorEstimatedOpen || queueEstimatedOpen || 'Segera';
      return {
        isReady: false,
        reason: !jasdorOpen ? `Jasdor Tutup (Buka ${est})` : `Antrian Ditahan (Buka ${est})`,
      };
    }
    const override = adminSettings.kopkenOverrides[item.id];
    if (override?.isUnavailable) {
      return { isReady: false, reason: '❌ Stok Habis di Outlet' };
    }
    // If booth/container/express, hot kitchen items like toast/panini/bagel that require oven are unavailable
    if (isExpressOutlet && item.category === 'food' && /toast|panini|bagel/i.test(item.name)) {
      return { isReady: false, reason: 'Habis / Outlet Tanpa Oven' };
    }
    return { isReady: true, reason: 'Ready' };
  };

  const filteredItems = brand.items.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#382820] pb-24">
      <Navbar />

      {/* Added to cart toast */}
      {cart.addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#382820] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <ShoppingBag className="w-4 h-4 text-[#bae5d6]" />
          <span>{cart.addedToast}</span>
        </div>
      )}

      {/* Toast Notifikasi Menu Nonaktif / Habis */}
      {itemNoticeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#382820] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{itemNoticeToast}</span>
        </div>
      )}

      {/* Closed Announcement Banner */}
      {!isServiceOpen && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div className="p-4 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs shadow-md space-y-2 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm text-amber-950">
                    Layanan Jastip Kopi Kenangan Sedang Tutup Sementara 🛑
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                    Pemesanan Ditahan
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                  {!jasdorOpen
                    ? (jasdorAnnouncement || 'Mohon maaf, pemesanan Kopi Kenangan sedang ditutup sementara oleh admin.')
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
        </div>
      )}

      {/* App Header Banner */}
      <div className="bg-white text-[#382820] border-b border-[#eae2d9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/jasdor"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a665b] hover:text-[#382820] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ganti Outlet</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] shadow-2xs">
                DISKON 50%
              </span>

              {/* Scoped Cart Button in Header */}
              <button
                onClick={() => cart.setIsCartOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#bae5d6]" />
                <span>Keranjang</span>
                {cart.items.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#bae5d6] text-[#059669] text-[10px] font-black">
                    {cart.items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Outlet / Cabang Selector Bar */}
          <div className="bg-[#fbf9f5] rounded-2xl p-3 border border-[#eae2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center shrink-0 shadow-2xs text-[#059669]">
                <MapPin className="w-4 h-4 text-[#059669]" />
              </div>
              <div>
                <div className="text-[10px] text-[#7a665b] font-semibold uppercase tracking-wider">
                  Cabang Pick-up (Ambil Sendiri di Kasir)
                </div>
                <div className="font-bold text-xs sm:text-sm text-[#382820] truncate max-w-xs sm:max-w-md">
                  {cart.outlet}
                </div>
              </div>
            </div>

            <Link
              href="/jasdor"
              className="px-3.5 py-1.5 rounded-xl bg-white text-[#382820] hover:bg-[#f2ece3] border border-[#eae2d9] font-bold text-xs shrink-0 transition-colors shadow-2xs text-center cursor-pointer inline-flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#059669]" />
              <span>Ganti Cabang</span>
            </Link>
          </div>

          {/* Quick WiFi Kopken Banner */}
          <div className="mt-2.5 p-2.5 sm:p-3 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#059669] text-[#fbf9f5] flex items-center justify-center shrink-0">
                <Wifi className="w-3.5 h-3.5 text-[#bae5d6]" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-[#059669] block sm:inline">
                  Lagi santai di outlet Kopi Kenangan?
                </span>{' '}
                <span className="text-[#7d6b63]">
                  Cek password WiFi &quot;Teman Kenangan&quot; hari ini gratis.
                </span>
              </div>
            </div>
            <Link
              href="/wifi"
              className="px-3 py-1 rounded-xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] text-[11px] font-bold shrink-0 transition-colors shadow-2xs"
            >
              Cek WiFi ➔
            </Link>
          </div>

          {/* Sistem Antrian & Estimasi Bar */}
          <div className="mt-2 p-2.5 sm:p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#059669]" />
              </div>
              <div className="text-[11px] text-[#7a665b] leading-tight">
                <strong className="text-[#382820]">Sistem Antrian Berjadwal (PO):</strong> Estimasi proses 5–30 menit (No Rush Order). Disarankan pesan sebelum tiba di outlet.
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#eae2d9] text-[#7a665b] shrink-0 hidden sm:inline">
              Alur Tertib
            </span>
          </div>

          {/* Jasdor Closure Announcement */}
          {!jasdorOpen && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block">Pemberitahuan: Jasdor Kopi Kenangan Tutup Sementara</span>
                <p className="mt-0.5 text-xs text-amber-800">
                  {jasdorAnnouncement || 'Mohon maaf, order Kopi Kenangan sedang ditutup sementara oleh admin. Menu tidak dapat ditambahkan ke keranjang.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Searchbar & Category Navigation */}
      <section className="bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#eae2d9] sticky top-16 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          {/* Searchbar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#7a665b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari menu Kopi Kenangan... (Kenangan Mantan, Cokelat, Roti)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#7a665b] focus:outline-hidden focus:ring-1 focus:ring-[#382820]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#7a665b] hover:text-[#382820]"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#382820] text-[#fbf9f5] border-[#382820] shadow-xs'
                      : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#fbf9f5] hover:text-[#382820]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Menu Feed */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#eae2d9]">
            <Coffee className="w-8 h-8 text-[#7a665b] mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#382820]">Menu tidak ditemukan</h3>
            <p className="text-xs text-[#7a665b] mt-1">Coba kata kunci lain atau pilih Semua Menu.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredItems.map((item) => {
              const availability = checkItemAvailability(item);
              const isReady = availability.isReady;
              const override = adminSettings.kopkenOverrides[item.id];
              const effectiveDiscountPrice = override?.discountPrice ?? item.discountPrice;
              const effectiveOriginalPrice = override?.originalPrice ?? item.originalPrice;
              const effectiveItem = {
                ...item,
                discountPrice: effectiveDiscountPrice,
                originalPrice: effectiveOriginalPrice,
              };

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    isReady
                      ? setSelectedItem(effectiveItem)
                      : showItemNotice(`Menu "${item.name}" ${availability.reason}`)
                  }
                  className={`bg-white rounded-2xl p-3 sm:p-4.5 border transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-2xs group ${
                    isReady
                      ? 'border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-md cursor-pointer'
                      : 'border-[#eae2d9] opacity-60 cursor-not-allowed bg-[#faf8f5]'
                  }`}
                >
                  {/* Left Side: Info & Price */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!isReady ? (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          {availability.reason.toUpperCase()}
                        </span>
                      ) : item.badge ? (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                          {item.badge}
                        </span>
                      ) : null}
                      <span className="text-[10px] font-bold text-[#7a665b] uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-[#382820] group-hover:text-[#059669] transition-colors leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#7a665b] mt-1 line-clamp-2 leading-relaxed">
                      {isReady ? item.description : availability.reason}
                    </p>

                    {/* Pricing row */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-[#059669]">
                        {formatRupiah(effectiveDiscountPrice)}
                      </span>
                      <span className="text-xs line-through text-[#7a665b]">
                        {formatRupiah(effectiveOriginalPrice)}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                        -50%
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Food/Cup Photo & Cocoa Add Button */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative border border-[#eae2d9] shadow-2xs bg-[#fbf9f5]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isReady ? 'group-hover:scale-105' : 'grayscale'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded-md bg-[#382820]/80 backdrop-blur-xs text-[9px] font-bold text-[#bae5d6]">
                        Kopken
                      </div>
                      {!isReady && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                          <span className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                            Kosong
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!isReady}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isReady) setSelectedItem(effectiveItem);
                      }}
                      className={`mt-2 w-full py-1.5 px-3 rounded-xl font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95 ${
                        isReady
                          ? 'bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] cursor-pointer'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {isReady ? (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#bae5d6]" />
                          <span>Tambah</span>
                        </>
                      ) : (
                        <span>Habis</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Alur Pemesanan & Regulasi Layanan Jasdor Kopi Kenangan */}
        <section className="mt-10 p-5 sm:p-6 rounded-3xl bg-white border border-[#eae2d9] text-xs shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#382820] text-sm">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Alur Pemesanan &amp; Regulasi Layanan Jasdor Kopi Kenangan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kolom 1: Alur Ambil di Kasir */}
            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2">
              <h4 className="font-bold text-[#382820] text-xs flex items-center gap-1.5">
                <span>☕ Cara Pengambilan di Kasir Outlet</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-[#7a665b] leading-relaxed text-[11px]">
                <li>Pilih menu &amp; cabang outlet favoritmu di katalog atas, masukkan ke keranjang.</li>
                <li>Pilih opsi jam pengambilan (ASAP atau dijadwalkan) dan checkout via QRIS resmi.</li>
                <li>Admin memproses pesananmu ke sistem kasir resmi outlet yang kamu pilih.</li>
                <li>Tunjukkan nomor tiket antrian atau foto struk kasir yang tampil di layar ke barista saat mengambil kopi.</li>
              </ol>
            </div>

            {/* Kolom 2: Regulasi Estimasi & No Rush Order */}
            <div className="p-4 rounded-2xl bg-[#ebf7f3]/60 border border-[#bde5d8] space-y-2 text-[#382820]">
              <h4 className="font-bold text-xs flex items-center gap-1.5 text-[#059669]">
                <span>⏱️ Estimasi Waktu &amp; Kebijakan Antrian (No Rush)</span>
              </h4>
              <ul className="space-y-1.5 text-[#7a665b] leading-relaxed text-[11px]">
                <li>
                  • <b>Sistem Pre-Order Tertib</b>: Estimasi waktu proses admin rata-rata <b>5 hingga 30 menit</b> setelah pembayaran terverifikasi, menyesuaikan ketersediaan antrian sistem kasir.
                </li>
                <li>
                  • <b>Kebijakan No Rush Order</b>: Seluruh pesanan dilayani secara berkala dan berurutan. Mohon kesediaannya tidak memesan tergesa-gesa / mendesak demi kelancaran alur kasir.
                </li>
                <li>
                  • <b>Pesanan Satuan / Nominal Hemat (&lt; Rp35.000)</b>: Diproses mengikuti siklus kloter antrian berkala sistem, sehingga membutuhkan alokasi waktu yang fleksibel dan tidak dapat dipercepat secara mendadak.
                </li>
                <li>
                  • <b>Ketersediaan Siap Saji (Ready Slot)</b>: Waktu pemrosesan dapat berlangsung jauh lebih cepat apabila sistem admin telah mengalokasikan kuota siap pakai pada jam operasional tersebut.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Outlet / Cabang Picker Modal */}
      {showOutletPicker && (
        <OutletPickerModal
          brandName="Kopi Kenangan"
          outlets={KOPKEN_OUTLETS}
          selectedOutlet={cart.outlet}
          onSelect={cart.setOutlet}
          onClose={() => setShowOutletPicker(false)}
        />
      )}

      {/* Coffee Customization Modal (Adds to Scoped Cart) */}
      {selectedItem && (
        <CoffeeOrderModal
          item={selectedItem}
          brandName="Kopi Kenangan"
          defaultOutletName={cart.outlet}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(cartItem) => {
            cart.addItem({
              ...cartItem,
              brand: 'kopken',
              outlet: cart.outlet,
            });
          }}
        />
      )}

      {/* Scoped Cart Drawer for Kopi Kenangan */}
      <CartDrawer
        scope="kopken"
        title="Keranjang Kopi Kenangan"
        items={cart.items}
        outlet={cart.outlet}
        onOpenOutletPicker={() => setShowOutletPicker(true)}
        onUpdateQty={cart.updateQty}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        isQueueOpen={isServiceOpen}
      />

      {/* Floating Cart Bar for Kopi Kenangan */}
      <FloatingCartBar
        items={cart.items}
        outlet={cart.outlet}
        onOpenCart={() => cart.setIsCartOpen(true)}
      />
    </div>
  );
}
