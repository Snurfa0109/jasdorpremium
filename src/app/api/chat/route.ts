import { NextRequest, NextResponse } from 'next/server';
import {
  getAllChatSessions,
  getSessionMessages,
  sendChatMessage,
  markSessionAsRead,
  resolveChatSession,
} from '@/lib/chatStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const markRead = searchParams.get('markRead');

  if (sessionId) {
    if (markRead === 'true') {
      markSessionAsRead(sessionId);
    }
    const messages = getSessionMessages(sessionId);
    const sessions = getAllChatSessions();
    const session = sessions.find((s) => s.sessionId === sessionId);
    return NextResponse.json({
      success: true,
      sessionId,
      session: session || null,
      messages,
    });
  }

  const sessions = getAllChatSessions();
  const unreadTotal = sessions.reduce((acc, s) => acc + (s.unreadCount || 0), 0);
  return NextResponse.json({
    success: true,
    sessions,
    unreadTotal,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      sender = 'user',
      text,
      customerName,
      customerContact,
      topic,
      adminName,
      action,
      status,
    } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId wajib diisi' }, { status: 400 });
    }

    if (action === 'resolve') {
      const updated = resolveChatSession(sessionId, status || 'resolved');
      return NextResponse.json({ success: true, session: updated });
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ success: false, error: 'Pesan chat tidak boleh kosong' }, { status: 400 });
    }

    const result = sendChatMessage({
      sessionId,
      sender,
      text: text.trim(),
      customerName,
      customerContact,
      topic,
      adminName,
    });

    return NextResponse.json({
      success: true,
      session: result.session,
      message: result.message,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
