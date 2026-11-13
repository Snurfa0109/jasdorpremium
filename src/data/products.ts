import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'streaming',
    description: 'Nonton film & series original tanpa jeda iklan, resolusi hingga 4K UHD.',
    badge: 'BEST SELLER',
    icon: '🎬',
    color: '#E50914',
    planGroups: [
      {
        groupName: 'SHARING 1P1U (1 Profile 1 User)',
        options: [
          { id: 'nf-1p1u-1d', name: '1 Hari', price: 4000 },
          { id: 'nf-1p1u-3d', name: '3 Hari', price: 7000 },
          { id: 'nf-1p1u-5d', name: '5 Hari', price: 10000 },
          { id: 'nf-1p1u-7d', name: '7 Hari', price: 12000 },
          { id: 'nf-1p1u-14d', name: '14 Hari', price: 20000 },
          { id: 'nf-1p1u-1m', name: '1 Bulan', price: 35000 },
          { id: 'nf-1p1u-2m', name: '2 Bulan', price: 65000 },
        ],
      },
      {
        groupName: 'SHARING 1P2U (1 Profile 2 User - Hemat)',
        options: [
          { id: 'nf-1p2u-1m', name: '1 Bulan', price: 25000 },
          { id: 'nf-1p2u-2m', name: '2 Bulan', price: 35000 },
        ],
      },
      {
        groupName: 'SEMI PRIVATE',
        options: [
          { id: 'nf-semi-1m', name: '1 Bulan', price: 40000 },
          { id: 'nf-semi-2m', name: '2 Bulan', price: 75000 },
          { id: 'nf-semi-3m', name: '3 Bulan', price: 100000 },
        ],
      },
      {
        groupName: 'PRIVATE (Full Akun)',
        options: [
          { id: 'nf-priv-1m', name: '1 Bulan Private', price: 160000 },
        ],
      },
    ],
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    category: 'creative',
    description: 'Desain tanpa batas, akses jutaan elemen & template premium + fitur AI.',
    badge: 'TERMURAH',
    icon: '🎨',
    color: '#00C4CC',
    planGroups: [
      {
        groupName: 'MEMBER (SUDAH INCLUDE DESIGNER)',
        options: [
          { id: 'cnv-1d', name: '1 Hari', price: 1500 },
          { id: 'cnv-3d', name: '3 Hari', price: 2000 },
          { id: 'cnv-7d', name: '7 Hari', price: 3000 },
          { id: 'cnv-1m', name: '1 Bulan', price: 5000 },
          { id: 'cnv-2m', name: '2 Bulan', price: 8000 },
          { id: 'cnv-3m', name: '3 Bulan', price: 10000 },
          { id: 'cnv-6m', name: '6 Bulan', price: 14000 },
          { id: 'cnv-1y', name: '1 Tahun', price: 17000 },
          { id: 'cnv-life', name: 'Lifetime', price: 22000 },
        ],
      },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'streaming',
    description: 'Bebas iklan di video & YouTube Music, bisa putar di latar belakang.',
    badge: 'POPULER',
    icon: '▶️',
    color: '#FF0000',
    planGroups: [
      {
        groupName: 'FAMPLAN (Family Plan Invite)',
        options: [
          { id: 'yt-fam-1m', name: '1 Bulan', price: 7000 },
          { id: 'yt-fam-2m', name: '2 Bulan', price: 12000 },
        ],
      },
      {
        groupName: 'INDPLAN (Individual Plan)',
        options: [
          { id: 'yt-ind-1m', name: '1 Bulan', price: 12000, notes: 'Email seller +2k, indplan email cust fresh' },
          { id: 'yt-ind-3m', name: '3 Bulan', price: 35000, notes: 'Email seller +2k, indplan email cust fresh' },
        ],
      },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    category: 'music',
    description: 'Dengarkan lagu favorit tanpa jeda iklan, skip tanpa batas & kualitas audio high.',
    badge: 'FAVORIT',
    icon: '🎵',
    color: '#1DB954',
    planGroups: [
      {
        groupName: 'FAMPLAN (Family Plan Plan)',
        options: [
          { id: 'spt-fam-1m', name: '1 Bulan', price: 20000 },
          { id: 'spt-fam-2m', name: '2 Bulan', price: 27000 },
        ],
      },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    category: 'ai',
    description: 'Akses GPT-4o, GPT-o1, DALL-E 3 image generation, tanpa batas antrian.',
    badge: 'AI TERBAIK',
    icon: '🤖',
    color: '#10A37F',
    planGroups: [
      {
        groupName: 'SHARING 5U (Maks 5 User)',
        options: [
          { id: 'gpt-5u-1w', name: '1 Minggu', price: 22000 },
          { id: 'gpt-5u-1m', name: '1 Bulan', price: 60000 },
        ],
      },
      {
        groupName: 'SHARING 8U (Maks 8 User - Hemat)',
        options: [
          { id: 'gpt-8u-1w', name: '1 Minggu', price: 17000 },
          { id: 'gpt-8u-1m', name: '1 Bulan', price: 35000 },
        ],
      },
    ],
  },
  {
    id: 'capcut',
    name: 'CapCut Pro',
    category: 'creative',
    description: 'Edit video tanpa watermark, template pro viral, transisi & effect exclusive.',
    badge: 'VIRAL',
    icon: '✂️',
    color: '#111111',
    planGroups: [
      {
        groupName: 'SHARING 3U',
        options: [
          { id: 'cpc-3u-7d', name: '7 Hari', price: 8000 },
          { id: 'cpc-3u-1m', name: '1 Bulan', price: 17000 },
        ],
      },
      {
        groupName: 'PRIVATE',
        options: [
          { id: 'cpc-prv-7d', name: '7 Hari', price: 15000 },
          { id: 'cpc-prv-1m', name: '1 Bulan', price: 22000 },
        ],
      },
    ],
  },
  {
    id: 'disney',
    name: 'Disney+ Hotstar',
    category: 'streaming',
    description: 'Nonton Marvel, Disney, Pixar, Star Wars & drama Korea eksklusif.',
    icon: '⭐',
    color: '#113CCF',
    planGroups: [
      {
        groupName: 'SHARING HARIAN 5U',
        options: [
          { id: 'dsn-h-1d', name: '1 Hari', price: 5000 },
          { id: 'dsn-h-3d', name: '3 Hari', price: 8000 },
          { id: 'dsn-h-5d', name: '5 Hari', price: 12000 },
          { id: 'dsn-h-7d', name: '7 Hari', price: 15000 },
        ],
      },
      {
        groupName: 'SHARING BULANAN',
        options: [
          { id: 'dsn-m-1m-46u', name: '1 Bulan (4-6u)', price: 30000 },
          { id: 'dsn-m-1m-3u', name: '1 Bulan (3u)', price: 55000 },
        ],
      },
    ],
  },
  {
    id: 'viu',
    name: 'Viu Premium',
    category: 'streaming',
    description: 'Nonton Drama Korea, Anime & Variety Show sub Indo terlengkap.',
    icon: '📺',
    color: '#FBBC05',
    planGroups: [
      {
        groupName: 'HARIAN',
        options: [
          { id: 'viu-h-1d', name: '1 Hari', price: 3000 },
          { id: 'viu-h-3d', name: '3 Hari', price: 4000 },
          { id: 'viu-h-5d', name: '5 Hari', price: 5000 },
          { id: 'viu-h-7d', name: '7 Hari', price: 6000 },
        ],
      },
      {
        groupName: 'ANTI LIMIT (Bulan/Tahun)',
        options: [
          { id: 'viu-al-1m', name: '1 Bulan', price: 8000 },
          { id: 'viu-al-3m', name: '3 Bulan', price: 12000 },
          { id: 'viu-al-6m', name: '6 Bulan', price: 17000 },
          { id: 'viu-al-1y', name: '1 Tahun', price: 23000 },
        ],
      },
    ],
  },
  {
    id: 'prime',
    name: 'Prime Video',
    category: 'streaming',
    description: 'Streaming Amazon Originals, blockbuster movies & TV shows.',
    icon: '📦',
    color: '#00A8E1',
    planGroups: [
      {
        groupName: 'SHARING',
        options: [
          { id: 'prm-sh-7d', name: '7 Hari', price: 6000 },
          { id: 'prm-sh-1m', name: '1 Bulan', price: 10000 },
        ],
      },
      {
        groupName: 'PRIVATE',
        options: [
          { id: 'prm-prv-1m', name: '1 Bulan', price: 19000 },
        ],
      },
    ],
  },
  {
    id: 'vidio',
    name: 'Vidio Platinum',
    category: 'streaming',
    description: 'Live streaming sepakbola liga dunia, sinetron & serial original.',
    icon: '⚽',
    color: '#E52320',
    planGroups: [
      {
        groupName: 'PAKET VIDIO',
        options: [
          { id: 'vd-tv-1m', name: 'Private TV Only (1 Bulan)', price: 15000 },
          { id: 'vd-mob-1m', name: 'Sharing Mobile (1 Bulan)', price: 15000 },
          { id: 'vd-all-1m', name: 'Sharing All Device (1 Bulan)', price: 32000 },
        ],
      },
    ],
  },
  {
    id: 'zoom',
    name: 'Zoom Pro',
    category: 'utility',
    description: 'Meeting tanpa limit 40 menit, kapasitas 100-300 peserta, cloud recording.',
    icon: '💻',
    color: '#2D8CFF',
    planGroups: [
      {
        groupName: 'PRIVATE',
        options: [
          { id: 'zm-prv-7d', name: '7 Hari', price: 14000 },
          { id: 'zm-prv-14d', name: '14 Hari', price: 25000 },
          { id: 'zm-prv-1m', name: '1 Bulan', price: 45000 },
        ],
      },
    ],
  },
  {
    id: 'wetv',
    name: 'WeTV VIP',
    category: 'streaming',
    description: 'Streaming Drama Asia, Dracin romantis & anime hits VIP.',
    icon: '🧡',
    color: '#FF6F00',
    planGroups: [
      {
        groupName: 'PAKET WETV',
        options: [
          { id: 'wtv-6u-1m', name: 'Sharing 6U (1 Bulan)', price: 12000 },
          { id: 'wtv-al3u-1m', name: 'Anlim 3U (1 Bulan)', price: 17000 },
          { id: 'wtv-prv-1m', name: 'Private (1 Bulan)', price: 32000 },
        ],
      },
    ],
  },
  {
    id: 'bstation',
    name: 'Bstation (Bilibili)',
    category: 'streaming',
    description: 'Nonton anime terlengkap kualitas 1080p/4K tanpa lag.',
    icon: '⚡',
    color: '#23ADE5',
    planGroups: [
      {
        groupName: 'SHARING',
        options: [
          { id: 'bst-sh-1m', name: '1 Bulan', price: 10000 },
          { id: 'bst-sh-2m', name: '2 Bulan', price: 15000 },
          { id: 'bst-sh-3m', name: '3 Bulan', price: 22000 },
        ],
      },
    ],
  },
  {
    id: 'loklok',
    name: 'Loklok VIP',
    category: 'streaming',
    description: 'Koleksi film bioskop dan drama dunia tanpa iklan.',
    icon: '🍿',
    color: '#FFD700',
    planGroups: [
      {
        groupName: 'SHARING',
        options: [
          { id: 'lkl-dsr-1m', name: 'Sharing Dasar (1 Bulan)', price: 20000 },
          { id: 'lkl-std-1m', name: 'Sharing Standar - Bisa TV (1 Bulan)', price: 22000 },
        ],
      },
    ],
  },
  {
    id: 'getcontact',
    name: 'GetContact Premium',
    category: 'utility',
    description: 'Lacak siapa yang mencari namamu & cek tag nomor tanpa batas.',
    icon: '🔍',
    color: '#1A73E8',
    planGroups: [
      {
        groupName: 'PAKET GETCONTACT',
        options: [
          { id: 'gtc-prv-1m', name: 'Private (1 Bulan)', price: 13000 },
          { id: 'gtc-1x', name: '1x Cek Tag/Nomor', price: 1000 },
        ],
      },
    ],
  },
  {
    id: 'alightmotion',
    name: 'Alight Motion Pro',
    category: 'creative',
    description: 'Motion graphic, animasi profesional & preset XML tanpa watermark.',
    icon: '✨',
    color: '#6C5CE7',
    planGroups: [
      {
        groupName: 'PRIVATE (Device Android +1k)',
        options: [
          { id: 'alm-prv-1m', name: '1 Bulan', price: 10000 },
          { id: 'alm-prv-2m', name: '2 Bulan', price: 15000 },
          { id: 'alm-prv-3m', name: '3 Bulan', price: 20000 },
          { id: 'alm-prv-1y', name: '1 Tahun', price: 27000 },
        ],
      },
    ],
  },
  {
    id: 'duolingo',
    name: 'Duolingo Super',
    category: 'education',
    description: 'Belajar bahasa tanpa batasan nyawa, bebas iklan & review practice.',
    icon: '🦉',
    color: '#58CC02',
    planGroups: [
      {
        groupName: 'FAMPLAN',
        options: [
          { id: 'duo-fam-14d', name: '14 Hari', price: 11000 },
          { id: 'duo-fam-1m', name: '1 Bulan', price: 15000 },
        ],
      },
      {
        groupName: 'HEAD (Need email cust)',
        options: [
          { id: 'duo-head-14d', name: '14 Hari Head', price: 16000, notes: 'Need email customer' },
        ],
      },
    ],
  },
  {
    id: 'hbomax',
    name: 'HBO Max',
    category: 'streaming',
    description: 'House of the Dragon, Game of Thrones, DC Universe & Warner Bros.',
    icon: '🏰',
    color: '#6A1B9A',
    planGroups: [
      {
        groupName: 'SHARING 8U',
        options: [
          { id: 'hbo-8u-1m', name: '1 Bulan', price: 22000 },
        ],
      },
      {
        groupName: 'PRIVATE (Login 1 Device - Acc Seller Only)',
        options: [
          { id: 'hbo-prv-1m', name: '1 Bulan', price: 98000, notes: 'Login 1 device, akun seller only' },
        ],
      },
    ],
  },
  {
    id: 'iqiyi',
    name: 'iQIYI VIP',
    category: 'streaming',
    description: 'Drama Mandarin, Anime eksklusif & variety show Asia kualitas 4K.',
    icon: '🥝',
    color: '#00B140',
    planGroups: [
      {
        groupName: 'SHARING',
        options: [
          { id: 'iqy-sh-1m', name: '1 Bulan', price: 10000 },
          { id: 'iqy-sh-2m', name: '2 Bulan', price: 18000 },
          { id: 'iqy-sh-3m', name: '3 Bulan', price: 25000 },
        ],
      },
      {
        groupName: 'ANTI LIMIT',
        options: [
          { id: 'iqy-al-1m', name: '1 Bulan', price: 18000 },
        ],
      },
      {
        groupName: 'PRIVATE',
        options: [
          { id: 'iqy-prv-1m', name: '1 Bulan', price: 35000 },
        ],
      },
    ],
  },
  {
    id: 'applemusic',
    name: 'Apple Music',
    category: 'music',
    description: 'Spatial Audio with Dolby Atmos & Lossless Audio jutaan lagu.',
    icon: '🍎',
    color: '#FC3C44',
    planGroups: [
      {
        groupName: 'VIA IMESSAGE',
        options: [
          { id: 'apm-1m', name: '1 Bulan', price: 15000 },
          { id: 'apm-2m', name: '2 Bulan', price: 25000 },
        ],
      },
    ],
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS All Payment',
    detail: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay',
    type: 'qris',
  },
];

