'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  Headphones,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Minimize2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'admin' | 'system';
  text: string;
  timestamp: string;
  chips?: { label: string; action: string }[];
  isRegisterCard?: boolean;
  isQueueCard?: boolean;
}

interface QueueInfo {
  queueNumber: string;
  name: string;
  contact: string;
  topic: string;
  position: number; // e.g. 2 -> 1 -> 0
  estimatedMinutes: number;
  status: 'waiting' | 'connected';
  sessionId?: string;
}

const CHAT_STORAGE_KEY = 'saoirse_chat_history_v3';
const CHAT_MODE_KEY = 'saoirse_chat_mode_v3';
const CHAT_QUEUE_KEY = 'saoirse_chat_queue_v3';

const BOT_KNOWLEDGE: Record<string, string> = {
  kopi: `☕ **Cara Jajan Jasdor Kopi Kenangan Diskon 50%:**
1. Buka menu **Jasdor Kopi** lalu tentukan cabang outlet terdekatmu.
2. Pilih minuman & bakery favorit (harga sudah auto diskon 50% lho!).
3. Bayar via QRIS All Payment (bisa BCA, Mandiri, BRI, DANA, GoPay, ShopeePay, dll).
4. Admin kami langsung pesankan ke kasir outlet pilihanmu. Begitu sampai di cabang, tinggal sebut nama pemesan di kasir/barista tanpa antre! 🎉`,

  premium: `🍿 **Aplikasi Streaming Premium & Garansi saoirse:**
• Ada Netflix, Spotify, YouTube Premium, Canva Pro, CapCut Pro, ChatGPT Plus, dll!
• **100% Bergaransi Penuh:** Kalau akun ada kendala sebelum masa aktif habis, admin siap kirim akun baru pengganti via tiket.
• Akun dikirim kilat ke layar tiket pesananmu setelah bayar QRIS. Asik banget kan? ✨`,

  jascur: `💬 **Jasa Curhat (Jascur) – Ruang Aman & Teman Cerita:**
• **Sesi Chat Teks:** Cuma Rp 3.000 / jam (berlaku kelipatan).
• **Sesi Voice Call:** Rp 15.000 / jam (ngobrol santai privat via telp Telegram).
• **Add-on Voice Note (VN):** +Rp 10.000 / sesi.
• 100% aman, rahasia & anonim (cukup username Telegram & nama panggilan). Mau tumpahin uneg-uneg atau sekadar cerita hari ini bebas banget! 🤗`,

  tiket: `🎫 **Cara Cek Status Pesanan / Tiketmu:**
1. Klik tombol **Cek Tiket** di navbar atas.
2. Masukkan nomor ID tiketmu (contoh: \`SR-1042\`) atau klik langsung dari histori tersimpan di browsermu.
3. Di layar tiket, kamu bisa pantau antrian live, ambil data akun/foto struk kopi kasir, dan download bukti transaksi! ✨`,
};

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-init-1',
  sender: 'bot',
  text: 'Hai saories tercinta! 👋✨\n\nKenalin, aku **saories helper** siap nemenin kamu belanja hemat di **saoirse store**. Mau jajan Kopi Kenangan diskon 50%, borong akun streaming premium, atau curhat santai di Jascur nih? Spill aja langsung ya! 😉👇',
  timestamp: 'Baru saja',
  chips: [
    { label: '☕ Jajan Jasdor Kopi 50%', action: 'action_kopi' },
    { label: '🍿 Borong Akun Premium', action: 'action_premium' },
    { label: '💬 Mau Curhat di Jascur', action: 'action_jascur' },
    { label: '🎫 Cara Cek Tiket', action: 'action_tiket' },
    { label: '👩‍💼 Sambungkan ke CS Admin', action: 'action_cs' },
  ],
};

function formatMessageContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
              <strong key={partIdx} className="font-extrabold text-inherit">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return (
              <em key={partIdx} className="italic text-inherit">
                {part.slice(1, -1)}
              </em>
            );
          }
          if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            return (
              <code key={partIdx} className="px-1.5 py-0.5 rounded-md bg-stone-100 font-mono text-[10px] font-bold text-inherit">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatMode, setChatMode] = useState<'bot' | 'register' | 'queue' | 'live_cs'>('bot');
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regTopic, setRegTopic] = useState('Kendala Pesanan / Pembayaran');
  const [regNotes, setRegNotes] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Play subtle boutique chime using Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // AudioContext not allowed or disabled
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  // Load from localStorage on client mount (so refresh won't lose messages)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
      const savedMode = localStorage.getItem(CHAT_MODE_KEY);
      if (savedMode && ['bot', 'register', 'queue', 'live_cs'].includes(savedMode)) {
        setChatMode(savedMode as 'bot' | 'register' | 'queue' | 'live_cs');
      }
      const savedQueue = localStorage.getItem(CHAT_QUEUE_KEY);
      if (savedQueue) {
        setQueueInfo(JSON.parse(savedQueue));
      }
    } catch (e) {
      // silent
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist messages & state to localStorage on every change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      localStorage.setItem(CHAT_MODE_KEY, chatMode);
      if (queueInfo) {
        localStorage.setItem(CHAT_QUEUE_KEY, JSON.stringify(queueInfo));
      } else {
        localStorage.removeItem(CHAT_QUEUE_KEY);
      }
    } catch (e) {
      // silent
    }
  }, [messages, chatMode, queueInfo, isHydrated]);

  // Rollback / Reset chat to fresh state
  const handleResetChat = () => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_MODE_KEY);
      localStorage.removeItem(CHAT_QUEUE_KEY);
    } catch (e) {
      // silent
    }
    setChatMode('bot');
    setQueueInfo(null);
    setMessages([{ ...INITIAL_MESSAGE, id: `msg-init-${Date.now()}` }]);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAdminTyping, chatMode]);

  // Listen to global open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setHasUnread(false);
    };
    window.addEventListener('saoirse:open_chatbot', handleOpen);
    return () => window.removeEventListener('saoirse:open_chatbot', handleOpen);
  }, []);

  // Queue progression timer simulation (countdown 2 -> 1 -> 0 -> connected)
  useEffect(() => {
    if (chatMode === 'queue' && queueInfo) {
      if (queueInfo.position > 0) {
        const timer = setTimeout(() => {
          setQueueInfo((prev) => {
            if (!prev) return null;
            const nextPos = prev.position - 1;
            return {
              ...prev,
              position: nextPos,
              estimatedMinutes: Math.max(1, nextPos),
            };
          });
          playChime();
        }, 5000); // Progress every 5 seconds
        return () => clearTimeout(timer);
      } else if (queueInfo.position === 0 && queueInfo.status === 'waiting') {
        // Connect to Admin CS!
        const connectTimer = setTimeout(() => {
          setQueueInfo((prev) => (prev ? { ...prev, status: 'connected' } : null));
          setChatMode('live_cs');
          playChime();

          // Admin introduction message
          setIsAdminTyping(true);
          setTimeout(() => {
            setIsAdminTyping(false);
            const adminWelcome: ChatMessage = {
              id: `msg-adm-${Date.now()}`,
              sender: 'admin',
              text: `Halo Kak **${queueInfo.name}**! Terima kasih sudah bersabar menunggu di antrian. Saya **Admin Dini (Customer Support)** siap membantu keluhan seputar *${queueInfo.topic}*.\n\nBoleh diceritakan lebih detail kendalanya ya kak?`,
              timestamp: 'Baru saja',
            };
            setMessages((prev) => [...prev, adminWelcome]);
          }, 2000);
        }, 2000);
        return () => clearTimeout(connectTimer);
      }
    }
  }, [chatMode, queueInfo]);

  // Real-time polling for incoming Admin messages from Admin Dashboard
  useEffect(() => {
    if (chatMode !== 'live_cs' || !queueInfo?.sessionId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${queueInfo.sessionId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newAdminMsgs = data.messages.filter(
              (m: { id: string; sender: string }) => m.sender === 'admin' && !existingIds.has(m.id)
            );
            if (newAdminMsgs.length > 0) {
              playChime();
              if (!isOpen) setHasUnread(true);
              return [
                ...prev,
                ...newAdminMsgs.map((m: { id: string; sender: string; text: string; timestamp?: string; adminName?: string }) => ({
                  id: m.id,
                  sender: 'admin' as const,
                  text: m.text,
                  timestamp: m.timestamp || 'Baru saja',
                })),
              ];
            }
            return prev;
          });
        }
      } catch (e) {
        // silent
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [chatMode, queueInfo?.sessionId, isOpen]);

  // Handle Quick Chips
  const handleChipClick = (action: string, label: string) => {
    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);

    if (action === 'action_cs') {
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `msg-b-${Date.now()}`,
          sender: 'bot',
          text: 'Untuk terhubung langsung dengan Tim CS / Admin kami, silakan lengkapi formulir pendaftaran antrian di bawah ini ya kak:',
          timestamp: 'Baru saja',
          isRegisterCard: true,
        };
        setMessages((prev) => [...prev, botReply]);
        setChatMode('register');
      }, 500);
      return;
    }

    const key = action.replace('action_', '');
    const answer = BOT_KNOWLEDGE[key] || 'Maaf, bot kami belum memahami pertanyaan tersebut.';

    setTimeout(() => {
      const botReply: ChatMessage = {
        id: `msg-b-${Date.now()}`,
        sender: 'bot',
        text: answer,
        timestamp: 'Baru saja',
        chips: [
          { label: '👩‍💼 Hubungi CS / Admin Langsung', action: 'action_cs' },
          { label: 'Kembali ke Menu Utama', action: 'action_main' },
        ],
      };
      setMessages((prev) => [...prev, botReply]);
      playChime();
    }, 600);
  };

  // Submit Queue Registration Form
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regContact.trim()) return;

    const randomQueueNum = `#CS-${Math.floor(10 + Math.random() * 89)}`;
    const sid = 'session-' + Date.now().toString(36);
    const newQueue: QueueInfo = {
      queueNumber: randomQueueNum,
      name: regName.trim(),
      contact: regContact.trim(),
      topic: regTopic,
      position: 2,
      estimatedMinutes: 2,
      status: 'waiting',
      sessionId: sid,
    };

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sid,
        sender: 'user',
        customerName: regName.trim(),
        customerContact: regContact.trim(),
        topic: regTopic,
        text: regNotes.trim() || `Halo Admin saoirse, saya ${regName.trim()} butuh bantuan terkait ${regTopic}.`,
      }),
    }).catch(() => {});

    setQueueInfo(newQueue);
    setChatMode('queue');

    const regConfirmation: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: 'system',
      text: `Pendaftaran berhasil! Kamu terdaftar atas nama **${regName.trim()}** (${regContact.trim()}) dengan nomor antrian **${randomQueueNum}**.`,
      timestamp: 'Baru saja',
      isQueueCard: true,
    };

    setMessages((prev) => [...prev, regConfirmation]);
    playChime();
  };

  // Handle User Sending Text Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);

    // If already in Live CS mode
    if (chatMode === 'live_cs') {
      if (queueInfo?.sessionId) {
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: queueInfo.sessionId,
            sender: 'user',
            customerName: queueInfo.name,
            customerContact: queueInfo.contact,
            topic: queueInfo.topic,
            text,
          }),
        }).catch(() => {});
      }

      setIsAdminTyping(true);
      setTimeout(() => {
        setIsAdminTyping(false);
        // Smart realistic CS replies
        let adminReplyText = `Baik Kak ${queueInfo?.name || ''}, kendala "${text}" sedang kami cek di sistem antrian. Mohon ditunggu sebentar ya kak.`;
        const lower = text.toLowerCase();
        if (lower.includes('bayar') || lower.includes('qris') || lower.includes('bukti')) {
          adminReplyText = `Untuk pembayaran QRIS biasanya terverifikasi otomatis dalam 10-30 detik kak. Boleh kirimkan ID Pesanan (SR-xxxx) atau nominal pembayarannya agar kami bantu cross-check langsung?`;
        } else if (lower.includes('kopi') || lower.includes('outlet') || lower.includes('cabang')) {
          adminReplyText = `Siap kak, untuk orderan Kopi Kenangan diskon 50%, admin langsung pesankan ke kasir cabang yang dipilih. Jika ada menu yang kosong, kami bisa sesuaikan dengan varian yang kakak inginkan.`;
        } else if (lower.includes('garansi') || lower.includes('rusak') || lower.includes('logout')) {
          adminReplyText = `Semua pembelian akun di saoirse bergaransi penuh kak. Silakan cantumkan email / nomor tiketnya ya, jika terjadi kendala login admin akan segera mengganti akun baru yang fresh.`;
        } else if (lower.includes('makasih') || lower.includes('terima kasih') || lower.includes('oke')) {
          adminReplyText = `Sama-sama Kak ${queueInfo?.name || ''}! Senang bisa membantu. Jika ada hal lain yang perlu ditanyakan, jangan ragu untuk chat admin kembali ya. Selamat menikmati layanan saoirse! ☕✨`;
        }

        const replyMsg: ChatMessage = {
          id: `msg-adm-${Date.now()}`,
          sender: 'admin',
          text: adminReplyText,
          timestamp: 'Baru saja',
        };
        setMessages((prev) => [...prev, replyMsg]);
        playChime();
      }, 1500);
      return;
    }

    // Bot Mode fallback: check keywords or ask to queue for CS
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = 'Terima kasih atas pesannya! Kamu bisa memilih topik bantuan cepat di bawah, atau langsung mendaftar antrian untuk berbicara dengan Admin CS kami.';
      let matchedChips = [
        { label: '👩‍💼 Hubungi CS / Admin (Antri)', action: 'action_cs' },
        { label: '☕ Info Jasdor Kopi 50%', action: 'action_kopi' },
        { label: '🍿 Info Akun Premium', action: 'action_premium' },
      ];

      if (lower.includes('saos') || lower.includes('tiram') || lower.includes('hehe') || lower.includes('saus')) {
        replyText = 'Hahaha beneran bukan saos tiram kok! 😂🍳 Nama toko kita **saoirse.** (dibaca: *ser-sya*), tapi panggilan kesayangan untuk semua pelanggan setia kita adalah **saories**! Makanya asisten bot ini namanya **saories helper** 💕\n\nMau jajan Kopi Kenangan 50%, borong akun streaming premium, atau curhat santai di Jascur nih? Spill aja langsung!';
        matchedChips = [
          { label: '☕ Jajan Jasdor Kopi 50%', action: 'action_kopi' },
          { label: '🍿 Borong Akun Premium', action: 'action_premium' },
          { label: '💬 Mau Curhat di Jascur', action: 'action_jascur' },
        ];
      } else if (lower === 'halo' || lower === 'hai' || lower === 'hei' || lower === 'p' || lower === 'hi') {
        replyText = 'Halo juga saories tercinta! ✨ Seneng banget kamu mampir ke saoirse. Ada yang bisa saories helper bantu atau mau jajan hemat hari ini?';
        matchedChips = [
          { label: '☕ Kopi Kenangan 50%', action: 'action_kopi' },
          { label: '🍿 Akun Streaming', action: 'action_premium' },
          { label: '💬 Jasa Curhat', action: 'action_jascur' },
          { label: '🎫 Cek Tiket', action: 'action_tiket' },
        ];
      } else if (lower.includes('kopi') || lower.includes('kopken') || lower.includes('kenangan')) {
        replyText = BOT_KNOWLEDGE.kopi;
      } else if (lower.includes('premium') || lower.includes('netflix') || lower.includes('spotify') || lower.includes('canva')) {
        replyText = BOT_KNOWLEDGE.premium;
      } else if (lower.includes('curhat') || lower.includes('jascur')) {
        replyText = BOT_KNOWLEDGE.jascur;
      } else if (lower.includes('tiket') || lower.includes('order') || lower.includes('pesanan')) {
        replyText = BOT_KNOWLEDGE.tiket;
      } else if (lower.includes('cs') || lower.includes('admin') || lower.includes('manusia') || lower.includes('bantuan')) {
        replyText = 'Silakan isi formulir antrian singkat di bawah ini ya kak agar dapat terhubung dengan Tim CS:';
        setChatMode('register');
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-b-${Date.now()}`,
            sender: 'bot',
            text: replyText,
            timestamp: 'Baru saja',
            isRegisterCard: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-b-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: 'Baru saja',
          chips: matchedChips,
        },
      ]);
      playChime();
    }, 600);
  };

  const handleEndLiveChat = () => {
    setChatMode('bot');
    setQueueInfo(null);
    const endMsg: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: 'system',
      text: 'Sesi chat dengan Admin CS telah diakhiri. Kamu kembali ke mode Bot Pintar saoirse. Ada lagi yang bisa kami bantu?',
      timestamp: 'Baru saja',
      chips: [
        { label: '☕ Info Jasdor Kopi 50%', action: 'action_kopi' },
        { label: '🍿 Info Akun Premium', action: 'action_premium' },
        { label: '💬 Tarif Jasa Curhat', action: 'action_jascur' },
      ],
    };
    setMessages((prev) => [...prev, endMsg]);
  };

  return (
    <>
      {/* Floating Trigger Bubble in Bottom-Right */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="fixed bottom-24 sm:bottom-6 right-3 sm:right-6 z-30 p-3 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl bg-[#4e403b] hover:bg-[#372b27] text-[#fbf9f5] shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 border border-[#eae2d9] cursor-pointer group"
          title="Buka Chatbot & Layanan CS"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#bae5d6]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#4e403b] absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black tracking-tight">saories helper</div>
            <div className="text-[10px] text-[#bae5d6] font-medium leading-tight">Online 24/7 &amp; CS Live</div>
          </div>
        </button>
      )}

      {/* Main Chatbot & Live Support Window */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[400px] h-[82vh] sm:h-[580px] max-h-[640px] bg-white rounded-3xl border border-[#eae2d9] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#fbf9f5] border-b border-[#eae2d9] flex items-center justify-between relative">
            {resetToast && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-[#382820] text-[#fbf9f5] text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 border border-[#eae2d9]">
                <RotateCcw className="w-3 h-3 text-[#bae5d6]" />
                <span>Chat di-rollback &amp; kembali segar! ✨</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669] font-serif font-black text-base shadow-2xs relative shrink-0">
                s.
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-sm sm:text-base text-[#4e403b] tracking-tight">
                    saories helper
                  </h3>
                  {chatMode === 'live_cs' && (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                      Admin Live
                    </span>
                  )}
                  {chatMode === 'queue' && (
                    <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                      Antrian CS
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#7d6b63] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>
                    {chatMode === 'live_cs'
                      ? 'Terhubung dengan Admin Dini'
                      : chatMode === 'queue'
                      ? `Menunggu giliran antrian (${queueInfo?.queueNumber})`
                      : 'Respon Kilat 24/7 & CS Live'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Hapus / Rollback Chat (Mulai Ulang)"
                className="px-2.5 py-1.5 rounded-xl hover:bg-[#eae2d9] text-[#7d6b63] hover:text-[#059669] transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-[#eae2d9]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[10px] font-bold text-[#4e403b] hidden sm:inline">Rollback</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#eae2d9] text-[#7d6b63] hover:text-[#4e403b] flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#fbf9f5]/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isAdmin = msg.sender === 'admin';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-xl bg-[#ebf7f3] text-[#059669] text-[10px] font-bold border border-[#bde5d8]">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {!isUser && (
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs ${
                          isAdmin
                            ? 'bg-[#059669] text-[#bae5d6]'
                            : 'bg-white border border-[#eae2d9] text-[#4e403b]'
                        }`}
                      >
                        {isAdmin ? 'CS' : '🤖'}
                      </div>
                    )}

                    <div>
                      <div
                        className={`p-3 rounded-2xl shadow-2xs text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#4e403b] text-[#fbf9f5] rounded-tr-xs'
                            : isAdmin
                            ? 'bg-white border border-[#bde5d8] text-[#382820] rounded-tl-xs ring-1 ring-[#bde5d8]'
                            : 'bg-white border border-[#eae2d9] text-[#382820] rounded-tl-xs'
                        }`}
                      >
                        {formatMessageContent(msg.text)}
                      </div>
                      <span className="text-[9px] text-[#a3948b] mt-1 block px-1">
                        {msg.timestamp} {isAdmin && '• Admin Dini'}
                      </span>
                    </div>
                  </div>

                  {/* Chips for interactive navigation */}
                  {msg.chips && msg.chips.length > 0 && chatMode === 'bot' && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                      {msg.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleChipClick(chip.action, chip.label)}
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#ebf7f3] text-[#4e403b] hover:text-[#059669] border border-[#eae2d9] hover:border-[#bde5d8] text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Embedded Registration Form */}
                  {msg.isRegisterCard && chatMode === 'register' && (
                    <div className="mt-3 ml-9 p-4 rounded-2xl bg-white border border-[#eae2d9] shadow-xs space-y-3 max-w-[95%]">
                      <div className="flex items-center gap-2 border-b border-[#eae2d9] pb-2">
                        <Headphones className="w-4 h-4 text-[#059669]" />
                        <span className="font-bold text-xs text-[#4e403b]">
                          Formulir Pendaftaran Antrian CS
                        </span>
                      </div>

                      <form onSubmit={handleSubmitRegistration} className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-[#7d6b63] uppercase mb-0.5">
                            Nama Panggilan *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Bintang"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-[#eae2d9] bg-[#fbf9f5] text-xs text-[#382820] focus:border-[#059669] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#7d6b63] uppercase mb-0.5">
                            Kontak (ID / Username Telegram) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: @username"
                            value={regContact}
                            onChange={(e) => setRegContact(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-[#eae2d9] bg-[#fbf9f5] text-xs text-[#382820] focus:border-[#059669] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#7d6b63] uppercase mb-0.5">
                            Topik Bantuan *
                          </label>
                          <select
                            value={regTopic}
                            onChange={(e) => setRegTopic(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-[#eae2d9] bg-[#fbf9f5] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                          >
                            <option value="Kendala Pesanan / Pembayaran">Kendala Pesanan / Pembayaran</option>
                            <option value="Tanya Stok / Outlet Kopi Kenangan">Tanya Stok / Outlet Kopi Kenangan</option>
                            <option value="Klaim Garansi Akun Premium">Klaim Garansi Akun Premium</option>
                            <option value="Konsultasi Jasa Curhat (Jascur)">Konsultasi Jasa Curhat (Jascur)</option>
                            <option value="Pertanyaan Umum Lainnya">Pertanyaan Umum Lainnya</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                        >
                          <span>Ambil Nomor Antrian CS ➔</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Embedded Queue Status Card */}
                  {msg.isQueueCard && queueInfo && chatMode === 'queue' && (
                    <div className="mt-3 ml-9 p-4 rounded-2xl bg-gradient-to-b from-[#ebf7f3] to-white border border-[#059669] shadow-sm max-w-[95%]">
                      <div className="flex items-center justify-between border-b border-[#bde5d8] pb-2 mb-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                          TIKET ANTRIAN CS LIVE
                        </span>
                        <span className="font-mono font-black text-sm text-[#059669] bg-white px-2 py-0.5 rounded-md border border-[#bde5d8]">
                          {queueInfo.queueNumber}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#7d6b63]">Atas Nama:</span>
                          <span className="font-bold text-[#382820]">{queueInfo.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#7d6b63]">Topik:</span>
                          <span className="font-semibold text-[#382820] truncate max-w-[160px]">
                            {queueInfo.topic}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#7d6b63]">Posisi Antrian:</span>
                          <span className="font-black text-[#059669]">
                            {queueInfo.position === 0
                              ? 'Giliranmu! Menghubungkan...'
                              : `${queueInfo.position} orang di depanmu`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#7d6b63]">Estimasi Tunggu:</span>
                          <span className="font-bold text-[#4e403b]">
                            ~{queueInfo.estimatedMinutes} menit
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar Animation */}
                      <div className="mt-3 pt-2.5 border-t border-[#bde5d8]">
                        <div className="w-full h-1.5 rounded-full bg-[#bde5d8] overflow-hidden">
                          <div
                            className="h-full bg-[#059669] transition-all duration-1000 animate-pulse"
                            style={{
                              width:
                                queueInfo.position === 0
                                  ? '95%'
                                  : queueInfo.position === 1
                                  ? '60%'
                                  : '30%',
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-center text-[#059669] font-semibold mt-1.5 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Mohon jangan tutup jendela ini, admin segera masuk...</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Admin typing indicator */}
            {isAdminTyping && (
              <div className="flex items-center gap-2 pl-9">
                <div className="p-2.5 rounded-2xl bg-white border border-[#eae2d9] shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] text-[#7d6b63] italic">
                  Admin Dini sedang mengetik...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 border-t border-[#eae2d9] bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  chatMode === 'live_cs'
                    ? 'Ketik pesan ke Admin Dini...'
                    : chatMode === 'queue'
                    ? 'Sedang mengantri CS...'
                    : 'Tanya seputar pesanan, kopi, curhat...'
                }
                disabled={chatMode === 'queue'}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#382820] placeholder-[#a3948b] focus:border-[#059669] focus:outline-hidden disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || chatMode === 'queue'}
                className="w-9 h-9 rounded-xl bg-[#4e403b] hover:bg-[#372b27] disabled:opacity-30 text-[#fbf9f5] flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4 text-[#bae5d6]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
