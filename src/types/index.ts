export type Category = 'all' | 'streaming' | 'music' | 'creative' | 'ai' | 'education' | 'utility';

export interface PlanOption {
  id: string;
  name: string; // e.g., "1 Bulan", "1 Tahun", "Lifetime"
  price: number; // in IDR
  type?: string; // e.g. "Sharing 1P1U", "Private", "Famplan", "Indplan"
  notes?: string; // e.g. "-need email cust", "Sudah include designer"
}

export interface ProductPlanGroup {
  groupName: string; // e.g. "SHARING 1P1U", "PRIVATE", "MEMBER"
  options: PlanOption[];
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  badge?: string; // e.g. "BEST SELLER", "POPULER", "TERBAIK"
  icon: string; // Icon identifier or emoji
  color: string; // Color accent for badge
  planGroups: ProductPlanGroup[];
  hasWarranty?: boolean; // Default true (bergaransi), false = non garansi
}

export type OrderStatus = 'pending_payment' | 'queued' | 'processing' | 'completed' | 'cancelled';

export interface OrderCredentials {
  email?: string;
  password?: string;
  profileName?: string;
  profilePin?: string;
  expiredDate?: string;
  rulesNotes?: string;
  notes?: string;
  photoUrl?: string; // Foto bukti validasi pesanan selesai / struk / barcode kasir
  pickupTime?: string; // Request jam ambil / jam proses
}

export interface OrderItem {
  id: string;
  name: string;
  details?: string; // Customizations like size, sugar, ice, or plan variant
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string; // e.g. "SR-1042"
  customerName: string;
  customerTelegram: string;
  productId: string;
  productName: string;
  planGroup?: string;
  planName?: string;
  outlet?: string; // Cabang Pick-up (khusus pesanan kopi)
  pickupTime?: string; // Request jam pengambilan dari customer (misal: "14:30 WIB" atau "Sekarang / ASAP")
  items?: OrderItem[]; // List pesanan jika checkout via keranjang
  price: number;
  costPrice?: number; // Uang Modal / HPP yang dikeluarkan admin
  profit?: number; // Keuntungan bersih = price - costPrice
  originalPrice?: number;
  voucherCode?: string;
  discountAmount?: number;
  paymentMethod: 'qris';
  status: OrderStatus;
  queueNumber: number;
  assignedAdmin?: 'Fadiyah' | 'Kifsha' | 'Admin 1' | 'Admin 2' | string | null;
  credentials?: OrderCredentials;
  review?: {
    rating: number; // 1 - 5
    comment: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedMinutes: number;
}

export interface CartItem {
  cartItemId: string; // unique cart entry id
  itemId: string;
  name: string;
  details: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: 'kopken' | 'tomoro' | 'premium';
  outlet?: string;
}
