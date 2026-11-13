'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ShoppingBag, RotateCcw, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeQueuesCount?: number;
  isQueueOpen?: boolean;
}

export default function Navbar({ activeQueuesCount = 2, isQueueOpen = true }: NavbarProps) {
  const [trackInput, setTrackInput] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [modalTab, setModalTab] = useState<'history' | 'lookup'>('history');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedTickets, setSavedTickets] = useState<{ id: string; productName: string; planName: string; price?: number; status?: string }[]>([]);
  const [syncContact, setSyncContact] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile/tab menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (showSearchModal) {
      try {
        const raw = localStorage.getItem('saoirse:saved_tickets');
        if (raw) setSavedTickets(JSON.parse(raw));
      } catch (e) {
        // silent
      }
    }
  }, [showSearchModal]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    const cleanId = trackInput.trim().toUpperCase();
    router.push(`/order/${cleanId}`);
    setShowSearchModal(false);
  };

  const handleSyncByContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncContact.trim()) return;
    setIsSyncing(true);
    setSyncMessage('');
    try {
      const res = await fetch(`/api/orders?contact=${encodeURIComponent(syncContact.trim())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        const formatted = data.orders.map((o: any) => ({
          id: o.id,
          productName: o.productName,
          planName: o.planName || '',
          price: o.price,
          status: o.status,
        }));
        setSavedTickets((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const merged = [...formatted.filter((f: any) => !existingIds.has(f.id)), ...prev];
          localStorage.setItem('saoirse:saved_tickets', JSON.stringify(merged.slice(0, 8)));
          return merged;
        });
        setSyncMessage(`Ditemukan ${data.orders.length} pesanan atas kontak tersebut! ✨`);
        setModalTab('history');
      } else {
        setSyncMessage('Belum ada riwayat pesanan dengan kontak tersebut.');
      }
    } catch (err) {
      setSyncMessage('Gagal menyinkronkan data.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReorder = (ticket: { id: string; productName?: string }) => {
    setShowSearchModal(false);
    const pName = (ticket.productName || '').toLowerCase();
    if (pName.includes('kopi') || ticket.id.startsWith('SR-KP')) {
      router.push('/jasdor/kopi-kenangan');
    } else if (pName.includes('curhat')) {
      router.push('/jascur');
    } else {
      router.push('/premium');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#eae2d9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand: saoirse in Matcha & Cocoa */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#bae5d6] flex items-center justify-center text-[#059669] shadow-2xs group-hover:scale-105 transition-transform font-serif font-black text-sm">
              s.
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-[#382820] lowercase font-serif">
                saoirse<span className="text-[#059669]">.</span>
              </span>
              <span className="text-[10px] text-[#7a665b] block -mt-1 font-medium">
                store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile & Tablet) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname === '/'
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#7a665b] hover:text-[#382820] hover:bg-[#f2ece3]'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/premium"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname.startsWith('/premium')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#7a665b] hover:text-[#382820] hover:bg-[#f2ece3]'
              }`}
            >
              Aplikasi Premium
            </Link>
            <Link
              href="/jasdor"
              className={`px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                pathname.startsWith('/jasdor')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#7a665b] hover:text-[#382820] hover:bg-[#f2ece3]'
              }`}
            >
              <span>Jasdor Kopi</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] text-[10px] font-black tracking-wide">
                50%
              </span>
            </Link>
            <Link
              href="/jascur"
              className={`px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                pathname.startsWith('/jascur')
                  ? 'bg-[#4e403b] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#7d6b63] hover:text-[#4e403b] hover:bg-[#f2ece3]'
              }`}
            >
              <span>Jascur</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] text-[9px] font-black">
                Baru
              </span>
            </Link>
            <Link
              href="/testimoni"
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                pathname.startsWith('/testimoni')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#7a665b] hover:text-[#382820] hover:bg-[#f2ece3]'
              }`}
            >
              Testimoni
            </Link>
          </nav>

          {/* Right Actions: Pesanan Saya & Strip-3 Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-white hover:bg-[#f2ece3] text-[#382820] border border-[#eae2d9] transition-colors shadow-2xs cursor-pointer"
              title="Buka Riwayat Belanja & Cek Tiket"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#059669]" />
              <span>Pesanan Saya</span>
              {savedTickets.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Strip 3 Menu Toggle Button for Mobile & Tablet */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white hover:bg-[#f2ece3] text-[#382820] border border-[#eae2d9] transition-all shadow-2xs cursor-pointer active:scale-95 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#382820]" />
              ) : (
                <Menu className="w-5 h-5 text-[#382820]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Hidden Menu (Strip 3 Dropdown) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#eae2d9] bg-[#fbf9f5] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200 shadow-md">
            <Link
              href="/"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/'
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#4e403b] hover:bg-white hover:text-[#059669]'
              }`}
            >
              <span>Beranda</span>
            </Link>

            <Link
              href="/premium"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname.startsWith('/premium')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#4e403b] hover:bg-white hover:text-[#059669]'
              }`}
            >
              <span>Aplikasi Premium</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                20+ App
              </span>
            </Link>

            <Link
              href="/jasdor"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname.startsWith('/jasdor')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#4e403b] hover:bg-white hover:text-[#059669]'
              }`}
            >
              <span>Jasdor Kopi Kenangan</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                Diskon 50%
              </span>
            </Link>

            <Link
              href="/jascur"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname.startsWith('/jascur')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#4e403b] hover:bg-white hover:text-[#059669]'
              }`}
            >
              <span>Jasa Curhat (Jascur)</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#bae5d6] text-[#059669]">
                Baru ✨
              </span>
            </Link>

            <Link
              href="/testimoni"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname.startsWith('/testimoni')
                  ? 'bg-[#382820] text-[#fbf9f5] shadow-2xs'
                  : 'text-[#4e403b] hover:bg-white hover:text-[#059669]'
              }`}
            >
              <span>Testimoni Pembeli</span>
              <span className="text-[10px] font-bold text-[#7a665b]">4.9 ⭐</span>
            </Link>

            <div className="pt-2 mt-2 border-t border-[#eae2d9] flex items-center justify-between text-[11px] font-semibold text-[#7a665b] px-2 pb-1">
              <Link href="/wifi" className="hover:text-[#382820] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span>Info WiFi Kopken</span>
              </Link>
              <Link href="/admin" className="hover:text-[#382820]">
                Portal Staff 🔐
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modal Riwayat Pesanan & Cek Tiket */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-[#eae2d9] relative max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fbf9f5] text-[#382820] hover:bg-[#f2ece3] flex items-center justify-center font-bold text-sm cursor-pointer border border-[#eae2d9]"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#ebf7f3] border border-[#bde5d8] text-[#059669] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#382820] font-serif">
                  Pesanan &amp; Riwayat Belanja
                </h3>
                <p className="text-[11px] text-[#7a665b]">
                  Pantau tiket live, struk digital, atau lakukan pemesanan ulang 1-klik.
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-bold mb-4">
              <button
                type="button"
                onClick={() => setModalTab('history')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === 'history'
                    ? 'bg-[#382820] text-white shadow-xs'
                    : 'text-[#7a665b] hover:text-[#382820]'
                }`}
              >
                <span>Riwayat Belanja</span>
                {savedTickets.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black">
                    {savedTickets.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setModalTab('lookup')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === 'lookup'
                    ? 'bg-[#382820] text-white shadow-xs'
                    : 'text-[#7a665b] hover:text-[#382820]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari / Pindah Perangkat</span>
              </button>
            </div>

            {/* Content Tab 1: Riwayat Belanja */}
            {modalTab === 'history' && (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[400px]">
                {savedTickets.length === 0 ? (
                  <div className="text-center py-10 px-4 text-[#7a665b]">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-[#7a665b]/30" />
                    <div className="font-bold text-xs text-[#382820]">Belum Ada Riwayat di Perangkat Ini</div>
                    <p className="text-[11px] mt-1 max-w-xs mx-auto">
                      Jika baru pertama jajan, pesananmu akan otomatis tersimpan di sini setelah checkout.
                    </p>
                    <button
                      type="button"
                      onClick={() => setModalTab('lookup')}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-[#ebf7f3] text-[#059669] font-bold text-xs hover:bg-[#d8f2e9] cursor-pointer"
                    >
                      Pernah jajan? Tarik riwayat via Telegram / No HP ➔
                    </button>
                  </div>
                ) : (
                  savedTickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] hover:border-[#bde5d8] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-[#059669]">
                            #{t.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Tersimpan
                          </span>
                        </div>
                        <div className="font-extrabold text-xs text-[#382820] mt-0.5 truncate">
                          {t.productName}
                        </div>
                        {t.planName && (
                          <div className="text-[11px] text-[#7a665b] truncate">
                            {t.planName}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReorder(t)}
                          className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Pesan lagi menu ini ke keranjang"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Pesan Lagi</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/order/${t.id}`);
                            setShowSearchModal(false);
                          }}
                          className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-bold text-xs shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Buka Tiket ➔</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Content Tab 2: Cari / Sinkronkan Akun */}
            {modalTab === 'lookup' && (
              <div className="space-y-4">
                {/* Opsi 1: Masukkan ID Tiket */}
                <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2">
                  <div className="text-xs font-bold text-[#382820]">
                    1. Buka Tiket Spesifik (SR-XXXX)
                  </div>
                  <form onSubmit={handleTrackSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: SR-1042..."
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#eae2d9] text-xs font-semibold uppercase tracking-wider text-[#382820] placeholder-[#7a665b] focus:outline-hidden focus:border-[#059669] bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-bold text-xs shadow-xs cursor-pointer shrink-0"
                    >
                      Buka ➔
                    </button>
                  </form>
                </div>

                {/* Opsi 2: Sinkronkan via No HP / Telegram */}
                <div className="p-3.5 rounded-2xl bg-[#ebf7f3]/60 border border-[#bde5d8] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                    <Sparkles className="w-4 h-4" />
                    <span>2. Pindah HP? Tarik Semua Pesananmu</span>
                  </div>
                  <p className="text-[11px] text-[#7a665b]">
                    Masukkan Username Telegram atau Nama pemesan untuk menyinkronkan seluruh riwayat belanjamu tanpa password:
                  </p>
                  <form onSubmit={handleSyncByContact} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Username Telegram / Nama..."
                      value={syncContact}
                      onChange={(e) => setSyncContact(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#eae2d9] text-xs text-[#382820] placeholder-[#7a665b] focus:outline-hidden focus:border-[#059669] bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Tarik Data ⚡'}
                    </button>
                  </form>
                  {syncMessage && (
                    <div className="text-[11px] font-bold text-[#059669] pt-1">
                      {syncMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
