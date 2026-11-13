'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { JASCUR_PACKAGES, JASCUR_PRICING, JascurPackage } from '@/data/jascur';
import {
  HeartHandshake,
  MessageCircle,
  Phone,
  Mic,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Lock,
  Headphones,
  Moon,
  Smile,
  X,
  QrCode,
  AlertCircle,
  ChevronDown,
  Plus,
  Minus,
  ShieldAlert,
  Ticket,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export default function JascurPage() {
  const router = useRouter();
  
  // Customizer / Booking state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'chat' | 'call'>('chat');
  const [durationHours, setDurationHours] = useState(1);
  const [withVnAddon, setWithVnAddon] = useState(false);
  
  const [aliasName, setAliasName] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [avoidTopics, setAvoidTopics] = useState('');
  const [agreedToSafetyRules, setAgreedToSafetyRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [rates, setRates] = useState<{
    chatPerHour: number;
    callPerHour: number;
    addonVnPrice: number;
    telegramUsername: string;
    isOpen: boolean;
    isCallOpen?: boolean;
    activeCallOrderId?: string | null;
    activeCallUntil?: string | null;
    callLockReason?: string;
    closeAnnouncement?: string;
    estimatedOpen?: string;
    closedSchedule?: string;
  }>({
    chatPerHour: JASCUR_PRICING.chatPerHour,
    callPerHour: JASCUR_PRICING.callPerHour,
    addonVnPrice: JASCUR_PRICING.addonVnPrice,
    telegramUsername: '@saoirse_temancurhat',
    isOpen: true,
    isCallOpen: true,
    estimatedOpen: 'Pukul 15:00 WIB',
    closedSchedule: 'Jadwal Aktif Sesi: 09:00 - 23:00 WIB',
  });
  const [isQueueOpen, setIsQueueOpen] = useState(true);

  const fetchRates = () => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings) {
          if (d.settings.jascur) {
            setRates(d.settings.jascur);
          }
          if (d.settings.store?.queueOpen !== undefined) {
            setIsQueueOpen(d.settings.store.queueOpen);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

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

  // Price calculations based on exact user pricelist
  const ratePerHour = sessionType === 'chat' ? rates.chatPerHour : rates.callPerHour;
  const baseSessionPrice = ratePerHour * durationHours;
  const addonPrice = (sessionType === 'chat' && withVnAddon) ? rates.addonVnPrice : 0;
  const subtotal = baseSessionPrice + addonPrice;
  const discountAmount = appliedVoucher ? Math.min(appliedVoucher.discountAmount, subtotal) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = async () => {
    const targetCode = promoCodeInput.trim().toUpperCase();
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
          service: 'jascur',
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
      setVoucherError('Gagal memeriksa voucher. Coba lagi.');
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

  const openBookingForPackage = (pkg: JascurPackage) => {
    if (!rates.isOpen) {
      alert(rates.closeAnnouncement || 'Layanan Teman Curhat sedang istirahat sementara.');
      return;
    }
    if (pkg.type === 'call' && rates.isCallOpen === false) {
      alert(rates.callLockReason || 'Sesi Call sedang berlangsung dengan klien lain. Silakan pilih Sesi Chat Teks atau tunggu hingga sesi selesai.');
      return;
    }
    setSessionType(pkg.type);
    setDurationHours(pkg.durationHours);
    setWithVnAddon(false);
    setAgreedToSafetyRules(false);
    setErrorMessage('');
    handleRemoveVoucher();
    setIsModalOpen(true);
  };

  const openCustomBooking = (type: 'chat' | 'call') => {
    if (!rates.isOpen) {
      alert(rates.closeAnnouncement || 'Layanan Teman Curhat sedang istirahat sementara.');
      return;
    }
    if (type === 'call' && rates.isCallOpen === false) {
      alert(rates.callLockReason || 'Sesi Call sedang berlangsung dengan klien lain. Silakan pilih Sesi Chat Teks atau tunggu hingga sesi selesai.');
      return;
    }
    setSessionType(type);
    setDurationHours(1);
    setWithVnAddon(false);
    setAgreedToSafetyRules(false);
    setErrorMessage('');
    handleRemoveVoucher();
    setIsModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasName.trim() || !telegramUsername.trim()) {
      setErrorMessage('Mohon lengkapi nama panggilan anonim & ID / Username Telegram.');
      return;
    }
    if (!agreedToSafetyRules) {
      setErrorMessage('Kamu wajib mencentang persetujuan regulasi keamanan (Zero Tolerance Harassment, Non-Refund, & Auto-Block).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const cleanTelegramId = telegramUsername.trim().startsWith('@')
        ? telegramUsername.trim()
        : `@${telegramUsername.trim()}`;

      const typeLabel = sessionType === 'chat' ? 'Sesi Chat Teks' : 'Sesi Voice Call';
      const addonLabel = (sessionType === 'chat' && withVnAddon) ? ' + Add-on VN' : '';
      const fullProductName = `Jascur – ${typeLabel} (${durationHours} Jam)${addonLabel}`;
      
      const avoidNotes = avoidTopics.trim()
        ? `Topik Dihindari: ${avoidTopics.trim()}`
        : 'Topik Dihindari: Bebas';

      const planSummary = `${typeLabel} ${durationHours} Jam${addonLabel} - Tele: ${cleanTelegramId} - ${avoidNotes}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: aliasName.trim(),
          customerTelegram: cleanTelegramId,
          productId: 'jascur',
          productName: fullProductName,
          planGroup: 'Jasa Curhat',
          planName: planSummary,
          price: grandTotal,
          originalPrice: subtotal,
          voucherCode: appliedVoucher?.code,
          discountAmount,
          paymentMethod: 'qris',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memproses pemesanan curhat.');
      }

      // Save to saved tickets
      try {
        const raw = localStorage.getItem('saoirse:saved_tickets');
        const list = raw ? JSON.parse(raw) : [];
        const nextList = [
          { id: data.order.id, productName: fullProductName, planName: `${durationHours} Jam${addonLabel}` },
          ...list.filter((x: { id: string }) => x.id !== data.order.id),
        ].slice(0, 5);
        localStorage.setItem('saoirse:saved_tickets', JSON.stringify(nextList));
      } catch (err) {
        // silent
      }

      // Redirect to Ticket Page
      router.push(`/order/${data.order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kendala jaringan.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  const FAQS = [
    {
      q: 'Berapa tarif resmi jasa curhat di Jascur?',
      a: 'Tarif kami sangat transparan dan ramah di kantong: Sesi Chat Teks Rp 3.000/jam (berlaku kelipatan jam), Sesi Voice Call Rp 15.000/jam (berlaku kelipatan jam), dan Add-on Voice Note (VN) Rp 10.000/sesi untuk kamu yang ingin bebas kirim rekaman suara selama sesi chat.',
    },
    {
      q: 'Bagaimana sistem kelipatan jam bekerja?',
      a: 'Kamu bebas memilih berapa jam pun yang kamu inginkan! Untuk Chat: 1 Jam = Rp 3.000, 2 Jam = Rp 6.000, 3 Jam = Rp 9.000, dan seterusnya. Untuk Voice Call: 1 Jam = Rp 15.000, 2 Jam = Rp 30.000, dst.',
    },
    {
      q: 'Kapan sebaiknya mengambil Add-on Voice Note (VN)?',
      a: 'Add-on Voice Note (Rp 10.000/sesi) cocok jika kamu mengambil Sesi Chat namun ingin sesekali mengirim pesan suara (voice note) panjang tanpa batas durasi saat lelah mengetik, serta mendengarkan pesan suara hangat dari teman curhat.',
    },
    {
      q: 'Apakah saya butuh nomor telepon atau data pribadi?',
      a: 'Sama sekali tidak butuh nomor telepon atau identitas asli! Cukup masukkan nama panggilan samaran (anonim) dan ID/username Telegram kamu agar privasimu terlindungi 100%.',
    },
    {
      q: 'Bagaimana jika ada topik sensitif yang tidak ingin saya bahas?',
      a: 'Kamu bisa mengisinya di kolom "Topik yang Dihindari (Notes)". Teman curhat kami akan menghormati batasanmu dan sama sekali tidak akan menyinggung hal-hal yang tidak nyaman bagimu.',
    },
    {
      q: 'Apa regulasi & batasan etika selama sesi curhat (terutama Voice Call)?',
      a: 'Kami menerapkan ZERO TOLERANCE POLICY terhadap segala bentuk pelecehan seksual verbal, flirting, merayu, meminta foto/video tidak pantas, atau ajakan asusila. Sesi ini murni ruang aman teman cerita, sharing kehidupan, dan pendengar empati profesional. Jika terindikasi melakukan pelecehan, admin berhak MEMUTUSKAN SESI SEPIHAK saat itu juga, pembayaran HANGUS (NON-REFUND), dan akun Telegram kamu akan langsung di-BLOCK permanen.',
    },
    {
      q: 'Bagaimana cara terhubung dengan teman curhat setelah bayar?',
      a: 'Setelah pembayaran QRIS selesai, halaman tiket pesananmu langsung memunculkan tombol akses Akun Telegram Khusus Teman Curhat. Kamu tinggal klik dan langsung disambut dengan hangat!',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#4e403b]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eae2d9] text-xs font-semibold text-[#4e403b] shadow-2xs mb-5">
          <HeartHandshake className="w-3.5 h-3.5 text-[#059669]" />
          <span>Ruang Aman &amp; Teman Cerita</span>
          <span className="text-[#bae5d6]">•</span>
          <span className="font-bold text-[#059669]">Anonim &amp; No Judging</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#4e403b] font-serif leading-[1.16]">
          Jascur – Jasa Curhat, <br className="hidden sm:block" />
          <span className="relative inline-block italic font-normal text-[#059669] mt-1">
            Didengar Tanpa Dihakimi.
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
          Capek mendem sendiri? Butuh teman ngobrol, tempat cerita keresahan hidup, atau sekadar didengar tanpa takut dinilai? Kami siap menemanimu via Telegram privat.
        </p>

        {/* Value Prop Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
          <span className="px-3 py-1 rounded-xl bg-white border border-[#eae2d9] text-[#4e403b] shadow-2xs flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#059669]" /> 100% Anonim &amp; Rahasia
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-[#eae2d9] text-[#4e403b] shadow-2xs flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#059669]" /> Pendengar Empatis
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-[#eae2d9] text-[#4e403b] shadow-2xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#059669]" /> Berlaku Kelipatan Jam
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-[#eae2d9] text-[#4e403b] shadow-2xs flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#059669]" /> Akun Telegram Khusus
          </span>
        </div>

        {/* Global Jascur Close Announcement */}
        {(!rates.isOpen || !isQueueOpen) && (
          <div className="mt-6 p-4 sm:p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs shadow-md text-left max-w-2xl mx-auto space-y-2 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm text-amber-950">
                    Layanan Teman Curhat Sedang Istirahat / Tutup Sementara 🛑
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                    Sesi Nonaktif
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                  {!rates.isOpen
                    ? (rates.closeAnnouncement || 'Mohon maaf, saat ini admin teman curhat sedang istirahat sejenak.')
                    : 'Antrian toko sedang ditahan sementara oleh admin.'}
                </p>
                <div className="mt-2.5 pt-2 border-t border-amber-200 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] font-bold text-amber-900">
                  <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>⏰ Estimasi Sesi Buka: <strong>{rates.estimatedOpen || 'Segera'}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    <span>🕒 Jadwal Sesi: <strong>{rates.closedSchedule || '09:00 - 23:00 WIB'}</strong></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Call Locked Announcement (Single Admin Active Call Handling) */}
        {rates.isOpen && rates.isCallOpen === false && (
          <div className="mt-6 p-4 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] text-[#059669] text-xs font-semibold flex items-start sm:items-center gap-3 shadow-2xs text-left max-w-2xl mx-auto">
            <Clock className="w-5 h-5 text-[#059669] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#047857]">Sesi Voice Call Sedang Penuh / Berlangsung ⏳</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase">Slot Call Tutup</span>
              </div>
              <p className="mt-0.5 text-xs text-[#4e403b]">
                {rates.callLockReason || 'Admin sedang menangani sesi telepon aktif dengan klien lain. Slot call ditutup otomatis demi menjaga fokus & privasi sesi.'}
              </p>
              {rates.activeCallUntil && (
                <p className="mt-1 text-[11px] font-bold text-[#059669]">
                  Estimasi call selesai &amp; buka kembali: {new Date(rates.activeCallUntil).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
              )}
              <p className="mt-1 text-[11px] text-[#7d6b63]">
                💡 <b>Tenang!</b> Kamu tetap bisa memesan <b>Sesi Chat Teks (3k/jam)</b> yang tetap buka dan standby.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 flex-1 w-full space-y-10">
        
        {/* Pricelist Highlight Bar */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#eae2d9] shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#eae2d9]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-2.5 py-0.5 rounded-full border border-[#bde5d8] mb-1.5">
                <Sparkles className="w-3 h-3 text-[#059669]" /> PRICELIST RESMI JASCUR
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-[#4e403b]">
                Tarif Transparan &amp; Fleksibel
              </h2>
              <p className="text-xs text-[#7d6b63] mt-0.5">
                Pilih sesi sesuai kenyamananmu, bisa chat teks santai atau call suara mendalam.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openCustomBooking('chat')}
                disabled={!rates.isOpen}
                className="px-4 py-2.5 rounded-2xl bg-[#4e403b] hover:bg-[#372b27] disabled:opacity-50 disabled:cursor-not-allowed text-[#fbf9f5] font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#bae5d6]" />
                <span>{!rates.isOpen ? 'Chat Tutup' : 'Pesan Chat (3k/jam)'}</span>
              </button>
              <button
                type="button"
                onClick={() => openCustomBooking('call')}
                disabled={!rates.isOpen || rates.isCallOpen === false}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 border shadow-xs transition-all active:scale-[0.98] ${
                  !rates.isOpen || rates.isCallOpen === false
                    ? 'bg-[#f4f2ee] text-[#a89a90] border-[#ded7ce] cursor-not-allowed'
                    : 'bg-[#ebf7f3] hover:bg-[#bae5d6] text-[#059669] border-[#bde5d8] cursor-pointer'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>
                  {!rates.isOpen ? 'Call Tutup' : rates.isCallOpen === false ? 'Call Sedang Penuh ⏳' : 'Pesan Call (15k/jam)'}
                </span>
              </button>
            </div>
          </div>

          {/* 3 Main Rate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {/* Card 1: Chat 3k/jam */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] hover:border-[#bde5d8] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#ebf7f3] text-[#059669] flex items-center justify-center border border-[#bde5d8]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#059669] border border-[#eae2d9]">
                    HEMAT &amp; SANTAI
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#4e403b]">Sesi Chat Teks</h3>
                <div className="mt-2 mb-1">
                  <span className="text-2xl font-black text-[#4e403b]">{formatRupiah(rates.chatPerHour)}</span>
                  <span className="text-xs text-[#7d6b63] font-semibold"> / jam</span>
                </div>
                <div className="text-[11px] font-bold text-[#059669] flex items-center gap-1 mb-2">
                  <Check className="w-3.5 h-3.5" /> Berlaku kelipatan durasi
                </div>
                <p className="text-[11px] text-[#7d6b63] leading-relaxed">
                  Ngobrol via chat Telegram leluasa. Cocok untuk uneg-uneg singkat, overthinking, atau butuh teman respon kilat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openCustomBooking('chat')}
                className="mt-4 w-full py-2 rounded-xl bg-white hover:bg-[#ebf7f3] text-[#4e403b] hover:text-[#059669] border border-[#eae2d9] hover:border-[#bde5d8] text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Pilih Chat ➔
              </button>
            </div>

            {/* Card 2: Call 15k/jam */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#ebf7f3] to-white border border-[#059669] shadow-sm flex flex-col justify-between relative">
              <div className="absolute top-0 right-0 bg-[#059669] text-[#fbf9f5] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#bae5d6]" /> LEGA MAKSIMAL
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#059669] text-[#bae5d6] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-[#4e403b]">Sesi Voice Call</h3>
                <div className="mt-2 mb-1">
                  <span className="text-2xl font-black text-[#4e403b]">{formatRupiah(rates.callPerHour)}</span>
                  <span className="text-xs text-[#7d6b63] font-semibold"> / jam</span>
                </div>
                <div className="text-[11px] font-bold text-[#059669] flex items-center gap-1 mb-2">
                  <Check className="w-3.5 h-3.5" /> Berlaku kelipatan durasi
                </div>
                <p className="text-[11px] text-[#7d6b63] leading-relaxed">
                  Panggilan suara langsung di Telegram. Cerita lebih hangat, ekspresif, dan mendalam seperti teleponan dengan sahabat baik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openCustomBooking('call')}
                disabled={!rates.isOpen || rates.isCallOpen === false}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-colors text-center shadow-2xs ${
                  !rates.isOpen || rates.isCallOpen === false
                    ? 'bg-[#ded7ce] text-[#7a665b] cursor-not-allowed select-none'
                    : 'bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] cursor-pointer'
                }`}
              >
                {!rates.isOpen
                  ? 'Tutup Sementara'
                  : rates.isCallOpen === false
                  ? 'Call Sedang Berlangsung ⏳'
                  : 'Pilih Call ➔'}
              </button>
            </div>

            {/* Card 3: Add-on VN 10k/sesi */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] hover:border-[#bde5d8] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#ebf7f3] text-[#059669] flex items-center justify-center border border-[#bde5d8]">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#7d6b63] border border-[#eae2d9]">
                    ADD-ON OPSIONAL
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#4e403b]">Add-on Voice Note (VN)</h3>
                <div className="mt-2 mb-1">
                  <span className="text-2xl font-black text-[#4e403b]">{formatRupiah(rates.addonVnPrice)}</span>
                  <span className="text-xs text-[#7d6b63] font-semibold"> / sesi</span>
                </div>
                <div className="text-[11px] font-bold text-[#059669] flex items-center gap-1 mb-2">
                  <Check className="w-3.5 h-3.5" /> Bebas kirim &amp; dengar VN
                </div>
                <p className="text-[11px] text-[#7d6b63] leading-relaxed">
                  Bebas kirim pesan suara selama sesi chat berlangsung tanpa batas menit, didengar dan dibalas dengan suara ramah.
                </p>
              </div>
              <div className="mt-4 py-2 px-3 rounded-xl bg-[#ebf7f3] text-[#059669] text-[11px] font-semibold text-center border border-[#bde5d8]">
                Bisa dicentang saat order sesi chat
              </div>
            </div>
          </div>
        </section>

        {/* Preset Packages Grid */}
        <section>
          <div className="text-center mb-7">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-3 py-1 rounded-full border border-[#bde5d8]">
              PILIHAN PAKET POPULER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4e403b] font-serif mt-2">
              Pilih Paket Siap Pakai
            </h2>
            <p className="text-xs text-[#7d6b63] mt-1 max-w-md mx-auto">
              Tinggal klik paket di bawah, sesuaikan durasi &amp; add-on sesuai selera kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {JASCUR_PACKAGES.map((pkg) => {
              const isPopular = pkg.popular;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden group ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#ebf7f3] via-white to-white border-[#059669] shadow-md ring-1 ring-[#059669]'
                      : 'bg-white border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-md shadow-2xs'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-[#059669] text-[#fbf9f5] text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-2xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#bae5d6]" /> Terpopuler
                    </div>
                  )}

                  <div>
                    {pkg.badge && !isPopular && (
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fbf9f5] text-[#7d6b63] border border-[#eae2d9] mb-2">
                        {pkg.badge}
                      </span>
                    )}

                    <h3 className="font-serif font-black text-lg text-[#4e403b]">
                      {pkg.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#059669] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{pkg.duration}</span>
                    </div>

                    <div className="my-4 pb-4 border-b border-[#eae2d9]">
                      <div className="text-2xl font-black text-[#4e403b]">
                        {formatRupiah(pkg.type === 'chat' ? rates.chatPerHour * pkg.durationHours : rates.callPerHour * pkg.durationHours)}
                      </div>
                      <div className="text-[10px] text-[#7d6b63]">
                        {pkg.type === 'chat' ? 'Sesi chat teks via Telegram' : 'Voice call langsung via Telegram'}
                      </div>
                    </div>

                    <p className="text-xs text-[#7d6b63] leading-relaxed mb-4">
                      {pkg.description}
                    </p>

                    <div className="space-y-2 text-[11px] text-[#4e403b]">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#eae2d9]">
                    <button
                      type="button"
                      disabled={!rates.isOpen || (pkg.type === 'call' && rates.isCallOpen === false)}
                      onClick={() => openBookingForPackage(pkg)}
                      className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] ${
                        !rates.isOpen || (pkg.type === 'call' && rates.isCallOpen === false)
                          ? 'bg-[#ded7ce] text-[#7a665b] cursor-not-allowed select-none'
                          : isPopular
                          ? 'bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] cursor-pointer'
                          : 'bg-[#ebf7f3] hover:bg-[#bae5d6] text-[#059669] border border-[#bde5d8] cursor-pointer'
                      }`}
                    >
                      <span>
                        {!rates.isOpen
                          ? 'Tutup Sementara'
                          : pkg.type === 'call' && rates.isCallOpen === false
                          ? 'Call Sedang Penuh ⏳'
                          : 'Mulai Curhat'}
                      </span>
                      {rates.isOpen && !(pkg.type === 'call' && rates.isCallOpen === false) && (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae2d9] shadow-2xs">
          <div className="text-center max-w-md mx-auto mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-3 py-1 rounded-full border border-[#bde5d8]">
              CARA MEMULAI
            </span>
            <h3 className="text-xl font-black text-[#4e403b] font-serif mt-2">
              Alur Jasa Curhat di saoirse
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] text-[#059669] font-black flex items-center justify-center mb-2.5 border border-[#bde5d8]">
                1
              </div>
              <div className="font-bold text-[#4e403b]">Pilih Sesi &amp; Jam</div>
              <p className="text-[#7d6b63] mt-1 leading-relaxed">
                Tentukan Chat (3k/jam) atau Call (15k/jam), pilih kelipatan jam yang diinginkan, dan centang Add-on VN jika butuh.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] text-[#059669] font-black flex items-center justify-center mb-2.5 border border-[#bde5d8]">
                2
              </div>
              <div className="font-bold text-[#4e403b]">Bayar via QRIS Instan</div>
              <p className="text-[#7d6b63] mt-1 leading-relaxed">
                Selesaikan pembayaran via QRIS dari aplikasi bank atau e-wallet apa saja. Sistem tiket otomatis aktif seketika.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] text-[#059669] font-black flex items-center justify-center mb-2.5 border border-[#bde5d8]">
                3
              </div>
              <div className="font-bold text-[#4e403b]">Chat di Akun Telegram Khusus</div>
              <p className="text-[#7d6b63] mt-1 leading-relaxed">
                Di layar tiket, kamu langsung mendapatkan link akun Telegram khusus. Tinggal klik dan mulai cerita sepuasnya!
              </p>
            </div>
          </div>
        </section>

        {/* Regulasi & Kebijakan Keamanan (Zero Tolerance Harassment) */}
        <section className="bg-gradient-to-b from-rose-50/70 to-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200 shadow-2xs">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                  KEBIJAKAN &amp; REGULASI RESMI
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#4e403b] font-serif mt-2">
                  Ruang Aman Bersama: Zero Tolerance Harassment
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#7d6b63] leading-relaxed">
                Jascur didirikan murni sebagai <b>wadah tempat curhat, sharing keluh kesah kehidupan, cerita hari-hari, atau overthinking secara suportif</b>. Kami sangat menjunjung tinggi batasan etika dan keselamatan bersama.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2 text-xs">
                <div className="font-bold text-rose-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>DILARANG KERAS Segala Bentuk Pelecehan Seksual:</span>
                </div>
                <ul className="text-[11px] text-[#4e403b] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><b>Flirting &amp; Rayuan:</b> Tidak diperkenankan merayu, mengajak pacaran, atau flirting yang berbau asmara/seksual.</li>
                  <li><b>Pelecehan Verbal (Sexual Harassment):</b> Tidak boleh membahas topik vulgar, pornografi, VCS, atau meminta konten seksual dalam bentuk apapun.</li>
                  <li><b>Permintaan Data Pribadi Sensitif:</b> Dilarang memaksa meminta kontak pribadi di luar akun resmi Jascur.</li>
                </ul>

                <div className="mt-3 pt-3 border-t border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-bold text-rose-800">
                  <span>🚨 Sanksi Tegas Pelanggaran:</span>
                  <span className="bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-300 text-rose-800">
                    Sesi Diputus Sepihak • Dana HANGUS (Non-Refund) • Auto-BLOCK Permanen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae2d9] shadow-2xs">
          <div className="text-center max-w-md mx-auto mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ebf7f3] px-3 py-1 rounded-full border border-[#bde5d8]">
              PERTANYAAN UMUM
            </span>
            <h3 className="text-xl font-black text-[#4e403b] font-serif mt-2">
              Hal yang Sering Ditanyakan
            </h3>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#eae2d9] bg-[#fbf9f5] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#4e403b] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7d6b63] transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#4e403b]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#7d6b63] leading-relaxed border-t border-[#eae2d9] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Checkout / Booking Modal with Real-time Calculator & Add-on */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#eae2d9] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-[#eae2d9] bg-[#fbf9f5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669]">
                  <HeartHandshake className="w-5 h-5 text-[#059669]" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-[#4e403b]">
                    Atur Sesi Curhat Kamu
                  </h3>
                  <p className="text-[11px] text-[#7d6b63]">
                    Privat, suportif &amp; 100% rahasia
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#eae2d9] text-[#7d6b63] hover:text-[#4e403b] flex items-center justify-center transition-colors cursor-pointer border border-[#eae2d9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Pilih Tipe Sesi: Chat vs Call */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1.5">
                  1. Pilih Media Sesi Curhat
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSessionType('chat');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      sessionType === 'chat'
                        ? 'bg-[#ebf7f3] border-[#059669] text-[#059669] ring-1 ring-[#059669]'
                        : 'bg-[#fbf9f5] border-[#eae2d9] text-[#4e403b] hover:border-[#bde5d8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-[10px] font-black">{rates.chatPerHour / 1000}k/jam</span>
                    </div>
                    <div className="font-black text-xs">Sesi Chat Teks</div>
                    <div className="text-[10px] text-[#7d6b63]">Bebas ketik di Telegram</div>
                  </button>

                  <button
                    type="button"
                    disabled={rates.isCallOpen === false}
                    onClick={() => {
                      if (rates.isCallOpen === false) return;
                      setSessionType('call');
                      setWithVnAddon(false); // Call already voice
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      rates.isCallOpen === false
                        ? 'bg-[#f4f2ee] border-[#ded7ce] text-[#a89a90] opacity-60 cursor-not-allowed select-none'
                        : sessionType === 'call'
                        ? 'bg-[#ebf7f3] border-[#059669] text-[#059669] ring-1 ring-[#059669] cursor-pointer'
                        : 'bg-[#fbf9f5] border-[#eae2d9] text-[#4e403b] hover:border-[#bde5d8] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px] font-black">
                        {rates.isCallOpen === false ? 'Penuh ⏳' : `${rates.callPerHour / 1000}k/jam`}
                      </span>
                    </div>
                    <div className="font-black text-xs">Sesi Voice Call</div>
                    <div className="text-[10px] text-[#7d6b63]">
                      {rates.isCallOpen === false ? 'Sedang ada panggilan aktif' : 'Teleponan langsung'}
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Durasi Jam (Berlaku Kelipatan) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d6b63]">
                    2. Durasi Sesi (Berlaku Kelipatan)
                  </label>
                  <span className="text-[11px] font-bold text-[#059669]">
                    {formatRupiah(baseSessionPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#eae2d9] rounded-2xl bg-[#fbf9f5] p-1 shrink-0">
                    <button
                      type="button"
                      disabled={durationHours <= 1}
                      onClick={() => setDurationHours((h) => Math.max(1, h - 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-[#eae2d9] disabled:opacity-30 text-[#4e403b] flex items-center justify-center transition-colors cursor-pointer border border-[#eae2d9]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-14 text-center font-black text-xs text-[#4e403b]">
                      {durationHours} Jam
                    </span>
                    <button
                      type="button"
                      disabled={durationHours >= 12}
                      onClick={() => setDurationHours((h) => Math.min(12, h + 1))}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-[#eae2d9] disabled:opacity-30 text-[#4e403b] flex items-center justify-center transition-colors cursor-pointer border border-[#eae2d9]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Hour Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    {[1, 2, 3, 4].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setDurationHours(h)}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          durationHours === h
                            ? 'bg-[#059669] text-[#fbf9f5] border-[#059669]'
                            : 'bg-white text-[#7d6b63] border-[#eae2d9] hover:border-[#bde5d8]'
                        }`}
                      >
                        {h} Jam
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-[#7d6b63] mt-1 block">
                  {sessionType === 'chat'
                    ? `Tarif chat ${formatRupiah(rates.chatPerHour)} x ${durationHours} jam = ${formatRupiah(baseSessionPrice)}`
                    : `Tarif call ${formatRupiah(rates.callPerHour)} x ${durationHours} jam = ${formatRupiah(baseSessionPrice)}`}
                </span>
              </div>

              {/* 3. Add-on Voice Note (Hanya untuk Sesi Chat) */}
              {sessionType === 'chat' && (
                <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={withVnAddon}
                      onChange={(e) => setWithVnAddon(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#059669] mt-0.5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#4e403b] flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-[#059669]" />
                          Add-on Voice Note (VN)
                        </span>
                        <span className="font-black text-xs text-[#059669]">
                          +{formatRupiah(rates.addonVnPrice)}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7d6b63] mt-0.5 leading-relaxed">
                        Bebas kirim pesan suara selama sesi chat berlangsung tanpa batas menit rekaman.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Voucher Promo Section */}
              <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b63] flex items-center gap-1.5">
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
                      <Tag className="w-3.5 h-3.5 text-[#7d6b63] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Contoh: CURHATHEMAT / SAOIRSE50"
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
                      onClick={handleApplyVoucher}
                      disabled={isValidatingVoucher || !promoCodeInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[#382820] hover:bg-[#251a14] disabled:opacity-40 text-[#fbf9f5] text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      {isValidatingVoucher ? (
                        <span>Cek...</span>
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
                  <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{voucherError}</span>
                  </div>
                )}
                {voucherSuccess && (
                  <div className="text-[11px] text-[#059669] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{voucherSuccess}</span>
                  </div>
                )}
              </div>

              {/* Live Price Summary Box */}
              <div className="p-3.5 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] text-[#059669]">
                <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#bde5d8]/60">
                  <span>
                    {sessionType === 'chat' ? 'Sesi Chat Teks' : 'Sesi Voice Call'} ({durationHours} Jam)
                  </span>
                  <span className="font-bold">{formatRupiah(baseSessionPrice)}</span>
                </div>
                {sessionType === 'chat' && withVnAddon && (
                  <div className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#bde5d8]/60">
                    <span>Add-on Voice Note (VN)</span>
                    <span className="font-bold">+{formatRupiah(rates.addonVnPrice)}</span>
                  </div>
                )}
                {appliedVoucher && (
                  <div className="flex items-center justify-between text-[11px] py-1.5 border-b border-[#bde5d8]/60 font-bold">
                    <span>Potongan Diskon ({appliedVoucher.code})</span>
                    <span>- {formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-black text-xs uppercase tracking-wider">Total Pembayaran</span>
                  <span className="font-black text-base">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Alias Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1">
                  Nama Panggilan / Alias Anonim *
                </label>
                <input
                  type="text"
                  required
                  value={aliasName}
                  onChange={(e) => setAliasName(e.target.value)}
                  placeholder="Contoh: Bintang / A / Anonim"
                  className="w-full p-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] focus:border-[#4e403b] focus:outline-hidden"
                />
                <span className="text-[10px] text-[#7d6b63] mt-1 block">
                  Bebas pakai nama samaran apa saja untuk menjaga privasimu.
                </span>
              </div>

              {/* Telegram Username (Required) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1">
                  ID / Username Telegram Aktif *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="Contoh: @username_kamu"
                    className="w-full p-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#4e403b] focus:border-[#059669] focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-[#7d6b63] mt-1 block">
                  Wajib diisi agar teman curhat kami bisa langsung menyapa &amp; menghubungimu di Telegram.
                </span>
              </div>

              {/* Topics to Avoid (Notes diisi client sendiri) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d6b63]">
                    Topik yang Dihindari (Notes Khusus)
                  </label>
                  <span className="text-[10px] text-[#7d6b63] italic font-medium">Opsional</span>
                </div>
                <textarea
                  rows={3}
                  value={avoidTopics}
                  onChange={(e) => setAvoidTopics(e.target.value)}
                  placeholder="Contoh: Jangan bahas mantan/asmara, hindari singgung masalah keluarga atau skripsi, jangan bahas topik berat, dll."
                  className="w-full p-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] placeholder-[#a3948b] focus:border-[#059669] focus:outline-hidden resize-none leading-relaxed"
                />
                <span className="text-[10px] text-[#7d6b63] mt-1 block">
                  Tulis hal sensitif yang tidak ingin dibahas sama sekali saat ngobrol (kosongkan jika bebas bercerita apa saja).
                </span>
              </div>

              {/* Regulasi & Kebijakan Keamanan (Zero Tolerance Harassment & Flirting) */}
              <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200 text-xs space-y-2.5">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Regulasi &amp; Kode Etik Sesi (Wajib)</span>
                </div>
                <p className="text-[11px] text-rose-950 leading-relaxed">
                  Jascur adalah <b>ruang aman teman cerita non-seksual</b>. Segala bentuk <i>flirting</i>, rayuan seksual, pelecehan verbal (sexual harassment), atau ajakan asusila <b>DILARANG KERAS</b>.
                </p>
                <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-[10px] text-rose-900 font-semibold space-y-1">
                  <div className="text-rose-700">🚨 <b>Konsekuensi Tegas Pelanggaran:</b></div>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                    <li>Seller berhak <b>memutuskan sesi sepihak</b> saat itu juga.</li>
                    <li>Uang pembayaran <b>HANGUS (Non-Refundable)</b>.</li>
                    <li>Akun Telegram kamu akan langsung di-<b>BLOCK permanen</b>.</li>
                  </ul>
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToSafetyRules}
                    onChange={(e) => setAgreedToSafetyRules(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#059669] accent-[#059669] focus:ring-[#059669] border-[#eae2d9] cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-rose-950 leading-tight">
                    Saya menyetujui regulasi di atas &amp; bersedia sesi diputus sepihak / non-refund jika melanggar. *
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !rates.isOpen || !isQueueOpen}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    !rates.isOpen || !isQueueOpen
                      ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                      : 'bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] cursor-pointer active:scale-[0.99]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#bae5d6]" />
                  <span>
                    {!rates.isOpen || !isQueueOpen
                      ? `Layanan Curhat Sedang Tutup (Buka: ${rates.estimatedOpen || 'Segera'})`
                      : isSubmitting
                      ? 'Membuat Tiket...'
                      : `Bayar QRIS ${formatRupiah(grandTotal)}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#eae2d9] py-8 px-4 text-center text-xs text-[#7d6b63]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#4e403b] font-serif">saoirse.</span>
            <span>•</span>
            <span>jascur – ruang aman teman cerita dan curhat privat</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/jasdor" className="text-[#4e403b] hover:underline">
              Jasdor Kopi
            </Link>
            <span>•</span>
            <Link href="/premium" className="text-[#4e403b] hover:underline">
              App Premium
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
