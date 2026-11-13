'use client';

import React, { useState } from 'react';
import {
  Star,
  X,
  Upload,
  Sparkles,
  Check,
  ShieldCheck,
  Image as ImageIcon,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { Testimonial, TESTIMONIAL_TEMPLATES } from '@/data/testimonials';

interface VerifiedOrder {
  id: string;
  productName: string;
  planName?: string;
}

interface TestimonialModalProps {
  orders: VerifiedOrder[];
  initialOrderId?: string;
  onClose: () => void;
  onSubmit: (testimonial: Testimonial) => void;
}

export default function TestimonialModal({
  orders,
  initialOrderId,
  onClose,
  onSubmit,
}: TestimonialModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || (orders.length > 0 ? orders[0].id : '')
  );
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('Indonesia');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [copiedTemplateId, setCopiedTemplateId] = useState<number | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Determine category from selected order
  const getCategory = (prodName: string): 'kopken' | 'tomoro' | 'premium' | 'jascur' => {
    const lower = prodName.toLowerCase();
    if (lower.includes('curhat') || lower.includes('jascur')) return 'jascur';
    if (lower.includes('kenangan') || lower.includes('kopken')) return 'kopken';
    return 'premium';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const applyTemplate = (templateId: number, text: string) => {
    setComment(text);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedTemplateId(templateId);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      alert('Mohon isi nama pemesan dan kata-kata ulasan testimoni.');
      return;
    }

    const prodName = selectedOrder?.productName || 'Order Terverifikasi';
    const category = getCategory(prodName);

    const nameParts = customerName.trim().split(' ');
    const avatarText = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : customerName.trim().slice(0, 2).toUpperCase();

    const newTestimonial: Testimonial = {
      id: `user-${Date.now()}`,
      orderId: selectedOrderId,
      customerName: customerName.trim(),
      location: location.trim() || 'Indonesia',
      category,
      productName: `${prodName} • Tiket #${selectedOrderId}`,
      rating,
      date: 'Baru saja',
      comment: comment.trim(),
      avatarText,
      image: selectedPhoto || 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      verified: true,
    };

    onSubmit(newTestimonial);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#eae2d9] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#eae2d9] bg-[#fbf9f5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] shadow-2xs">
              <Star className="w-5 h-5 text-[#059669] fill-[#059669]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base text-[#4e403b]">
                  Tulis Testimoni Pembeli
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
              <p className="text-[11px] text-[#7d6b63]">
                Khusus pembeli yang telah checkout pesanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#eae2d9] text-[#7d6b63] hover:text-[#4e403b] flex items-center justify-center transition-colors cursor-pointer border border-[#eae2d9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Order Selector (if user has multiple checkouts) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1.5">
              Pesanan Yang Diulas (Tiket Checkout)
            </label>
            {orders.length > 1 && !initialOrderId ? (
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#4e403b] focus:border-[#4e403b] focus:outline-hidden"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Tiket #{o.id} – {o.productName}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-between text-[#059669]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-bold">
                    Tiket #{selectedOrderId}
                  </span>
                  <span className="text-[11px] opacity-80">
                    ({selectedOrder?.productName || 'Order Terverifikasi'})
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-lg">
                  Terverifikasi
                </span>
              </div>
            )}
          </div>

          {/* Name & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1">
                Nama / Inisial Pemesan *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Rian P. / Sarah"
                className="w-full p-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] focus:border-[#4e403b] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1">
                Kota / Domisili
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Jakarta Selatan"
                className="w-full p-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] focus:border-[#4e403b] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Interactive Rating */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1.5">
              Rating Kepuasan Pembeli
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-xs text-[#4e403b]">
                {rating} dari 5 Bintang
              </span>
            </div>
          </div>

          {/* Photo Upload (Optional) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1">
              Foto Bukti Produk / Struk / Screenshot (Opsional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-[#eae2d9] hover:border-[#bde5d8] bg-[#fbf9f5] hover:bg-[#ebf7f3] rounded-2xl p-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-[#7d6b63] hover:text-[#059669]">
                <Upload className="w-4 h-4" />
                <span>{selectedPhoto ? 'Ganti Foto' : 'Unggah Foto Bukti'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {selectedPhoto && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#bde5d8] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPhoto}
                    alt="Preview bukti"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto('')}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 10 TEMPLATE PILIHAN KALIMAT TESTIMONI (Tinggal Copas / Klik) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>Pilih Template Kalimat Testimoni (10 Opsi Siap Pakai):</span>
              </label>
              <span className="text-[10px] text-[#7d6b63]">Ketuk untuk gunakan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-[#fbf9f5] rounded-2xl border border-[#eae2d9]">
              {TESTIMONIAL_TEMPLATES.map((tmpl) => {
                const isCopied = copiedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl.id, tmpl.text)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isCopied
                        ? 'bg-[#ebf7f3] border-[#059669] text-[#059669]'
                        : 'bg-white border-[#eae2d9] hover:border-[#bde5d8] text-[#4e403b]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] truncate pr-1">
                        {tmpl.label}
                      </span>
                      <span className="shrink-0 text-[10px] text-[#059669] font-bold">
                        {isCopied ? '✓ Terpasang & Disalin' : '+ Gunakan'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7d6b63] line-clamp-2 leading-relaxed">
                      &quot;{tmpl.text}&quot;
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment / Review Textarea */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7d6b63] mb-1">
              Kata-Kata Ulasan Testimoni Kamu *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis ulasanmu di sini atau pilih salah satu template di atas..."
              className="w-full p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] focus:border-[#4e403b] focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Action Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Star className="w-4 h-4 text-[#bae5d6] fill-[#bae5d6]" />
              <span>Kirim Testimoni Terverifikasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
