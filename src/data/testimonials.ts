export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  category: 'premium' | 'kopken' | 'tomoro' | 'jascur';
  productName: string;
  rating: number;
  date: string;
  comment: string;
  avatarText: string;
  image: string; // Screenshot or proof photo
  verified: boolean;
  orderId?: string;
}

export interface TestimonialTemplate {
  id: number;
  label: string;
  text: string;
}

export const TESTIMONIAL_TEMPLATES: TestimonialTemplate[] = [
  {
    id: 1,
    label: '⭐ 1000/10 Pelayanan Terbaik',
    text: '1000/10 pelayanannya gausah diragukan lagi! Bener-bener secepet itu dan adminnya ramah banget. Pasti bakal langganan terus di sini!',
  },
  {
    id: 2,
    label: '⚡ Super Recommended & Gercep',
    text: 'Super recommended! Pelayanan gercep tanpa ribet, prosesnya beneran hitungan menit langsung beres. Puas banget belanja di sini.',
  },
  {
    id: 3,
    label: '💯 Pelayanan Bintang Lima',
    text: 'Awalnya coba-coba, ternyata pelayanannya bintang lima. Transaksi aman, proses kilat, dan terpercaya 100%. Thank you so much!',
  },
  {
    id: 4,
    label: '💬 Admin Ramah & Responsif',
    text: 'Gak pernah nyesel order di sini. Adminnya responsif, komunikatif, dan pelayanannya bener-bener memuaskan dari awal sampai selesai.',
  },
  {
    id: 5,
    label: '🛡️ Amanah & Profesional',
    text: 'Definisi seller amanah dan profesional! Sistemnya rapi banget, instruksinya jelas, dan pelayanannya top tier. 10/10!',
  },
  {
    id: 6,
    label: '✨ Pelayanan Ter-The Best',
    text: 'Pelayanan ter-the best pokoknya! Fast respon parah, ramah, dan solutif banget kalau ada yang mau ditanyain. Sangat recommended!',
  },
  {
    id: 7,
    label: '🚀 Sat-set Langsung Beres',
    text: 'Keren banget pelayanannya, ga pake lama langsung sat-set beres. Buat yang masih ragu gausah mikir dua kali, langsung order aja!',
  },
  {
    id: 8,
    label: '🔒 Terpercaya & Memuaskan',
    text: 'Pelayanan ramah, proses transparan, dan terpercaya. Selalu puas tiap kali belanja di sini, ga pernah ngecewain sama sekali.',
  },
  {
    id: 9,
    label: '❤️ Pelayanan Nomor Satu',
    text: 'Pelayanan nomor satu! Jarang nemu seller yang secepet dan se-care ini sama pelanggannya. Sukses terus yaa!',
  },
  {
    id: 10,
    label: '🌟 Praktis & Sangat Puas',
    text: 'Pelayanan bintang lima kualitas jempolan! Serba praktis, otomatis, dan memuaskan. Bakal rekomendasikan ke temen-temen juga!',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'Nadia S.',
    location: 'Jakarta Selatan',
    category: 'premium',
    productName: 'Netflix Premium (1 Bulan)',
    rating: 5,
    date: '2 jam yang lalu',
    comment: 'Awalnya ragu karena murah banget, ternyata pas bayar QRIS langsung muncul email sama PIN profilnya di layar tiket. No ribet chat admin lagi, langsung nonton!',
    avatarText: 'NS',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-2',
    customerName: 'Rian Pratama',
    location: 'Bandung',
    category: 'kopken',
    productName: 'Kopi Kenangan Mantan + Cincau',
    rating: 5,
    date: 'Hari ini, 13:40',
    comment: 'Jasdor kopken tercepat! Pas nyampe outlet Mall PVJ, pesanan udah ready di pick up bar tinggal sebut nama doang. Hemat 50% beneran kerasa tiap hari.',
    avatarText: 'RP',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-3',
    customerName: 'Clarissa M.',
    location: 'Surabaya',
    category: 'premium',
    productName: 'Canva Pro (1 Tahun)',
    rating: 5,
    date: 'Kemarin',
    comment: 'Langganan canva pro buat kerjaan kantor lancar jaya. Masuk tim resmi dan semua template kebuka. Thank you saoirse!',
    avatarText: 'CM',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-4',
    customerName: 'Dimas Anggara',
    location: 'Tangerang',
    category: 'kopken',
    productName: 'Butterscotch Aren Latte + Roti Daging',
    rating: 5,
    date: 'Kemarin',
    comment: 'Udah order jasdor kopken 4 kali di sini, gapernah salah outlet atau ukuran. Gak perlu install banyak kupon lagi tinggal buka saoirse.',
    avatarText: 'DA',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-5',
    customerName: 'Aulia Rahma',
    location: 'Depok',
    category: 'premium',
    productName: 'Spotify Individual (2 Bulan)',
    rating: 5,
    date: '2 hari yang lalu',
    comment: 'Akun spotify langsung login di hp dan ipad. Admin di WA juga fast respon waktu aku nanya cara perpanjang. Terbaik saories!',
    avatarText: 'AR',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-6',
    customerName: 'Ferry Kurniawan',
    location: 'Jakarta Barat',
    category: 'tomoro',
    productName: 'Tomoro Aren Latte (Large)',
    rating: 5,
    date: '3 hari yang lalu',
    comment: 'Tomoro coffee favoritku cuma 10 ribuan. Ambil di Tomoro Central Park tinggal sebut nama langsung dikasih. Rekomen banget!',
    avatarText: 'FK',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-7',
    customerName: 'Jessica Tan',
    location: 'Jakarta Pusat',
    category: 'premium',
    productName: 'YouTube Premium Famplan',
    rating: 5,
    date: '4 hari yang lalu',
    comment: 'Email sendiri di-invite langsung masuk family plan. Gak ada iklan lagi pas nonton di smart TV. Murah meriah.',
    avatarText: 'JT',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 't-8',
    customerName: 'Rizky Alamsyah',
    location: 'Bekasi',
    category: 'kopken',
    productName: 'Avocado Coffee + Dutch Chocolate',
    rating: 5,
    date: '5 hari yang lalu',
    comment: 'Order buat traktiran kantor 6 cup Kopi Kenangan, hemat hampir 70 ribu. Semuanya sesuai request level gula dan es.',
    avatarText: 'RA',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
    verified: true,
  },
];

