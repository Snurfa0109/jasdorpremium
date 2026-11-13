'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TestimonialModal from '@/components/TestimonialModal';
import { Testimonial } from '@/data/testimonials';
import { Order } from '@/types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  ArrowLeft,
  QrCode,
  Zap,
  Loader2,
  MapPin,
  Star,
  Sparkles,
  ShieldAlert,
  Coffee,
  Camera,
  ExternalLink,
  RotateCcw,
  Receipt,
  Printer,
  ShoppingBag,
} from 'lucide-react';

function OrderTrackingContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string)?.toUpperCase();

  const [order, setOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [queueInfo, setQueueInfo] = useState<{
    position: number;
    totalWaiting: number;
    currentlyProcessingId?: string;
    adminAssigned?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testiToast, setTestiToast] = useState<string | null>(null);
  const [adminTelegram, setAdminTelegram] = useState('saoirse_temancurhat');
  const [csTelegram, setCsTelegram] = useState('saoirse_cs');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.settings?.jascur?.telegramUsername) {
            setAdminTelegram(d.settings.jascur.telegramUsername.replace('@', ''));
          }
          if (d.settings?.store?.csTelegram) {
            setCsTelegram(d.settings.store.csTelegram.replace('@', ''));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleReorder = () => {
    if (!order) return;
    const isKopken =
      order.productId === 'kopken' ||
      order.productId === 'jasdor' ||
      (order.items && order.items.length > 0) ||
      order.productName.toLowerCase().includes('kenangan');
    const isJascur = order.productId === 'jascur' || order.planGroup?.includes('Curhat');

    if (isKopken) {
      if (order.items && order.items.length > 0) {
        try {
          const cartKey = 'saoirse_cart_kopken';
          const cartItems = order.items.map((it) => ({
            cartItemId: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            itemId: it.id,
            name: it.name,
            details: it.details || '',
            price: it.price,
            quantity: it.quantity || 1,
            brand: 'kopken' as const,
            outlet: order.outlet || 'Kopi Kenangan - Kota Kasablanka (Lt. LG)',
          }));
          localStorage.setItem(cartKey, JSON.stringify(cartItems));
          if (order.outlet) {
            localStorage.setItem('saoirse_cabang_kopken', order.outlet);
          }
        } catch (e) {}
      }
      router.push('/jasdor/kopi-kenangan');
    } else if (isJascur) {
      router.push('/jascur');
    } else {
      router.push('/premium');
    }
  };

  const handleSaveTestimonial = (newReview: Testimonial) => {
    try {
      const rawUserReviews = localStorage.getItem('saoirse:user_testimonials');
      const existing = rawUserReviews ? JSON.parse(rawUserReviews) : [];
      localStorage.setItem('saoirse:user_testimonials', JSON.stringify([newReview, ...existing]));
    } catch (e) {
      // silent
    }
    setShowTestimonialModal(false);
    setTestiToast('Terima kasih! Testimoni pesananmu berhasil dipublikasikan ⭐');
    setTimeout(() => setTestiToast(null), 4000);
  };

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders?id=${orderId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Tiket pesanan tidak ditemukan');
      }
      setOrder(data.order);
      setQueueInfo(data.queueInfo);
      setError('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat pesanan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleSimulateAdvance = async () => {
    if (!order) return;
    setIsSimulating(true);
    try {
      const nextStatus = order.status === 'queued' ? 'processing' : 'completed';
      const orderIsKopken = order.productId === 'kopken' || !!order.outlet || order.planGroup === 'Kopi Kenangan' || (order.items && order.items.length > 0 && !!order.outlet);
      
      let mockCreds = undefined;
      if (nextStatus === 'completed') {
        if (orderIsKopken) {
          mockCreds = {
            email: 'Pesanan Kopi Siap Diambil di Kasir',
            password: `Tiket Kasir #${order.id}`,
            profileName: `Atas Nama: ${order.customerName}`,
            pickupTime: order.pickupTime || 'Sekarang (ASAP)',
            expiredDate: order.pickupTime || 'Ambil Hari Ini',
            rulesNotes: `Pesanan Kopi Kenangan telah dibuat oleh barista outlet ${order.outlet || 'Kopi Kenangan'}. Sebutkan nama ${order.customerName} di kasir / pick-up bar.`,
          };
        } else {
          mockCreds = {
            email: `${order.customerName.toLowerCase().replace(/\s+/g, '')}.vip@saoirse.id`,
            password: `SafePass${Math.floor(1000 + Math.random() * 9000)}!`,
            profileName: `Profil ${order.customerName}`,
            profilePin: '1234',
            expiredDate: '30 Hari dari Sekarang (Garansi Aktif)',
            rulesNotes: 'Dilarang mengubah password dan email agar garansi replace tetap berlaku.',
          };
        }
      }

      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          status: nextStatus,
          credentials: mockCreds,
        }),
      });

      await fetchOrder();
    } catch (e) {
      // silent
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfdfc] flex flex-col text-[#4e403b]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-[#4e403b] animate-spin mb-3" />
          <p className="text-xs font-bold text-[#705f59]">Memuat tiket pesananmu...</p>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fbfdfc] flex flex-col text-[#4e403b]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#c2e8dc] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#edf8f4] text-[#4e403b] flex items-center justify-center mx-auto mb-4 border border-[#c2e8dc]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-[#4e403b] font-serif">Tiket Tidak Ditemukan</h2>
            <p className="text-xs text-[#705f59] mt-2 mb-6">
              Kode antrian <strong className="font-mono text-[#4e403b]">{orderId}</strong> belum terdaftar di sistem.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isCompleted = order.status === 'completed';
  const isProcessing = order.status === 'processing';
  const isQueued = order.status === 'queued';
  const isJascur = order.productId === 'jascur' || order.planGroup === 'Jasa Curhat';
  const isKopken = order.productId === 'kopken' || !!order.outlet || order.planGroup === 'Kopi Kenangan' || (order.items && order.items.length > 0 && !!order.outlet);

  return (
    <div className="min-h-screen bg-[#fbfdfc] flex flex-col text-[#4e403b]">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#705f59] hover:text-[#4e403b] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </Link>

        {/* Demo Simulator Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-white border border-[#c2e8dc] flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#bae5d6]" />
            <span className="font-bold text-[#4e403b]">
              Mode Demo Interaktif:
            </span>
            <span className="text-[#705f59] hidden sm:inline">
              uji coba perpindahan status antrian
            </span>
          </div>
          {!isCompleted && (
            <button
              onClick={handleSimulateAdvance}
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-xl bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] font-bold text-[11px] shadow-2xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              {isSimulating ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#bae5d6]" />
              ) : (
                <Zap className="w-3 h-3 text-[#bae5d6]" />
              )}
              <span>{isQueued ? 'Simulasi Admin Ambil' : 'Simulasi Pesanan Selesai'}</span>
            </button>
          )}
        </div>

        {/* Header Ticket Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c2e8dc] shadow-2xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dfd8d4]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4e403b] bg-[#bae5d6] px-2 py-0.5 rounded-full shadow-2xs">
                  tiket resmi saoirse
                </span>
                <span className="text-xs text-[#705f59]">verified order</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#4e403b] mt-1.5">
                {order.id}
              </h1>
              <p className="text-xs text-[#705f59] mt-1">
                Atas nama: <strong className="text-[#4e403b]">{order.customerName}</strong> ({order.customerTelegram})
              </p>
            </div>

            <div className="sm:text-right">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                isCompleted
                  ? 'bg-[#bae5d6] text-[#4e403b]'
                  : isProcessing
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#edf8f4] text-[#4e403b] border border-[#c2e8dc]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isCompleted ? 'bg-[#4e403b]' : isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-[#4e403b] animate-ping'
                }`} />
                {isCompleted
                  ? 'Pesanan Sudah Siap'
                  : isProcessing
                  ? 'Sedang Diproses Admin'
                  : 'Dalam Antrian'}
              </span>
              <div className="text-[11px] text-[#705f59] mt-1">
                {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-6 border-b border-[#dfd8d4]">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-1.5 ${
                  isQueued || isProcessing || isCompleted
                    ? 'bg-[#4e403b] text-[#bae5d6]'
                    : 'bg-[#edf8f4] text-stone-400'
                }`}>
                  1
                </div>
                <span className="font-bold text-[#4e403b] text-[11px]">Dalam Antrian</span>
                <span className="text-[10px] text-[#705f59]">Tiket Terbit</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-1.5 ${
                  isProcessing || isCompleted
                    ? 'bg-[#4e403b] text-[#bae5d6]'
                    : 'bg-[#edf8f4] text-stone-400'
                }`}>
                  2
                </div>
                <span className="font-bold text-[#4e403b] text-[11px]">Diproses Admin</span>
                <span className="text-[10px] text-[#705f59]">
                  Diproses Admin
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-1.5 ${
                  isCompleted
                    ? 'bg-[#bae5d6] text-[#4e403b] font-black'
                    : 'bg-[#edf8f4] text-stone-400'
                }`}>
                  3
                </div>
                <span className="font-bold text-[#4e403b] text-[11px]">Siap Digunakan</span>
                <span className="text-[10px] text-[#705f59]">Tampil di Layar</span>
              </div>
            </div>
          </div>

          {/* Live Position Radar */}
          {!isCompleted && queueInfo && (
            <div className="mt-6 p-5 rounded-2xl bg-[#edf8f4] border border-[#c2e8dc]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4e403b] animate-pulse" />
                  <span className="font-extrabold text-sm text-[#4e403b]">
                    Radar Antrian
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#4e403b] bg-[#bae5d6] px-2.5 py-0.5 rounded-full">
                  ⚡ auto refresh
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center my-3">
                <div className="bg-white p-3 rounded-xl border border-[#c2e8dc]">
                  <div className="text-[11px] text-[#705f59] font-medium">Nomor Antrian Kamu</div>
                  <div className="text-xl font-black text-[#4e403b]">
                    #{queueInfo.position || 1}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#c2e8dc]">
                  <div className="text-[11px] text-[#705f59] font-medium">Antrian di Depanmu</div>
                  <div className="text-xl font-black text-[#4e403b]">
                    {Math.max(0, (queueInfo.position || 1) - 1)} Orang
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#c2e8dc] col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-[#705f59] font-medium">Estimasi Waktu</div>
                  <div className="text-xl font-black text-[#4e403b]">
                    {isKopken ? '5–30 Menit' : `~${Math.max(3, (queueInfo.position || 1) * 4)} Menit`}
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-[#705f59] mt-2">
                {isKopken
                  ? 'Pesanan Jasdor diproses secara berkala (5–30 menit) mengikuti antrian sistem/PO. Hindari rush order agar pesanan terverifikasi rapi di kasir.'
                  : 'Santai sejenak ya. Admin sedang menyiapkan pesananmu. Begitu selesai, data langsung otomatis muncul di bawah tanpa perlu reload.'}
              </p>
            </div>
          )}

          {/* Cabang Pick-up Banner if present */}
          {order.outlet && (
            <div className="mt-6 p-4 rounded-2xl bg-[#edf8f4] border border-[#c2e8dc] space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#bae5d6] text-[#4e403b] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#4e403b]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#705f59]">
                    Cabang Pick-up Outlet (Ambil di Kasir)
                  </div>
                  <div className="text-sm font-black text-[#4e403b]">{order.outlet}</div>
                  <div className="text-[10px] text-[#705f59] mt-0.5">
                    Tunjukkan nomor tiket #{order.id} ke barista / kasir saat mengambil pesanan.
                  </div>
                </div>
              </div>

              {(order.pickupTime || order.credentials?.pickupTime) && (
                <div className="pt-2.5 border-t border-[#c2e8dc] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#4e403b]">
                    <Clock className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Request Jam Pengambilan:</span>
                  </div>
                  <span className="font-black px-2.5 py-0.5 rounded-full bg-[#bae5d6] text-[#4e403b] text-xs">
                    {order.credentials?.pickupTime || order.pickupTime}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Order Items Breakdown */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#edf8f4] border border-[#c2e8dc]">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4e403b] mb-3 pb-2 border-b border-[#c2e8dc]">
              <span>Rincian Pesanan ({order.items && order.items.length > 0 ? `${order.items.reduce((s, i) => s + i.quantity, 0)} Item` : '1 Item'})</span>
              <span>Harga</span>
            </div>

            {order.items && order.items.length > 0 ? (
              <div className="space-y-2.5">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs py-1.5 border-b border-[#c2e8dc]/60 last:border-b-0">
                    <div className="pr-3">
                      <div className="font-bold text-[#4e403b]">
                        {it.quantity}x {it.name}
                      </div>
                      {it.details && (
                        <div className="text-[11px] text-[#705f59] mt-0.5">{it.details}</div>
                      )}
                    </div>
                    <div className="font-extrabold text-[#4e403b] shrink-0">
                      {formatRupiah(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm font-bold text-[#4e403b]">
                <div>
                  {order.productName} ({order.planName})
                  <div className="text-xs font-normal text-[#705f59]">{order.planGroup}</div>
                </div>
                <div className="text-base font-black text-[#4e403b]">{formatRupiah(order.price)}</div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-[#c2e8dc] flex items-center justify-between text-xs">
              <span className="font-bold text-[#705f59]">Total Pembayaran:</span>
              <span className="text-base font-black text-[#4e403b]">{formatRupiah(order.price)}</span>
            </div>
          </div>

          {/* JASCUR TELEGRAM CHAT BOX */}
          {isJascur && (
            <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#bde5d8] shadow-sm animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#ebf7f3] text-[#059669] flex items-center justify-center shrink-0 border border-[#bde5d8]">
                  <MessageCircle className="w-6 h-6 text-[#059669]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] text-[10px] font-black uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3 h-3 text-[#059669]" /> Akun Telegram Khusus
                  </div>
                  <h3 className="font-serif font-black text-base text-[#4e403b]">
                    Teman Curhat Kamu Sudah Siap!
                  </h3>
                  <p className="text-xs text-[#7d6b63]">
                    {isCompleted
                      ? 'Pembayaran berhasil! Silakan langsung hubungi akun Telegram privat di bawah:'
                      : 'Setelah bayar via QRIS di bawah, langsung klik link Telegram ini untuk mulai:'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <a
                  href={`https://t.me/${adminTelegram}?start=tiket_${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Buka Chat Telegram Teman Curhat ➔</span>
                </a>

                <div className="text-[11px] text-[#7d6b63] space-y-1.5 pt-1">
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span>Sebutkan ID Tiket kamu: <strong>#{order.id}</strong> ({order.productName}) saat pertama menyapa.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span>Identitasmu 100% anonim dan rahasia terjamin. Bebas chat teks atau voice note.</span>
                  </div>
                </div>

                {/* Regulasi Keamanan & Zero-Tolerance Harassment */}
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Regulasi Keamanan Sesi (Zero Tolerance Policy)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-950">
                    Sesi curhat bersifat <b>non-seksual</b>. Segala bentuk rayuan, <i>flirting</i>, pelecehan verbal (sexual harassment), atau ajakan asusila akan membuat admin berhak <b>memutuskan sesi sepihak, dana HANGUS (Non-Refundable), dan akun Telegram di-BLOCK permanen</b>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* JASDOR KOPI KENANGAN PICK-UP BOX */}
          {isKopken && isCompleted && order.credentials && (
            <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#bae5d6] shadow-sm animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#bae5d6] text-[#4e403b] flex items-center justify-center shrink-0 font-bold">
                  <Coffee className="w-6 h-6 text-[#4e403b]" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#4e403b]">
                    Pesanan Kopi Kamu Siap Diambil di Kasir!
                  </h3>
                  <p className="text-xs text-[#705f59]">
                    Tunjukkan tiket ini atau foto struk / barcode di bawah ke barista outlet:
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-[#edf8f4] p-4 sm:p-5 rounded-2xl border border-[#c2e8dc]">
                {/* Kode Tiket Kasir */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#c2e8dc]">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#705f59]">Kode Kasir / Tiket Antrian</div>
                    <div className="text-base sm:text-lg font-mono font-black text-[#4e403b]">
                      {order.credentials.password || `#${order.id}`}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.credentials?.password || `#${order.id}`, 'pickup_code')}
                    className="p-2.5 rounded-lg bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] transition-colors cursor-pointer"
                    title="Salin Kode Kasir"
                  >
                    {copiedKey === 'pickup_code' ? <Check className="w-4 h-4 text-[#bae5d6]" /> : <Copy className="w-4 h-4 text-[#bae5d6]" />}
                  </button>
                </div>

                {/* Outlet & Atas Nama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#c2e8dc]">
                    <div className="text-[10px] uppercase font-bold text-[#705f59]">Atas Nama Pemesan</div>
                    <div className="font-extrabold text-[#4e403b] mt-0.5">
                      {order.credentials.profileName || order.customerName}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#c2e8dc]">
                    <div className="text-[10px] uppercase font-bold text-[#705f59]">Cabang Outlet Pick-up</div>
                    <div className="font-extrabold text-[#4e403b] mt-0.5">
                      {order.outlet || 'Kopi Kenangan'}
                    </div>
                  </div>
                </div>

                {/* Jam Pengambilan / Diproses */}
                {(order.credentials.pickupTime || order.credentials.expiredDate || order.pickupTime) && (
                  <div className="p-3 rounded-xl bg-white border border-[#c2e8dc] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#059669]" />
                      <span className="font-bold text-[#4e403b]">Jam Pengambilan / Diproses:</span>
                    </div>
                    <span className="font-black px-2.5 py-0.5 rounded-full bg-[#bae5d6] text-[#4e403b]">
                      {order.credentials.pickupTime || order.credentials.expiredDate || order.pickupTime}
                    </span>
                  </div>
                )}

                {/* FOTO BUKTI STRUK / BARCODE PICK-UP */}
                {order.credentials.photoUrl && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#c2e8dc] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#4e403b]">
                        <Camera className="w-4 h-4 text-[#059669]" />
                        <span>Foto Struk / Barcode Pick-up Kasir</span>
                      </div>
                      <a
                        href={order.credentials.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#059669] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka Layar Penuh</span>
                      </a>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-[#c2e8dc] bg-stone-50 flex items-center justify-center p-1">
                      <img
                        src={order.credentials.photoUrl}
                        alt="Foto Bukti Pesanan Kasir"
                        className="w-full max-h-80 object-contain rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(order.credentials?.photoUrl, '_blank')}
                      />
                    </div>

                    <p className="text-[11px] text-[#705f59] leading-relaxed text-center">
                      💡 <i>Tips: Tunjukkan foto barcode / struk ini langsung ke barista agar pesanan kopi segera diserahkan.</i>
                    </p>
                  </div>
                )}

                {/* Catatan Kasir / Barista */}
                {order.credentials.rulesNotes && (
                  <div className="p-3 rounded-xl bg-white border border-[#c2e8dc] text-xs text-[#4e403b]">
                    <strong>Catatan dari Admin:</strong> {order.credentials.rulesNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUCCESS BOX: CREDENTIALS (For Premium Apps) */}
          {!isJascur && !isKopken && isCompleted && order.credentials && (
            <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#bae5d6] shadow-sm animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#bae5d6] text-[#4e403b] flex items-center justify-center shrink-0 font-bold">
                  <CheckCircle2 className="w-6 h-6 text-[#4e403b]" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#4e403b]">
                    Pesanan Kamu Sudah Siap!
                  </h3>
                  <p className="text-xs text-[#705f59]">
                    Disiapkan oleh Admin resmi khusus buat kamu:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 bg-[#edf8f4] p-4 rounded-2xl border border-[#c2e8dc]">
                {order.credentials.email && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#c2e8dc]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#705f59]">Email / Akun</div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-[#4e403b]">
                        {order.credentials.email}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.credentials?.email || '', 'email')}
                      className="p-2 rounded-lg bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] transition-colors cursor-pointer"
                      title="Salin Email"
                    >
                      {copiedKey === 'email' ? <Check className="w-4 h-4 text-[#bae5d6]" /> : <Copy className="w-4 h-4 text-[#bae5d6]" />}
                    </button>
                  </div>
                )}

                {order.credentials.password && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#c2e8dc]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#705f59]">Password</div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-[#4e403b]">
                        {order.credentials.password}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.credentials?.password || '', 'password')}
                      className="p-2 rounded-lg bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] transition-colors cursor-pointer"
                      title="Salin Password"
                    >
                      {copiedKey === 'password' ? <Check className="w-4 h-4 text-[#bae5d6]" /> : <Copy className="w-4 h-4 text-[#bae5d6]" />}
                    </button>
                  </div>
                )}

                {order.credentials.profileName && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#c2e8dc]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#705f59]">Profil &amp; PIN</div>
                      <div className="text-xs sm:text-sm font-bold text-[#4e403b]">
                        {order.credentials.profileName} {order.credentials.profilePin && `• PIN: ${order.credentials.profilePin}`}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${order.credentials?.profileName} PIN: ${order.credentials?.profilePin}`, 'pin')}
                      className="p-2 rounded-lg bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] transition-colors cursor-pointer"
                    >
                      {copiedKey === 'pin' ? <Check className="w-4 h-4 text-[#bae5d6]" /> : <Copy className="w-4 h-4 text-[#bae5d6]" />}
                    </button>
                  </div>
                )}

                {order.credentials.expiredDate && (
                  <div className="p-2 rounded-xl text-xs text-[#705f59]">
                    <strong className="text-[#4e403b]">Masa Aktif:</strong> {order.credentials.expiredDate}
                  </div>
                )}

                {order.credentials.rulesNotes && (
                  <div className="p-2.5 rounded-xl bg-white border border-[#c2e8dc] text-xs text-[#4e403b]">
                    <strong>Catatan Penting:</strong> {order.credentials.rulesNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dedicated QRIS Payment Box */}
          {!isCompleted && (
            <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-[#edf8f4] border border-[#c2e8dc] shadow-2xs text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bae5d6] text-[#4e403b] text-[11px] font-bold mb-3">
                <QrCode className="w-3.5 h-3.5" />
                <span>QRIS Standar Pembayaran Nasional</span>
              </div>

              <h3 className="font-extrabold text-base text-[#4e403b]">
                Scan QRIS untuk Menyelesaikan Pembayaran
              </h3>
              <p className="text-xs text-[#705f59] mt-0.5 max-w-sm mx-auto">
                Bisa di-scan dari semua M-Banking (BCA, Mandiri, BRI, BNI) &amp; E-Wallet (GoPay, DANA, OVO, ShopeePay).
              </p>

              {/* QR Code Container */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-[#c2e8dc] inline-block shadow-2xs">
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-stone-200 flex flex-col items-center justify-center relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#4e403b]">
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="currentColor" />
                    <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                    <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />

                    <rect x="69" y="5" width="26" height="26" rx="4" fill="currentColor" />
                    <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                    <rect x="77" y="13" width="10" height="10" rx="1" fill="currentColor" />

                    <rect x="5" y="69" width="26" height="26" rx="4" fill="currentColor" />
                    <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                    <rect x="13" y="77" width="10" height="10" rx="1" fill="currentColor" />

                    <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="46" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="56" y="8" width="6" height="6" fill="currentColor" />
                    <rect x="36" y="18" width="6" height="6" fill="currentColor" />
                    <rect x="46" y="18" width="6" height="6" fill="currentColor" />
                    <rect x="56" y="18" width="6" height="6" fill="currentColor" />
                    <rect x="36" y="28" width="6" height="6" fill="currentColor" />
                    <rect x="46" y="28" width="6" height="6" fill="currentColor" />
                    <rect x="8" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="18" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="28" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="8" y="46" width="6" height="6" fill="currentColor" />
                    <rect x="18" y="46" width="6" height="6" fill="currentColor" />
                    <rect x="28" y="46" width="6" height="6" fill="currentColor" />
                    <rect x="8" y="56" width="6" height="6" fill="currentColor" />
                    <rect x="18" y="56" width="6" height="6" fill="currentColor" />
                    <rect x="28" y="56" width="6" height="6" fill="currentColor" />
                    <rect x="68" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="78" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="88" y="36" width="6" height="6" fill="currentColor" />
                    <rect x="68" y="46" width="6" height="6" fill="currentColor" />
                    <rect x="78" y="46" width="6" height="6" fill="currentColor" />
                    <rect x="88" y="46" width="6" height="6" fill="currentColor" />
                    <rect x="68" y="56" width="6" height="6" fill="currentColor" />
                    <rect x="78" y="56" width="6" height="6" fill="currentColor" />
                    <rect x="88" y="56" width="6" height="6" fill="currentColor" />

                    <rect x="38" y="38" width="24" height="24" rx="4" fill="#4e403b" />
                    <text x="50" y="54" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#bae5d6" fontFamily="serif">s.</text>
                  </svg>
                </div>
                <div className="mt-2 text-[10px] font-bold text-[#705f59] uppercase tracking-wider">
                  NMID: ID1029384756 • saoirse store
                </div>
              </div>

              {/* Nominal Price Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#c2e8dc] max-w-sm mx-auto flex items-center justify-between text-left">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#705f59]">Total Nominal Transfer</div>
                  <div className="text-lg font-black text-[#4e403b]">
                    {formatRupiah(order.price)}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(String(order.price), 'price')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  {copiedKey === 'price' ? <Check className="w-3.5 h-3.5 text-[#bae5d6]" /> : <Copy className="w-3.5 h-3.5 text-[#bae5d6]" />}
                  <span>Salin</span>
                </button>
              </div>

              {/* Confirm via Telegram button */}
              <div className="mt-4 max-w-sm mx-auto">
                <a
                  href={`https://t.me/${csTelegram}?start=bayar_${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-[#4e403b] hover:bg-[#382c28] text-[#bae5d6] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#bae5d6]" />
                  <span>Kirim Bukti Pembayaran ke Telegram</span>
                </a>
              </div>
            </div>
          )}

          {/* CS Telegram button for issues */}
          <div className="mt-6 pt-5 border-t border-[#dfd8d4] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#705f59] text-center sm:text-left">
              Ada kendala akun atau butuh klaim garansi?
            </div>
            <a
              href={`https://t.me/${csTelegram}?start=bantuan_${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#edf8f4] text-[#4e403b] border border-[#c2e8dc] font-bold text-xs shadow-2xs transition-all w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4 text-[#059669]" />
              <span>Hubungi CS Telegram (Tiket #{order.id})</span>
            </a>
          </div>

          {/* Quick Action Bar: Pesan Lagi & Unduh Struk Digital */}
          <div className="mt-6 p-4 rounded-3xl bg-white border border-[#eae2d9] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#ebf7f3] text-[#059669] flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-[#382820]">
                  Layanan &amp; Bukti Pembelian
                </div>
                <div className="text-[11px] text-[#7a665b]">
                  Unduh invoice resmi atau pesan kembali menu yang sama dalam 1 klik.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-[#fbf9f5] text-[#382820] border border-[#eae2d9] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#7a665b]" />
                <span>Unduh Struk Digital</span>
              </button>

              <button
                type="button"
                onClick={handleReorder}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pesan Lagi Menu Ini</span>
              </button>
            </div>
          </div>

          {/* Write Testimonial Box */}
          <div className="mt-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#ebf7f3] via-white to-[#fbf9f5] border border-[#bde5d8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#059669] text-[#bae5d6] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-[#bae5d6]" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-[#4e403b] flex items-center gap-1.5">
                  <span>Puas dengan Pesananmu?</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#bae5d6] text-[#059669]">
                    10 Template Siap Pakai
                  </span>
                </div>
                <div className="text-[11px] text-[#7d6b63] mt-0.5">
                  Beri ulasan testimoni pembeli terverifikasi (bisa lampirkan foto bukti &amp; tinggal copas template!).
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTestimonialModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs transition-all active:scale-[0.98] cursor-pointer w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#bae5d6]" />
              <span>Tulis Testimoni Sekarang</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Success Toast */}
      {testiToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4e403b] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <Check className="w-4 h-4 text-[#bae5d6]" />
          <span>{testiToast}</span>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <TestimonialModal
          orders={[{ id: order.id, productName: order.productName, planName: order.planName || '' }]}
          initialOrderId={order.id}
          onClose={() => setShowTestimonialModal(false)}
          onSubmit={handleSaveTestimonial}
        />
      )}

      {/* Digital Receipt Modal (Struk Pembelian Kasir) */}
      {showReceiptModal && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl border border-[#eae2d9] relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Printable Receipt Paper Card */}
            <div id="digital-receipt-print" className="p-5 sm:p-6 rounded-2xl bg-[#fdfbf7] border-2 border-dashed border-[#dfd7cc] font-mono text-[#382820] space-y-4 shadow-inner">
              {/* Receipt Header */}
              <div className="text-center pb-3 border-b border-dashed border-[#dfd7cc]">
                <div className="font-serif font-black text-xl text-[#382820] tracking-tight">
                  saoirse. store
                </div>
                <div className="text-[10px] text-[#7a665b] font-sans mt-0.5">
                  Boutique Lifestyle, Jasdor &amp; Premium Experience
                </div>
                <div className="text-[11px] font-bold text-[#059669] mt-1 font-sans">
                  ● BUKTI TRANSAKSI DIGITAL RESMI
                </div>
              </div>

              {/* Order Meta */}
              <div className="text-xs space-y-1 pb-3 border-b border-dashed border-[#dfd7cc]">
                <div className="flex justify-between">
                  <span className="text-[#7a665b]">No. Tiket:</span>
                  <span className="font-bold">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a665b]">Waktu:</span>
                  <span>{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a665b]">Pelanggan (saories):</span>
                  <span className="font-bold">{order.customerName}</span>
                </div>
                {order.customerTelegram && (
                  <div className="flex justify-between">
                    <span className="text-[#7a665b]">Kontak:</span>
                    <span>{order.customerTelegram}</span>
                  </div>
                )}
                {order.outlet && (
                  <div className="flex justify-between">
                    <span className="text-[#7a665b]">Outlet Cabang:</span>
                    <span className="font-bold text-right truncate max-w-[200px]">{order.outlet}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 pb-3 border-b border-dashed border-[#dfd7cc] text-xs">
                <div className="font-bold text-[11px] uppercase tracking-wider text-[#7a665b] mb-1">
                  Rincian Item
                </div>
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="font-bold">{it.quantity || 1}x {it.name}</div>
                        {it.details && <div className="text-[10px] text-[#7a665b]">{it.details}</div>}
                      </div>
                      <div className="font-bold shrink-0">
                        Rp {(it.price * (it.quantity || 1)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{order.productName}</div>
                      {order.planName && <div className="text-[10px] text-[#7a665b]">{order.planName}</div>}
                    </div>
                    <div className="font-bold">
                      Rp {order.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Summary */}
              <div className="space-y-1.5 text-xs pb-3 border-b border-dashed border-[#dfd7cc]">
                {order.originalPrice && order.discountAmount ? (
                  <>
                    <div className="flex justify-between text-[#7a665b]">
                      <span>Subtotal Normal:</span>
                      <span>Rp {order.originalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-[#059669] font-bold">
                      <span>Diskon Promo ({order.voucherCode || 'Hemat'}):</span>
                      <span>-Rp {order.discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </>
                ) : null}
                <div className="flex justify-between font-extrabold text-sm pt-1 text-[#382820]">
                  <span>TOTAL DIBAYAR:</span>
                  <span>Rp {order.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#7a665b]">
                  <span>Status Pembayaran:</span>
                  <span className="font-bold uppercase text-[#059669]">QRIS All Payment (LUNAS ✓)</span>
                </div>
              </div>

              {/* Stamp / Status */}
              <div className="text-center pt-1 font-sans">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase border border-emerald-300">
                  ✓ TRANSAKSI TERVERIFIKASI
                </div>
                <p className="text-[10px] text-[#7a665b] mt-2">
                  Terima kasih telah jajan di saoirse. Struk ini merupakan bukti transaksi resmi.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-[#bae5d6]" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-3 rounded-2xl bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] font-bold text-xs cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fbfdfc] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#4e403b] animate-spin mb-3" />
        <p className="text-xs font-bold text-[#705f59]">Memuat tiket antrian...</p>
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}
