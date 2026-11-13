'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CheckoutModal from '@/components/CheckoutModal';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartBar from '@/components/FloatingCartBar';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useScopedCart } from '@/hooks/useScopedCart';
import { Search, ShoppingBag, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua Aplikasi' },
  { id: 'streaming', label: '🎬 Streaming Film & TV' },
  { id: 'music', label: '🎵 Musik' },
  { id: 'design_ai', label: '🎨 Desain & AI' },
  { id: 'tools', label: '⚡ Produktivitas' },
];

export default function PremiumCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeQueueCount, setActiveQueueCount] = useState(2);
  const [isQueueOpen, setIsQueueOpen] = useState(true);

  // Settings from admin
  const [premiumOpen, setPremiumOpen] = useState(true);
  const [premiumAnnouncement, setPremiumAnnouncement] = useState('');
  const [premiumEstimatedOpen, setPremiumEstimatedOpen] = useState('');
  const [premiumClosedSchedule, setPremiumClosedSchedule] = useState('');
  const [queueLockReason, setQueueLockReason] = useState('');
  const [queueEstimatedOpen, setQueueEstimatedOpen] = useState('');
  const [premiumOverrides, setPremiumOverrides] = useState<Record<string, { isUnavailable?: boolean; price?: number; hasWarranty?: boolean }>>({});
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);

  // Scoped isolated cart for Premium Apps
  const cart = useScopedCart('premium');

  const fetchStatsAndSettings = async () => {
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
        setPremiumOpen(s.store.premiumOpen ?? true);
        setPremiumAnnouncement(s.store.premiumAnnouncement || '');
        setPremiumEstimatedOpen(s.store.premiumEstimatedOpen || '');
        setPremiumClosedSchedule(s.store.premiumClosedSchedule || '');
        setQueueLockReason(s.store.queueLockReason || '');
        setQueueEstimatedOpen(s.store.queueEstimatedOpen || '');
        setPremiumOverrides(s.premiumOverrides || {});
        if (Array.isArray(s.customProducts)) {
          setCustomProducts(s.customProducts);
        }
        if (Array.isArray(s.deletedProductIds)) {
          setDeletedProductIds(s.deletedProductIds);
        }
      }
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    fetchStatsAndSettings();
    const interval = setInterval(fetchStatsAndSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  // Merge static PRODUCTS with customProducts (and exclude deletedProductIds)
  const mergedProducts: Product[] = useMemo(() => {
    const map = new Map<string, Product>();
    PRODUCTS.forEach((p) => {
      if (!deletedProductIds.includes(p.id)) {
        map.set(p.id, p);
      }
    });
    customProducts.forEach((p) => {
      if (!deletedProductIds.includes(p.id)) {
        map.set(p.id, p);
      }
    });
    return Array.from(map.values());
  }, [customProducts, deletedProductIds]);

  const filteredProducts = useMemo(() => {
    return mergedProducts.filter((prod) => {
      const matchCategory =
        selectedCategory === 'all' ||
        prod.category === selectedCategory ||
        (selectedCategory === 'design_ai' && (prod.category === 'creative' || prod.category === 'ai')) ||
        (selectedCategory === 'tools' && (prod.category === 'utility' || prod.category === 'education'));
      const matchSearch =
        !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [mergedProducts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#382820] pb-24">
      <Navbar activeQueuesCount={activeQueueCount} isQueueOpen={isQueueOpen} />

      {/* Added to cart toast */}
      {cart.addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#382820] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <ShoppingBag className="w-4 h-4 text-[#bae5d6]" />
          <span>{cart.addedToast}</span>
        </div>
      )}

      {/* Header section */}
      <section className="pt-10 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <span>Katalog Aplikasi Premium</span>
            <span className="text-[#bae5d6]">•</span>
            <span className="text-[#7a665b]">20 Aplikasi Siap Order</span>
          </div>

          {/* Scoped Cart Button in Header */}
          <button
            onClick={() => cart.setIsCartOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#bae5d6]" />
            <span>Keranjang Aplikasi</span>
            {cart.items.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#bae5d6] text-[10px] text-[#059669] font-black">
                {cart.items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#382820] font-serif leading-[1.16]">
          Langganan Aplikasi Resmi, <br className="hidden sm:block" />
          <span className="relative inline-block italic font-normal text-[#059669] mt-1">
            Proses Kilat &amp; Bergaransi.
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

        <p className="mt-3 text-xs sm:text-sm text-[#7a665b] max-w-lg mx-auto leading-relaxed">
          Pilih aplikasi favoritmu, masukkan ke keranjang atau checkout langsung via QRIS otomatis. Detail akun langsung otomatis muncul di layar tiketmu.
        </p>

        {/* Global Premium Announcement if Closed */}
        {(!premiumOpen || !isQueueOpen) && (
          <div className="mt-5 p-4 sm:p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs shadow-md space-y-2 text-left animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-sm text-amber-950">
                    Layanan Aplikasi Premium Sedang Tutup / Maintenance 🛑
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                    Pemesanan Ditahan
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                  {!premiumOpen
                    ? (premiumAnnouncement || 'Mohon maaf, pembelian akun premium sedang ditutup sementara oleh admin untuk restock & pembaruan sistem.')
                    : (queueLockReason || 'Antrian toko sedang ditahan sementara oleh admin.')}
                </p>
                <div className="mt-2.5 pt-2 border-t border-amber-200 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] font-bold text-amber-900">
                  <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    <span>⏰ Estimasi Buka: <strong>{premiumEstimatedOpen || queueEstimatedOpen || 'Segera'}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    <span>🕒 Jadwal Operasional: <strong>{premiumClosedSchedule || 'Layanan 24 Jam'}</strong></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clean Searchbar */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#7a665b] absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2} />
          <input
            type="text"
            placeholder="Cari aplikasi... (Netflix, Canva, YouTube, Spotify)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-2.5 pl-11 rounded-2xl bg-white border border-[#eae2d9] focus:border-[#382820] focus:ring-1 focus:ring-[#382820] focus:outline-hidden text-sm text-[#382820] placeholder-[#7a665b] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7a665b] hover:text-[#382820]"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      {/* Main product catalogue */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 flex-1 w-full space-y-6">
        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                  isActive
                    ? 'bg-[#382820] text-[#fbf9f5] border border-[#382820]'
                    : 'bg-white text-[#7a665b] hover:bg-[#fbf9f5] hover:text-[#382820] border border-[#eae2d9]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const isOutOfStock = !premiumOpen || Boolean(premiumOverrides[product.id]?.isUnavailable);
            const effectiveHasWarranty =
              premiumOverrides[product.id]?.hasWarranty !== undefined
                ? premiumOverrides[product.id].hasWarranty
                : product.hasWarranty !== false;
            const effectiveProduct = {
              ...product,
              hasWarranty: effectiveHasWarranty,
            };

            return (
              <ProductCard
                key={product.id}
                product={effectiveProduct}
                isUnavailable={isOutOfStock}
                onSelect={(p) => {
                  if (isOutOfStock) return;
                  setSelectedProduct(p);
                }}
              />
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#eae2d9] max-w-md mx-auto p-6">
            <p className="text-sm font-bold text-[#382820]">Aplikasi tidak ditemukan</p>
            <p className="text-xs text-[#7a665b] mt-1">Coba kata kunci lain atau pilih kategori &apos;Semua&apos;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#382820] text-[#fbf9f5] text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>

      {/* Checkout / Add to Cart Modal for Apps */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isQueueOpen={premiumOpen && isQueueOpen}
          onAddToCart={(cartItem) => {
            cart.addItem({
              ...cartItem,
              brand: 'premium',
            });
          }}
        />
      )}

      {/* Scoped Cart Drawer for Premium Apps */}
      <CartDrawer
        scope="premium"
        title="Keranjang Aplikasi Premium"
        items={cart.items}
        onUpdateQty={cart.updateQty}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        isQueueOpen={premiumOpen && isQueueOpen}
      />

      {/* Floating Cart Bar for Premium Apps */}
      <FloatingCartBar
        items={cart.items}
        onOpenCart={() => cart.setIsCartOpen(true)}
      />
    </div>
  );
}
