import { NextRequest, NextResponse } from 'next/server';
import { getAdminSettings, updateAdminSettings } from '@/lib/adminSettingsStore';

export async function GET() {
  const settings = getAdminSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateAdminSettings(body);
    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui pengaturan admin';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

