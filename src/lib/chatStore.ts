export interface LiveChatMessage {
  id: string;
  sessionId: string;
  sender: 'bot' | 'user' | 'admin' | 'system';
  text: string;
  timestamp: string;
  adminName?: string;
}

export interface LiveChatSession {
  sessionId: string;
  customerName: string;
  customerContact: string;
  topic: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'resolved';
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __SAOIRSE_CHAT_SESSIONS__: LiveChatSession[] | undefined;
  // eslint-disable-next-line no-var
  var __SAOIRSE_CHAT_MESSAGES__: Record<string, LiveChatMessage[]> | undefined;
}

const DEFAULT_SESSIONS: LiveChatSession[] = [
  {
    sessionId: 'session-cust-1',
    customerName: 'Bintang Alamsyah',
    customerContact: '@bintang_alam',
    topic: 'Klaim Garansi Netflix 1P1U',
    lastMessage: 'Kak profil 2 saya mendadak minta update password, boleh minta tolong kirim akun replace?',
    lastMessageTime: '10 menit yang lalu',
    unreadCount: 1,
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    sessionId: 'session-cust-2',
    customerName: 'Sarah Amalia',
    customerContact: '@sarahamalia99',
    topic: 'Jasdor Kopi Kenangan Cabang Senayan',
    lastMessage: 'Halo admin, kalau saya pesan sekarang jam berapa bisa diambil di kasirnya ya?',
    lastMessageTime: '25 menit yang lalu',
    unreadCount: 0,
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    sessionId: 'session-cust-3',
    customerName: 'Klien Anonim #49',
    customerContact: '@curhat_anon49',
    topic: 'Tanya Slot Sesi Curhat Jascur',
    lastMessage: 'Malam kak, apakah sesi voice call malam ini jam 21:00 masih ready?',
    lastMessageTime: '1 jam yang lalu',
    unreadCount: 0,
    status: 'resolved',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_MESSAGES: Record<string, LiveChatMessage[]> = {
  'session-cust-1': [
    {
      id: 'msg-1-1',
      sessionId: 'session-cust-1',
      sender: 'user',
      text: 'Halo admin saoirse, saya pembeli tiket #SR-1038 kemarin',
      timestamp: '15:40',
    },
    {
      id: 'msg-1-2',
      sessionId: 'session-cust-1',
      sender: 'user',
      text: 'Kak profil 2 saya mendadak minta update password, boleh minta tolong kirim akun replace?',
      timestamp: '15:41',
    },
  ],
  'session-cust-2': [
    {
      id: 'msg-2-1',
      sessionId: 'session-cust-2',
      sender: 'user',
      text: 'Halo admin, kalau saya pesan sekarang jam berapa bisa diambil di kasirnya ya?',
      timestamp: '15:20',
    },
    {
      id: 'msg-2-2',
      sessionId: 'session-cust-2',
      sender: 'admin',
      adminName: 'Fadiyah',
      text: 'Halo kak Sarah! 👋 Estimasi proses pesanan sekitar 5-15 menit kak, begitu status selesai kakak bisa langsung sebut nama di kasir tanpa antre ya!',
      timestamp: '15:22',
    },
  ],
  'session-cust-3': [
    {
      id: 'msg-3-1',
      sessionId: 'session-cust-3',
      sender: 'user',
      text: 'Malam kak, apakah sesi voice call malam ini jam 21:00 masih ready?',
      timestamp: '14:30',
    },
    {
      id: 'msg-3-2',
      sessionId: 'session-cust-3',
      sender: 'admin',
      adminName: 'Kifsha',
      text: 'Malam kak! Ready banget kak, silakan langsung checkout di menu Jascur ya 🤗',
      timestamp: '14:32',
    },
  ],
};

export function getAllChatSessions(): LiveChatSession[] {
  if (!globalThis.__SAOIRSE_CHAT_SESSIONS__) {
    globalThis.__SAOIRSE_CHAT_SESSIONS__ = [...DEFAULT_SESSIONS];
  }
  return globalThis.__SAOIRSE_CHAT_SESSIONS__;
}

export function getSessionMessages(sessionId: string): LiveChatMessage[] {
  if (!globalThis.__SAOIRSE_CHAT_MESSAGES__) {
    globalThis.__SAOIRSE_CHAT_MESSAGES__ = { ...DEFAULT_MESSAGES };
  }
  return globalThis.__SAOIRSE_CHAT_MESSAGES__[sessionId] || [];
}

export function sendChatMessage(data: {
  sessionId: string;
  sender: 'bot' | 'user' | 'admin' | 'system';
  text: string;
  customerName?: string;
  customerContact?: string;
  topic?: string;
  adminName?: string;
}): { session: LiveChatSession; message: LiveChatMessage } {
  const sessions = getAllChatSessions();
  const allMessages = globalThis.__SAOIRSE_CHAT_MESSAGES__ || { ...DEFAULT_MESSAGES };

  let session = sessions.find((s) => s.sessionId === data.sessionId);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newMessage: LiveChatMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sessionId: data.sessionId,
    sender: data.sender,
    text: data.text,
    timestamp: timeStr,
    adminName: data.adminName,
  };

  if (!session) {
    session = {
      sessionId: data.sessionId,
      customerName: data.customerName || 'Pelanggan saoirse',
      customerContact: data.customerContact || '@username',
      topic: data.topic || 'Bantuan Umum',
      lastMessage: data.text,
      lastMessageTime: 'Baru saja',
      unreadCount: data.sender === 'user' ? 1 : 0,
      status: 'active',
      createdAt: now.toISOString(),
    };
    sessions.unshift(session);
  } else {
    session.lastMessage = data.text;
    session.lastMessageTime = 'Baru saja';
    if (data.sender === 'user') {
      session.unreadCount = (session.unreadCount || 0) + 1;
    }
    if (data.customerName) session.customerName = data.customerName;
    if (data.customerContact) session.customerContact = data.customerContact;
    if (data.topic) session.topic = data.topic;

    // Move updated session to top
    const idx = sessions.findIndex((s) => s.sessionId === data.sessionId);
    if (idx > 0) {
      sessions.splice(idx, 1);
      sessions.unshift(session);
    }
  }

  if (!allMessages[data.sessionId]) {
    allMessages[data.sessionId] = [];
  }
  allMessages[data.sessionId].push(newMessage);

  globalThis.__SAOIRSE_CHAT_SESSIONS__ = sessions;
  globalThis.__SAOIRSE_CHAT_MESSAGES__ = allMessages;

  return { session, message: newMessage };
}

export function markSessionAsRead(sessionId: string): void {
  const sessions = getAllChatSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (session) {
    session.unreadCount = 0;
  }
}

export function resolveChatSession(sessionId: string, status: 'active' | 'resolved' = 'resolved'): LiveChatSession | null {
  const sessions = getAllChatSessions();
  const session = sessions.find((s) => s.sessionId === sessionId);
  if (session) {
    session.status = status;
    return session;
  }
  return null;
}
