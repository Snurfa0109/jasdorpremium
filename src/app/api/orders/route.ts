import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  assignAdminToOrder,
  completeOrder,
  updateOrderStatus,
  addOrderReview,
  isQueueOpen,
  setQueueOpen,
  getQueuePosition,
} from '@/lib/orderStore';
import { getAdminSettings, updateAdminSettings } from '@/lib/adminSettingsStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const search = searchParams.get('search');
  const contact = searchParams.get('contact');

  if (id) {
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }
    const queueInfo = getQueuePosition(id);
    return NextResponse.json({ success: true, order, queueInfo });
  }

  let orders = getAllOrders();

  if (contact) {
    const clean = contact.toLowerCase().replace('@', '').trim();
    const matched = orders.filter((o) => {
      const tg = (o.customerTelegram || '').toLowerCase().replace('@', '');
      const nm = (o.customerName || '').toLowerCase();
      return tg.includes(clean) || nm.includes(clean);
    });
    return NextResponse.json({ success: true, orders: matched });
  }

  if (search) {
    const q = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerTelegram?.toLowerCase().includes(q)
    );
  }

  const activeQueues = orders.filter((o) => o.status === 'queued' || o.status === 'processing').length;
  const completedToday = orders.filter((o) => o.status === 'completed').length;

  return NextResponse.json({
    success: true,
    orders,
    queueOpen: isQueueOpen(),
    stats: {
      activeQueues,
      completedToday,
      totalOrders: orders.length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!isQueueOpen()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Antrian saat ini sedang ditutup sementara oleh admin untuk pemrosesan batch. Mohon tunggu beberapa saat.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      customerName,
      customerTelegram,
      productId,
      productName,
      planGroup,
      planName,
      price,
      originalPrice,
      voucherCode,
      discountAmount,
      paymentMethod,
      outlet,
      pickupTime,
      items,
    } = body;

    const contactInfo = (customerTelegram || '').trim();

    if (!customerName || !contactInfo || !productName || !price) {
      return NextResponse.json({ success: false, error: 'Data pesanan belum lengkap' }, { status: 400 });
    }

    const settings = getAdminSettings();

    // Jasdor Kopi Check
    if (productId === 'kopken' || productId === 'jasdor' || planGroup === 'Jasdor Kopi') {
      if (!settings.store.jasdorOpen) {
        return NextResponse.json(
          {
            success: false,
            error: settings.store.jasdorAnnouncement || 'Antrian Jasdor Kopi Kenangan sedang ditutup sementara.',
          },
          { status: 403 }
        );
      }
    }

    // App Premium Check
    if (productId === 'premium' || planGroup === 'Aplikasi Premium') {
      if (!settings.store.premiumOpen) {
        return NextResponse.json(
          {
            success: false,
            error: settings.store.premiumAnnouncement || 'Layanan Akun Premium sedang ditutup sementara.',
          },
          { status: 403 }
        );
      }
    }

    // Jascur Check & Call Lock
    const isCallSession =
      (productName || '').toLowerCase().includes('call') ||
      (planName || '').toLowerCase().includes('call');

    if (productId === 'jascur' || planGroup === 'Jasa Curhat') {
      if (!settings.jascur.isOpen) {
        return NextResponse.json(
          {
            success: false,
            error: settings.jascur.closeAnnouncement || 'Layanan Jasa Curhat sedang istirahat sementara.',
          },
          { status: 403 }
        );
      }

      if (isCallSession && !settings.jascur.isCallOpen) {
        return NextResponse.json(
          {
            success: false,
            error: settings.jascur.callLockReason || 'Sesi Call sedang berlangsung dengan klien lain. Mohon tunggu giliran selesai.',
          },
          { status: 403 }
        );
      }
    }

    const newOrder = createOrder({
      customerName,
      customerTelegram: contactInfo,
      productId,
      productName,
      planGroup,
      planName,
      outlet,
      pickupTime,
      items,
      price,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      voucherCode: voucherCode ? String(voucherCode).trim().toUpperCase() : undefined,
      discountAmount: discountAmount ? Number(discountAmount) : undefined,
      paymentMethod,
    });

    // If voucher was applied, increment its usedCount
    if (voucherCode && settings.vouchers) {
      const cleanCode = String(voucherCode).trim().toUpperCase();
      const updatedVouchers = settings.vouchers.map((v) => {
        if (v.code.toUpperCase() === cleanCode) {
          return { ...v, usedCount: (v.usedCount || 0) + 1 };
        }
        return v;
      });
      updateAdminSettings({ vouchers: updatedVouchers });
    }

    // Auto-lock Call session if Call order placed
    if ((productId === 'jascur' || planGroup === 'Jasa Curhat') && isCallSession) {
      const matchHours = (planName || '').match(/(\d+)\s*Jam/i);
      const hours = matchHours ? parseInt(matchHours[1], 10) : 1;
      const expireIso = new Date(Date.now() + hours * 3600 * 1000).toISOString();
      updateAdminSettings({
        jascur: {
          ...settings.jascur,
          isCallOpen: false,
          activeCallOrderId: newOrder.id,
          activeCallUntil: expireIso,
          callLockReason: `Sesi Call sedang berlangsung (Tiket #${newOrder.id})`,
        },
      });
    }

    const queueInfo = getQueuePosition(newOrder.id);

    return NextResponse.json({ success: true, order: newOrder, queueInfo });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orderId, adminName, credentials, costPrice, status, queueOpen } = body;

    // Toggle queue throttle
    if (action === 'toggleQueue') {
      const state = setQueueOpen(Boolean(queueOpen));
      return NextResponse.json({ success: true, queueOpen: state });
    }

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId wajib diisi' }, { status: 400 });
    }

    if (action === 'assign') {
      const validAdmins = ['Admin 1', 'Admin 2', 'Fadiyah', 'Kifsha'];
      if (!adminName || !validAdmins.includes(adminName)) {
        return NextResponse.json({ success: false, error: 'Nama admin tidak valid' }, { status: 400 });
      }
      const updated = assignAdminToOrder(orderId, adminName);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated });
    }

    if (action === 'release') {
      const orders = getAllOrders();
      const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
      if (!order) {
        return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }
      order.assignedAdmin = null;
      order.status = 'queued';
      order.updatedAt = new Date().toISOString();
      return NextResponse.json({ success: true, order });
    }

    if (action === 'cancel') {
      const updated = updateOrderStatus(orderId, 'cancelled');
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }

      // Reopen Call if this was the active call order
      const currentSettings = getAdminSettings();
      if (currentSettings.jascur.activeCallOrderId?.toUpperCase() === orderId.toUpperCase()) {
        updateAdminSettings({
          jascur: {
            ...currentSettings.jascur,
            isCallOpen: true,
            activeCallOrderId: null,
            activeCallUntil: null,
            callLockReason: '',
          },
        });
      }

      return NextResponse.json({ success: true, order: updated });
    }

    if (action === 'complete') {
      if (!credentials) {
        return NextResponse.json({ success: false, error: 'Detail akun wajib diisi' }, { status: 400 });
      }
      const updated = completeOrder(orderId, credentials, adminName || 'Admin 1', costPrice);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }

      // Reopen Call if this was the active call order
      const currentSettings = getAdminSettings();
      if (currentSettings.jascur.activeCallOrderId?.toUpperCase() === orderId.toUpperCase()) {
        updateAdminSettings({
          jascur: {
            ...currentSettings.jascur,
            isCallOpen: true,
            activeCallOrderId: null,
            activeCallUntil: null,
            callLockReason: '',
          },
        });
      }

      return NextResponse.json({ success: true, order: updated });
    }

    if (action === 'updateStatus') {
      const updated = updateOrderStatus(orderId, status);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }

      if (status === 'completed' || status === 'cancelled') {
        const currentSettings = getAdminSettings();
        if (currentSettings.jascur.activeCallOrderId?.toUpperCase() === orderId.toUpperCase()) {
          updateAdminSettings({
            jascur: {
              ...currentSettings.jascur,
              isCallOpen: true,
              activeCallOrderId: null,
              activeCallUntil: null,
              callLockReason: '',
            },
          });
        }
      }

      return NextResponse.json({ success: true, order: updated });
    }

    if (action === 'review') {
      const { rating, comment } = body;
      if (!rating) {
        return NextResponse.json({ success: false, error: 'Rating bintang wajib diisi' }, { status: 400 });
      }
      const updated = addOrderReview(orderId, { rating: Number(rating), comment: comment || '' });
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

