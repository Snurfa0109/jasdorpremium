export interface JascurRateConfig {
  chatPerHour: number;
  callPerHour: number;
  addonVnPrice: number;
}

export const JASCUR_PRICING: JascurRateConfig = {
  chatPerHour: 3000,     // 3k/jam sesi chat berlaku kelipatan
  callPerHour: 15000,    // 15k/jam sesi call
  addonVnPrice: 10000,   // add on vn 10k/sesi
};

export interface JascurPackage {
  id: string;
  name: string;
  type: 'chat' | 'call';
  durationHours: number;
  duration: string;
  price: number;
  badge?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export const JASCUR_PACKAGES: JascurPackage[] = [
  {
    id: 'jc-chat-1h',
    name: 'Sesi Chat Teks 1 Jam',
    type: 'chat',
    durationHours: 1,
    duration: '1 Jam (60 Menit)',
    price: 3000,
    badge: 'HEMAT',
    description: 'Cocok buat kamu yang pengen ngeluarin uneg-uneg singkat, cerita hari ini, atau butuh opini cepat tanpa dihakimi.',
    features: [
      'Chat teks leluasa 1 jam via Telegram',
      'Respon cepat & teman dengar suportif',
      'Anonimitas 100% (identitas terjaga aman)',
      'Bisa tambah Add-on Voice Note (VN)',
    ],
  },
  {
    id: 'jc-chat-2h',
    name: 'Sesi Chat Teks 2 Jam',
    type: 'chat',
    durationHours: 2,
    duration: '2 Jam (120 Menit)',
    price: 6000,
    badge: 'TERPOPULER',
    popular: true,
    description: 'Waktu yang pas untuk cerita mendalam tentang masalah kerjaan, hubungan asmara, keluarga, atau keresahan diri.',
    features: [
      'Chat santai 2 jam penuh via Telegram',
      'Diskusi dua arah yang hangat & empati',
      'Teman cerita anti-ghosting',
      'Bisa tambah Add-on Voice Note (VN)',
    ],
  },
  {
    id: 'jc-chat-3h',
    name: 'Sesi Chat Teks 3 Jam',
    type: 'chat',
    durationHours: 3,
    duration: '3 Jam (180 Menit)',
    price: 9000,
    badge: 'LEBIH PUAS',
    description: 'Waktu super leluasa untuk kamu yang butuh ditemani ngobrol lama dari awal sampai tuntas tanpa terburu-buru.',
    features: [
      'Chat leluasa 3 jam via Telegram',
      'Waktu cerita sangat fleksibel & rileks',
      'Eksplorasi beban pikiran sampai lega',
      'Bisa tambah Add-on Voice Note (VN)',
    ],
  },
  {
    id: 'jc-call-1h',
    name: 'Sesi Voice Call 1 Jam',
    type: 'call',
    durationHours: 1,
    duration: '1 Jam (Voice Call)',
    price: 15000,
    badge: 'CALL SUARA',
    description: 'Ngobrol langsung lewat panggilan suara Telegram. Cerita lebih lega, hangat, dan ekspresif seperti teleponan dengan sahabat akrab.',
    features: [
      'Voice call langsung 1 jam via Telegram',
      'Didengarkan dengan penuh perhatian & empati',
      'Bebas luapkan emosi, tawa, atau tangis lega',
      'Privasi suara & akun terjamin 100% aman',
    ],
  },
];

export const JASCUR_TELEGRAM_LINK = 'https://t.me/saoirse_temancurhat';
