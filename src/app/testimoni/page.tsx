'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { TESTIMONIALS, Testimonial } from '@/data/testimonials';
import TestimonialModal from '@/components/TestimonialModal';
import {
  Star,
  CheckCircle2,
  MapPin,
  Maximize2,
  Coffee,
  Smartphone,
  Plus,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Check,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua Bukti & Testimoni' },
  { id: 'premium', label: 'Aplikasi Premium' },
  { id: 'kopken', label: 'Kopi Kenangan (Diskon 50%)' },
  { id: 'jascur', label: 'Jascur (Jasa Curhat)' },
];

export default function TestimoniPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [savedOrders, setSavedOrders] = useState<{ id: string; productName: string; planName: string }[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved tickets & user submitted reviews from localStorage
  useEffect(() => {
    try {
      const rawTickets = localStorage.getItem('saoirse:saved_tickets');
      if (rawTickets) {
        const parsed = JSON.parse(rawTickets);
        if (Array.isArray(parsed)) setSavedOrders(parsed);
      }

      const rawUserReviews = localStorage.getItem('saoirse:user_testimonials');
      if (rawUserReviews) {
        const parsedReviews = JSON.parse(rawUserReviews);
        if (Array.isArray(parsedReviews)) {
          setAllTestimonials([...parsedReviews, ...TESTIMONIALS]);
        }
      }
    } catch (e) {
      // silent
    }
  }, []);

  const hasCheckedOut = savedOrders.length > 0;

  const handleOpenWriteReview = () => {
    if (hasCheckedOut) {
      setShowWriteModal(true);
    } else {
      setShowLockedModal(true);
    }
  };

  const handleNewTestimonial = (newReview: Testimonial) => {
    const nextList = [newReview, ...allTestimonials];
    setAllTestimonials(nextList);

    try {
      const rawUserReviews = localStorage.getItem('saoirse:user_testimonials');
      const existing = rawUserReviews ? JSON.parse(rawUserReviews) : [];
      localStorage.setItem('saoirse:user_testimonials', JSON.stringify([newReview, ...existing]));
    } catch (e) {
      // silent
    }

    setShowWriteModal(false);
    setToastMessage('Terima kasih! Testimoni terverifikasimu berhasil dipublikasikan ⭐');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredTestimonials = allTestimonials.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#4e403b]">
      <Navbar />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4e403b] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <Check className="w-4 h-4 text-[#bae5d6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <section className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eae2d9] text-[#4e403b] text-xs font-semibold mb-4 shadow-2xs">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Testimoni &amp; Bukti Transaksi Real</span>
          <span className="text-[#bae5d6]">•</span>
          <span className="font-bold text-[#059669]">4.9 / 5.0 Rating</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#4e403b] font-serif leading-[1.16]">
          Apa Kata Pembeli Tentang <br className="hidden sm:block" />
          <span className="relative inline-block italic font-normal text-[#059669] mt-1">
            Layanan di saoirse?
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

        <p className="mt-3 text-xs sm:text-sm text-[#7d6b63] max-w-lg mx-auto leading-relaxed">
          Semua ulasan di bawah adalah kiriman asli dari pembeli saoirse yang telah melakukan checkout. Bukti akun aplikasi premium aktif dan struk pick-up kopi kenangan diskon 50%.
        </p>

        {/* Action Button: Tulis Testimoni Pembeli (Gated) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleOpenWriteReview}
            className="px-5 py-2.5 rounded-2xl bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {hasCheckedOut ? (
              <>
                <Sparkles className="w-4 h-4 text-[#bae5d6]" />
                <span>+ Tulis Testimoni Pesananmu</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#bae5d6]" />
                <span>+ Tulis Testimoni (Khusus Pembeli)</span>
              </>
            )}
          </button>

          {hasCheckedOut && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{savedOrders.length} Order Checkout Terdeteksi</span>
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg mx-auto text-center">
          <div className="p-3.5 rounded-2xl bg-white border border-[#eae2d9] shadow-2xs">
            <div className="text-lg sm:text-2xl font-black text-[#4e403b]">1.250+</div>
            <div className="text-[11px] text-[#7d6b63] mt-0.5 font-medium">Order Selesai</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#eae2d9] shadow-2xs">
            <div className="text-lg sm:text-2xl font-black text-[#4e403b]">4.9 / 5.0</div>
            <div className="text-[11px] text-[#7d6b63] mt-0.5 font-medium">Rating Pembeli</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#eae2d9] shadow-2xs">
            <div className="text-lg sm:text-2xl font-black text-[#4e403b]">100%</div>
            <div className="text-[11px] text-[#7d6b63] mt-0.5 font-medium">Garansi Replace</div>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#4e403b] text-[#fbf9f5] border-[#4e403b] shadow-xs'
                    : 'bg-white text-[#7d6b63] border-[#eae2d9] hover:bg-[#ebf7f3] hover:text-[#4e403b]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Testimonials Masonry / Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-md transition-all flex flex-col justify-between shadow-2xs group"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#ebf7f3] text-[#059669] font-black text-xs flex items-center justify-center font-mono border border-[#bde5d8]">
                      {item.avatarText}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#4e403b] flex items-center gap-1.5">
                        <span>{item.customerName}</span>
                        {item.verified && (
                          <span title="Pembeli Terverifikasi">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#7d6b63]">{item.date}</div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>

                {/* Service Tag */}
                <div className="mb-2.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#fbf9f5] text-[10px] font-bold text-[#4e403b] border border-[#eae2d9]">
                    {item.category === 'kopken' ? (
                      <Coffee className="w-3 h-3 text-[#059669]" />
                    ) : item.category === 'jascur' ? (
                      <HeartHandshake className="w-3 h-3 text-[#059669]" />
                    ) : (
                      <Smartphone className="w-3 h-3 text-[#059669]" />
                    )}
                    <span>{item.productName}</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#7d6b63] leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </p>

                {/* Outlet info if coffee */}
                {item.location && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-[#7d6b63]">
                    <MapPin className="w-3 h-3 text-[#059669]" shrink-0 />
                    <span className="truncate">{item.location}</span>
                  </div>
                )}
              </div>

              {/* Real Photo Attachment */}
              {item.image && (
                <div className="mt-4 pt-4 border-t border-[#eae2d9]">
                  <div
                    onClick={() => setActiveImageModal(item.image!)}
                    className="relative rounded-2xl overflow-hidden border border-[#eae2d9] cursor-pointer group/img max-h-52 bg-[#fbf9f5]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={`Bukti transaksi ${item.customerName}`}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 text-[#4e403b] text-xs font-bold shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Bukti</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* MODAL 1: Write Testimonial (When User Has Checked Out) */}
      {showWriteModal && (
        <TestimonialModal
          orders={savedOrders}
          onClose={() => setShowWriteModal(false)}
          onSubmit={handleNewTestimonial}
        />
      )}

      {/* MODAL 2: Gated Locked Notice (When User Has NOT Checked Out Yet) */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#eae2d9] shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] text-[#059669] flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-7 h-7 text-[#059669]" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                Khusus Pembeli Terverifikasi
              </span>
              <h3 className="font-serif font-black text-xl text-[#4e403b] mt-2">
                Belum Pernah Checkout?
              </h3>
              <p className="text-xs text-[#7d6b63] mt-2 leading-relaxed">
                Untuk menjaga keaslian dan kredibilitas ulasan, testimoni hanya dapat dikirimkan oleh pembeli yang telah menyelesaikan transaksi pesanan di saoirse.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-left text-[11px] text-[#7d6b63] space-y-1">
              <div className="font-bold text-[#4e403b]">Cara Membuka Fitur Testimoni:</div>
              <div>1. Lakukan checkout pesanan Kopi Kenangan, Tomoro, atau Aplikasi Premium.</div>
              <div>2. Setelah checkout, kamu bisa langsung unggah foto bukti dan memilih 10 template testimoni siap pakai!</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowLockedModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7d6b63] font-bold text-xs cursor-pointer border border-[#eae2d9]"
              >
                Tutup
              </button>
              <Link
                href="/jasdor/kopi-kenangan"
                className="flex-1 py-2.5 rounded-xl bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Mulai Belanja</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#bae5d6]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Zoom Gambar */}
      {activeImageModal && (
        <div
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-3xl p-3 overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-black"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImageModal}
              alt="Bukti Transaksi Full"
              className="w-full h-auto max-h-[82vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
