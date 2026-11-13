'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Loader2,
  ArrowLeft,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  Ticket,
} from 'lucide-react';
import { CartItem } from '@/types';

interface CartDrawerProps {
  scope: 'kopken' | 'tomoro' | 'premium';
  title: string;
  items: CartItem[];
  outlet?: string;
  onOpenOutletPicker?: () => void;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onClose: () => void;
  isQueueOpen?: boolean;
}

export default function CartDrawer({
  scope,
  title,
  items,
  outlet,
  onOpenOutletPicker,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  isOpen,
  onClose,
  isQueueOpen = true,
}: CartDrawerProps) {
  const router = useRouter();
  const [step, setStep] = useState<'review' | 'payment'>('review');
  const [customerName, setCustomerName] = useState('');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [pickupTimeType, setPickupTimeType] = useState<'asap' | 'scheduled'>('asap');
  const [customPickupTime, setCustomPickupTime] = useState('14:00');
  const [stockFallback, setStockFallback] = useState('Hubungi via Telegram');
  const [substituteNote, setSubstituteNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Voucher Promo State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    title: string;
    discountAmount: number;
  } | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const discountAmount = appliedVoucher ? Math.min(appliedVoucher.discountAmount, subtotal) : 0;
  const totalPrice = Math.max(0, subtotal - discountAmount);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleApplyVoucher = async (codeToApply?: string) => {
    const targetCode = (codeToApply || promoCodeInput).trim().toUpperCase();
    if (!targetCode) {
      setVoucherError('Ketik kode promo terlebih dahulu.');
      return;
    }
    setIsValidatingVoucher(true);
    setVoucherError('');
    setVoucherSuccess('');

    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: targetCode,
          subtotal,
          service: scope === 'premium' ? 'premium' : 'jasdor',
        }),
      });
      const data = await res.json();
      if (data.valid && data.voucher) {
        setAppliedVoucher({
          code: data.voucher.code,
          title: data.voucher.title,
          discountAmount: data.discountAmount,
        });
        setVoucherSuccess(data.message || `Voucher ${data.voucher.code} berhasil diterapkan!`);
        setVoucherError('');
        setPromoCodeInput(data.voucher.code);
      } else {
        setAppliedVoucher(null);
        setVoucherError(data.error || 'Kode promo tidak valid atau syarat tidak terpenuhi.');
      }
    } catch {
      setVoucherError('Gagal memeriksa voucher. Coba beberapa saat lagi.');
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setPromoCodeInput('');
    setVoucherSuccess('');
    setVoucherError('');
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) return;
    if ((scope === 'kopken' || scope === 'tomoro') && (!outlet || outlet.includes('Pilih Outlet'))) {
      if (onOpenOutletPicker) {
        onOpenOutletPicker();
        return;
      }
    }
    setStep('payment');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Mohon isi nama panggilan kamu.');
      return;
    }

    const cleanTele = customerTelegram.trim();
    if (!cleanTele || cleanTele.length < 3) {
      setErrorMessage('Mohon isi Username / ID Telegram kamu (misal: @username).');
      return;
    }

    if (!isQueueOpen) {
      setErrorMessage('Antrian sedang ditutup sementara oleh admin. Coba beberapa saat lagi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const productName =
        scope === 'kopken'
          ? `Kopi Kenangan (${totalItemsCount} Menu)`
          : scope === 'tomoro'
          ? `Tomoro Coffee (${totalItemsCount} Menu)`
          : `Paket Aplikasi (${totalItemsCount} Akun)`;

      const orderItems = items.map((it) => ({
        id: it.itemId,
        name: it.name,
        details: it.details,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      }));

      const finalPickupTime =
        scope !== 'premium'
          ? pickupTimeType === 'scheduled' && customPickupTime
            ? `Pukul ${customPickupTime} WIB`
            : 'Sekarang (ASAP)'
          : undefined;

      const fallbackPart =
        scope !== 'premium'
          ? ` • Jika Habis: ${stockFallback}${substituteNote.trim() ? ` (${substituteNote.trim()})` : ''}`
          : '';

      const pickupPart = finalPickupTime ? ` • Jam Ambil: ${finalPickupTime}` : '';

      const planSummary =
        items
          .map((it) => `${it.quantity}x ${it.name} (${it.details || 'Standar'})`)
          .join(' | ') + fallbackPart + pickupPart;

      const formattedTelegram = customerTelegram.trim().startsWith('@')
        ? customerTelegram.trim()
        : `@${customerTelegram.trim()}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerTelegram: formattedTelegram,
          productId: scope,
          productName,
          planGroup: scope === 'premium' ? 'Aplikasi Premium' : 'Jasdor Kopi',
          planName: planSummary,
          outlet: scope !== 'premium' ? outlet : undefined,
          pickupTime: finalPickupTime,
          items: orderItems,
          price: totalPrice,
          originalPrice: subtotal,
          voucherCode: appliedVoucher?.code,
          discountAmount,
          paymentMethod: 'qris',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memproses pesanan keranjang');
      }

      // Save to saved tickets list
      try {
        const raw = localStorage.getItem('saoirse:saved_tickets');
        const list = raw ? JSON.parse(raw) : [];
        const nextList = [
          { id: data.order.id, productName, planName: planSummary },
          ...list.filter((x: { id: string }) => x.id !== data.order.id),
        ].slice(0, 5);
        localStorage.setItem('saoirse:saved_tickets', JSON.stringify(nextList));
      } catch (err) {
        // silent
      }

      // Clear the current scoped cart
      onClearCart();
      onClose();

      // Redirect to Ticket Page
      router.push(`/order/${data.order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kendala jaringan.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/45 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full sm:h-[94vh] sm:mr-4 sm:rounded-3xl shadow-2xl border border-[#eae2d9] flex flex-col justify-between p-4 sm:p-6 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eae2d9] shrink-0">
          <div className="flex items-center gap-2.5">
            {step === 'payment' ? (
              <button
                type="button"
                onClick={() => setStep('review')}
                className="w-9 h-9 rounded-xl bg-[#fbf9f5] hover:bg-[#ebf7f3] border border-[#eae2d9] flex items-center justify-center text-[#382820] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669]">
                <ShoppingBag className="w-4 h-4 text-[#059669]" />
              </div>
            )}
            <div>
              <h2 className="font-black text-base sm:text-lg text-[#382820] font-serif">
                {step === 'payment' ? 'Pembayaran QRIS' : title}
              </h2>
              <p className="text-[11px] text-[#7a665b]">
                {step === 'payment'
                  ? `Selesaikan pembayaran untuk ${totalItemsCount} item`
                  : 'Khusus pesanan halaman ini'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              setStep('review');
            }}
            className="w-8 h-8 rounded-full bg-[#fbf9f5] text-[#382820] hover:bg-[#f2ece3] flex items-center justify-center font-bold text-sm transition-colors border border-[#eae2d9] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cabang Banner (For Kopken & Tomoro) */}
        {(scope === 'kopken' || scope === 'tomoro') && (
          <div className="my-3 p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-[#059669] shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-[#7a665b] tracking-wider">
                  Cabang Pick-up (Ambil di Kasir)
                </div>
                <div className="text-xs font-black text-[#382820] truncate">
                  {outlet || 'Belum memilih cabang outlet'}
                </div>
              </div>
            </div>

            {onOpenOutletPicker && step === 'review' && (
              <button
                type="button"
                onClick={onOpenOutletPicker}
                className="px-2.5 py-1 rounded-xl bg-white text-[#382820] hover:bg-[#ebf7f3] border border-[#eae2d9] text-[11px] font-bold shrink-0 cursor-pointer shadow-2xs"
              >
                Ganti Cabang
              </button>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="my-2 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-900 shrink-0">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* STEP 1: REVIEW ITEMS */}
        {step === 'review' && (
          <>
            {/* Items List (Scrollable) */}
            <div className="flex-1 overflow-y-auto py-2 space-y-2.5 pr-1">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-[#382820]">Keranjang masih kosong</p>
                  <p className="text-xs text-[#7a665b] mt-1">
                    Silakan pilih menu di halaman ini lalu klik &apos;+ Masukkan ke Keranjang&apos;
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between gap-3"
                  >
                    {item.image && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#eae2d9] bg-white">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[#382820] truncate">
                        {item.name}
                      </h4>
                      {item.details && (
                        <p className="text-[10px] text-[#7a665b] truncate mt-0.5">{item.details}</p>
                      )}
                      <div className="text-xs font-black text-[#059669] mt-1">
                        {formatRupiah(item.price)}
                      </div>
                    </div>

                    {/* Qty Stepper */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onUpdateQty(item.cartItemId, -1)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#eae2d9] text-[#382820] hover:bg-[#ebf7f3] flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-black text-[#382820]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.cartItemId, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#eae2d9] text-[#382820] hover:bg-[#ebf7f3] flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 ml-1 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions for Step 1 */}
            {items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#eae2d9] shrink-0 space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a665b]">
                      Total ({totalItemsCount} item)
                    </div>
                    <div className="text-base sm:text-lg font-black text-[#059669]">
                      {formatRupiah(totalPrice)}
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-[#059669] bg-[#ebf7f3] px-2.5 py-0.5 rounded-full border border-[#bde5d8] shadow-2xs">
                    Diskon 50% Aktif
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl bg-white hover:bg-[#fbf9f5] text-[#382820] border border-[#eae2d9] font-bold text-xs cursor-pointer text-center"
                  >
                    + Tambah Menu Lain
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="flex-1 py-3 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Lanjut ke Pembayaran</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#bae5d6]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: PAYMENT & BUYER INFO */}
        {step === 'payment' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto pt-2 space-y-3.5">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs space-y-1.5">
                <div className="font-bold text-[#382820] mb-1">Ringkasan Pesanan:</div>
                <div className="text-[#7a665b] line-clamp-2">
                  {items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
                <div className="pt-2 border-t border-[#eae2d9] space-y-1">
                  <div className="flex items-center justify-between text-[#7a665b]">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatRupiah(subtotal)}</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex items-center justify-between text-[#059669] font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Diskon Promo ({appliedVoucher.code}):</span>
                      </span>
                      <span>- {formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-1 border-t border-[#eae2d9]/60 flex items-center justify-between font-bold text-[#382820]">
                    <span>Total Tagihan:</span>
                    <span className="text-sm font-black text-[#059669]">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Voucher Promo Section */}
              <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a665b] flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Kode Promo / Voucher Diskon</span>
                  </label>
                  {appliedVoucher && (
                    <span className="text-[9px] font-black uppercase text-[#059669] bg-[#ebf7f3] px-2 py-0.5 rounded-full border border-[#bde5d8]">
                      Voucher Aktif
                    </span>
                  )}
                </div>

                {!appliedVoucher ? (
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#7a665b] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ketik kode (misal: SAOIRSE50)"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyVoucher();
                          }
                        }}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-mono font-bold text-[#382820] placeholder-[#a3948b] uppercase focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher()}
                      disabled={isValidatingVoucher || !promoCodeInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[#382820] hover:bg-[#251a14] disabled:opacity-40 text-[#fbf9f5] text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      {isValidatingVoucher ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Terapkan</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#059669] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        🎟️
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#059669] flex items-center gap-1.5">
                          <span>{appliedVoucher.code}</span>
                          <span className="text-[10px] bg-white text-[#059669] px-1.5 py-0.2 rounded-md border border-emerald-200">
                            - {formatRupiah(appliedVoucher.discountAmount)}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-800 line-clamp-1">{appliedVoucher.title}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      ✕ Lepas
                    </button>
                  </div>
                )}

                {voucherError && (
                  <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{voucherError}</span>
                  </div>
                )}
                {voucherSuccess && (
                  <div className="text-[11px] text-[#059669] font-medium flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{voucherSuccess}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
                  Informasi Pembeli
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Kamu (untuk ambil di kasir)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs font-semibold bg-[#fbf9f5] text-[#382820] placeholder-[#7a665b] focus:ring-1 focus:ring-[#382820] focus:outline-hidden"
                    required
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Username Telegram (@username)"
                    value={customerTelegram}
                    onChange={(e) => setCustomerTelegram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs font-semibold bg-[#fbf9f5] text-[#382820] placeholder-[#7a665b] focus:ring-1 focus:ring-[#382820] focus:outline-hidden"
                    required
                  />
                </div>
                <p className="text-[10px] text-[#7a665b] mt-1">
                  *Username Telegram digunakan untuk konfirmasi status antrian &amp; klaim garansi.
                </p>
              </div>

              {/* Request Jam Pengambilan / Jam Pemesanan di Kasir */}
              {scope !== 'premium' && (
                <div className="p-3.5 rounded-2xl bg-[#ebf7f3]/60 border border-[#bde5d8] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#382820] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Request Jam Ambil di Kasir:</span>
                    </label>
                    <span className="text-[9px] font-black uppercase text-[#059669] bg-white px-2 py-0.5 rounded-md border border-[#bde5d8]">
                      Estimasi 5–30 Menit
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPickupTimeType('asap')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        pickupTimeType === 'asap'
                          ? 'bg-[#059669] text-white border-[#059669] shadow-2xs'
                          : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#fbf9f5]'
                      }`}
                    >
                      ⚡ Sekarang (ASAP)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupTimeType('scheduled')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        pickupTimeType === 'scheduled'
                          ? 'bg-[#059669] text-white border-[#059669] shadow-2xs'
                          : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#fbf9f5]'
                      }`}
                    >
                      🕒 Jam Tertentu
                    </button>
                  </div>

                  {pickupTimeType === 'scheduled' && (
                    <div className="pt-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={customPickupTime}
                          onChange={(e) => setCustomPickupTime(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#eae2d9] font-mono font-bold text-xs text-[#382820] focus:ring-1 focus:ring-[#059669] focus:outline-hidden"
                          required
                        />
                        <span className="text-xs font-bold text-[#7a665b]">WIB</span>
                      </div>
                      <p className="text-[10px] text-[#059669] font-medium leading-relaxed">
                        💡 Admin akan memproses pesananmu mendekati jam tersebut agar es tidak mencair &amp; kopi tetap fresh saat diambil!
                      </p>
                    </div>
                  )}

                  {pickupTimeType === 'asap' && (
                    <p className="text-[10px] text-[#7a665b] leading-relaxed">
                      Pesanan diproses secara berkala (estimasi 5–30 menit mengikuti alur antrian/PO sistem, mohon tidak rush order).
                    </p>
                  )}

                  {totalPrice < 35000 && (
                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                      ℹ️ <b>Info Antrian:</b> Untuk pesanan satuan / di bawah Rp35.000, pesanan diproses mengikuti kloter siklus antrian berkala sistem (tidak dapat di-rush). Disarankan order lebih awal atau jadwalkan jam ambil.
                    </div>
                  )}
                </div>
              )}

              {/* Automatic Stock Fallback for Coffee Orders */}
              {scope !== 'premium' && (
                <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a665b]">
                      Jika ada menu mendadak habis di kasir:
                    </label>
                    <span className="text-[9px] font-bold text-[#059669] bg-[#ebf7f3] px-2 py-0.5 rounded-md border border-[#bde5d8]">
                      Otomatis
                    </span>
                  </div>
                  <select
                    value={stockFallback}
                    onChange={(e) => setStockFallback(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eae2d9] text-xs font-semibold bg-white text-[#382820] focus:ring-1 focus:ring-[#382820] focus:outline-hidden"
                  >
                    <option value="Hubungi via Telegram">Hubungi saya via Telegram</option>
                    <option value="Ganti otomatis ke menu sejenis">Ganti otomatis ke menu sejenis / seharga</option>
                    <option value="Refund dana item yang habis">Refund dana untuk menu yang habis</option>
                  </select>
                  {stockFallback.includes('Ganti') && (
                    <input
                      type="text"
                      placeholder="Tulis menu cadangan (opsional, misal: KKM Less Sugar)"
                      value={substituteNote}
                      onChange={(e) => setSubstituteNote(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#eae2d9] text-xs font-semibold bg-white text-[#382820] placeholder-[#7a665b] focus:outline-hidden"
                    />
                  )}
                </div>
              )}

              {/* Payment Method Badge */}
              <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#382820] text-[#fbf9f5] flex items-center justify-center font-bold text-[11px]">
                    QR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#382820]">QRIS All Payment</div>
                    <div className="text-[10px] text-[#7a665b]">BCA, Mandiri, BRI, GoPay, DANA, dll.</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#059669] bg-[#ebf7f3] px-2 py-0.5 rounded-full border border-[#bde5d8]">
                  Otomatis
                </span>
              </div>

              {/* Regulasi Singkat Jasdor */}
              {scope !== 'premium' && (
                <div className="p-3 rounded-2xl bg-white border border-[#eae2d9] text-[10px] text-[#7a665b] space-y-1">
                  <div className="font-bold text-[#382820] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Sistem Antrian &amp; Pre-Order Terjadwal</span>
                    </span>
                    <span className="text-[#059669] font-bold">No Rush Order</span>
                  </div>
                  <p className="leading-relaxed">
                    Estimasi proses 5–30 menit mengikuti ketersediaan antrian sistem kasir. Kecepatan proses dapat berlangsung lebih singkat jika slot kuota ready telah dialokasikan oleh admin.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isQueueOpen}
                className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#bae5d6]" />
                    <span>Membuat Tiket Pesanan...</span>
                  </>
                ) : (
                  <>
                    <span>Bayar Sekarang via QRIS ({formatRupiah(totalPrice)})</span>
                    <ArrowRight className="w-4 h-4 text-[#bae5d6]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
