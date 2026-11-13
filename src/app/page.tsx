'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { PRODUCTS } from '@/data/products';
import {
  ChevronDown,
  ArrowRight,
  QrCode,
  Clock,
  Coffee,
  Smartphone,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Zap,
  MapPin,
  MessageCircle,
} from 'lucide-react';

const FAQS = [
  {
    q: 'Berapa lama proses pesanan sampai siap?',
    a: 'Untuk Aplikasi Premium, akun diproses dalam 5–15 menit setelah pembayaran QRIS terkonfirmasi. Data login langsung tampil otomatis di layar tiketmu. Untuk Jasdor Kopi, pesanan langsung masuk ke sistem kasir outlet pilihanmu.',
  },
  {
    q: 'Bagaimana jika akun aplikasi berkendala atau ter-logout?',
    a: 'Semua akun di saoirse store bergaransi Full Replace selama masa aktif. Jika terjadi kendala login atau limit, kamu cukup hubungi CS Telegram atau Chatbot di layar tiket untuk penggantian baru.',
  },
  {
    q: 'Bagaimana cara mengambil pesanan Jasdor Kopi Kenangan?',
    a: 'Setelah bayar via QRIS diskon 50% di saoirse, kamu cukup datang ke cabang Kopi Kenangan yang dipilih, lalu sebutkan nama kamu di kasir atau pick-up bar. Minuman langsung diserahkan tanpa antre!',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Pembayaran 100% menggunakan QRIS All Payment resmi. Bisa di-scan menggunakan seluruh aplikasi M-Banking (BCA, Mandiri, BRI, BNI, dll.) maupun E-Wallet (GoPay, DANA, OVO, ShopeePay).',
  },
];

