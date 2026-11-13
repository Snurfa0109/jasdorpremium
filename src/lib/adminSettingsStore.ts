import { JASCUR_PRICING, JascurPackage, JASCUR_PACKAGES } from '@/data/jascur';
import { Product } from '@/types';

export interface AdminJascurConfig {
  chatPerHour: number;
  callPerHour: number;
  addonVnPrice: number;
  telegramUsername: string;
  isOpen: boolean;
  isCallOpen: boolean;
  activeCallOrderId?: string | null;
  activeCallUntil?: string | null;
  callLockReason?: string;
  closeAnnouncement?: string;
  estimatedOpen?: string;
  closedSchedule?: string;
}

export interface AdminStoreConfig {
  queueOpen: boolean;
  queueLockReason?: string;
  queueEstimatedOpen?: string;
  dailyOpenTime?: string;
  dailyCloseTime?: string;
  jasdorOpen: boolean;
  jasdorAnnouncement?: string;
  jasdorEstimatedOpen?: string;
  jasdorClosedSchedule?: string;
  premiumOpen: boolean;
  premiumAnnouncement?: string;
  premiumEstimatedOpen?: string;
  premiumClosedSchedule?: string;
  announcement: string;
  csTelegram: string;
}

export interface ItemOverride {
  discountPrice?: number;
  originalPrice?: number;
  isUnavailable?: boolean;
}

export interface AdminAccount {
  username: 'Fadiyah' | 'Kifsha';
  role: string;
  passwordHash: string;
  registeredFacePhoto?: string | null;
  lastEnrolledAt?: string | null;
}

export interface CannedResponse {
  id: string;
  title: string;
  category: 'kopi' | 'premium' | 'jascur' | 'payment' | 'general';
  text: string;
  isCustom?: boolean;
}

