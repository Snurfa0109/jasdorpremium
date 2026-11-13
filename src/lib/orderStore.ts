import { Order, OrderStatus, OrderCredentials } from '@/types';

declare global {
  // eslint-disable-next-line no-var
  var __SAOIRSE_ORDERS__: Order[] | undefined;
  // eslint-disable-next-line no-var
  var __SAOIRSE_QUEUE_OPEN__: boolean | undefined;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'SR-1038',
    customerName: 'Dina Safitri',
    customerTelegram: '@dina_safitri',
    productId: 'netflix',
    productName: 'Netflix',
    planGroup: 'SHARING 1P1U (1 Profile 1 User)',
    planName: '1 Bulan',
    price: 35000,
    costPrice: 22000,
    profit: 13000,
    paymentMethod: 'qris',
    status: 'completed',
    queueNumber: 38,
    assignedAdmin: 'Fadiyah',
    credentials: {
      email: 'netflix.vip38@gmail.com',
      password: 'PassNetflix2026!',
      profileName: 'Dina (Profil 2)',
      profilePin: '4321',
      expiredDate: '10 Desember 2026',
      rulesNotes: 'Dilarang ganti pin / password & dilarang login di lebih dari 1 device.',
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    estimatedMinutes: 0,
  },
  {
    id: 'SR-1039',
    customerName: 'Budi Santoso',
    customerTelegram: '@budi_santoso99',
    productId: 'canva',
    productName: 'Canva Pro',
    planGroup: 'MEMBER (SUDAH INCLUDE DESIGNER)',
    planName: '1 Tahun',
    price: 17000,
    costPrice: 10000,
    profit: 7000,
    paymentMethod: 'qris',
    status: 'completed',
    queueNumber: 39,
    assignedAdmin: 'Kifsha',
    credentials: {
      email: 'budi.santoso99@gmail.com',
      notes: 'Undangan tim Canva Designer telah dikirimkan ke email kamu. Cek inbox / spam untuk accept invite.',
      expiredDate: '10 November 2027',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    estimatedMinutes: 0,
  },
  {
    id: 'SR-1040',
    customerName: 'Rian Pratama',
    customerTelegram: '@rianpratama',
    productId: 'chatgpt',
    productName: 'ChatGPT Plus',
    planGroup: 'SHARING 5U (Maks 5 User)',
    planName: '1 Bulan',
    price: 60000,
    paymentMethod: 'qris',
    status: 'processing',
    queueNumber: 40,
    assignedAdmin: 'Fadiyah',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedMinutes: 3,
  },
  {
    id: 'SR-1041',
    customerName: 'Siti Sarah',
    customerTelegram: '@sitisarah_id',
    productId: 'spotify',
    productName: 'Spotify Premium',
    planGroup: 'FAMPLAN (Family Plan Plan)',
    planName: '2 Bulan',
    price: 27000,
    paymentMethod: 'qris',
    status: 'queued',
    queueNumber: 41,
    assignedAdmin: null,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedMinutes: 8,
  },
  {
    id: 'SR-1042',
    customerName: 'Dimas Anggara',
    customerTelegram: '@dimas_anggara',
    productId: 'capcut',
    productName: 'CapCut Pro',
    planGroup: 'PRIVATE',
    planName: '1 Bulan',
    price: 22000,
    paymentMethod: 'qris',
    status: 'queued',
    queueNumber: 42,
    assignedAdmin: null,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    estimatedMinutes: 12,
  },
];

if (!globalThis.__SAOIRSE_ORDERS__) {
  globalThis.__SAOIRSE_ORDERS__ = INITIAL_ORDERS;
}

if (globalThis.__SAOIRSE_QUEUE_OPEN__ === undefined) {
  globalThis.__SAOIRSE_QUEUE_OPEN__ = true;
}

export function getAllOrders(): Order[] {
  return globalThis.__SAOIRSE_ORDERS__ || [];
}

export function getOrderById(id: string): Order | undefined {
  const orders = getAllOrders();
  return orders.find((o) => o.id.toUpperCase() === id.toUpperCase());
}

export function createOrder(data: {
  customerName: string;
  customerTelegram: string;
  productId: string;
  productName: string;
  planGroup?: string;
  planName?: string;
  outlet?: string;
  pickupTime?: string;
  items?: { id: string; name: string; details?: string; price: number; quantity: number; image?: string }[];
  price: number;
  originalPrice?: number;
  voucherCode?: string;
  discountAmount?: number;
  paymentMethod?: 'qris';
}): Order {
  const orders = getAllOrders();
  const nextNum = orders.length > 0 ? Math.max(...orders.map((o) => o.queueNumber)) + 1 : 1001;
  const newId = `SR-${nextNum}`;

  const activeQueues = orders.filter((o) => o.status === 'queued' || o.status === 'processing').length;
  const estMins = Math.max(3, (activeQueues + 1) * 4);

  const telegramHandle = data.customerTelegram.trim().startsWith('@')
    ? data.customerTelegram.trim()
    : `@${data.customerTelegram.trim()}`;

  const newOrder: Order = {
    id: newId,
    customerName: data.customerName,
    customerTelegram: telegramHandle,
    productId: data.productId,
    productName: data.productName,
    planGroup: data.planGroup || '',
    planName: data.planName || '',
    outlet: data.outlet,
    pickupTime: data.pickupTime,
    items: data.items,
    price: data.price,
    originalPrice: data.originalPrice,
    voucherCode: data.voucherCode,
    discountAmount: data.discountAmount,
    paymentMethod: 'qris',
    status: 'queued',
    queueNumber: nextNum,
    assignedAdmin: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedMinutes: estMins,
  };

  orders.unshift(newOrder);
  globalThis.__SAOIRSE_ORDERS__ = orders;
  return newOrder;
}

export function assignAdminToOrder(orderId: string, adminName: string): Order | null {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (!order) return null;

  order.assignedAdmin = adminName;
  order.status = 'processing';
  order.updatedAt = new Date().toISOString();
  order.estimatedMinutes = 3;
  return order;
}

export function calculateDefaultCostPrice(order: { productId?: string; planGroup?: string; price: number }): number {
  const pId = (order.productId || '').toLowerCase();
  const group = (order.planGroup || '').toLowerCase();

  if (pId === 'jascur' || group.includes('curhat')) {
    return 0; // Jasa curhat tenaga pribadi = Rp 0 modal
  }
  if (pId === 'kopken' || pId === 'jasdor' || group.includes('kopi')) {
    // Jasdor Kopi: rata-rata modal kasir/voucher 60% dari harga yang dibayar pembeli
    return Math.round(order.price * 0.6);
  }
  // Akun premium streaming: rata-rata modal kulak akun 65%
  return Math.round(order.price * 0.65);
}

export function completeOrder(
  orderId: string,
  credentials: OrderCredentials,
  adminName: string,
  costPrice?: number
): Order | null {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (!order) return null;

  order.assignedAdmin = adminName;
  order.status = 'completed';
  order.credentials = credentials;

  const finalCost =
    costPrice !== undefined && !isNaN(Number(costPrice))
      ? Number(costPrice)
      : (order.costPrice ?? calculateDefaultCostPrice(order));

  order.costPrice = finalCost;
  order.profit = Math.max(0, order.price - finalCost);

  order.updatedAt = new Date().toISOString();
  order.estimatedMinutes = 0;
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}

export function isQueueOpen(): boolean {
  return globalThis.__SAOIRSE_QUEUE_OPEN__ ?? true;
}

export function setQueueOpen(open: boolean): boolean {
  globalThis.__SAOIRSE_QUEUE_OPEN__ = open;
  return globalThis.__SAOIRSE_QUEUE_OPEN__;
}

export function getQueuePosition(orderId: string): {
  position: number;
  totalWaiting: number;
  currentlyProcessingId?: string;
  adminAssigned?: string | null;
} {
  const orders = getAllOrders();
  const target = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (!target) return { position: 0, totalWaiting: 0 };

  if (target.status === 'completed') {
    return { position: 0, totalWaiting: 0, adminAssigned: target.assignedAdmin };
  }

  const activeOrders = orders
    .filter((o) => o.status === 'queued' || o.status === 'processing')
    .sort((a, b) => a.queueNumber - b.queueNumber);

  const currentlyProcessing = activeOrders.find((o) => o.status === 'processing');
  const index = activeOrders.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());

  return {
    position: index >= 0 ? index + 1 : 0,
    totalWaiting: activeOrders.length,
    currentlyProcessingId: currentlyProcessing ? currentlyProcessing.id : undefined,
    adminAssigned: target.assignedAdmin,
  };
}

export function addOrderReview(
  orderId: string,
  review: { rating: number; comment: string }
): Order | null {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (!order) return null;
  order.review = {
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date().toISOString(),
  };
  return order;
}