export default function HomePage() {
  const [activeQueueCount, setActiveQueueCount] = useState(2);
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [queueLockReason, setQueueLockReason] = useState('');
  const [queueEstimatedOpen, setQueueEstimatedOpen] = useState('');
  const [jasdorOpen, setJasdorOpen] = useState(true);
  const [jasdorEstimatedOpen, setJasdorEstimatedOpen] = useState('');
  const [premiumOpen, setPremiumOpen] = useState(true);
  const [premiumEstimatedOpen, setPremiumEstimatedOpen] = useState('');
  const [jascurOpen, setJascurOpen] = useState(true);
  const [jascurEstimatedOpen, setJascurEstimatedOpen] = useState('');

  const fetchQueueStats = async () => {
    try {
      const [resOrders, resSettings] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/admin/settings'),
      ]);
      const dataOrders = await resOrders.json();
      if (dataOrders.success && dataOrders.stats) {
        setActiveQueueCount(dataOrders.stats.activeQueues);
        setIsQueueOpen(dataOrders.queueOpen);
      }
      const dataSettings = await resSettings.json();
      if (dataSettings.success && dataSettings.settings) {
        const s = dataSettings.settings;
        setJasdorOpen(s.store.jasdorOpen ?? true);
        setJasdorEstimatedOpen(s.store.jasdorEstimatedOpen || '');
        setPremiumOpen(s.store.premiumOpen ?? true);
        setPremiumEstimatedOpen(s.store.premiumEstimatedOpen || '');
        setQueueLockReason(s.store.queueLockReason || '');
        setQueueEstimatedOpen(s.store.queueEstimatedOpen || '');
        if (s.jascur) {
          setJascurOpen(s.jascur.isOpen ?? true);
          setJascurEstimatedOpen(s.jascur.estimatedOpen || '');
        }
      }
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    fetchQueueStats();
    const interval = setInterval(fetchQueueStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const topApps = PRODUCTS.filter((p) =>
    ['netflix', 'spotify', 'canva', 'youtube'].includes(p.id)
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#382820] font-sans">
      <Navbar activeQueuesCount={activeQueueCount} isQueueOpen={isQueueOpen} />

      {/* Hero Section: Signature Modern Studio Header */}
      <section className="pt-10 sm:pt-16 pb-10 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] shadow-2xs mb-5">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isQueueOpen ? 'bg-[#059669]' : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isQueueOpen ? 'bg-[#059669]' : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="font-bold">
            {isQueueOpen ? `Antrian Berjalan: ${activeQueueCount} pesanan` : 'Antrian Ditahan Sementara'}
          </span>
          <span className="text-[#bae5d6]">•</span>
          <span className="text-[#059669] font-bold">100% Legal &amp; Terverifikasi</span>
        </div>

        {/* Global Queue Closed Alert */}
        {!isQueueOpen && (
          <div className="mb-6 p-4 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs shadow-md max-w-xl mx-auto text-left space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-black text-sm text-amber-950">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
              <span>Antrian Toko Sedang Ditahan Sementara 🔴</span>
            </div>
            <p className="text-xs text-amber-900">
              {queueLockReason || 'Admin sedang istirahat / proses batch order.'}
            </p>
            <div className="pt-1 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <span>⏰ Estimasi Antrian Dibuka: <strong>{queueEstimatedOpen || 'Segera'}</strong></span>
            </div>
          </div>
        )}

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#382820] tracking-tight leading-[1.12] max-w-3xl mx-auto">
          Akun Premium Legal &amp; Kopi Kenangan Diskon 50%.
        </h1>

        <p className="mt-4 text-xs sm:text-base text-[#7a665b] max-w-2xl mx-auto leading-relaxed">
          Pusat belanja 20+ akun hiburan, streaming &amp; kerja dengan garansi replace penuh. Ditambah voucher Kopi Kenangan 50% di 1.330+ cabang, dan sesi curhat anonim yang aman.
        </p>

        {/* Quick Action CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/jasdor"
            className="px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Coffee className="w-4 h-4 text-[#bae5d6]" />
            <span>Pilih Outlet Kopi (Diskon 50%)</span>
            {(!jasdorOpen || !isQueueOpen) ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-900/60 text-white text-[10px] font-bold">
                Tutup (Buka {jasdorEstimatedOpen || queueEstimatedOpen || 'Segera'})
              </span>
            ) : (
              <ArrowRight className="w-4 h-4 text-[#bae5d6]" />
            )}
          </Link>

          <Link
            href="/premium"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#ebf7f3] text-[#382820] hover:text-[#059669] font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xs border border-[#eae2d9] hover:border-[#bde5d8] transition-all active:scale-[0.98]"
          >
            <Smartphone className="w-4 h-4 text-[#059669]" />
            <span>Katalog Aplikasi Premium</span>
            {(!premiumOpen || !isQueueOpen) && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                Tutup (Buka {premiumEstimatedOpen || queueEstimatedOpen || 'Segera'})
              </span>
            )}
          </Link>
        </div>

        {/* Trust Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-[#7a665b]">
          <span className="flex items-center gap-1.5 text-[#382820]">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Garansi Replace 100%
          </span>
          <span className="flex items-center gap-1.5 text-[#382820]">
            <Clock className="w-4 h-4 text-[#059669]" /> Proses 5-10 Menit
          </span>
          <span className="flex items-center gap-1.5 text-[#382820]">
            <QrCode className="w-4 h-4 text-[#059669]" /> QRIS Otomatis Semua Bank
          </span>
        </div>
      </section>

      {/* Signature Bento Showcase (3 Pillars) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 flex-1 w-full space-y-8">
        {/* Bento 1: Featured Wide Card - Jasdor Kopi Kenangan 50% */}
        <section className="bg-white rounded-3xl p-6 sm:p-9 border border-[#eae2d9] shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ebf7f3]/80 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24 group-hover:scale-110 transition-transform" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebf7f3] border border-[#bde5d8] text-[11px] font-bold text-[#059669]">
                <Coffee className="w-3.5 h-3.5" />
                <span>Jasa Order Kopi Kenangan</span>
                <span className="text-[#bae5d6]">•</span>
                <span>Hemat s.d. 50%</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#382820] leading-tight">
                Pesan Kopi Kenangan Hemat 50%, Ambil Sendiri di Kasir.
              </h2>

              <p className="text-xs sm:text-sm text-[#7a665b] leading-relaxed">
                Tersedia di 1.330+ cabang Kopi Kenangan seluruh Indonesia. Pilih menu favorit, atur gula &amp; es sesukamu. Admin langsung order ke sistem outlet, kamu cukup datang dan sebut namamu di kasir tanpa perlu antre!
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <Link
                  href="/jasdor"
                  className="px-5 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-[#bae5d6]" />
                  <span>Pilih Cabang Terdekat</span>
                  <ArrowRight className="w-4 h-4 text-[#bae5d6]" />
                </Link>
                <Link
                  href="/jasdor/kopi-kenangan"
                  className="px-4 py-3 rounded-2xl bg-[#fbf9f5] hover:bg-[#ebf7f3] text-[#382820] border border-[#eae2d9] font-bold text-xs transition-colors"
                >
                  Lihat 83 Menu
                </Link>
              </div>
            </div>

            {/* Right Mini Preview of Top Items */}
            <div className="lg:col-span-5 bg-[#fbf9f5] rounded-2xl p-4 sm:p-5 border border-[#eae2d9] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#382820] pb-2 border-b border-[#eae2d9]">
                <span>Menu Favorit Hari Ini</span>
                <span className="text-[#059669] text-[11px] font-black">Diskon 50%</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#eae2d9] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#382820]">Kopi Kenangan Mantan</div>
                    <div className="text-[10px] text-[#7a665b]">Reguler • Es &amp; Gula Aren</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#059669]">Rp 11.000</div>
                    <div className="text-[10px] text-[#7a665b] line-through">Rp 22.000</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#eae2d9] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#382820]">Cokelat Klasik</div>
                    <div className="text-[10px] text-[#7a665b]">Reguler • Rich Dark Cocoa</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#059669]">Rp 12.000</div>
                    <div className="text-[10px] text-[#7a665b] line-through">Rp 24.000</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#eae2d9] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#382820]">Roti Cokelat Klasik</div>
                    <div className="text-[10px] text-[#7a665b]">Roti Lembut Isi Cokelat</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#059669]">Rp 7.000</div>
                    <div className="text-[10px] text-[#7a665b] line-through">Rp 14.000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento 2 & 3: Split Grid for Premium Apps & Jascur */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento 2: Aplikasi Premium Vault */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae2d9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-center text-[#382820] shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                  20+ Aplikasi
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#382820]">
                Aplikasi Premium Bergaransi
              </h3>
              <p className="text-xs text-[#7a665b] mt-2 leading-relaxed">
                Akun streaming, musik, desain, dan tools produktivitas AI legal bergaransi full replace. Netflix, Spotify, YouTube Premium, ChatGPT Plus, Canva Pro, Vidio, dll.
              </p>

              {/* Sample app pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Netflix', 'Spotify', 'Canva Pro', 'YouTube', 'ChatGPT Plus', 'Disney+', 'CapCut Pro', 'Vidio'].map((app) => (
                  <span
                    key={app}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-[#fbf9f5] text-[#382820] border border-[#eae2d9]"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#eae2d9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7a665b] block">Tarif Mulai</span>
                <span className="font-black text-sm text-[#059669]">Rp 1.000 / akun</span>
              </div>

              <Link
                href="/premium"
                className="px-5 py-2.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Buka Katalog</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#bae5d6]" />
              </Link>
            </div>
          </div>

          {/* Bento 3: Jascur (Jasa Curhat & Teman Cerita) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae2d9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] shadow-2xs">
                  <HeartHandshake className="w-5 h-5 text-[#059669]" />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#bae5d6] text-[#059669]">
                  100% Anonim
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#382820]">
                Jascur – Ruang Cerita &amp; Curhat
              </h3>
              <p className="text-xs text-[#7a665b] mt-2 leading-relaxed">
                Butuh teman ngobrol tanpa takut dihakimi? Curhat santai, didengarkan dengan empati via Telegram. Tanpa butuh nomor HP atau nama asli.
              </p>

              {/* Rate Badges */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9]">
                  <div className="text-[10px] text-[#7a665b]">Chat Teks</div>
                  <div className="font-bold text-[#059669] mt-0.5">3k / jam</div>
                </div>
                <div className="p-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9]">
                  <div className="text-[10px] text-[#7a665b]">Voice Call</div>
                  <div className="font-bold text-[#059669] mt-0.5">15k / jam</div>
                </div>
                <div className="p-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9]">
                  <div className="text-[10px] text-[#7a665b]">Add-on VN</div>
                  <div className="font-bold text-[#059669] mt-0.5">+10k / sesi</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#eae2d9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7a665b] block">Akses</span>
                <span className="font-bold text-xs text-[#382820]">Akun Khusus Telegram</span>
              </div>

              <Link
                href="/jascur"
                className="px-5 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Mulai Sesi Curhat</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#bae5d6]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Best Seller Apps Preview */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae2d9] shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#eae2d9]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-2.5 py-0.5 rounded-full border border-[#bde5d8]">
                PRODUK POPULER
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#382820] mt-1">
                Aplikasi Terlaris Minggu Ini
              </h3>
            </div>
            <Link
              href="/premium"
              className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1"
            >
              <span>Lihat semua 20 aplikasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topApps.map((prod) => {
              const allOptions = prod.planGroups.flatMap((g) => g.options);
              const lowestPrice = allOptions.length > 0 ? Math.min(...allOptions.map((o) => o.price)) : 0;
              return (
                <div
                  key={prod.id}
                  className="bg-[#fbf9f5] rounded-2xl p-4 border border-[#eae2d9] flex flex-col justify-between hover:border-[#059669] transition-all group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#eae2d9] flex items-center justify-center font-bold text-xs text-[#382820] mb-3 font-mono shadow-2xs group-hover:scale-105 transition-transform">
                      {prod.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="font-bold text-sm text-[#382820]">{prod.name}</div>
                    <p className="text-[11px] text-[#7a665b] mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eae2d9] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#7a665b]">Mulai</div>
                      <div className="text-xs font-extrabold text-[#059669]">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(lowestPrice)}
                      </div>
                    </div>
                    <Link
                      href="/premium"
                      className="px-3.5 py-1.5 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-bold text-[11px] shadow-2xs transition-colors"
                    >
                      Pilih
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="text-center pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-3 py-1 rounded-full border border-[#bde5d8]">
            STANDAR LAYANAN SAOIRSE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#382820] mt-3">
            Belanja Digital &amp; Kopi Tanpa Ribet
          </h2>
          <p className="text-xs sm:text-sm text-[#7a665b] mt-1.5 max-w-lg mx-auto">
            Sistem terintegrasi otomatis: tiket antrian live, pembayaran QRIS instan, dan akun langsung siap.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
            <div className="bg-white p-5 rounded-3xl border border-[#eae2d9] shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] text-[#059669] font-black text-xs flex items-center justify-center mb-3 border border-[#bde5d8]">
                01
              </div>
              <h4 className="font-bold text-sm text-[#382820]">Nomor Antrian Live</h4>
              <p className="text-xs text-[#7a665b] mt-1.5 leading-relaxed">
                Begitu checkout, kamu langsung mendapatkan nomor tiket antrian. Pantau posisi antrian dan admin yang melayanimu secara real-time.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#eae2d9] shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] text-[#059669] font-black text-xs flex items-center justify-center mb-3 border border-[#bde5d8]">
                02
              </div>
              <h4 className="font-bold text-sm text-[#382820]">QRIS All Payment</h4>
              <p className="text-xs text-[#7a665b] mt-1.5 leading-relaxed">
                Scan QRIS resmi dari bank atau e-wallet mana saja. Tanpa perlu kirim bukti struk manual, sistem otomatis membaca pembayaranmu.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#eae2d9] shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] text-[#059669] font-black text-xs flex items-center justify-center mb-3 border border-[#bde5d8]">
                03
              </div>
              <h4 className="font-bold text-sm text-[#382820]">Garansi &amp; Ambil Cepat</h4>
              <p className="text-xs text-[#7a665b] mt-1.5 leading-relaxed">
                Email dan password akun langsung tampil di layar tiket. Untuk pesanan kopi, kamu tinggal datang ke cabang dan ambil di kasir.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-2xl mx-auto pt-2">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-3 py-1 rounded-full border border-[#bde5d8]">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#382820] mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#eae2d9] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#382820] hover:bg-[#fbf9f5] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#382820] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-1 text-xs text-[#7a665b] leading-relaxed border-t border-[#eae2d9] bg-[#fbf9f5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#eae2d9] py-8 px-4 text-center text-xs text-[#7a665b]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#382820] font-serif">saoirse.</span>
            <span>•</span>
            <span>official premium account store &amp; coffee pass</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/wifi" className="text-[#7a665b] hover:text-[#382820]">
              WiFi Kopken
            </Link>
            <span className="text-[#eae2d9]">•</span>
            <a
              href="https://t.me/saoirse_cs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#382820] hover:underline"
            >
              Telegram CS: @saoirse_cs
            </a>
            <span className="text-[#eae2d9]">•</span>
            <a href="/admin" className="text-[#7a665b] hover:text-[#382820]">
              Portal Staff
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