export interface VoucherCode {
  id: string;
  code: string;
  title: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number | null;
  applicableService: 'all' | 'jasdor' | 'premium' | 'jascur';
  usageLimit?: number | null;
  usedCount: number;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_VOUCHERS: VoucherCode[] = [
  {
    id: 'voucher-saoirse50',
    code: 'SAOIRSE50',
    title: 'Diskon Rp 5.000 Belanja Hemat',
    discountType: 'fixed',
    discountValue: 5000,
    minOrder: 25000,
    applicableService: 'all',
    usageLimit: 100,
    usedCount: 14,
    expiryDate: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'voucher-ngopiasik',
    code: 'NGOPIASIK',
    title: 'Potongan Rp 3.000 Jasdor Kopi',
    discountType: 'fixed',
    discountValue: 3000,
    minOrder: 15000,
    applicableService: 'jasdor',
    usageLimit: 200,
    usedCount: 38,
    expiryDate: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'voucher-streaming10',
    code: 'STREAMING10',
    title: 'Diskon 10% Semua Aplikasi Premium',
    discountType: 'percent',
    discountValue: 10,
    minOrder: 30000,
    maxDiscount: 10000,
    applicableService: 'premium',
    usageLimit: 50,
    usedCount: 9,
    expiryDate: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'voucher-curhatfree',
    code: 'CURHATHEMAT',
    title: 'Diskon Rp 3.000 Sesi Curhat Jascur',
    discountType: 'fixed',
    discountValue: 3000,
    minOrder: 3000,
    applicableService: 'jascur',
    usageLimit: 50,
    usedCount: 5,
    expiryDate: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const DEFAULT_CANNED_RESPONSES: CannedResponse[] = [
  {
    id: 'cr-kopi-ready',
    title: '☕ Pesanan Kopi Siap Diambil di Kasir',
    category: 'kopi',
    text: 'Halo kak {nama}! 👋 Pesanan Jasdor Kopi Kenangan diskon 50% kamu (#{id_pesanan}) sudah selesai kami pesankan ke kasir cabang {outlet}. Begitu sampai di outlet, kakak tinggal sebut nama pemesan "{nama}" di kasir / barista tanpa antre ya! Selamat menikmati kopinya kak ✨☕',
  },
  {
    id: 'cr-kopi-soldout',
    title: '☕ Menu Kopi Habis di Outlet (Tawaran Ganti)',
    category: 'kopi',
    text: 'Halo kak {nama}! Maaf banget mengabari, menu pilihan kakak di cabang outlet {outlet} saat ini sedang kosong/habis stok bahannya dari pihak outlet 🥺. Kakak mau kami gantikan dengan menu lain yang setara atau mau refund penuh kak? Tolong kabari kami ya kak 🙏',
  },
  {
    id: 'cr-premium-ready',
    title: '🍿 Akun Premium Baru Siap Digunakan',
    category: 'premium',
    text: 'Hai kak {nama}! Akun {produk} pesanan kakak (#{id_pesanan}) sudah aktif dan siap digunakan ya ✨\n\n📧 Email/Username: {email}\n🔑 Password: {password}\n👤 Profil: {profil}\n📌 PIN: {pin}\n⏳ Masa Aktif: {durasi}\n\n⚠️ Aturan Pakai: Dilarang mengganti email, password, atau mengotak-atik profil lain agar garansi tetap berlaku penuh ya kak. Jika ada kendala, admin siap bantu replace. Terima kasih kak! 🎉',
  },
  {
    id: 'cr-premium-replace',
    title: '🛡️ Klaim Garansi Penggantian Akun (Replace)',
    category: 'premium',
    text: 'Halo kak {nama}, klaim garansi untuk akun {produk} (#{id_pesanan}) sudah kami proses ya. Berikut akun baru pengganti (Full Replace):\n\n📧 Email: {email}\n🔑 Password: {password}\n👤 Profil: {profil}\n\nSilakan dicoba login sekarang ya kak. Maaf atas ketidaknyamanannya dan selamat menikmati kembali layanannya! 🙏✨',
  },
  {
    id: 'cr-premium-non-garansi',
    title: '⚠️ Pemberitahuan Akun Non-Garansi',
    category: 'premium',
    text: 'Halo kak {nama}, akun {produk} pesanan kakak (#{id_pesanan}) sudah aktif ya. Mengingat paket ini berstatus "Non Garansi", akun diserahkan lepas tanpa garansi penggantian baru jika terjadi kendala di kemudian hari. Pastikan digunakan sesuai panduan ya kak, terima kasih banyak! 😊',
  },
  {
    id: 'cr-jascur-start',
    title: '💬 Pembukaan Sesi Curhat (Jascur)',
    category: 'jascur',
    text: 'Halo kak {nama}! Salam hangat dari saoirse Teman Curhat 🤗✨ Sesi curhat kakak (#{id_pesanan}) sudah siap dimulai. Di sini ruang aman, privat, dan rahasia kakak 100% terjaga. Apapun yang lagi dirasain atau mau diceritain hari ini, tumpahin aja santai ya kak. Admin siap dengerin dengan sepenuh hati ❤️',
  },
  {
    id: 'cr-jascur-end',
    title: '💬 Penutupan Sesi Curhat & Doa Penyemangat',
    category: 'jascur',
    text: 'Terima kasih banyak ya kak {nama} sudah menyempatkan waktu untuk cerita dan berbagi di Jascur saoirse hari ini (#{id_pesanan}) 🤗✨ Semoga harimu terasa jauh lebih lega dan tenang. Kamu hebat sudah bertahan sejauh ini! Kalau butuh teman ngobrol lagi, pintu saoirse selalu terbuka buat kamu ya. Semangat selalu! ✨🤍',
  },
  {
    id: 'cr-pay-confirm',
    title: '💳 Konfirmasi Pembayaran QRIS Masuk',
    category: 'payment',
    text: 'Halo kak {nama}! Pembayaran QRIS untuk pesanan #{id_pesanan} ({produk}) sebesar Rp {nominal} sudah terverifikasi masuk ke sistem kami ✅. Pesanan kakak saat ini sedang diproses kilat oleh admin {admin}. Mohon ditunggu ya kak! ⚡',
  },
  {
    id: 'cr-antrian-delay',
    title: '⏳ Permohonan Maaf Antrian Sedang Ramai',
    category: 'general',
    text: 'Halo kak {nama}, terima kasih banyak sudah bersabar menunggu pesanan #{id_pesanan} 🙏. Saat ini antrian order sedang cukup padat, namun pesanan kakak sedang dalam proses penanganan prioritas oleh admin {admin}. Estimasi selesai sekitar 5-10 menit lagi ya kak. Terima kasih atas pengertiannya! ✨',
  },
];

export interface AdminSettingsState {
  jascur: AdminJascurConfig;
  store: AdminStoreConfig;
  kopkenOverrides: Record<string, ItemOverride>;
  premiumOverrides: Record<string, { isUnavailable?: boolean; price?: number; hasWarranty?: boolean }>;
  adminAccounts: Record<'Fadiyah' | 'Kifsha', AdminAccount>;
  customProducts: Product[];
  deletedProductIds: string[];
  cannedResponses: CannedResponse[];
  vouchers: VoucherCode[];
  lastUpdated: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __SAOIRSE_SETTINGS__: AdminSettingsState | undefined;
}

const DEFAULT_SETTINGS: AdminSettingsState = {
  jascur: {
    chatPerHour: JASCUR_PRICING.chatPerHour, // 3000
    callPerHour: JASCUR_PRICING.callPerHour, // 15000
    addonVnPrice: JASCUR_PRICING.addonVnPrice, // 10000
    telegramUsername: '@saoirse_temancurhat',
    isOpen: true,
    isCallOpen: true,
    activeCallOrderId: null,
    activeCallUntil: null,
    callLockReason: '',
    closeAnnouncement: 'Layanan curhat sedang istirahat sejenak. Akan segera dibuka kembali.',
    estimatedOpen: 'Pukul 15:00 WIB',
    closedSchedule: 'Jadwal Aktif Sesi: 09:00 - 23:00 WIB',
  },
  store: {
    queueOpen: true,
    queueLockReason: 'Admin sedang istirahat / proses batch order',
    queueEstimatedOpen: 'Pukul 14:00 WIB',
    dailyOpenTime: '08:00 WIB',
    dailyCloseTime: '22:00 WIB',
    jasdorOpen: true,
    jasdorAnnouncement: 'Antrian Jasdor Kopi Kenangan sedang istirahat batch / kasir tutup sementara.',
    jasdorEstimatedOpen: 'Pukul 14:30 WIB',
    jasdorClosedSchedule: 'Jadwal Kasir: 08:00 - 21:30 WIB',
    premiumOpen: true,
    premiumAnnouncement: 'Katalog Akun Premium sedang maintenance stok & pembaharuan akun.',
    premiumEstimatedOpen: 'Pukul 16:00 WIB',
    premiumClosedSchedule: 'Layanan 24 Jam (Maintenance 03:00 - 05:00 WIB)',
    announcement: 'Diskon 50% Kopi Kenangan & Akun Premium Legal Bergaransi Full Replace ✨',
    csTelegram: '@saoirse_cs',
  },
  kopkenOverrides: {},
  premiumOverrides: {},
  adminAccounts: {
    Fadiyah: {
      username: 'Fadiyah',
      role: 'Admin 1 • Lead',
      passwordHash: 'fadiyah123',
      registeredFacePhoto: null,
      lastEnrolledAt: null,
    },
    Kifsha: {
      username: 'Kifsha',
      role: 'Admin 2 • Pantry & Operasional',
      passwordHash: 'kifsha123',
      registeredFacePhoto: null,
      lastEnrolledAt: null,
    },
  },
  customProducts: [],
  deletedProductIds: [],
  cannedResponses: DEFAULT_CANNED_RESPONSES,
  vouchers: DEFAULT_VOUCHERS,
  lastUpdated: new Date().toISOString(),
};

export function getAdminSettings(): AdminSettingsState {
  if (!globalThis.__SAOIRSE_SETTINGS__) {
    globalThis.__SAOIRSE_SETTINGS__ = { ...DEFAULT_SETTINGS };
  }
  
  // Auto-reopen Call session if duration has expired
  const s = globalThis.__SAOIRSE_SETTINGS__;
  if (!s.jascur.isCallOpen && s.jascur.activeCallUntil) {
    const expireTime = new Date(s.jascur.activeCallUntil).getTime();
    if (!isNaN(expireTime) && Date.now() >= expireTime) {
      s.jascur.isCallOpen = true;
      s.jascur.activeCallOrderId = null;
      s.jascur.activeCallUntil = null;
      s.jascur.callLockReason = '';
      s.lastUpdated = new Date().toISOString();
    }
  }

  return globalThis.__SAOIRSE_SETTINGS__;
}

export function updateAdminSettings(partial: Partial<AdminSettingsState>): AdminSettingsState {
  const current = getAdminSettings();
  const updated: AdminSettingsState = {
    ...current,
    ...partial,
    jascur: {
      ...current.jascur,
      ...(partial.jascur || {}),
    },
    store: {
      ...current.store,
      ...(partial.store || {}),
    },
    kopkenOverrides: {
      ...current.kopkenOverrides,
      ...(partial.kopkenOverrides || {}),
    },
    premiumOverrides: {
      ...current.premiumOverrides,
      ...(partial.premiumOverrides || {}),
    },
    adminAccounts: {
      ...current.adminAccounts,
      ...(partial.adminAccounts || {}),
    },
    customProducts: partial.customProducts !== undefined ? partial.customProducts : (current.customProducts || []),
    deletedProductIds: partial.deletedProductIds !== undefined ? partial.deletedProductIds : (current.deletedProductIds || []),
    cannedResponses: partial.cannedResponses !== undefined ? partial.cannedResponses : (current.cannedResponses || DEFAULT_CANNED_RESPONSES),
    vouchers: partial.vouchers !== undefined ? partial.vouchers : (current.vouchers || DEFAULT_VOUCHERS),
    lastUpdated: new Date().toISOString(),
  };

  // Sync with global store queue status
  if (partial.store?.queueOpen !== undefined) {
    globalThis.__SAOIRSE_QUEUE_OPEN__ = partial.store.queueOpen;
  }

  globalThis.__SAOIRSE_SETTINGS__ = updated;
  return updated;
}

