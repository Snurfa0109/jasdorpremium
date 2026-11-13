import { NextRequest, NextResponse } from 'next/server';
import { getAdminSettings } from '@/lib/adminSettingsStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal = 0, service = 'all' } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Mohon masukkan kode voucher.',
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const settings = getAdminSettings();
    const vouchers = settings.vouchers || [];

    const voucher = vouchers.find((v) => v.code.toUpperCase() === cleanCode);

    if (!voucher) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Kode promo "${cleanCode}" tidak ditemukan atau sudah tidak aktif.`,
      });
    }

    if (!voucher.isActive) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Voucher "${cleanCode}" saat ini sedang dinonaktifkan oleh admin.`,
      });
    }

    // Expiry check
    if (voucher.expiryDate) {
      const exp = new Date(voucher.expiryDate).getTime();
      if (!isNaN(exp) && Date.now() > exp) {
        return NextResponse.json({
          success: false,
          valid: false,
          error: `Masa berlaku voucher "${cleanCode}" telah berakhir pada ${new Date(voucher.expiryDate).toLocaleDateString('id-ID')}.`,
        });
      }
    }

    // Usage limit check
    if (voucher.usageLimit !== null && voucher.usageLimit !== undefined && voucher.usageLimit > 0) {
      if ((voucher.usedCount || 0) >= voucher.usageLimit) {
        return NextResponse.json({
          success: false,
          valid: false,
          error: `Kuota penggunaan voucher "${cleanCode}" sudah habis (${voucher.usedCount}/${voucher.usageLimit} terpakai).`,
        });
      }
    }

    // Service scope check
    if (voucher.applicableService !== 'all' && service !== 'all') {
      if (voucher.applicableService !== service) {
        const serviceNames: Record<string, string> = {
          jasdor: 'Jasdor Kopi Kenangan',
          premium: 'Aplikasi Premium',
          jascur: 'Jasa Curhat (Jascur)',
        };
        const targetName = serviceNames[voucher.applicableService] || voucher.applicableService;
        return NextResponse.json({
          success: false,
          valid: false,
          error: `Voucher "${cleanCode}" hanya berlaku untuk pemesanan ${targetName}.`,
        });
      }
    }

    // Minimum order check
    const numSubtotal = Number(subtotal) || 0;
    if (voucher.minOrder > 0 && numSubtotal < voucher.minOrder) {
      const formatRupiah = (num: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Minimal belanja untuk voucher "${cleanCode}" adalah ${formatRupiah(voucher.minOrder)} (subtotal pesananmu saat ini: ${formatRupiah(numSubtotal)}).`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (voucher.discountType === 'percent') {
      discountAmount = Math.round((numSubtotal * voucher.discountValue) / 100);
      if (voucher.maxDiscount && voucher.maxDiscount > 0 && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else {
      discountAmount = Math.min(voucher.discountValue, numSubtotal);
    }

    const finalPrice = Math.max(0, numSubtotal - discountAmount);

    return NextResponse.json({
      success: true,
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        title: voucher.title,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrder: voucher.minOrder,
        maxDiscount: voucher.maxDiscount,
        applicableService: voucher.applicableService,
      },
      discountAmount,
      finalPrice,
      message: `Voucher ${voucher.code} berhasil diterapkan! Hemat ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(discountAmount)} 🎉`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memvalidasi voucher';
    return NextResponse.json({ success: false, valid: false, error: msg }, { status: 500 });
  }
}

