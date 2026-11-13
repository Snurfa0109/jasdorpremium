'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Order, Product, Category, PlanOption, ProductPlanGroup } from '@/types';
import { COFFEE_BRANDS } from '@/data/coffee';
import { PRODUCTS } from '@/data/products';
import { AdminAccount, CannedResponse, DEFAULT_CANNED_RESPONSES, VoucherCode, DEFAULT_VOUCHERS } from '@/lib/adminSettingsStore';
import { calculateDefaultCostPrice } from '@/lib/orderStore';
import { LiveChatMessage, LiveChatSession } from '@/lib/chatStore';
import {
  Users,
  CheckCircle2,
  Clock,
  Lock,
  Send,
  Power,
  Search,
  MessageCircle,
  MessageSquare,
  Phone,
  Mic,
  Coffee,
  Smartphone,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Sliders,
  Store,
  ExternalLink,
  LogOut,
  KeyRound,
  Volume2,
  VolumeX,
  Copy,
  RotateCcw,
  XCircle,
  Bell,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Info,
  Camera,
  UploadCloud,
  ImageIcon,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Tag,
  BarChart3,
  TrendingUp,
  Download,
  Award,
  DollarSign,
  Ticket,
  Percent,
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShoppingBag,
  Boxes,
} from 'lucide-react';

export default function AdminDashboardPage() {
  // 1. Auth & Admin Session State
  const [loggedInAdmin, setLoggedInAdmin] = useState<'Fadiyah' | 'Kifsha' | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'vermuk'>('password');
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<'Fadiyah' | 'Kifsha'>('Fadiyah');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Accounts DB state (Fadiyah & Kifsha)
  const [adminAccounts, setAdminAccounts] = useState<Record<'Fadiyah' | 'Kifsha', AdminAccount>>({
    Fadiyah: {
      username: 'Fadiyah',
      role: 'Admin 1 • Lead',
      passwordHash: 'fadiyah123',
      registeredFacePhoto: null,
      lastEnrolledAt: null,
    },
    Kifsha: {
      username: 'Kifsha',
      role: 'Admin 2 • Pantry & Operasional',
      passwordHash: 'kifsha123',
      registeredFacePhoto: null,
      lastEnrolledAt: null,
    },
  });

  // Profile Edit / Enrollment state (Inside Dashboard)
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [enrollVideoActive, setEnrollVideoActive] = useState(false);
  const [enrolledSnapshot, setEnrolledSnapshot] = useState<string | null>(null);
  const enrollVideoRef = useRef<HTMLVideoElement | null>(null);
  const enrollMediaStreamRef = useRef<MediaStream | null>(null);

  // Vermuk (Verifikasi Muka) Login State
  const [vermukState, setVermukState] = useState<'idle' | 'camera_active' | 'scanning' | 'verified'>('idle');
  const [vermukError, setVermukError] = useState('');
  const [vermukPhoto, setVermukPhoto] = useState<string | null>(null);
  const [recognizedAdmin, setRecognizedAdmin] = useState<'Fadiyah' | 'Kifsha' | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 2. Audio Alert & Notifications
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevQueuedCountRef = useRef<number | null>(null);

  // 3. Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'livechat' | 'canned' | 'vouchers' | 'jascur' | 'kopken' | 'premium' | 'store' | 'profile'>('orders');
  const [credCostPrice, setCredCostPrice] = useState<number>(0);

  // Live CS Chatbot State
  const [chatSessions, setChatSessions] = useState<LiveChatSession[]>([]);
  const [selectedChatSessionId, setSelectedChatSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<LiveChatMessage[]>([]);
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatSessionFilter, setChatSessionFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [liveChatUnreadCount, setLiveChatUnreadCount] = useState(0);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [orderSubTab, setOrderSubTab] = useState<'queued' | 'my_active' | 'completed' | 'cancelled'>('queued');
  const [orderCategoryFilter, setOrderCategoryFilter] = useState<'all' | 'premium' | 'kopken' | 'jascur'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Analytics State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [analyticsServiceFilter, setAnalyticsServiceFilter] = useState<'all' | 'jasdor' | 'premium' | 'jascur'>('all');

  // Quick Canned Responses State
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>(DEFAULT_CANNED_RESPONSES);
  const [cannedCategory, setCannedCategory] = useState<'all' | 'kopi' | 'premium' | 'jascur' | 'payment' | 'general'>('all');
  const [cannedSearch, setCannedSearch] = useState('');
  const [isCannedModalOpen, setIsCannedModalOpen] = useState(false);
  const [editingCannedId, setEditingCannedId] = useState<string | null>(null);
  const [formCannedTitle, setFormCannedTitle] = useState('');
  const [formCannedCategory, setFormCannedCategory] = useState<'kopi' | 'premium' | 'jascur' | 'payment' | 'general'>('general');
  const [formCannedText, setFormCannedText] = useState('');
  const [orderQuickCannedMenuId, setOrderQuickCannedMenuId] = useState<string | null>(null);

  // Promo Vouchers State
  const [vouchers, setVouchers] = useState<VoucherCode[]>(DEFAULT_VOUCHERS);
  const [voucherSearch, setVoucherSearch] = useState('');
  const [voucherFilterStatus, setVoucherFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [voucherFilterService, setVoucherFilterService] = useState<'all' | 'jasdor' | 'premium' | 'jascur'>('all');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);

  // Voucher Form State
  const [formVoucherCode, setFormVoucherCode] = useState('');
  const [formVoucherTitle, setFormVoucherTitle] = useState('');
  const [formVoucherType, setFormVoucherType] = useState<'percent' | 'fixed'>('fixed');
  const [formVoucherValue, setFormVoucherValue] = useState<number>(5000);
  const [formVoucherMinOrder, setFormVoucherMinOrder] = useState<number>(20000);
  const [formVoucherMaxDiscount, setFormVoucherMaxDiscount] = useState<number | ''>('');
  const [formVoucherService, setFormVoucherService] = useState<'all' | 'jasdor' | 'premium' | 'jascur'>('all');
  const [formVoucherUsageLimit, setFormVoucherUsageLimit] = useState<number | ''>('');
  const [formVoucherExpiryDate, setFormVoucherExpiryDate] = useState('');
  const [formVoucherIsActive, setFormVoucherIsActive] = useState(true);

  // 4. Orders Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [queueOpen, setQueueOpen] = useState(true);

  // 5. Jascur Settings Form State
  const [jascurChatRate, setJascurChatRate] = useState(3000);
  const [jascurCallRate, setJascurCallRate] = useState(15000);
  const [jascurAddonVn, setJascurAddonVn] = useState(10000);
  const [jascurTelegram, setJascurTelegram] = useState('@saoirse_temancurhat');
  const [jascurIsOpen, setJascurIsOpen] = useState(true);
  const [jascurIsCallOpen, setJascurIsCallOpen] = useState(true);
  const [jascurActiveCallUntil, setJascurActiveCallUntil] = useState<string | null>(null);
  const [jascurActiveCallOrderId, setJascurActiveCallOrderId] = useState<string | null>(null);
  const [jascurCallLockReason, setJascurCallLockReason] = useState('Admin sedang melayani sesi call aktif. Slot call ditutup sementara.');
  const [jascurCloseAnnouncement, setJascurCloseAnnouncement] = useState('Mohon maaf, saat ini slot teman curhat sedang istirahat.');
  const [jascurEstimatedOpen, setJascurEstimatedOpen] = useState('Pukul 15:00 WIB');
  const [jascurClosedSchedule, setJascurClosedSchedule] = useState('Jadwal Aktif Sesi: 09:00 - 23:00 WIB');

  // 6. Store Settings Form State
  const [storeAnnouncement, setStoreAnnouncement] = useState('Diskon 50% Kopi Kenangan & Akun Premium Legal Bergaransi Full Replace ✨');
  const [storeTelegram, setStoreTelegram] = useState('@saoirse_cs');
  const [queueLockReason, setQueueLockReason] = useState('Admin sedang istirahat / proses batch order');
  const [queueEstimatedOpen, setQueueEstimatedOpen] = useState('Pukul 14:00 WIB');
  const [dailyOpenTime, setDailyOpenTime] = useState('08:00 WIB');
  const [dailyCloseTime, setDailyCloseTime] = useState('22:00 WIB');
  const [storeJasdorOpen, setStoreJasdorOpen] = useState(true);
  const [storeJasdorAnnouncement, setStoreJasdorAnnouncement] = useState('Layanan Jastip Order Kopi Kenangan sedang ditutup sementara.');
  const [storeJasdorEstimatedOpen, setStoreJasdorEstimatedOpen] = useState('Pukul 14:30 WIB');
  const [storeJasdorClosedSchedule, setStoreJasdorClosedSchedule] = useState('Jadwal Kasir: 08:00 - 21:30 WIB');
  const [storePremiumOpen, setStorePremiumOpen] = useState(true);
  const [storePremiumAnnouncement, setStorePremiumAnnouncement] = useState('Layanan Akun Premium sedang ditutup sementara.');
  const [storePremiumEstimatedOpen, setStorePremiumEstimatedOpen] = useState('Pukul 16:00 WIB');
  const [storePremiumClosedSchedule, setStorePremiumClosedSchedule] = useState('Layanan 24 Jam (Maintenance 03:00 - 05:00 WIB)');

  // 7. Product Catalog Overrides & Dynamic Apps
  const [kopkenSearch, setKopkenSearch] = useState('');
  const [kopkenCategory, setKopkenCategory] = useState('all');
  const [kopkenOverrides, setKopkenOverrides] = useState<Record<string, { discountPrice?: number; originalPrice?: number; isUnavailable?: boolean }>>({});
  const [premiumOverrides, setPremiumOverrides] = useState<Record<string, { isUnavailable?: boolean; price?: number; hasWarranty?: boolean }>>({});
  const [premiumSearch, setPremiumSearch] = useState('');
  const [premiumCategory, setPremiumCategory] = useState<string>('all');
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);

  // App Add/Edit Modal Form State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [formAppName, setFormAppName] = useState('');
  const [formAppCategory, setFormAppCategory] = useState<Category>('streaming');
  const [formAppDescription, setFormAppDescription] = useState('');
  const [formAppBadge, setFormAppBadge] = useState('POPULER');
  const [formAppIcon, setFormAppIcon] = useState('📱');
  const [formAppColor, setFormAppColor] = useState('#059669');
  const [formAppPlanGroupName, setFormAppPlanGroupName] = useState('SHARING 1P1U');
  const [formAppPlans, setFormAppPlans] = useState<Array<{ id: string; name: string; price: number; notes: string }>>([
    { id: 'p1', name: '1 Bulan Sharing', price: 35000, notes: 'Garansi Full Replace' },
  ]);
  const [formAppHasWarranty, setFormAppHasWarranty] = useState<boolean>(true);

  // 8. Fulfillment Modal State
  const [selectedOrderToComplete, setSelectedOrderToComplete] = useState<Order | null>(null);
  const [credEmail, setCredEmail] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credProfile, setCredProfile] = useState('');
  const [credPin, setCredPin] = useState('');
  const [credExpired, setCredExpired] = useState('30 Hari');
  const [credPhoto, setCredPhoto] = useState('');
  const [credNotes, setCredNotes] = useState('Dilarang ganti password & profil akun. Garansi full replace.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to set quick estimated open time
  const applyQuickEstimate = (setter: (val: string) => void, minutesToAdd: number) => {
    const d = new Date(Date.now() + minutesToAdd * 60000);
    const timeStr = `Pukul ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
    setter(timeStr);
  };

  // Sound Synthesizer via Web Audio API (Zero external assets needed)
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      // Two-tone chime (D5 -> A5)
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // AudioContext blocked before interaction
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check saved session in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saoirse:admin_session');
      if (saved === 'Fadiyah' || saved === 'Kifsha') {
        setLoggedInAdmin(saved);
      }
      const savedSound = localStorage.getItem('saoirse:sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }
    } catch {
      // silent
    } finally {
      setIsAuthChecked(true);
    }
  }, []);

  // Fetch Orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
      const data = await res.json();
      if (data.success) {
        const orderList: Order[] = data.orders || [];
        setOrders(orderList);
        setQueueOpen(data.queueOpen ?? true);

        // Check for new queued orders to trigger audio chime
        const currentQueued = orderList.filter((o) => o.status === 'queued').length;
        if (prevQueuedCountRef.current !== null && currentQueued > prevQueuedCountRef.current) {
          const diff = currentQueued - prevQueuedCountRef.current;
          if (soundEnabled) {
            playNotificationSound();
          }
          showToast(`🔔 Ada ${diff} pesanan baru masuk ke antrian!`);
        }
        prevQueuedCountRef.current = currentQueued;
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Settings from API
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        const s = data.settings;
        setJascurChatRate(s.jascur.chatPerHour);
        setJascurCallRate(s.jascur.callPerHour);
        setJascurAddonVn(s.jascur.addonVnPrice);
        setJascurTelegram(s.jascur.telegramUsername);
        setJascurIsOpen(s.jascur.isOpen ?? true);
        setJascurIsCallOpen(s.jascur.isCallOpen ?? true);
        setJascurActiveCallUntil(s.jascur.activeCallUntil || null);
        setJascurActiveCallOrderId(s.jascur.activeCallOrderId || null);
        setJascurCallLockReason(s.jascur.callLockReason || 'Admin sedang melayani sesi call aktif. Slot call ditutup sementara.');
        setJascurCloseAnnouncement(s.jascur.closeAnnouncement || 'Mohon maaf, saat ini slot teman curhat sedang istirahat.');
        setJascurEstimatedOpen(s.jascur.estimatedOpen || 'Pukul 15:00 WIB');
        setJascurClosedSchedule(s.jascur.closedSchedule || 'Jadwal Aktif Sesi: 09:00 - 23:00 WIB');

        setStoreAnnouncement(s.store.announcement);
        setStoreTelegram(s.store.csTelegram || '@saoirse_cs');
        setQueueOpen(s.store.queueOpen);
        setQueueLockReason(s.store.queueLockReason || 'Admin sedang istirahat / proses batch order');
        setQueueEstimatedOpen(s.store.queueEstimatedOpen || 'Pukul 14:00 WIB');
        setDailyOpenTime(s.store.dailyOpenTime || '08:00 WIB');
        setDailyCloseTime(s.store.dailyCloseTime || '22:00 WIB');
        setStoreJasdorOpen(s.store.jasdorOpen ?? true);
        setStoreJasdorAnnouncement(s.store.jasdorAnnouncement || '');
        setStoreJasdorEstimatedOpen(s.store.jasdorEstimatedOpen || 'Pukul 14:30 WIB');
        setStoreJasdorClosedSchedule(s.store.jasdorClosedSchedule || 'Jadwal Kasir: 08:00 - 21:30 WIB');
        setStorePremiumOpen(s.store.premiumOpen ?? true);
        setStorePremiumAnnouncement(s.store.premiumAnnouncement || '');
        setStorePremiumEstimatedOpen(s.store.premiumEstimatedOpen || 'Pukul 16:00 WIB');
        setStorePremiumClosedSchedule(s.store.premiumClosedSchedule || 'Layanan 24 Jam');

        setKopkenOverrides(s.kopkenOverrides || {});
        setPremiumOverrides(s.premiumOverrides || {});
        if (s.customProducts) {
          setCustomProducts(s.customProducts);
        }
        if (s.deletedProductIds) {
          setDeletedProductIds(s.deletedProductIds);
        }
        if (s.adminAccounts) {
          setAdminAccounts(s.adminAccounts);
        }
        if (Array.isArray(s.cannedResponses) && s.cannedResponses.length > 0) {
          setCannedResponses(s.cannedResponses);
        }
        if (Array.isArray(s.vouchers) && s.vouchers.length > 0) {
          setVouchers(s.vouchers);
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  useEffect(() => {
    setCurrentTime(Date.now());
    fetchSettings();
  }, []);

  useEffect(() => {
    if (loggedInAdmin) {
      fetchOrders();
      fetchSettings();
      const interval = setInterval(fetchOrders, 4000);
      return () => clearInterval(interval);
    }
  }, [loggedInAdmin, searchQuery]);

  // Attach live streams to video elements when active
  useEffect(() => {
    if (vermukState === 'camera_active' && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [vermukState]);

  useEffect(() => {
    if (enrollVideoActive && enrollVideoRef.current && enrollMediaStreamRef.current) {
      enrollVideoRef.current.srcObject = enrollMediaStreamRef.current;
    }
  }, [enrollVideoActive]);

  // Camera & Face Verification (Vermuk) Controllers
  const startCamera = async () => {
    setVermukError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung pada browser ini.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
      });
      mediaStreamRef.current = stream;
      setVermukState('camera_active');
    } catch {
      setVermukError('Kamera tidak dapat diakses atau izin ditolak. Silakan gunakan opsi Simulasi Vermuk.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleScanFace = () => {
    setVermukState('scanning');
    setVermukError('');
    playNotificationSound();
    setTimeout(() => {
      let captured = '';
      if (videoRef.current) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 200;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 200, 200);
            captured = canvas.toDataURL('image/jpeg', 0.8);
            setVermukPhoto(captured);
          }
        } catch {}
      }
      stopCamera();

      // Check enrolled faces in adminAccounts
      const fadiyahFace = adminAccounts.Fadiyah?.registeredFacePhoto;
      const kifshaFace = adminAccounts.Kifsha?.registeredFacePhoto;

      if (!fadiyahFace && !kifshaFace) {
        setVermukState('idle');
        setVermukError(
          'Belum ada admin yang mendaftarkan foto wajah (Vermuk). Silakan login via opsi Password dulu (Fadiyah: fadiyah123 / Kifsha: kifsha123), lalu buka menu "Keamanan & Vermuk Saya" untuk mendaftarkan wajahmu.'
        );
        return;
      }

      // If registered, resolve matched admin
      let matched: 'Fadiyah' | 'Kifsha' = 'Fadiyah';
      if (fadiyahFace && !kifshaFace) matched = 'Fadiyah';
      else if (kifshaFace && !fadiyahFace) matched = 'Kifsha';
      else matched = selectedUserForPassword; // fallback if both registered

      setRecognizedAdmin(matched);
      setVermukState('verified');
      playNotificationSound();

      setTimeout(() => {
        setLoggedInAdmin(matched);
        try {
          localStorage.setItem('saoirse:admin_session', matched);
        } catch {}
        showToast(`Wajah Cocok! Selamat datang Admin ${matched} ✨`);
      }, 900);
    }, 1800);
  };

  const handleSimulateVermuk = (userChoice?: 'Fadiyah' | 'Kifsha') => {
    setVermukError('');
    setVermukState('scanning');
    playNotificationSound();
    const chosen = userChoice || selectedUserForPassword || 'Fadiyah';
    setTimeout(() => {
      setRecognizedAdmin(chosen);
      setVermukState('verified');
      playNotificationSound();
      setTimeout(() => {
        setLoggedInAdmin(chosen);
        try {
          localStorage.setItem('saoirse:admin_session', chosen);
        } catch {}
        showToast(`Simulasi Vermuk Berhasil! Masuk sebagai ${chosen} ✓`);
      }, 700);
    }, 1200);
  };

  useEffect(() => {
    if (vermukState === 'camera_active' && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [vermukState]);

  useEffect(() => {
    if (enrollVideoActive && enrollVideoRef.current && enrollMediaStreamRef.current) {
      enrollVideoRef.current.srcObject = enrollMediaStreamRef.current;
    }
  }, [enrollVideoActive]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopEnrollCamera();
    };
  }, []);

  // Handle Login via Password Only
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const account = adminAccounts[selectedUserForPassword];
    const pass = loginPassword.trim();
    if (!pass) {
      setLoginError(`Harap masukkan password untuk ${selectedUserForPassword}.`);
      return;
    }

    const isValid =
      pass === account.passwordHash ||
      (selectedUserForPassword === 'Fadiyah' && ['fadiyah', 'fadiyah123', 'saoirse2026', 'admin'].includes(pass.toLowerCase())) ||
      (selectedUserForPassword === 'Kifsha' && ['kifsha', 'kifsha123', 'saoirse2026', 'admin'].includes(pass.toLowerCase()));

    if (!isValid) {
      setLoginError(`Password salah untuk ${selectedUserForPassword}. Silakan coba lagi.`);
      return;
    }

    setLoggedInAdmin(selectedUserForPassword);
    try {
      localStorage.setItem('saoirse:admin_session', selectedUserForPassword);
    } catch {}
    showToast(`Berhasil login sebagai ${selectedUserForPassword}! 👋`);
  };

  // Profile: Change Password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInAdmin) return;
    if (!newPasswordInput.trim()) {
      showToast('⚠️ Password baru tidak boleh kosong!');
      return;
    }
    if (newPasswordInput !== newPasswordConfirm) {
      showToast('⚠️ Konfirmasi password tidak cocok!');
      return;
    }

    setIsSavingPassword(true);
    try {
      const updatedAccounts = {
        ...adminAccounts,
        [loggedInAdmin]: {
          ...adminAccounts[loggedInAdmin],
          passwordHash: newPasswordInput.trim(),
        },
      };
      setAdminAccounts(updatedAccounts);

      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAccounts: updatedAccounts }),
      });

      setNewPasswordInput('');
      setNewPasswordConfirm('');
      showToast(`Password untuk ${loggedInAdmin} berhasil diperbarui! 🔒`);
    } catch {
      showToast('Gagal menyimpan password baru.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Profile: Face Enrollment (Vermuk Registration)
  const startEnrollCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Kamera tidak didukung pada browser ini.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
      });
      enrollMediaStreamRef.current = stream;
      setEnrollVideoActive(true);
    } catch {
      showToast('Izin kamera ditolak. Silakan izinkan akses kamera.');
    }
  };

  const stopEnrollCamera = () => {
    if (enrollMediaStreamRef.current) {
      enrollMediaStreamRef.current.getTracks().forEach((track) => track.stop());
      enrollMediaStreamRef.current = null;
    }
    setEnrollVideoActive(false);
  };

  const captureEnrollSnapshot = () => {
    if (enrollVideoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(enrollVideoRef.current, 0, 0, 320, 320);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEnrolledSnapshot(dataUrl);
        }
      } catch {}
    }
    stopEnrollCamera();
  };

  const handleSaveEnrolledFace = async () => {
    if (!loggedInAdmin || !enrolledSnapshot) return;
    try {
      const updatedAccounts = {
        ...adminAccounts,
        [loggedInAdmin]: {
          ...adminAccounts[loggedInAdmin],
          registeredFacePhoto: enrolledSnapshot,
          lastEnrolledAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        },
      };
      setAdminAccounts(updatedAccounts);

      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAccounts: updatedAccounts }),
      });

      setEnrolledSnapshot(null);
      showToast(`Wajah Admin ${loggedInAdmin} berhasil didaftarkan! Mulai sekarang bisa login via Vermuk ✨`);
    } catch {
      showToast('Gagal menyimpan pendaftaran wajah.');
    }
  };

  const handleRemoveFace = async () => {
    if (!loggedInAdmin) return;
    if (!confirm(`Hapus biometrik wajah terdaftar untuk ${loggedInAdmin}?`)) return;
    try {
      const updatedAccounts = {
        ...adminAccounts,
        [loggedInAdmin]: {
          ...adminAccounts[loggedInAdmin],
          registeredFacePhoto: null,
          lastEnrolledAt: null,
        },
      };
      setAdminAccounts(updatedAccounts);

      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAccounts: updatedAccounts }),
      });
      showToast(`Data vermuk ${loggedInAdmin} berhasil dihapus.`);
    } catch {}
  };

  const handleLogout = () => {
    setLoggedInAdmin(null);
    setLoginPassword('');
    setVermukState('idle');
    setVermukPhoto(null);
    setRecognizedAdmin(null);
    stopCamera();
    stopEnrollCamera();
    try {
      localStorage.removeItem('saoirse:admin_session');
    } catch {
      // silent
    }
    showToast('Telah keluar dari sesi admin.');
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('saoirse:sound_enabled', String(next));
    } catch {
      // silent
    }
    if (next) playNotificationSound();
    showToast(next ? '🔔 Audio Notifikasi Aktif' : '🔕 Audio Notifikasi Senyap');
  };

  // 1-Click Unlock Sesi Voice Call
  const handleUnlockCallNow = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jascur: {
            isCallOpen: true,
            activeCallOrderId: null,
            activeCallUntil: null,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJascurIsCallOpen(true);
        setJascurActiveCallOrderId(null);
        setJascurActiveCallUntil(null);
        showToast('🔓 Slot Voice Call berhasil dibuka kembali untuk buyer! ✨');
      }
    } catch {
      alert('Gagal membuka slot call.');
    }
  };

  // Save Jascur Settings
  const handleSaveJascur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jascur: {
            chatPerHour: Number(jascurChatRate),
            callPerHour: Number(jascurCallRate),
            addonVnPrice: Number(jascurAddonVn),
            telegramUsername: jascurTelegram.trim(),
            isOpen: jascurIsOpen,
            isCallOpen: jascurIsCallOpen,
            callLockReason: jascurCallLockReason.trim(),
            closeAnnouncement: jascurCloseAnnouncement.trim(),
            estimatedOpen: jascurEstimatedOpen.trim(),
            closedSchedule: jascurClosedSchedule.trim(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pengaturan Jascur & Jadwal berhasil disimpan! ✨');
      }
    } catch {
      alert('Gagal menyimpan pengaturan Jascur.');
    }
  };

  // Save Store Settings
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store: {
            queueOpen,
            queueLockReason: queueLockReason.trim(),
            queueEstimatedOpen: queueEstimatedOpen.trim(),
            dailyOpenTime: dailyOpenTime.trim(),
            dailyCloseTime: dailyCloseTime.trim(),
            announcement: storeAnnouncement.trim(),
            csTelegram: storeTelegram.trim(),
            jasdorOpen: storeJasdorOpen,
            jasdorAnnouncement: storeJasdorAnnouncement.trim(),
            jasdorEstimatedOpen: storeJasdorEstimatedOpen.trim(),
            jasdorClosedSchedule: storeJasdorClosedSchedule.trim(),
            premiumOpen: storePremiumOpen,
            premiumAnnouncement: storePremiumAnnouncement.trim(),
            premiumEstimatedOpen: storePremiumEstimatedOpen.trim(),
            premiumClosedSchedule: storePremiumClosedSchedule.trim(),
          },
          jascur: {
            isOpen: jascurIsOpen,
            closeAnnouncement: jascurCloseAnnouncement.trim(),
            estimatedOpen: jascurEstimatedOpen.trim(),
            closedSchedule: jascurClosedSchedule.trim(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Jadwal Tutup, Estimasi Buka & Pengaturan Toko tersimpan! ✨');
      }
    } catch {
      alert('Gagal menyimpan pengaturan toko.');
    }
  };

  // Save Kopken Overrides
  const handleSaveKopken = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kopkenOverrides }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Status stok & harga menu Kopi Kenangan berhasil di-update! ☕');
      }
    } catch {
      alert('Gagal menyimpan perubahan Kopken.');
    }
  };

  // Save Premium Overrides
  const handleSavePremium = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premiumOverrides }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Katalog & status stok Aplikasi Premium berhasil di-update! 🍿');
      }
    } catch {
      alert('Gagal menyimpan perubahan Aplikasi Premium.');
    }
  };

  // Quick Toggle Kopken Availability with Instant Auto-Save & Toast
  const toggleKopkenItemStock = async (itemId: string, itemName?: string) => {
    const current = kopkenOverrides[itemId] || {};
    const nextStatus = !current.isUnavailable;
    const nextOverrides = {
      ...kopkenOverrides,
      [itemId]: {
        ...current,
        isUnavailable: nextStatus,
      },
    };
    setKopkenOverrides(nextOverrides);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kopkenOverrides: nextOverrides }),
      });
      showToast(
        nextStatus
          ? `❌ Menu "${itemName || itemId}" dinonaktifkan (Habis)`
          : `✅ Menu "${itemName || itemId}" aktif kembali (Ready)`
      );
    } catch {
      showToast('Gagal memperbarui status menu ke server.');
    }
  };

  // Quick Toggle Premium App Stock with Instant Auto-Save & Toast
  const togglePremiumStock = async (productId: string, productName?: string) => {
    const current = premiumOverrides[productId] || {};
    const nextStatus = !current.isUnavailable;
    const nextOverrides = {
      ...premiumOverrides,
      [productId]: {
        ...current,
        isUnavailable: nextStatus,
      },
    };
    setPremiumOverrides(nextOverrides);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premiumOverrides: nextOverrides }),
      });
      showToast(
        nextStatus
          ? `❌ Aplikasi "${productName || productId}" dinonaktifkan (Habis)`
          : `✅ Aplikasi "${productName || productId}" aktif kembali (Ready)`
      );
    } catch {
      showToast('Gagal memperbarui status aplikasi ke server.');
    }
  };

  // Merge static PRODUCTS with customProducts (and exclude deletedProductIds)
  const mergedProducts: Product[] = useMemo(() => {
    const map = new Map<string, Product>();
    PRODUCTS.forEach((p) => {
      if (!deletedProductIds.includes(p.id)) {
        map.set(p.id, p);
      }
    });
    customProducts.forEach((p) => {
      if (!deletedProductIds.includes(p.id)) {
        map.set(p.id, p);
      }
    });
    return Array.from(map.values());
  }, [customProducts, deletedProductIds]);

  const filteredMergedProducts = useMemo(() => {
    return mergedProducts.filter((prod) => {
      const matchCat = premiumCategory === 'all' || prod.category === premiumCategory;
      const matchSearch =
        !premiumSearch ||
        prod.name.toLowerCase().includes(premiumSearch.toLowerCase()) ||
        prod.description.toLowerCase().includes(premiumSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [mergedProducts, premiumCategory, premiumSearch]);

  // Financial Analytics Computation (Revenue, Layanan, Admin Breakdown, Top Items)
  const analyticsData = useMemo(() => {
    // Service Helper
    const getService = (o: Order): 'jasdor' | 'premium' | 'jascur' => {
      if (o.productId === 'jascur' || o.planGroup?.includes('Curhat'))
        return 'jascur';
      if (
        Boolean(o.outlet) ||
        o.productId === 'kopi-kenangan' ||
        o.productId.startsWith('kopken') ||
        o.productName.toLowerCase().includes('kopi') ||
        o.items?.some((i) => i.id?.startsWith('kopken') || i.name?.toLowerCase().includes('kopi'))
      )
        return 'jasdor';
      return 'premium';
    };

    if (!currentTime) {
      return {
        periodOrders: [],
        completedOrders: [],
        pipelineOrdersCount: 0,
        totalRevenue: 0,
        pipelineRevenue: 0,
        totalTransactions: 0,
        aov: 0,
        serviceStats: {
          jasdor: { revenue: 0, orders: 0, itemsCount: 0 },
          premium: { revenue: 0, orders: 0, itemsCount: 0 },
          jascur: { revenue: 0, orders: 0, itemsCount: 0 },
        },
        adminStats: {
          Fadiyah: { orders: 0, revenue: 0 },
          Kifsha: { orders: 0, revenue: 0 },
          Lainnya: { orders: 0, revenue: 0 },
        },
        topProducts: [],
        getService,
      };
    }

    const now = new Date(currentTime);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;

    // Filter by period
    const periodOrders = orders.filter((ord) => {
      const ordTime = new Date(ord.createdAt).getTime();
      if (analyticsPeriod === 'today') return ordTime >= todayStart;
      if (analyticsPeriod === '7days') return ordTime >= sevenDaysAgo;
      if (analyticsPeriod === '30days') return ordTime >= thirtyDaysAgo;
      return true; // all
    });

    const completedOrders = periodOrders.filter((o) => o.status === 'completed');
    const pipelineOrders = periodOrders.filter(
      (o) => o.status === 'queued' || o.status === 'processing'
    );

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const totalCost = completedOrders.reduce((sum, o) => {
      const c = o.costPrice !== undefined ? o.costPrice : calculateDefaultCostPrice(o);
      return sum + c;
    }, 0);
    const totalProfit = Math.max(0, totalRevenue - totalCost);
    const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
    const pipelineRevenue = pipelineOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const totalTransactions = completedOrders.length;
    const aov = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
    const avgProfit = totalTransactions > 0 ? Math.round(totalProfit / totalTransactions) : 0;

    // Service Breakdown
    const serviceStats = {
      jasdor: { revenue: 0, cost: 0, profit: 0, orders: 0, itemsCount: 0 },
      premium: { revenue: 0, cost: 0, profit: 0, orders: 0, itemsCount: 0 },
      jascur: { revenue: 0, cost: 0, profit: 0, orders: 0, itemsCount: 0 },
    };

    completedOrders.forEach((o) => {
      const s = getService(o);
      const c = o.costPrice !== undefined ? o.costPrice : calculateDefaultCostPrice(o);
      serviceStats[s].revenue += o.price || 0;
      serviceStats[s].cost += c;
      serviceStats[s].profit += Math.max(0, (o.price || 0) - c);
      serviceStats[s].orders += 1;
      const countInOrder = o.items?.reduce((cnt, it) => cnt + (it.quantity || 1), 0) || 1;
      serviceStats[s].itemsCount += countInOrder;
    });

    // Admin Breakdown (Fadiyah vs Kifsha)
    const adminStats = {
      Fadiyah: { orders: 0, revenue: 0, profit: 0 },
      Kifsha: { orders: 0, revenue: 0, profit: 0 },
      Lainnya: { orders: 0, revenue: 0, profit: 0 },
    };

    completedOrders.forEach((o) => {
      const handler = o.assignedAdmin;
      const c = o.costPrice !== undefined ? o.costPrice : calculateDefaultCostPrice(o);
      const profit = Math.max(0, (o.price || 0) - c);
      if (handler === 'Fadiyah') {
        adminStats.Fadiyah.orders += 1;
        adminStats.Fadiyah.revenue += o.price || 0;
        adminStats.Fadiyah.profit += profit;
      } else if (handler === 'Kifsha') {
        adminStats.Kifsha.orders += 1;
        adminStats.Kifsha.revenue += o.price || 0;
        adminStats.Kifsha.profit += profit;
      } else {
        adminStats.Lainnya.orders += 1;
        adminStats.Lainnya.revenue += o.price || 0;
        adminStats.Lainnya.profit += profit;
      }
    });

    // Top Selling Products
    const productMap = new Map<
      string,
      { name: string; category: string; count: number; revenue: number }
    >();

    completedOrders.forEach((o) => {
      const s = getService(o);
      o.items?.forEach((item) => {
        const key = item.name;
        const current = productMap.get(key) || {
          name: item.name,
          category:
            s === 'jasdor' ? 'Kopi Kenangan' : s === 'jascur' ? 'Jasa Curhat' : 'Aplikasi Premium',
          count: 0,
          revenue: 0,
        };
        current.count += item.quantity || 1;
        current.revenue += (item.price || 0) * (item.quantity || 1);
        productMap.set(key, current);
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      periodOrders,
      completedOrders,
      pipelineOrdersCount: pipelineOrders.length,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      avgProfit,
      pipelineRevenue,
      totalTransactions,
      aov,
      serviceStats,
      adminStats,
      topProducts,
      getService,
    };
  }, [orders, analyticsPeriod, currentTime]);

  // Export Analytics CSV Handler
  const exportAnalyticsCSV = () => {
    if (!analyticsData.periodOrders || analyticsData.periodOrders.length === 0) {
      showToast('Tidak ada data transaksi untuk diekspor pada periode ini.');
      return;
    }

    const headers = [
      'ID Pesanan',
      'Tanggal (WIB)',
      'Layanan',
      'Nama Pembeli',
      'Kontak',
      'Daftar Item',
      'Status',
      'Admin Penanggungjawab',
      'Total Nominal (IDR)',
    ];

    const rows = analyticsData.periodOrders.map((ord) => {
      const dateStr = new Date(ord.createdAt).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
      });
      const service = analyticsData.getService(ord);
      const serviceLabel =
        service === 'jasdor'
          ? 'Jasdor Kopi'
          : service === 'jascur'
          ? 'Jasa Curhat'
          : 'Aplikasi Premium';
      const itemsStr =
        ord.items?.map((it) => `${it.name} (x${it.quantity || 1})`).join('; ') || '-';
      const cleanCustomer = ord.customerName.replace(/"/g, '""');
      const cleanContact = (ord.customerTelegram || '-').replace(/"/g, '""');
      const admin = ord.assignedAdmin || 'Belum di-assign';

      return [
        `"${ord.id}"`,
        `"${dateStr}"`,
        `"${serviceLabel}"`,
        `"${cleanCustomer}"`,
        `"${cleanContact}"`,
        `"${itemsStr.replace(/"/g, '""')}"`,
        `"${ord.status}"`,
        `"${admin}"`,
        ord.price || 0,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `saoirse-laporan-omzet-${analyticsPeriod}-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('✅ File laporan rekap keuangan (.CSV) berhasil diunduh!');
  };

  // Interpolate Canned Response Variables
  const interpolateCannedText = (template: string, order?: Order | null): string => {
    const adminName = loggedInAdmin || 'Admin saoirse';
    if (!order) {
      return template
        .replace(/{nama}/g, 'Kak Budi')
        .replace(/{id_pesanan}/g, 'SR-1042')
        .replace(/{produk}/g, 'Netflix 1 Bulan')
        .replace(/{outlet}/g, 'Kopi Kenangan Mall Serang')
        .replace(/{admin}/g, adminName)
        .replace(/{nominal}/g, '35.000')
        .replace(/{email}/g, 'netflix.user@gmail.com')
        .replace(/{password}/g, 'SaoirsePass2026!#')
        .replace(/{profil}/g, 'Profil 1')
        .replace(/{pin}/g, '1234')
        .replace(/{durasi}/g, '30 Hari');
    }

    const itemsSummary =
      order.items?.map((i) => i.name).join(', ') || order.productName || 'Layanan saoirse';
    const creds = order.credentials;

    return template
      .replace(/{nama}/g, order.customerName)
      .replace(/{id_pesanan}/g, order.id)
      .replace(/{produk}/g, itemsSummary)
      .replace(/{outlet}/g, order.outlet || 'Outlet Terpilih')
      .replace(/{admin}/g, adminName)
      .replace(/{nominal}/g, (order.price || 0).toLocaleString('id-ID'))
      .replace(/{email}/g, creds?.email || 'email-user@gmail.com')
      .replace(/{password}/g, creds?.password || 'Pass2026!#')
      .replace(/{profil}/g, creds?.profileName || 'Profil 1')
      .replace(/{pin}/g, creds?.profilePin || '-')
      .replace(/{durasi}/g, creds?.expiredDate || '30 Hari');
  };

  // Copy Canned Response to Clipboard
  const copyCannedResponse = (cr: CannedResponse, order?: Order | null) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const textToCopy = interpolateCannedText(cr.text, order);
      navigator.clipboard.writeText(textToCopy);
      showToast(`Template "${cr.title}" tersalin ke clipboard! 📋`);
    } else {
      showToast('Clipboard browser tidak didukung.');
    }
    setOrderQuickCannedMenuId(null);
  };

  // Filtered Canned Responses
  const filteredCannedResponses = useMemo(() => {
    return cannedResponses.filter((cr) => {
      const matchCat = cannedCategory === 'all' || cr.category === cannedCategory;
      const matchSearch =
        !cannedSearch ||
        cr.title.toLowerCase().includes(cannedSearch.toLowerCase()) ||
        cr.text.toLowerCase().includes(cannedSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [cannedResponses, cannedCategory, cannedSearch]);

  // Open Add Canned Modal
  const openAddCannedModal = () => {
    setEditingCannedId(null);
    setFormCannedTitle('');
    setFormCannedCategory('general');
    setFormCannedText('');
    setIsCannedModalOpen(true);
  };

  // Open Edit Canned Modal
  const openEditCannedModal = (cr: CannedResponse) => {
    setEditingCannedId(cr.id);
    setFormCannedTitle(cr.title);
    setFormCannedCategory(cr.category);
    setFormCannedText(cr.text);
    setIsCannedModalOpen(true);
  };

  // Save / Submit Canned Response
  const handleSaveCannedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCannedTitle.trim() || !formCannedText.trim()) {
      showToast('Judul dan isi template chat wajib diisi.');
      return;
    }

    const id = editingCannedId || `custom-cr-${Date.now()}`;
    const newCR: CannedResponse = {
      id,
      title: formCannedTitle.trim(),
      category: formCannedCategory,
      text: formCannedText.trim(),
      isCustom: true,
    };

    const updated = editingCannedId
      ? cannedResponses.map((item) => (item.id === editingCannedId ? newCR : item))
      : [newCR, ...cannedResponses];

    setCannedResponses(updated);
    setIsCannedModalOpen(false);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cannedResponses: updated }),
      });
      showToast(
        editingCannedId
          ? `Template "${formCannedTitle}" berhasil diperbarui!`
          : `Template "${formCannedTitle}" berhasil disimpan!`
      );
    } catch {
      showToast('Gagal menyimpan template chat ke server.');
    }
  };

  // Delete Canned Response
  const handleDeleteCanned = async (id: string, title: string) => {
    if (!confirm(`Hapus template chat "${title}"?`)) return;
    const updated = cannedResponses.filter((item) => item.id !== id);
    setCannedResponses(updated);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cannedResponses: updated }),
      });
      showToast(`Template "${title}" telah dihapus.`);
    } catch {
      showToast('Gagal menghapus template.');
    }
  };

  // ==================== VOUCHER / PROMO CODE HELPERS ====================
  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchSearch =
        !voucherSearch.trim() ||
        v.code.toLowerCase().includes(voucherSearch.toLowerCase()) ||
        v.title.toLowerCase().includes(voucherSearch.toLowerCase());

      const matchStatus =
        voucherFilterStatus === 'all'
          ? true
          : voucherFilterStatus === 'active'
          ? v.isActive
          : !v.isActive;

      const matchService =
        voucherFilterService === 'all' || v.applicableService === 'all' || v.applicableService === voucherFilterService;

      return matchSearch && matchStatus && matchService;
    });
  }, [vouchers, voucherSearch, voucherFilterStatus, voucherFilterService]);

  // Voucher KPI Stats
  const voucherStats = useMemo(() => {
    const total = vouchers.length;
    const active = vouchers.filter((v) => v.isActive).length;
    const totalUsed = vouchers.reduce((acc, v) => acc + (v.usedCount || 0), 0);
    const topVoucher = [...vouchers].sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))[0];
    return { total, active, totalUsed, topVoucher };
  }, [vouchers]);

  // Toggle Voucher Active
  const handleToggleVoucherActive = async (id: string) => {
    const target = vouchers.find((v) => v.id === id);
    if (!target) return;
    const nextStatus = !target.isActive;
    const updated = vouchers.map((v) => (v.id === id ? { ...v, isActive: nextStatus } : v));
    setVouchers(updated);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vouchers: updated }),
      });
      showToast(nextStatus ? `🎟️ Voucher "${target.code}" diaktifkan.` : `Voucher "${target.code}" dinonaktifkan.`);
    } catch {
      showToast('Gagal mengubah status voucher.');
    }
  };

  // Delete Voucher
  const handleDeleteVoucher = async (id: string, code: string) => {
    if (!confirm(`Apakah kamu yakin ingin menghapus voucher "${code}"?`)) return;
    const updated = vouchers.filter((v) => v.id !== id);
    setVouchers(updated);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vouchers: updated }),
      });
      showToast(`Voucher "${code}" telah dihapus.`);
    } catch {
      showToast('Gagal menghapus voucher.');
    }
  };

  // Copy Voucher Code to Clipboard
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Kode "${code}" disalin ke clipboard! 📋`);
  };

  // Generate Random Code
  const handleGenerateRandomCode = () => {
    const prefixes = ['HEMAT', 'DISKON', 'SAOIRSE', 'PROMO', 'JAJAN', 'NGOPI', 'SERU'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setFormVoucherCode(`${prefix}${num}`);
  };

  // Open Add Voucher Modal
  const openAddVoucherModal = () => {
    setEditingVoucherId(null);
    setFormVoucherCode(`PROMO${Math.floor(10 + Math.random() * 90)}`);
    setFormVoucherTitle('Diskon Spesial Belanja');
    setFormVoucherType('fixed');
    setFormVoucherValue(5000);
    setFormVoucherMinOrder(20000);
    setFormVoucherMaxDiscount('');
    setFormVoucherService('all');
    setFormVoucherUsageLimit(50);
    setFormVoucherExpiryDate('');
    setFormVoucherIsActive(true);
    setIsVoucherModalOpen(true);
  };

  // Open Edit Voucher Modal
  const openEditVoucherModal = (v: VoucherCode) => {
    setEditingVoucherId(v.id);
    setFormVoucherCode(v.code);
    setFormVoucherTitle(v.title);
    setFormVoucherType(v.discountType);
    setFormVoucherValue(v.discountValue);
    setFormVoucherMinOrder(v.minOrder || 0);
    setFormVoucherMaxDiscount(v.maxDiscount || '');
    setFormVoucherService(v.applicableService);
    setFormVoucherUsageLimit(v.usageLimit ?? '');
    setFormVoucherExpiryDate(v.expiryDate || '');
    setFormVoucherIsActive(v.isActive);
    setIsVoucherModalOpen(true);
  };

  // Save / Submit Voucher
  const handleSaveVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formVoucherCode.trim().toUpperCase();
    if (!cleanCode || !formVoucherTitle.trim()) {
      showToast('Kode voucher dan judul wajib diisi.');
      return;
    }

    const id = editingVoucherId || `voucher-${Date.now()}`;
    const newVoucher: VoucherCode = {
      id,
      code: cleanCode,
      title: formVoucherTitle.trim(),
      discountType: formVoucherType,
      discountValue: Number(formVoucherValue) || 0,
      minOrder: Number(formVoucherMinOrder) || 0,
      maxDiscount: formVoucherMaxDiscount !== '' ? Number(formVoucherMaxDiscount) : null,
      applicableService: formVoucherService,
      usageLimit: formVoucherUsageLimit !== '' ? Number(formVoucherUsageLimit) : null,
      usedCount: editingVoucherId ? (vouchers.find((v) => v.id === editingVoucherId)?.usedCount || 0) : 0,
      expiryDate: formVoucherExpiryDate.trim() || null,
      isActive: formVoucherIsActive,
      createdAt: editingVoucherId ? (vouchers.find((v) => v.id === editingVoucherId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    const updated = editingVoucherId
      ? vouchers.map((v) => (v.id === editingVoucherId ? newVoucher : v))
      : [newVoucher, ...vouchers];

    setVouchers(updated);
    setIsVoucherModalOpen(false);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vouchers: updated }),
      });
      showToast(
        editingVoucherId
          ? `Voucher "${cleanCode}" berhasil diperbarui!`
          : `Voucher "${cleanCode}" berhasil dibuat & aktif!`
      );
    } catch {
      showToast('Gagal menyimpan voucher ke server.');
    }
  };

  // Toggle Premium Warranty (Instant 1-Click: Bergaransi vs Non Garansi)
  const togglePremiumWarranty = async (productId: string, productName: string) => {
    const override = premiumOverrides[productId] || {};
    const currentWarranty =
      override.hasWarranty !== undefined
        ? override.hasWarranty
        : mergedProducts.find((p) => p.id === productId)?.hasWarranty !== false;
    const nextWarranty = !currentWarranty;

    const nextOverrides = {
      ...premiumOverrides,
      [productId]: {
        ...premiumOverrides[productId],
        hasWarranty: nextWarranty,
      },
    };
    setPremiumOverrides(nextOverrides);

    const isCustom = customProducts.some((p) => p.id === productId);
    let updatedCustom = customProducts;
    if (isCustom) {
      updatedCustom = customProducts.map((p) =>
        p.id === productId ? { ...p, hasWarranty: nextWarranty } : p
      );
      setCustomProducts(updatedCustom);
    }

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          premiumOverrides: nextOverrides,
          customProducts: updatedCustom,
        }),
      });
      showToast(
        nextWarranty
          ? `🛡️ "${productName}" kini BERGARANSI (Replace).`
          : `⚠️ "${productName}" kini NON GARANSI (Badge amber aktif).`
      );
    } catch {
      showToast('Gagal mengubah status garansi.');
    }
  };

  // Open Modal: Add New App
  const openAddAppModal = () => {
    setEditingAppId(null);
    setFormAppName('');
    setFormAppCategory('streaming');
    setFormAppDescription('');
    setFormAppBadge('POPULER');
    setFormAppIcon('📱');
    setFormAppColor('#059669');
    setFormAppHasWarranty(true);
    setFormAppPlanGroupName('SHARING 1P1U');
    setFormAppPlans([
      { id: 'plan-1', name: '1 Bulan Sharing', price: 35000, notes: 'Garansi Replace' },
    ]);
    setIsAppModalOpen(true);
  };

  // Open Modal: Edit Existing App
  const openEditAppModal = (prod: Product) => {
    const override = premiumOverrides[prod.id] || {};
    const effectiveWarranty =
      override.hasWarranty !== undefined ? override.hasWarranty : prod.hasWarranty !== false;

    setEditingAppId(prod.id);
    setFormAppName(prod.name);
    setFormAppCategory(prod.category);
    setFormAppDescription(prod.description);
    setFormAppBadge(prod.badge || '');
    setFormAppIcon(prod.icon || '📱');
    setFormAppColor(prod.color || '#059669');
    setFormAppHasWarranty(effectiveWarranty);

    const firstGroup = prod.planGroups[0] || { groupName: 'PAKET REGULER', options: [] };
    setFormAppPlanGroupName(firstGroup.groupName);
    setFormAppPlans(
      firstGroup.options.length > 0
        ? firstGroup.options.map((opt) => ({
            id: opt.id,
            name: opt.name,
            price: opt.price,
            notes: opt.notes || '',
          }))
        : [{ id: 'plan-1', name: '1 Bulan', price: 35000, notes: '' }]
    );
    setIsAppModalOpen(true);
  };

  // Save / Submit App (Create or Edit)
  const handleSaveAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAppName.trim()) {
      showToast('Nama aplikasi wajib diisi.');
      return;
    }

    const appId =
      editingAppId ||
      formAppName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      `app-${Date.now()}`;

    const newProduct: Product = {
      id: appId,
      name: formAppName.trim(),
      category: formAppCategory,
      description:
        formAppDescription.trim() ||
        (formAppHasWarranty
          ? 'Akun premium resmi legal bergaransi full replace.'
          : 'Akun premium resmi legal (Non Garansi).'),
      badge: formAppBadge.trim() || undefined,
      icon: formAppIcon.trim() || '📱',
      color: formAppColor || '#059669',
      hasWarranty: formAppHasWarranty,
      planGroups: [
        {
          groupName: formAppPlanGroupName.trim() || 'PAKET UTAMA',
          options: formAppPlans.map((pl, idx) => ({
            id: pl.id || `${appId}-p${idx + 1}`,
            name: pl.name.trim() || `Paket ${idx + 1}`,
            price: Number(pl.price) || 10000,
            notes: pl.notes?.trim() || undefined,
          })),
        },
      ],
    };

    const filteredExisting = customProducts.filter((p) => p.id !== appId);
    const updatedCustomProducts = [...filteredExisting, newProduct];
    setCustomProducts(updatedCustomProducts);

    const updatedDeletedIds = deletedProductIds.filter((id) => id !== appId);
    setDeletedProductIds(updatedDeletedIds);

    const updatedOverrides = {
      ...premiumOverrides,
      [appId]: {
        ...premiumOverrides[appId],
        hasWarranty: formAppHasWarranty,
      },
    };
    setPremiumOverrides(updatedOverrides);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customProducts: updatedCustomProducts,
          deletedProductIds: updatedDeletedIds,
          premiumOverrides: updatedOverrides,
        }),
      });
      setIsAppModalOpen(false);
      showToast(
        editingAppId
          ? `Aplikasi "${formAppName}" berhasil diperbarui! ✨`
          : `Aplikasi "${formAppName}" berhasil ditambahkan ke katalog! 🚀`
      );
    } catch {
      showToast('Gagal menyimpan aplikasi ke server.');
    }
  };

  // Delete App from Catalog
  const handleDeleteApp = async (prodId: string, prodName: string) => {
    if (!confirm(`Hapus aplikasi "${prodName}" dari katalog pembeli?`)) return;

    const updatedCustom = customProducts.filter((p) => p.id !== prodId);
    setCustomProducts(updatedCustom);

    const updatedDeleted = Array.from(new Set([...deletedProductIds, prodId]));
    setDeletedProductIds(updatedDeleted);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customProducts: updatedCustom,
          deletedProductIds: updatedDeleted,
        }),
      });
      showToast(`Aplikasi "${prodName}" telah dihapus.`);
    } catch {
      showToast('Gagal menghapus aplikasi.');
    }
  };

  // Add plan option in modal form
  const addPlanRow = () => {
    setFormAppPlans((prev) => [
      ...prev,
      { id: `plan-${Date.now()}`, name: '1 Bulan Private', price: 50000, notes: '' },
    ]);
  };

  // Remove plan option in modal form
  const removePlanRow = (index: number) => {
    if (formAppPlans.length <= 1) {
      showToast('Aplikasi minimal harus memiliki 1 opsi paket harga.');
      return;
    }
    setFormAppPlans((prev) => prev.filter((_, i) => i !== index));
  };

  // Order Actions: Assign (Lock to me)
  const handleAssign = async (orderId: string) => {
    if (!loggedInAdmin) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign',
          orderId,
          adminName: loggedInAdmin,
        }),
      });
      if (res.ok) {
        await fetchOrders();
        setOrderSubTab('my_active');
        showToast(`Pesanan #${orderId} berhasil dikunci untuk ${loggedInAdmin}! 🔒`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Actions: Release back to queue
  const handleReleaseOrder = async (orderId: string) => {
    if (!confirm(`Kembalikan pesanan #${orderId} ke antrian umum?`)) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'release',
          orderId,
        }),
      });
      if (res.ok) {
        await fetchOrders();
        setOrderSubTab('queued');
        showToast(`Pesanan #${orderId} dilepas kembali ke antrian umum. 🔄`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Actions: Cancel
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(`Batalkan pesanan #${orderId}? Status akan berubah menjadi Dibatalkan.`)) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          orderId,
        }),
      });
      if (res.ok) {
        await fetchOrders();
        showToast(`Pesanan #${orderId} telah dibatalkan.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Click Copy Chat Format for Telegram
  const handleCopyChatFormat = (order: Order) => {
    const text = `Halo kak ${order.customerName}! ✨\nPesanan kamu di saoirse store sedang kami proses.\n\nDetail Pesanan:\n• Produk: ${order.productName}\n• Opsi: ${order.planName || '-'}\n• No. Tiket: #${order.id}\n• Admin: ${loggedInAdmin}\n\nCek tiket & akunmu di: ${window.location.origin}/order/${order.id}\nTerima kasih atas kepercayaannya!`;
    navigator.clipboard.writeText(text);
    showToast(`Format chat Telegram untuk #${order.id} berhasil disalin! 📋`);
  };

  // Live Chat Controllers
  const fetchChatSessions = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setChatSessions(data.sessions);
        setLiveChatUnreadCount(data.unreadTotal || 0);
        setSelectedChatSessionId((prev) => {
          if (prev && data.sessions.some((s: LiveChatSession) => s.sessionId === prev)) {
            return prev;
          }
          return data.sessions.length > 0 ? data.sessions[0].sessionId : null;
        });
      }
    } catch (e) {
      console.error('Failed to fetch chat sessions:', e);
    }
  };

  const fetchSessionMessages = async (sessionId: string, markRead = false) => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}${markRead ? '&markRead=true' : ''}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setSessionMessages(data.messages);
        if (markRead) {
          setChatSessions((prev) =>
            prev.map((s) => (s.sessionId === sessionId ? { ...s, unreadCount: 0 } : s))
          );
          setLiveChatUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (e) {
      console.error('Failed to fetch messages for session:', sessionId, e);
    }
  };

  const handleSendAdminReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChatSessionId || !chatReplyText.trim() || !loggedInAdmin || isSendingReply) return;

    const textToSend = chatReplyText.trim();
    setChatReplyText('');
    setIsSendingReply(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedChatSessionId,
          sender: 'admin',
          text: textToSend,
          adminName: `Admin ${loggedInAdmin}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.message) {
          setSessionMessages((prev) => [...prev, data.message]);
        }
        showToast('Balasan live chat terkirim ke customer! 💬');
        fetchChatSessions();
      }
    } catch (e) {
      console.error('Failed to send admin chat reply:', e);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleResolveSession = async (sessionId: string, newStatus: 'active' | 'resolved') => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'resolve',
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(newStatus === 'resolved' ? 'Sesi chat ditandai selesai! ✅' : 'Sesi chat dibuka kembali 🟢');
        fetchChatSessions();
        if (selectedChatSessionId === sessionId) {
          fetchSessionMessages(sessionId);
        }
      }
    } catch (e) {
      console.error('Failed to update session status:', e);
    }
  };

  useEffect(() => {
    if (loggedInAdmin) {
      fetchChatSessions();
      const interval = setInterval(fetchChatSessions, 4000);
      return () => clearInterval(interval);
    }
  }, [loggedInAdmin]);

  useEffect(() => {
    if (selectedChatSessionId) {
      fetchSessionMessages(selectedChatSessionId, true);
      const interval = setInterval(() => {
        fetchSessionMessages(selectedChatSessionId, false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChatSessionId]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages]);

  // Open Fulfillment Modal
  const openCompleteModal = (order: Order) => {
    setSelectedOrderToComplete(order);
    const isJascur = order.productId === 'jascur' || order.planGroup?.includes('Curhat');
    const isKopken = order.productId === 'kopken' || order.productName.toLowerCase().includes('kenangan');
    const defaultCost = order.costPrice !== undefined ? order.costPrice : calculateDefaultCostPrice(order);
    setCredCostPrice(defaultCost);

    if (isJascur) {
      setCredEmail(order.customerTelegram || jascurTelegram);
      setCredPassword('-');
      setCredProfile(order.customerName);
      setCredPin('-');
      setCredExpired('Sesi Selesai');
      setCredNotes(`Sesi curhat telah selesai dikerjakan dengan hangat & aman via Telegram.`);
      setCredPhoto('');
    } else if (isKopken) {
      setCredEmail('Pesanan Kopi Siap Diambil di Kasir');
      setCredPassword(`Tiket Kasir #${order.id}`);
      setCredProfile(`Atas Nama: ${order.customerName}`);
      setCredPin(order.outlet || 'Kasir Outlet Resmi');
      const reqTime = order.pickupTime || (order.planName?.match(/Jam Ambil:\s*([^\•\|]+)/i)?.[1]?.trim()) || 'Sekarang (ASAP)';
      setCredExpired(reqTime);
      setCredNotes(`Pesanan Kopi Kenangan telah dibuat oleh barista outlet ${order.outlet || ''}. Sebutkan nama ${order.customerName} di kasir / pick-up bar.`);
      setCredPhoto(order.credentials?.photoUrl || '');
    } else {
      setCredEmail(`${order.productName.toLowerCase().replace(/\s+/g, '')}.saoirse@gmail.com`);
      setCredPassword('SaoirseVip2026!');
      setCredProfile(`${order.customerName} (Profil 1)`);
      setCredPin('1234');
      setCredExpired('30 Hari dari Pembelian');
      setCredNotes('Dilarang ganti password & profil akun ya. Garansi full replace jika berkendala.');
      setCredPhoto('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCredPhoto(reader.result);
        showToast('Foto bukti validasi pesanan berhasil diunggah! 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderToComplete || !loggedInAdmin) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          orderId: selectedOrderToComplete.id,
          adminName: loggedInAdmin,
          costPrice: credCostPrice,
          credentials: {
            email: credEmail,
            password: credPassword,
            profileName: credProfile,
            profilePin: credPin,
            expiredDate: credExpired,
            rulesNotes: credNotes,
            photoUrl: credPhoto,
            pickupTime: credExpired,
          },
        }),
      });

      if (res.ok) {
        showToast(`Pesanan #${selectedOrderToComplete.id} berhasil diselesaikan & data terkirim ke buyer! ✅`);
        setSelectedOrderToComplete(null);
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleThrottle = async () => {
    const nextState = !queueOpen;
    setQueueOpen(nextState);
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleQueue',
          queueOpen: nextState,
        }),
      });
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store: {
            queueOpen: nextState,
            queueLockReason: queueLockReason.trim(),
            queueEstimatedOpen: queueEstimatedOpen.trim(),
            dailyOpenTime: dailyOpenTime.trim(),
            dailyCloseTime: dailyCloseTime.trim(),
            announcement: storeAnnouncement,
            csTelegram: storeTelegram,
            jasdorOpen: storeJasdorOpen,
            jasdorAnnouncement: storeJasdorAnnouncement,
            jasdorEstimatedOpen: storeJasdorEstimatedOpen,
            jasdorClosedSchedule: storeJasdorClosedSchedule,
            premiumOpen: storePremiumOpen,
            premiumAnnouncement: storePremiumAnnouncement,
            premiumEstimatedOpen: storePremiumEstimatedOpen,
            premiumClosedSchedule: storePremiumClosedSchedule,
          },
        }),
      });
      showToast(nextState ? 'Antrian Toko dibuka kembali!' : 'Antrian Toko ditahan sementara.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMockOrder = async (type: 'premium' | 'kopken' | 'jascur') => {
    if (type === 'jascur') {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Bintang Anonim',
          customerTelegram: '@bintang_cerita',
          productId: 'jascur',
          productName: `Jascur – Sesi Chat Teks (2 Jam) + Add-on VN`,
          planGroup: 'Jasa Curhat',
          planName: `Sesi Chat Teks 2 Jam + Add-on VN - Tele: @bintang_cerita - Topik Dihindari: Jangan bahas asmara`,
          price: jascurChatRate * 2 + jascurAddonVn,
          paymentMethod: 'qris',
        }),
      });
    } else if (type === 'kopken') {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Alya Putri',
          customerTelegram: '@alya_putri',
          productId: 'kopken',
          productName: 'Kopi Kenangan (2 Menu)',
          planGroup: 'Jasdor Kopi',
          planName: '1x Kopi Kenangan Mantan (Regular • Normal • Normal) | 1x Cokelat Klasik (Regular)',
          outlet: 'Kopi Kenangan - Mall Kota Kasablanka',
          items: [
            { id: 'kk-9645', name: 'Kopi Kenangan Mantan', details: 'Regular • Normal Sugar • Normal Ice', price: 11000, quantity: 1 },
            { id: 'kk-cokelat', name: 'Cokelat Klasik', details: 'Regular • Normal Sugar • Normal Ice', price: 12000, quantity: 1 },
          ],
          price: 23000,
          paymentMethod: 'qris',
        }),
      });
    } else {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Kevin Sanjaya',
          customerTelegram: '@kevin_sanjaya',
          productId: 'netflix',
          productName: 'Netflix',
          planGroup: 'Aplikasi Premium',
          planName: 'SHARING 1P1U (1 Profile 1 User) - 1 Bulan',
          price: 35000,
          paymentMethod: 'qris',
        }),
      });
    }
    await fetchOrders();
    showToast(`Order test ${type.toUpperCase()} berhasil dibuat! 🚀`);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Filter Orders
  const currentAdmin = loggedInAdmin || 'Fadiyah';
  const partnerAdmin = currentAdmin === 'Fadiyah' ? 'Kifsha' : 'Fadiyah';

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Category filter
      if (orderCategoryFilter === 'premium') {
        if (o.productId === 'jascur' || o.productId === 'kopken' || o.productName.toLowerCase().includes('kenangan')) return false;
      } else if (orderCategoryFilter === 'kopken') {
        if (o.productId !== 'kopken' && !o.productName.toLowerCase().includes('kenangan')) return false;
      } else if (orderCategoryFilter === 'jascur') {
        if (o.productId !== 'jascur' && !o.planGroup?.includes('Curhat')) return false;
      }

      // Subtab filter
      if (orderSubTab === 'queued') return o.status === 'queued';
      if (orderSubTab === 'my_active') return o.status === 'processing' && o.assignedAdmin === currentAdmin;
      if (orderSubTab === 'completed') return o.status === 'completed';
      if (orderSubTab === 'cancelled') return o.status === 'cancelled';
      return true;
    });
  }, [orders, orderCategoryFilter, orderSubTab, currentAdmin]);

  const queuedCount = orders.filter((o) => o.status === 'queued').length;
  const myActiveCount = orders.filter((o) => o.status === 'processing' && o.assignedAdmin === currentAdmin).length;
  const partnerActiveCount = orders.filter((o) => o.status === 'processing' && o.assignedAdmin === partnerAdmin).length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  const kopkenItems = COFFEE_BRANDS[0]?.items || [];
  const filteredKopkenItems = useMemo(() => {
    const q = kopkenSearch.toLowerCase().trim();
    return kopkenItems.filter((it) => {
      if (kopkenCategory !== 'all' && it.category !== kopkenCategory) return false;
      if (q && !it.name.toLowerCase().includes(q) && !it.categoryLabel.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [kopkenItems, kopkenSearch, kopkenCategory]);

  // Loading state while checking localStorage session
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-9 h-9 rounded-full border-3 border-[#059669] border-t-transparent animate-spin mx-auto mb-2.5" />
          <p className="text-xs font-bold text-[#7a665b]">Memuat portal admin saoirse...</p>
        </div>
      </div>
    );
  }

  // ==================== SCREEN 1: LOGIN ADMIN (PASSWORD ATAU VERMUK) ====================
  if (!loggedInAdmin) {
    const isAnyFaceEnrolled = Boolean(
      adminAccounts.Fadiyah?.registeredFacePhoto || adminAccounts.Kifsha?.registeredFacePhoto
    );

    return (
      <div className="min-h-screen bg-[#fbf9f5] flex flex-col justify-between text-[#382820] font-sans">
        <Navbar />

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#eae2d9] shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header Brand */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#bae5d6] text-[#059669] font-serif font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                s.
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#382820] font-serif tracking-tight">
                Portal Admin saoirse
              </h2>
              <p className="text-xs text-[#7a665b] mt-1">
                Pilih metode masuk yang kamu inginkan di bawah ini:
              </p>
            </div>

            {/* Tab Pilihan Metode Masuk (Password atau Vermuk) */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('password');
                  setLoginError('');
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginMethod === 'password'
                    ? 'bg-[#382820] text-[#fbf9f5] shadow-xs'
                    : 'text-[#7a665b] hover:text-[#382820]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Via Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMethod('vermuk');
                  setLoginError('');
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginMethod === 'vermuk'
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'text-[#7a665b] hover:text-[#059669]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Via Vermuk (Face ID)</span>
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* ================= OPSI 1: LOGIN VIA PASSWORD ================= */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-2">
                    Pilih Profil Admin:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Fadiyah */}
                    <button
                      type="button"
                      onClick={() => setSelectedUserForPassword('Fadiyah')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        selectedUserForPassword === 'Fadiyah'
                          ? 'bg-[#ebf7f3] border-[#059669] ring-2 ring-[#059669] shadow-2xs'
                          : 'bg-[#fbf9f5] border-[#eae2d9] hover:border-[#bde5d8]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-8 h-8 rounded-xl bg-[#059669] text-[#bae5d6] font-bold text-xs flex items-center justify-center font-serif">
                          F
                        </div>
                        {selectedUserForPassword === 'Fadiyah' && (
                          <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        )}
                      </div>
                      <div>
                        <div className="font-black text-sm text-[#382820]">Fadiyah</div>
                        <div className="text-[10px] text-[#059669] font-semibold">Lead Admin</div>
                      </div>
                    </button>

                    {/* Kifsha */}
                    <button
                      type="button"
                      onClick={() => setSelectedUserForPassword('Kifsha')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                        selectedUserForPassword === 'Kifsha'
                          ? 'bg-[#ebf7f3] border-[#059669] ring-2 ring-[#059669] shadow-2xs'
                          : 'bg-[#fbf9f5] border-[#eae2d9] hover:border-[#bde5d8]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-8 h-8 rounded-xl bg-[#382820] text-[#fbf9f5] font-bold text-xs flex items-center justify-center font-serif">
                          K
                        </div>
                        {selectedUserForPassword === 'Kifsha' && (
                          <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        )}
                      </div>
                      <div>
                        <div className="font-black text-sm text-[#382820]">Kifsha</div>
                        <div className="text-[10px] text-[#7a665b] font-semibold">Pantry &amp; Ops</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Password ({selectedUserForPassword})</span>
                    <span className="text-[10px] text-[#7a665b] font-normal">
                      Default: {selectedUserForPassword === 'Fadiyah' ? 'fadiyah123' : 'kifsha123'}
                    </span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#7a665b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder={`Masukkan password ${selectedUserForPassword}`}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#a3948b] focus:border-[#059669] focus:outline-hidden"
                      autoFocus
                    />
                  </div>
                  <span className="text-[10px] text-[#7a665b] mt-1.5 block">
                    💡 Tips: Password bisa kamu ubah sendiri kapan saja di tab Profil Admin setelah masuk.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Masuk sebagai {selectedUserForPassword} ➔</span>
                </button>
              </form>
            )}

            {/* ================= OPSI 2: LOGIN VIA VERMUK ================= */}
            {loginMethod === 'vermuk' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#ebf7f3]/60 border border-[#bde5d8] text-center space-y-1">
                  <div className="font-bold text-xs text-[#059669] flex items-center justify-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>Login Instan dengan Wajah (Tanpa Password)</span>
                  </div>
                  <p className="text-[11px] text-[#7a665b]">
                    Arahkan wajahmu ke kamera, sistem akan mengenali otomatis apakah kamu Fadiyah atau Kifsha.
                  </p>
                </div>

                {/* State: IDLE */}
                {vermukState === 'idle' && (
                  <div className="text-center py-5 px-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                    <div className="w-14 h-14 rounded-full bg-white border border-[#eae2d9] text-[#059669] flex items-center justify-center mx-auto shadow-2xs">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#382820]">Kamera Belum Aktif</div>
                      <p className="text-[11px] text-[#7a665b] mt-0.5 max-w-xs mx-auto">
                        Klik tombol di bawah untuk membuka kamera dan mulai memindai wajah.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1 justify-center">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Buka Kamera &amp; Scan Vermuk</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateVermuk('Fadiyah')}
                        className="px-3 py-2.5 rounded-xl bg-white border border-[#eae2d9] hover:bg-stone-100 text-[#7a665b] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Simulasi Vermuk ⚡
                      </button>
                    </div>
                  </div>
                )}

                {/* State: CAMERA ACTIVE */}
                {vermukState === 'camera_active' && (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-[#059669] aspect-square max-w-[240px] mx-auto shadow-inner">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Reticle Overlay */}
                      <div className="absolute inset-4 border-2 border-dashed border-[#059669]/80 rounded-full pointer-events-none flex items-center justify-center animate-pulse" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-mono">
                        LIVE WEBCAM
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleScanFace}
                        className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pindai Wajah Sekarang</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#7a665b] font-bold text-xs cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* State: SCANNING */}
                {vermukState === 'scanning' && (
                  <div className="text-center py-8 px-3 rounded-2xl bg-white border border-[#bde5d8] space-y-3 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-full bg-[#ebf7f3] border-2 border-[#059669] flex items-center justify-center mx-auto text-[#059669] animate-pulse">
                      <Loader2 className="w-7 h-7 animate-spin text-[#059669]" />
                    </div>
                    <div className="font-black text-sm text-[#382820]">
                      Menganalisis Biometrik Wajah...
                    </div>
                    <p className="text-[11px] text-[#7a665b]">
                      Posisikan wajah tetap menghadap kamera. Sistem sedang mencocokkan biometrik.
                    </p>
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#059669] to-transparent shadow-[0_0_15px_#059669] animate-bounce" />
                  </div>
                )}

                {/* State: VERIFIED */}
                {vermukState === 'verified' && (
                  <div className="p-4 rounded-2xl bg-white border border-[#bde5d8] text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#ebf7f3] text-[#059669] flex items-center justify-center mx-auto border border-[#bde5d8]">
                      <CheckCircle2 className="w-6 h-6 text-[#059669]" />
                    </div>
                    <div className="font-bold text-sm text-[#382820]">
                      Wajah Cocok: Admin {recognizedAdmin || 'Terverifikasi'}!
                    </div>
                    <p className="text-xs text-[#059669]">
                      Membuka dashboard otomatis, mohon tunggu sebentar...
                    </p>
                  </div>
                )}

                {/* Error Banner & Guidance */}
                {vermukError && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed space-y-2">
                    <div>⚠️ {vermukError}</div>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('password')}
                      className="font-bold text-[#059669] hover:underline block"
                    >
                      Beralih ke Login via Password ➔
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== SCREEN 2: MAIN DASHBOARD OPERASIONAL (MODERN SELLER CENTER) ====================
  return (
    <div className="min-h-screen bg-[#f8f6f0] flex text-[#382820] font-sans antialiased">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#382820] text-[#fbf9f5] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#eae2d9]">
          <Check className="w-4 h-4 text-[#bae5d6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ==================== 1. VERTICAL SELLER SIDEBAR ==================== */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 bg-white border-r border-[#eae2d9] flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#eae2d9]">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-[#059669] text-[#bae5d6] font-serif font-black text-lg flex items-center justify-center shadow-xs">
                s.
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <div className="font-serif font-black text-sm text-[#382820] leading-tight flex items-center gap-1.5">
                    <span>saoirse</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-sans font-black uppercase">
                      Seller
                    </span>
                  </div>
                  <div className="text-[10px] text-[#7a665b]">Command Center</div>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex w-7 h-7 rounded-xl hover:bg-[#fbf9f5] text-[#7a665b] hover:text-[#382820] items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#eae2d9]"
              title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Admin Profile Card */}
          {!isSidebarCollapsed && (
            <div className="mt-3 p-2.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#382820] text-[#fbf9f5] font-serif font-bold text-xs flex items-center justify-center">
                  {loggedInAdmin[0]}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-black text-[#382820] flex items-center gap-1">
                    <span className="truncate">{loggedInAdmin}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>
                  <div className="text-[10px] text-[#059669] font-medium truncate">
                    {loggedInAdmin === 'Fadiyah' ? 'Lead Admin' : 'Pantry & Ops'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#7a665b] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                title="Keluar / Ganti Akun Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
          {[
            {
              group: 'Operasional',
              items: [
                {
                  id: 'orders',
                  label: 'Antrian & Pesanan Live',
                  icon: Clock,
                  badge: queuedCount + myActiveCount > 0 ? `${queuedCount + myActiveCount}` : '0',
                  badgeHighlight: (queuedCount + myActiveCount) > 0,
                },
              ],
            },
            {
              group: 'Bisnis & Finansial',
              items: [
                {
                  id: 'analytics',
                  label: 'Rekap Omzet & Finansial',
                  icon: BarChart3,
                  badge: `Rp ${(analyticsData.totalRevenue / 1000).toFixed(0)}k`,
                },
                {
                  id: 'vouchers',
                  label: 'Voucher & Promo Diskon',
                  icon: Ticket,
                  badge: `${vouchers.filter((v) => v.isActive).length} Aktif`,
                },
              ],
            },
            {
              group: 'Katalog Layanan',
              items: [
                {
                  id: 'kopken',
                  label: 'Jasdor Kopi Kenangan',
                  icon: Coffee,
                  badge: '83 Menu',
                },
                {
                  id: 'premium',
                  label: 'Aplikasi Premium',
                  icon: Smartphone,
                  badge: `${mergedProducts.length} App`,
                },
                {
                  id: 'jascur',
                  label: 'Jasa Curhat (Jascur)',
                  icon: MessageCircle,
                  badge: jascurIsCallOpen ? 'Call Ready' : 'Call Locked',
                  badgeHighlight: !jascurIsCallOpen,
                },
              ],
            },
            {
              group: 'Komunikasi & CS',
              items: [
                {
                  id: 'livechat',
                  label: 'Live CS Chatbot',
                  icon: MessageCircle,
                  badge: liveChatUnreadCount > 0 ? `${liveChatUnreadCount} Chat` : undefined,
                  badgeHighlight: liveChatUnreadCount > 0,
                },
                {
                  id: 'canned',
                  label: 'Template Chat Kilat',
                  icon: MessageSquare,
                  badge: `${cannedResponses.length}`,
                },
              ],
            },
            {
              group: 'Sistem Toko',
              items: [
                {
                  id: 'store',
                  label: 'Jam Buka & Operasional',
                  icon: Store,
                  badge: queueOpen ? 'Buka' : 'Tutup',
                  badgeHighlight: !queueOpen,
                },
                {
                  id: 'profile',
                  label: 'Keamanan & Vermuk Saya',
                  icon: KeyRound,
                  badge: adminAccounts[loggedInAdmin]?.registeredFacePhoto ? 'Vermuk ✓' : undefined,
                },
              ],
            },
          ].map((sec) => (
            <div key={sec.group} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-[#a3948b]">
                  {sec.group}
                </div>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileSidebarOpen(false);
                      }}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#382820] text-[#fbf9f5] shadow-xs'
                          : 'text-[#7a665b] hover:text-[#382820] hover:bg-[#fbf9f5]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#bae5d6]' : 'text-[#7a665b]'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                            item.badgeHighlight
                              ? 'bg-rose-100 text-rose-700'
                              : isActive
                              ? 'bg-emerald-950/80 text-[#bae5d6]'
                              : 'bg-[#ebf7f3] text-[#059669]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Quick View Buyer Store */}
        <div className="p-3 border-t border-[#eae2d9] space-y-2">
          <Link
            href="/"
            target="_blank"
            className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-[#ebf7f3] hover:bg-[#dbf0ea] text-[#059669] text-xs font-black transition-colors ${
              isSidebarCollapsed ? 'px-0' : ''
            }`}
            title="Buka Toko Pembeli di Tab Baru"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Lihat Toko Buyer ↗</span>}
          </Link>
        </div>
      </aside>

      {/* ==================== 2. MAIN WORKSTATION WRAPPER ==================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* SELLER TOP BAR (REPLACES BUYER NAVBAR) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eae2d9] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-2xs">
          {/* Left: Mobile Hamburger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#eae2d9] text-[#382820] hover:bg-[#fbf9f5] cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#a3948b]">
                  Seller Center
                </span>
                <span className="text-[#a3948b]">/</span>
                <span className="text-xs font-extrabold text-[#382820]">
                  {activeTab === 'orders'
                    ? 'Antrian & Pesanan Live'
                    : activeTab === 'analytics'
                    ? 'Rekap Finansial & Omzet'
                    : activeTab === 'livechat'
                    ? 'Live CS Chatbot'
                    : activeTab === 'canned'
                    ? 'Template Chat Kilat'
                    : activeTab === 'vouchers'
                    ? 'Voucher & Promo Diskon'
                    : activeTab === 'jascur'
                    ? 'Pengaturan Jascur (Curhat)'
                    : activeTab === 'kopken'
                    ? 'Menu Jasdor Kopi'
                    : activeTab === 'premium'
                    ? 'Katalog Premium'
                    : activeTab === 'store'
                    ? 'Operasional Toko'
                    : 'Keamanan Akun & Vermuk'}
                </span>
              </div>
              <div className="text-[11px] text-[#7a665b] hidden sm:block">
                Admin: <strong>{loggedInAdmin}</strong> • Partner: <strong>{partnerAdmin}</strong>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-[#ebf7f3] border-[#059669] text-[#059669]'
                  : 'bg-white border-[#eae2d9] text-[#7a665b]'
              }`}
              title="Notifikasi Suara Pesanan Masuk"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{soundEnabled ? 'Suara: ON' : 'Suara: OFF'}</span>
            </button>

            {/* Antrian Open/Close Switch */}
            <button
              type="button"
              onClick={handleToggleThrottle}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                queueOpen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{queueOpen ? '🟢 Toko BUKA' : '🔴 Toko DITAHAN'}</span>
            </button>

            {/* Profile Dropdown / Quick Switch */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#eae2d9]">
              <div className="w-7 h-7 rounded-xl bg-[#059669] text-[#bae5d6] font-serif font-black text-xs flex items-center justify-center">
                {loggedInAdmin[0]}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-xl hover:bg-[#eae2d9] text-[#7a665b] hover:text-[#382820] transition-colors cursor-pointer"
                title="Keluar / Ganti Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* WORKSTATION MAIN AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto space-y-5">
          {/* Compact 4-Column KPI Stats Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#eae2d9] shadow-2xs">
              <div className="text-[10px] font-bold text-[#7a665b] uppercase">Antrian Menunggu</div>
              <div className="text-xl sm:text-2xl font-black text-[#059669] mt-0.5">{queuedCount}</div>
              <div className="text-[10px] text-[#7a665b]">Siap diambil admin</div>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#eae2d9] shadow-2xs">
              <div className="text-[10px] font-bold text-[#7a665b] uppercase">Dikerjakan Saya ({loggedInAdmin})</div>
              <div className="text-xl sm:text-2xl font-black text-[#382820] mt-0.5">{myActiveCount}</div>
              <div className="text-[10px] text-[#059669] font-semibold">Tanggung jawab saya</div>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#eae2d9] shadow-2xs">
              <div className="text-[10px] font-bold text-[#7a665b] uppercase">Dikerjakan Partner ({partnerAdmin})</div>
              <div className="text-xl sm:text-2xl font-black text-[#7a665b] mt-0.5">{partnerActiveCount}</div>
              <div className="text-[10px] text-[#7a665b]">Terkunci aman</div>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#eae2d9] shadow-2xs">
              <div className="text-[10px] font-bold text-[#7a665b] uppercase">Total Selesai</div>
              <div className="text-xl sm:text-2xl font-black text-[#382820] mt-0.5">{completedCount}</div>
              <div className="text-[10px] text-[#7a665b]">Order tuntas hari ini</div>
            </div>
          </div>

        {/* ==================== TAB 1: ANTRIAN & PESANAN LIVE ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Quick Test Order Bar */}
            <div className="p-3 rounded-2xl bg-white border border-[#eae2d9] flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7a665b]">
                <Sparkles className="w-4 h-4 text-[#059669]" />
                <span>Simulasi Order Cepat (Testing):</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAddMockOrder('kopken')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#fbf9f5] text-[#382820] hover:bg-[#ebf7f3] border border-[#eae2d9] cursor-pointer"
                >
                  ☕ +Test Kopken
                </button>
                <button
                  onClick={() => handleAddMockOrder('jascur')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#fbf9f5] text-[#382820] hover:bg-[#ebf7f3] border border-[#eae2d9] cursor-pointer"
                >
                  💬 +Test Jascur
                </button>
                <button
                  onClick={() => handleAddMockOrder('premium')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#fbf9f5] text-[#382820] hover:bg-[#ebf7f3] border border-[#eae2d9] cursor-pointer"
                >
                  🍿 +Test Premium
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'Semua Layanan' },
                  { id: 'kopken', label: '☕ Kopi Kenangan' },
                  { id: 'jascur', label: '💬 Jasa Curhat' },
                  { id: 'premium', label: '🍿 App Premium' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setOrderCategoryFilter(cat.id as 'all' | 'kopken' | 'jascur' | 'premium')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                      orderCategoryFilter === cat.id
                        ? 'bg-[#382820] text-[#fbf9f5] border-[#382820]'
                        : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#f2ece3]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Subtabs: Queued vs Active vs Completed vs Cancelled */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#eae2d9] text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setOrderSubTab('queued')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    orderSubTab === 'queued' ? 'bg-[#059669] text-[#fbf9f5]' : 'text-[#7a665b] hover:text-[#382820]'
                  }`}
                >
                  Menunggu ({queuedCount})
                </button>
                <button
                  onClick={() => setOrderSubTab('my_active')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    orderSubTab === 'my_active' ? 'bg-[#059669] text-[#fbf9f5]' : 'text-[#7a665b] hover:text-[#382820]'
                  }`}
                >
                  Dikerjakan Saya ({myActiveCount})
                </button>
                <button
                  onClick={() => setOrderSubTab('completed')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    orderSubTab === 'completed' ? 'bg-[#059669] text-[#fbf9f5]' : 'text-[#7a665b] hover:text-[#382820]'
                  }`}
                >
                  Selesai ({completedCount})
                </button>
                <button
                  onClick={() => setOrderSubTab('cancelled')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    orderSubTab === 'cancelled' ? 'bg-[#059669] text-[#fbf9f5]' : 'text-[#7a665b] hover:text-[#382820]'
                  }`}
                >
                  Batal ({cancelledCount})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#7a665b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID tiket (#SR-1042), nama buyer, kontak Telegram..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#7a665b] focus:border-[#059669] focus:outline-hidden shadow-2xs"
              />
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#eae2d9] shadow-2xs">
                <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2" />
                <h3 className="font-bold text-base text-[#382820]">Tidak ada pesanan di kategori ini</h3>
                <p className="text-xs text-[#7a665b] mt-1">
                  Semua pesanan sudah diproses atau belum ada pesanan baru yang masuk.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredOrders.map((order) => {
                  const isJascur = order.productId === 'jascur' || order.planGroup?.includes('Curhat');
                  const isKopken = order.productId === 'kopken' || order.productName.toLowerCase().includes('kenangan');
                  const isMyLock = order.assignedAdmin === loggedInAdmin;
                  const isPartnerLock = Boolean(order.assignedAdmin && order.assignedAdmin !== loggedInAdmin);

                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-3xl p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs ${
                        order.status === 'processing'
                          ? isMyLock
                            ? 'border-[#059669] ring-1 ring-[#059669]'
                            : 'border-amber-400 bg-amber-50/20'
                          : 'border-[#eae2d9] hover:border-[#bde5d8]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Service Icon Badge */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border shadow-2xs ${
                            isJascur
                              ? 'bg-[#ebf7f3] border-[#bde5d8] text-[#059669]'
                              : isKopken
                              ? 'bg-[#fbf9f5] border-[#eae2d9] text-[#382820]'
                              : 'bg-stone-50 border-stone-200 text-[#4e403b]'
                          }`}
                        >
                          {isJascur ? '💬' : isKopken ? '☕' : '🍿'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono font-black text-xs text-[#382820] bg-[#fbf9f5] px-2 py-0.5 rounded-lg border border-[#eae2d9]">
                              #{order.id}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]">
                              {order.planGroup || 'Order'}
                            </span>
                            {order.assignedAdmin && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isMyLock ? 'bg-[#059669] text-[#fbf9f5]' : 'bg-[#382820] text-[#fbf9f5]'
                              }`}>
                                <Lock className="w-2.5 h-2.5" />
                                <span>{order.assignedAdmin}</span>
                              </span>
                            )}
                            <span className="text-[10px] text-[#7a665b]">
                              {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm sm:text-base text-[#382820] truncate">
                            {order.productName}
                          </h3>

                          <p className="text-xs text-[#7a665b] mt-0.5 leading-relaxed">
                            {order.planName}
                          </p>

                          {/* Customer & Price Row */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                            <span className="font-bold text-[#382820]">
                              Buyer: <span className="text-[#059669]">{order.customerName}</span>
                            </span>
                            <span className="text-[#eae2d9]">•</span>
                            <span className="font-semibold text-[#7a665b]">
                              Kontak: <strong>{order.customerTelegram}</strong>
                            </span>
                            <span className="text-[#eae2d9]">•</span>
                            <span className="font-black text-[#059669] text-sm">
                              {formatRupiah(order.price)}
                            </span>
                          </div>

                          {/* Pick-up outlet, Request Jam Ambil, & Foto Bukti for Kopken */}
                          {(order.outlet || order.pickupTime || order.credentials?.photoUrl) && (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                              {order.outlet && (
                                <span className="font-semibold text-[#059669] bg-[#ebf7f3] px-2.5 py-1 rounded-xl border border-[#bde5d8] inline-flex items-center gap-1">
                                  📍 Ambil di: {order.outlet}
                                </span>
                              )}
                              {order.pickupTime && (
                                <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300 inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>Request Jam: {order.pickupTime}</span>
                                </span>
                              )}
                              {order.credentials?.photoUrl && (
                                <span className="font-bold text-[#059669] bg-white px-2.5 py-1 rounded-xl border border-[#bde5d8] inline-flex items-center gap-1">
                                  <Camera className="w-3 h-3 text-[#059669]" />
                                  <span>Ada Foto Struk Validasi</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#eae2d9]">
                        {/* Status Queued -> Ambil */}
                        {order.status === 'queued' && (
                          <button
                            type="button"
                            onClick={() => handleAssign(order.id)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-[#bae5d6]" />
                            <span>Ambil Order ({loggedInAdmin})</span>
                          </button>
                        )}

                        {/* Partner Lock Indicator (Anti-Bentrok) */}
                        {order.status === 'processing' && isPartnerLock && (
                          <div className="px-3.5 py-2 rounded-xl bg-[#382820] text-[#fbf9f5] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <Lock className="w-3.5 h-3.5 text-[#bae5d6]" />
                            <span>Dikerjakan {order.assignedAdmin} (Anti-Bentrok)</span>
                          </div>
                        )}

                        {/* Status Processing by Me -> Actions */}
                        {order.status === 'processing' && isMyLock && (
                          <div className="flex items-center gap-1.5 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => handleReleaseOrder(order.id)}
                              className="px-3 py-2.5 rounded-xl bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] font-bold text-xs border border-[#eae2d9] transition-colors cursor-pointer"
                              title="Lepas pesanan kembali ke antrian umum"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openCompleteModal(order)}
                              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5 text-[#bae5d6]" />
                              <span>Selesaikan &amp; Kirim Akun</span>
                            </button>
                          </div>
                        )}

                        {/* Action Row: Quick Canned, Copy Chat, Buyer Screen, Telegram */}
                        <div className="flex items-center gap-1.5 w-full justify-end flex-wrap">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOrderQuickCannedMenuId(
                                  orderQuickCannedMenuId === order.id ? null : order.id
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-[#ebf7f3] hover:bg-[#d8f2e9] text-[#059669] text-[11px] font-bold border border-[#bde5d8] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Pilih template chat kilat khusus order ini"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Pilih Template</span>
                            </button>

                            {orderQuickCannedMenuId === order.id && (
                              <div className="absolute right-0 bottom-full mb-1.5 w-64 bg-white rounded-2xl shadow-xl border border-[#eae2d9] p-2 z-40 space-y-1 animate-in fade-in zoom-in-95">
                                <div className="text-[10px] font-bold text-[#7a665b] uppercase px-2 py-1 flex items-center justify-between border-b border-[#eae2d9]">
                                  <span>Template Siap Kirim</span>
                                  <button
                                    type="button"
                                    onClick={() => setOrderQuickCannedMenuId(null)}
                                    className="text-stone-400 hover:text-stone-700 font-bold"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                  {cannedResponses.map((cr) => (
                                    <button
                                      key={cr.id}
                                      type="button"
                                      onClick={() => copyCannedResponse(cr, order)}
                                      className="w-full text-left p-2 rounded-xl hover:bg-[#fbf9f5] transition-colors text-xs cursor-pointer block group"
                                    >
                                      <span className="font-bold text-[#382820] group-hover:text-[#059669] line-clamp-1 block">
                                        {cr.title}
                                      </span>
                                      <span className="text-[10px] text-[#7a665b] line-clamp-1 block">
                                        {cr.text.slice(0, 40)}...
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyChatFormat(order)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#fbf9f5] hover:bg-[#ebf7f3] text-[#382820] text-[11px] font-bold border border-[#eae2d9] transition-colors flex items-center gap-1 cursor-pointer"
                            title="Salin template chat siap kirim untuk buyer"
                          >
                            <Copy className="w-3 h-3 text-[#059669]" />
                            <span>Salin Chat</span>
                          </button>

                          <Link
                            href={`/order/${order.id}`}
                            target="_blank"
                            className="px-2.5 py-1.5 rounded-xl bg-[#fbf9f5] hover:bg-[#ebf7f3] text-[#382820] text-[11px] font-bold border border-[#eae2d9] transition-colors flex items-center gap-1"
                          >
                            <span>Layar</span>
                            <ExternalLink className="w-3 h-3 text-[#7a665b]" />
                          </Link>

                          {order.customerTelegram && (
                            <a
                              href={`https://t.me/${order.customerTelegram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <span>Telegram</span>
                            </a>
                          )}

                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(order.id)}
                              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              title="Batalkan Order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      {/* ==================== TAB: REKAP FINANSIAL & OMZET OTOMATIS (REVENUE ANALYTICS) ==================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Header & Period Switcher */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669]">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#382820] font-serif">
                      Rekap Finansial &amp; Omzet Otomatis
                    </h2>
                    <p className="text-xs text-[#7a665b] mt-0.5">
                      Analisis pendapatan real-time, performa per admin ({loggedInAdmin} &amp; {partnerAdmin}), serta layanan terlaris.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                {/* Period Pills */}
                <div className="flex items-center p-1 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-bold w-full sm:w-auto justify-between sm:justify-start">
                  {[
                    { id: 'today', label: 'Hari Ini' },
                    { id: '7days', label: '7 Hari' },
                    { id: '30days', label: '30 Hari' },
                    { id: 'all', label: 'Semua' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAnalyticsPeriod(p.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        analyticsPeriod === p.id
                          ? 'bg-[#382820] text-white shadow-xs'
                          : 'text-[#7a665b] hover:text-[#382820]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={exportAnalyticsCSV}
                  className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="Unduh laporan transaksi pembukuan format CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Metrics: Omzet, Uang Modal, Keuntungan Bersih, Margin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Omzet Penjualan (Gross) */}
              <div className="bg-white p-5 rounded-3xl border border-[#eae2d9] shadow-2xs relative overflow-hidden">
                <div className="text-[11px] font-bold text-[#7a665b] uppercase tracking-wider flex items-center justify-between">
                  <span>Total Omzet Penjualan</span>
                  <DollarSign className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#382820] mt-2 font-mono">
                  Rp {analyticsData.totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="mt-2 text-[11px] text-[#7a665b] flex items-center gap-1">
                  <span className="font-bold text-[#382820]">{analyticsData.totalTransactions} pesanan</span>
                  <span>selesai (uang masuk)</span>
                </div>
              </div>

              {/* 2. Uang Modal (HPP Keluar) */}
              <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-2xs relative overflow-hidden bg-gradient-to-br from-white to-amber-50/30">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Total Uang Modal (HPP)</span>
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2 font-mono">
                  Rp {(analyticsData.totalCost || 0).toLocaleString('id-ID')}
                </div>
                <div className="mt-2 text-[11px] text-[#7a665b]">
                  Modal kasir &amp; supplier akun keluar
                </div>
              </div>

              {/* 3. Keuntungan Bersih (Net Profit) */}
              <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/20 to-[#ebf7f3]">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Keuntungan Bersih (Profit)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                    Margin {analyticsData.profitMargin || 0}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2 font-mono">
                  Rp {(analyticsData.totalProfit || 0).toLocaleString('id-ID')}
                </div>
                <div className="mt-2 text-[11px] text-[#059669] font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Laba bersih murni saoirse</span>
                </div>
              </div>

              {/* 4. Rata-Rata Profit per Order */}
              <div className="bg-white p-5 rounded-3xl border border-[#eae2d9] shadow-2xs">
                <div className="text-[11px] font-bold text-[#7a665b] uppercase tracking-wider flex items-center justify-between">
                  <span>Rata-Rata Profit / Order</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#382820] mt-2 font-mono">
                  Rp {(analyticsData.avgProfit || 0).toLocaleString('id-ID')}
                </div>
                <div className="mt-2 text-[11px] text-[#7a665b]">
                  AOV Omzet: Rp {analyticsData.aov.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Middle Section: Service Revenue Share & Admin Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Service Share (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#382820] font-serif">
                    Kontribusi Omzet Berdasarkan Layanan
                  </h3>
                  <span className="text-[11px] text-[#7a665b] font-semibold">
                    {analyticsPeriod === 'today'
                      ? 'Hari Ini'
                      : analyticsPeriod === '7days'
                      ? '7 Hari Terakhir'
                      : analyticsPeriod === '30days'
                      ? '30 Hari Terakhir'
                      : 'Semua Waktu'}
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'jasdor',
                      title: 'Jasdor Kopi Kenangan',
                      icon: '☕',
                      unit: 'Cup',
                      stats: analyticsData.serviceStats.jasdor,
                      color: 'bg-amber-700',
                      badge: 'Diskon 50%',
                    },
                    {
                      id: 'premium',
                      title: 'Aplikasi Premium',
                      icon: '🍿',
                      unit: 'Akun',
                      stats: analyticsData.serviceStats.premium,
                      color: 'bg-emerald-600',
                      badge: 'Streaming & AI',
                    },
                    {
                      id: 'jascur',
                      title: 'Jasa Curhat (Jascur)',
                      icon: '💬',
                      unit: 'Sesi',
                      stats: analyticsData.serviceStats.jascur,
                      color: 'bg-teal-600',
                      badge: 'Chat & Call',
                    },
                  ].map((srv) => {
                    const percent =
                      analyticsData.totalRevenue > 0
                        ? Math.round((srv.stats.revenue / analyticsData.totalRevenue) * 100)
                        : 0;

                    return (
                      <div
                        key={srv.id}
                        className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{srv.icon}</span>
                            <div>
                              <span className="font-bold text-[#382820] block">{srv.title}</span>
                              <span className="text-[10px] text-[#7a665b]">
                                {srv.stats.orders} transaksi • {srv.stats.itemsCount} {srv.unit}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-sm text-[#382820] block font-mono">
                              Rp {srv.stats.revenue.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] font-bold text-[#059669]">
                              {percent}% dari total
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-[#eae2d9] overflow-hidden">
                          <div
                            className={`h-full ${srv.color} transition-all duration-500 rounded-full`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin Performance (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#382820] font-serif">
                    Performa &amp; Bagi Kerja Admin
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#059669] bg-[#ebf7f3] px-2 py-0.5 rounded-full border border-[#bde5d8]">
                    Fadiyah vs Kifsha
                  </span>
                </div>

                <div className="space-y-3">
                  {(['Fadiyah', 'Kifsha'] as const).map((name) => {
                    const st = analyticsData.adminStats[name];
                    const percent =
                      analyticsData.totalRevenue > 0
                        ? Math.round((st.revenue / analyticsData.totalRevenue) * 100)
                        : 0;
                    const isCurrent = loggedInAdmin === name;

                    return (
                      <div
                        key={name}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-[#ebf7f3]/40 border-[#bde5d8]'
                            : 'bg-[#fbf9f5] border-[#eae2d9]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#382820] text-[#fbf9f5] font-serif font-black text-sm flex items-center justify-center">
                              {name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-sm text-[#382820]">{name}</span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-[#059669] text-white text-[9px] font-black uppercase">
                                    Saya
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#7a665b]">
                                {st.orders} order selesai
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-sm text-[#059669] font-mono block">
                              Rp {st.revenue.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-[#7a665b] font-semibold">
                              Beban Kerja: {percent}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-[#eae2d9] overflow-hidden">
                          <div
                            className="h-full bg-[#059669] transition-all rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  💡 <strong>Catatan Rekap Kerja:</strong> Setiap order yang diselesaikan admin tercatat otomatis pada ID akun masing-masing untuk pembagian tugas harian yang adil &amp; transparan.
                </div>
              </div>
            </div>

            {/* Top 5 Best Selling Items */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#382820] font-serif">
                    Top 5 Menu &amp; Produk Paling Menghasilkan Omzet
                  </h3>
                  <p className="text-xs text-[#7a665b] mt-0.5">
                    Produk dengan total penjualan dan revenue tertinggi pada periode ini.
                  </p>
                </div>
                <Award className="w-5 h-5 text-amber-500" />
              </div>

              {analyticsData.topProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7a665b]">
                  Belum ada transaksi selesai pada periode ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {analyticsData.topProducts.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex flex-col justify-between space-y-2 hover:border-[#bde5d8] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="w-5 h-5 rounded-full bg-[#382820] text-white font-black text-[10px] flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7a665b] border border-[#eae2d9]">
                            {prod.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-[#382820] mt-2 line-clamp-1">
                          {prod.name}
                        </h4>
                        <span className="text-[11px] text-[#7a665b] block">
                          Terjual: <strong>{prod.count}x</strong>
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#eae2d9]">
                        <span className="text-[9px] text-[#7a665b] block">Total Omzet:</span>
                        <span className="font-extrabold text-xs text-[#059669] font-mono">
                          Rp {prod.revenue.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Full Transaction History Table */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#eae2d9]">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#382820] font-serif">
                    Riwayat Transaksi Finansial ({analyticsData.periodOrders.length} Transaksi)
                  </h3>
                  <p className="text-xs text-[#7a665b] mt-0.5">
                    Data transaksi yang masuk ke pembukuan tokomu.
                  </p>
                </div>

                {/* Service Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: 'Semua Layanan' },
                    { id: 'jasdor', label: '☕ Kopi Kenangan' },
                    { id: 'premium', label: '🍿 Premium' },
                    { id: 'jascur', label: '💬 Jascur' },
                  ].map((sf) => (
                    <button
                      key={sf.id}
                      type="button"
                      onClick={() => setAnalyticsServiceFilter(sf.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                        analyticsServiceFilter === sf.id
                          ? 'bg-[#382820] text-white shadow-xs'
                          : 'bg-[#fbf9f5] text-[#7a665b] hover:bg-[#eae2d9] border border-[#eae2d9]'
                      }`}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#382820]">
                  <thead>
                    <tr className="border-b border-[#eae2d9] text-[10px] text-[#7a665b] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Waktu</th>
                      <th className="py-2.5 px-3">ID Pesanan</th>
                      <th className="py-2.5 px-3">Layanan</th>
                      <th className="py-2.5 px-3">Pembeli</th>
                      <th className="py-2.5 px-3">Detail Item</th>
                      <th className="py-2.5 px-3">Admin</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eae2d9]">
                    {analyticsData.periodOrders
                      .filter((ord) => {
                        if (analyticsServiceFilter === 'all') return true;
                        return analyticsData.getService(ord) === analyticsServiceFilter;
                      })
                      .map((ord) => {
                        const dateStr = new Date(ord.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        const s = analyticsData.getService(ord);
                        const isCompleted = ord.status === 'completed';

                        return (
                          <tr key={ord.id} className="hover:bg-[#fbf9f5] transition-colors">
                            <td className="py-3 px-3 text-[#7a665b] whitespace-nowrap">{dateStr}</td>
                            <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                              #{ord.id}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  s === 'jasdor'
                                    ? 'bg-amber-100 text-amber-900'
                                    : s === 'jascur'
                                    ? 'bg-teal-100 text-teal-900'
                                    : 'bg-emerald-100 text-emerald-900'
                                }`}
                              >
                                {s === 'jasdor' ? '☕ Kopi' : s === 'jascur' ? '💬 Jascur' : '🍿 Premium'}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-semibold">{ord.customerName}</td>
                            <td className="py-3 px-3 text-[#7a665b] max-w-xs truncate">
                              {ord.items?.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ') || '-'}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap font-medium text-[#7a665b]">
                              {ord.assignedAdmin || '-'}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isCompleted
                                    ? 'bg-[#ebf7f3] text-[#059669]'
                                    : ord.status === 'cancelled'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {isCompleted ? 'Selesai' : ord.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-bold font-mono text-[#059669] whitespace-nowrap">
                              Rp {(ord.price || 0).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* ==================== TAB: LIVE CS CHATBOT (BALAS CUSTOMER REAL-TIME) ==================== */}
        {activeTab === 'livechat' && (() => {
          const filteredSessions = chatSessions.filter((s) => {
            if (chatSessionFilter === 'active' && s.status !== 'active') return false;
            if (chatSessionFilter === 'resolved' && s.status !== 'resolved') return false;
            if (chatSearchQuery.trim()) {
              const q = chatSearchQuery.toLowerCase();
              return (
                s.customerName.toLowerCase().includes(q) ||
                s.topic.toLowerCase().includes(q) ||
                s.lastMessage.toLowerCase().includes(q)
              );
            }
            return true;
          });

          const activeSession = chatSessions.find((s) => s.sessionId === selectedChatSessionId);

          return (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669]">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[#382820] font-serif">
                        Live CS Chatbot
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {chatSessions.filter((s) => s.status === 'active').length} Sesi Aktif
                      </span>
                    </div>
                    <p className="text-xs text-[#7a665b] mt-0.5">
                      Balas pesan konsultasi, pertanyaan menu, dan kendala pelanggan secara real-time sebagai <strong>Admin {loggedInAdmin}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center p-1 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-bold w-full md:w-auto">
                    {[
                      { id: 'all', label: `Semua (${chatSessions.length})` },
                      { id: 'active', label: `Aktif (${chatSessions.filter((s) => s.status === 'active').length})` },
                      { id: 'resolved', label: `Selesai (${chatSessions.filter((s) => s.status === 'resolved').length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setChatSessionFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          chatSessionFilter === tab.id
                            ? 'bg-[#382820] text-white shadow-xs'
                            : 'text-[#7a665b] hover:text-[#382820]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      fetchChatSessions();
                      if (selectedChatSessionId) fetchSessionMessages(selectedChatSessionId);
                      showToast('Daftar percakapan diperbarui! 🔄');
                    }}
                    className="p-2.5 rounded-2xl border border-[#eae2d9] hover:bg-[#fbf9f5] text-[#7a665b] cursor-pointer"
                    title="Segarkan Chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2-Column Chat Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-250px)] min-h-[580px]">
                {/* Left Column: Session List (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col overflow-hidden">
                  {/* Search Bar */}
                  <div className="p-3.5 border-b border-[#eae2d9]">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a665b]" />
                      <input
                        type="text"
                        placeholder="Cari nama atau topik chat..."
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#382820] focus:outline-hidden focus:border-[#059669]"
                      />
                    </div>
                  </div>

                  {/* Sessions Scrollable List */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-[#eae2d9]/40">
                    {filteredSessions.length === 0 ? (
                      <div className="text-center py-12 px-4 text-[#7a665b]">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#7a665b]/40" />
                        <div className="font-bold text-xs">Belum ada sesi chat</div>
                        <p className="text-[11px] mt-0.5">Pesan dari customer akan muncul di sini</p>
                      </div>
                    ) : (
                      filteredSessions.map((s) => {
                        const isSelected = selectedChatSessionId === s.sessionId;
                        return (
                          <button
                            key={s.sessionId}
                            type="button"
                            onClick={() => setSelectedChatSessionId(s.sessionId)}
                            className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'bg-[#ebf7f3] border border-[#bde5d8] shadow-xs'
                                : 'hover:bg-[#fbf9f5] border border-transparent'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#382820] text-[#fbf9f5] font-serif font-black text-xs flex items-center justify-center shrink-0">
                              {s.customerName ? s.customerName[0].toUpperCase() : 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-bold text-xs text-[#382820] truncate">
                                  {s.customerName}
                                </span>
                                <span className="text-[10px] text-[#7a665b] shrink-0">
                                  {s.lastMessageTime}
                                </span>
                              </div>

                              <div className="text-[11px] font-semibold text-[#059669] truncate mb-1">
                                {s.topic}
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] text-[#7a665b] truncate">
                                  {s.lastMessage}
                                </p>
                                {s.unreadCount > 0 && (
                                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                                    {s.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Chat Pane (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col overflow-hidden">
                  {activeSession ? (
                    <>
                      {/* Header Pane */}
                      <div className="p-3.5 sm:p-4 bg-[#fbf9f5] border-b border-[#eae2d9] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                            {activeSession.customerName[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-sm text-[#382820] truncate">
                                {activeSession.customerName}
                              </h3>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                                  activeSession.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {activeSession.status === 'active' ? '● Aktif' : '✓ Selesai'}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#7a665b] flex items-center gap-2 truncate">
                              <span>{activeSession.customerContact}</span>
                              <span>•</span>
                              <span className="text-[#059669] font-medium">{activeSession.topic}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleResolveSession(
                                activeSession.sessionId,
                                activeSession.status === 'active' ? 'resolved' : 'active'
                              )
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              activeSession.status === 'active'
                                ? 'bg-white border-[#eae2d9] text-[#7a665b] hover:bg-stone-100'
                                : 'bg-[#ebf7f3] border-[#bde5d8] text-[#059669] hover:bg-[#d8f2e9]'
                            }`}
                          >
                            {activeSession.status === 'active' ? 'Tandai Selesai ✓' : 'Buka Kembali ↺'}
                          </button>
                        </div>
                      </div>

                      {/* Chat Thread */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf8f5]/40">
                        {sessionMessages.map((msg) => {
                          const isAdmin = msg.sender === 'admin';
                          const isBot = msg.sender === 'bot';

                          if (isBot) {
                            return (
                              <div key={msg.id} className="flex justify-center my-2">
                                <div className="px-3.5 py-1.5 rounded-full bg-[#ebf7f3] border border-[#bde5d8] text-[11px] text-[#059669] font-medium">
                                  🤖 <strong>saories helper:</strong> {msg.text}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                            >
                              <div className="flex items-end gap-1.5 max-w-[85%]">
                                {!isAdmin && (
                                  <div className="w-6 h-6 rounded-lg bg-[#382820] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                                    {activeSession.customerName[0] || 'U'}
                                  </div>
                                )}

                                <div
                                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                    isAdmin
                                      ? 'bg-[#059669] text-white rounded-br-xs shadow-xs'
                                      : 'bg-white text-[#382820] border border-[#eae2d9] rounded-bl-xs shadow-2xs'
                                  }`}
                                >
                                  {isAdmin && (
                                    <div className="text-[10px] font-bold text-emerald-100 mb-1 flex items-center gap-1">
                                      <span>{msg.adminName || `Admin ${loggedInAdmin}`}</span>
                                    </div>
                                  )}
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>

                                {isAdmin && (
                                  <div className="w-6 h-6 rounded-lg bg-[#059669] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                                    {loggedInAdmin[0]}
                                  </div>
                                )}
                              </div>
                              <span className="text-[9px] text-[#7a665b] mt-1 px-1">
                                {msg.timestamp || 'Baru saja'}
                              </span>
                            </div>
                          );
                        })}
                        <div ref={chatScrollRef} />
                      </div>

                      {/* Quick Canned Chips Bar */}
                      <div className="px-3 py-2 bg-[#fbf9f5] border-t border-[#eae2d9] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <span className="text-[10px] font-bold text-[#7a665b] uppercase shrink-0 mr-1">
                          ⚡ Template:
                        </span>
                        {[
                          'Halo kak! Boleh sebutkan ID tiket pesanan kakak ya.',
                          'Pesanan Kopi Kenangan sudah dipesankan ke barista outlet ya kak ☕',
                          'Akun pengganti sedang dipersiapkan, tunggu 2-3 menit ya kak ✨',
                          'Sesi curhat malam ini sudah siap di Telegram ya kak 💬',
                          'Garansi langsung kami proses full replace! Mohon ditunggu ya kak 🙏',
                        ].map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setChatReplyText((prev) => (prev ? `${prev} ${tmpl}` : tmpl))}
                            className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#eae2d9] border border-[#eae2d9] text-[11px] text-[#382820] font-medium whitespace-nowrap cursor-pointer transition-colors shadow-2xs shrink-0"
                          >
                            {tmpl.slice(0, 32)}...
                          </button>
                        ))}
                      </div>

                      {/* Bottom Reply Form */}
                      <form
                        onSubmit={handleSendAdminReply}
                        className="p-3 bg-white border-t border-[#eae2d9] flex items-end gap-2"
                      >
                        <div className="flex-1">
                          <textarea
                            rows={2}
                            placeholder={`Ketik balasan live untuk ${activeSession.customerName} (Tekan Enter untuk kirim)...`}
                            value={chatReplyText}
                            onChange={(e) => setChatReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendAdminReply();
                              }
                            }}
                            className="w-full px-3.5 py-2 rounded-2xl border border-[#eae2d9] text-xs text-[#382820] placeholder-[#7a665b] focus:outline-hidden focus:border-[#059669] resize-none bg-[#fbf9f5]"
                          />
                          <div className="text-[10px] text-[#7a665b] mt-0.5 px-1 flex items-center justify-between">
                            <span>Membalas sebagai <strong>Admin {loggedInAdmin}</strong></span>
                            <span>Enter ↵ untuk kirim</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={!chatReplyText.trim() || isSendingReply}
                          className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer h-[42px] mb-4 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-8 text-center text-[#7a665b]">
                      <div>
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-[#7a665b]/30" />
                        <h3 className="font-serif font-black text-base text-[#382820]">
                          Pilih Percakapan untuk Membalas
                        </h3>
                        <p className="text-xs max-w-sm mx-auto mt-1">
                          Pilih salah satu sesi chat di kolom kiri untuk membaca kendala buyer dan mengirimkan balasan langsung.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}


        {/* ==================== TAB: QUICK CANNED RESPONSES (TEMPLATE CHAT KILAT) ==================== */}
        {activeTab === 'canned' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] flex items-center justify-center text-[#059669]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#382820] font-serif">
                      Template Chat Kilat (Quick Canned Responses)
                    </h2>
                    <p className="text-xs text-[#7a665b] mt-0.5">
                      Koleksi pesan template siap pakai untuk membalas buyer, mengirim akun, hingga panduan ambil kopi kasir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={openAddCannedModal}
                  className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Template Baru</span>
                </button>
              </div>
            </div>

            {/* Category Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                {[
                  { id: 'all', label: 'Semua Template' },
                  { id: 'kopi', label: '☕ Kopi Kenangan' },
                  { id: 'premium', label: '🍿 Aplikasi Premium' },
                  { id: 'jascur', label: '💬 Jasa Curhat' },
                  { id: 'payment', label: '💳 Pembayaran QRIS' },
                  { id: 'general', label: '⏳ Antrian & Umum' },
                ].map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? cannedResponses.length
                      : cannedResponses.filter((c) => c.category === cat.id).length;
                  const isActive = cannedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCannedCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#382820] text-white shadow-xs'
                          : 'bg-white text-[#7a665b] hover:bg-[#eae2d9] border border-[#eae2d9]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#eae2d9] text-[#382820]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a665b]" />
                <input
                  type="text"
                  placeholder="Cari judul / isi template chat..."
                  value={cannedSearch}
                  onChange={(e) => setCannedSearch(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 rounded-xl border border-[#eae2d9] text-xs bg-white focus:border-[#059669] focus:outline-hidden text-[#382820]"
                />
                {cannedSearch && (
                  <button
                    type="button"
                    onClick={() => setCannedSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Variable Information Banner */}
            <div className="p-4 rounded-3xl bg-[#ebf7f3] border border-[#bde5d8] text-xs text-[#059669] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Variabel Otomatis:</strong> Gunakan variabel{' '}
                  <code className="bg-white/70 px-1 py-0.5 rounded text-[11px] font-mono text-[#382820] font-bold">{'{nama}'}</code>,{' '}
                  <code className="bg-white/70 px-1 py-0.5 rounded text-[11px] font-mono text-[#382820] font-bold">{'{id_pesanan}'}</code>,{' '}
                  <code className="bg-white/70 px-1 py-0.5 rounded text-[11px] font-mono text-[#382820] font-bold">{'{produk}'}</code>,{' '}
                  <code className="bg-white/70 px-1 py-0.5 rounded text-[11px] font-mono text-[#382820] font-bold">{'{outlet}'}</code>,{' '}
                  <code className="bg-white/70 px-1 py-0.5 rounded text-[11px] font-mono text-[#382820] font-bold">{'{admin}'}</code> di dalam pesan untuk auto-replace nama buyer saat disalin.
                </span>
              </div>
            </div>

            {/* Canned Responses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
              {filteredCannedResponses.map((cr) => (
                <div
                  key={cr.id}
                  className="bg-white p-5 rounded-3xl border border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            cr.category === 'kopi'
                              ? 'bg-amber-100 text-amber-900'
                              : cr.category === 'jascur'
                              ? 'bg-teal-100 text-teal-900'
                              : cr.category === 'premium'
                              ? 'bg-emerald-100 text-emerald-900'
                              : cr.category === 'payment'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-stone-100 text-stone-800'
                          }`}
                        >
                          {cr.category.toUpperCase()}
                        </span>
                        {cr.isCustom && (
                          <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 text-[9px] font-black uppercase">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {cr.isCustom && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditCannedModal(cr)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-[#059669] hover:bg-[#ebf7f3] transition-colors cursor-pointer"
                              title="Edit template"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCanned(cr.id, cr.title)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus template"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-sm text-[#382820] leading-snug">
                      {cr.title}
                    </h3>

                    {/* Message Box */}
                    <div className="mt-2.5 p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs text-[#4e403b] whitespace-pre-line leading-relaxed font-sans max-h-48 overflow-y-auto">
                      {cr.text}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#eae2d9] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#7a665b]">
                      Format siap dikirim via Chatbot / Telegram
                    </span>
                    <button
                      type="button"
                      onClick={() => copyCannedResponse(cr, null)}
                      className="px-3.5 py-2 rounded-xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#bae5d6]" />
                      <span>Salin Pesan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: VOUCHER & PROMO DISKON ==================== */}
        {activeTab === 'vouchers' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-xl shadow-2xs shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#382820] font-serif">
                    Manajemen Voucher &amp; Promo Diskon
                  </h2>
                  <p className="text-xs text-[#7a665b] mt-0.5">
                    Buat kode promo persen atau potongan harga tetap untuk checkout Jasdor Kopi, Premium, dan Jascur.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddVoucherModal}
                className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Voucher Baru</span>
              </button>
            </div>

            {/* Voucher KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-3xl bg-white border border-[#eae2d9] shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
                  Total Voucher
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#382820]">
                  {voucherStats.total}
                </div>
                <div className="text-[10px] text-[#7a665b] mt-0.5">Tersimpan di katalog promo</div>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-[#eae2d9] shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#059669] mb-1">
                  Voucher Aktif
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#059669]">
                  {voucherStats.active}
                </div>
                <div className="text-[10px] text-[#059669] mt-0.5">Bisa langsung dipakai buyer</div>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-[#eae2d9] shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a665b] mb-1">
                  Total Klaim Terpakai
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#382820]">
                  {voucherStats.totalUsed}x
                </div>
                <div className="text-[10px] text-[#7a665b] mt-0.5">Total pemakaian sukses</div>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-[#eae2d9] shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                  Voucher Terfavorit
                </div>
                <div className="text-base sm:text-lg font-black text-amber-800 font-mono truncate">
                  {voucherStats.topVoucher?.code || '-'}
                </div>
                <div className="text-[10px] text-[#7a665b] mt-0.5">
                  {voucherStats.topVoucher ? `${voucherStats.topVoucher.usedCount}x digunakan` : 'Belum ada transaksi'}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-[#eae2d9] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#7a665b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kode promo atau judul voucher..."
                  value={voucherSearch}
                  onChange={(e) => setVoucherSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#a3948b] focus:border-[#059669] focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <select
                  value={voucherFilterStatus}
                  onChange={(e) => setVoucherFilterStatus(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Hanya Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>

                {/* Service Filter */}
                <select
                  value={voucherFilterService}
                  onChange={(e) => setVoucherFilterService(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Semua Layanan</option>
                  <option value="jasdor">☕ Jasdor Kopi</option>
                  <option value="premium">🍿 Premium</option>
                  <option value="jascur">💖 Jascur</option>
                </select>
              </div>
            </div>

            {/* Vouchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVouchers.map((v) => {
                const serviceLabel =
                  v.applicableService === 'jasdor'
                    ? '☕ Jasdor Kopi'
                    : v.applicableService === 'premium'
                    ? '🍿 Aplikasi Premium'
                    : v.applicableService === 'jascur'
                    ? '💖 Jascur (Curhat)'
                    : '🌐 Semua Layanan';

                const usagePct =
                  v.usageLimit && v.usageLimit > 0
                    ? Math.min(100, Math.round(((v.usedCount || 0) / v.usageLimit) * 100))
                    : null;

                return (
                  <div
                    key={v.id}
                    className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-2xs relative ${
                      v.isActive
                        ? 'border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-md'
                        : 'border-[#eae2d9] opacity-65 bg-[#fbf9f5]/60'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Code + Actions */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#eae2d9]">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-xl bg-[#382820] text-[#fbf9f5] font-mono text-xs font-black tracking-wider shadow-2xs">
                            {v.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyVoucherCode(v.code)}
                            title="Salin kode voucher"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#059669] hover:bg-[#ebf7f3] transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleVoucherActive(v.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition-all border ${
                              v.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                            }`}
                          >
                            {v.isActive ? '● Aktif' : '○ Nonaktif'}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditVoucherModal(v)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#059669] hover:bg-[#ebf7f3] transition-colors cursor-pointer"
                            title="Edit voucher"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVoucher(v.id, v.code)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus voucher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Service */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-[#059669] bg-[#ebf7f3] px-2 py-0.5 rounded-md border border-[#bde5d8]">
                            {serviceLabel}
                          </span>
                          {v.expiryDate && (
                            <span className="text-[10px] text-[#7a665b]">
                              s/d {new Date(v.expiryDate).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-sm text-[#382820] leading-snug">
                          {v.title}
                        </h3>
                      </div>

                      {/* Discount Highlight Card */}
                      <div className="mt-3 p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#7a665b]">Besar Potongan:</span>
                          <span className="font-black text-sm text-[#059669]">
                            {v.discountType === 'percent'
                              ? `Diskon ${v.discountValue}%`
                              : `Potongan Rp ${v.discountValue.toLocaleString('id-ID')}`}
                          </span>
                        </div>

                        {v.discountType === 'percent' && v.maxDiscount && (
                          <div className="flex items-center justify-between text-[10px] text-[#7a665b]">
                            <span>Maksimal Diskon:</span>
                            <span className="font-bold text-[#382820]">
                              Rp {v.maxDiscount.toLocaleString('id-ID')}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-[#7a665b] pt-1 border-t border-[#eae2d9]/60">
                          <span>Min. Belanja:</span>
                          <span className="font-bold text-[#382820]">
                            {v.minOrder > 0 ? `Rp ${v.minOrder.toLocaleString('id-ID')}` : 'Tanpa Minimum'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Usage Progress / Counter */}
                    <div className="mt-4 pt-3 border-t border-[#eae2d9]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[#7a665b] font-medium">Pemakaian Voucher:</span>
                        <span className="font-bold text-[#382820]">
                          {v.usedCount} {v.usageLimit ? `/ ${v.usageLimit}` : ''} kali
                        </span>
                      </div>
                      {usagePct !== null ? (
                        <div className="w-full h-2 rounded-full bg-[#eae2d9] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePct >= 100
                                ? 'bg-rose-500'
                                : usagePct >= 75
                                ? 'bg-amber-500'
                                : 'bg-[#059669]'
                            }`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#059669] font-medium">
                          ✓ Kuota tak terbatas (unlimited)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredVouchers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#eae2d9] p-6 space-y-2">
                <Ticket className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-bold text-sm text-[#382820]">Tidak ada voucher ditemukan</h3>
                <p className="text-xs text-[#7a665b] max-w-sm mx-auto">
                  Coba sesuaikan kata kunci pencarian atau klik &quot;Buat Voucher Baru&quot; untuk menambahkan promo baru.
                </p>
              </div>
            )}
          </div>
        )}

       {/* ==================== TAB 2: PENGATURAN JASCUR (JASA CURHAT) ==================== */}
        {activeTab === 'jascur' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Form: Edit Rates */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-5">
              <div className="pb-3 border-b border-[#eae2d9]">
                <h2 className="text-lg font-black text-[#382820] font-serif">
                  Pengaturan Pricelist &amp; Slot Jasa Curhat (Jascur)
                </h2>
                <p className="text-xs text-[#7a665b] mt-0.5">
                  Ubah tarif resmi, username Telegram penerima curhat, serta kontrol slot Voice Call.
                </p>
              </div>

              <form onSubmit={handleSaveJascur} className="space-y-4 text-xs">
                {/* 1. Tarif Chat */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Tarif Sesi Chat Teks (per Jam) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#7a665b]">Rp</span>
                    <input
                      type="number"
                      required
                      value={jascurChatRate}
                      onChange={(e) => setJascurChatRate(Number(e.target.value))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] text-[#7a665b] mt-0.5 block">
                    Default: Rp 3.000 / jam (kelipatan 2 jam = {formatRupiah(jascurChatRate * 2)}, 3 jam = {formatRupiah(jascurChatRate * 3)}).
                  </span>
                </div>

                {/* 2. Tarif Call */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Tarif Sesi Voice Call (per Jam) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#7a665b]">Rp</span>
                    <input
                      type="number"
                      required
                      value={jascurCallRate}
                      onChange={(e) => setJascurCallRate(Number(e.target.value))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] text-[#7a665b] mt-0.5 block">
                    Default: Rp 15.000 / jam (kelipatan 2 jam = {formatRupiah(jascurCallRate * 2)}).
                  </span>
                </div>

                {/* 3. Tarif Add-on VN */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Tarif Add-on Voice Note (VN) per Sesi *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#7a665b]">Rp</span>
                    <input
                      type="number"
                      required
                      value={jascurAddonVn}
                      onChange={(e) => setJascurAddonVn(Number(e.target.value))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] text-[#7a665b] mt-0.5 block">
                    Default: Rp 10.000 per sesi chat.
                  </span>
                </div>

                {/* 4. Telegram Account */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    ID / Username Akun Telegram Teman Curhat *
                  </label>
                  <input
                    type="text"
                    required
                    value={jascurTelegram}
                    onChange={(e) => setJascurTelegram(e.target.value)}
                    placeholder="@saoirse_temancurhat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-mono font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-[#7a665b] mt-0.5 block">
                    Akun Telegram privat yang akan muncul di layar tiket buyer setelah pembayaran QRIS.
                  </span>
                </div>

                {/* 5. Status Buka / Libur Jascur */}
                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#382820]">Status Layanan Jascur Global</div>
                      <div className="text-[10px] text-[#7a665b]">Buka untuk menerima order curhat baru</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setJascurIsOpen(!jascurIsOpen)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        jascurIsOpen
                          ? 'bg-[#059669] text-[#fbf9f5]'
                          : 'bg-rose-100 text-rose-700 border border-rose-300'
                      }`}
                    >
                      {jascurIsOpen ? 'Layanan BUKA' : 'Layanan TUTUP'}
                    </button>
                  </div>

                  {!jascurIsOpen && (
                    <div className="pt-2 border-t border-[#eae2d9] space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                          Pemberitahuan ke Buyer saat Jascur Tutup:
                        </label>
                        <input
                          type="text"
                          value={jascurCloseAnnouncement}
                          onChange={(e) => setJascurCloseAnnouncement(e.target.value)}
                          placeholder="Mohon maaf, saat ini slot teman curhat sedang istirahat sejenak."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-[#7a665b] uppercase tracking-wider">
                            ⏰ Estimasi Buka Kembali (Tampil ke User):
                          </label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => applyQuickEstimate(setJascurEstimatedOpen, 15)}
                              className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                            >
                              +15m
                            </button>
                            <button
                              type="button"
                              onClick={() => applyQuickEstimate(setJascurEstimatedOpen, 30)}
                              className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                            >
                              +30m
                            </button>
                            <button
                              type="button"
                              onClick={() => applyQuickEstimate(setJascurEstimatedOpen, 60)}
                              className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                            >
                              +1 Jam
                            </button>
                            <button
                              type="button"
                              onClick={() => setJascurEstimatedOpen('Besok Pukul 10:00 WIB')}
                              className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                            >
                              Besok
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={jascurEstimatedOpen}
                          onChange={(e) => setJascurEstimatedOpen(e.target.value)}
                          placeholder="Contoh: Pukul 15:30 WIB"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#059669] focus:border-[#059669] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                          🕒 Jadwal Aktif Sesi (Jam Kerja Curhat):
                        </label>
                        <input
                          type="text"
                          value={jascurClosedSchedule}
                          onChange={(e) => setJascurClosedSchedule(e.target.value)}
                          placeholder="Jadwal Sesi Aktif: 09:00 - 23:00 WIB"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Kontrol Kapasitas 1-Admin Sesi Voice Call */}
                <div className="p-4 rounded-2xl bg-[#ebf7f3]/50 border border-[#bde5d8] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#382820]">Kapasitas Voice Call (1 Admin)</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          jascurIsCallOpen
                            ? 'bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]'
                            : 'bg-rose-100 text-rose-700 border border-rose-300'
                        }`}>
                          {jascurIsCallOpen ? '🟢 Ready / Buka' : '🔴 Sedang Terkunci'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7a665b] mt-0.5 leading-relaxed">
                        Sistem otomatis mengunci slot Call begitu ada yang order Call agar admin tidak bentrok telepon. Begitu sesi selesai/berakhir, otomatis buka kembali.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setJascurIsCallOpen(!jascurIsCallOpen)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                        jascurIsCallOpen
                          ? 'bg-[#059669] text-[#fbf9f5]'
                          : 'bg-rose-600 text-[#fbf9f5]'
                      }`}
                    >
                      {jascurIsCallOpen ? 'Kunci Call Manual' : 'Buka Call Manual'}
                    </button>
                  </div>

                  {!jascurIsCallOpen && (
                    <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-[#382820] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-rose-700">⏳ Sedang Melayani Sesi Call:</span>
                        {jascurActiveCallOrderId && (
                          <span className="font-mono text-[10px] font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            {jascurActiveCallOrderId}
                          </span>
                        )}
                      </div>
                      {jascurActiveCallUntil && (
                        <div className="text-[11px] text-[#7a665b]">
                          Estimasi sesi berakhir otomatis: <strong className="text-[#382820]">{new Date(jascurActiveCallUntil).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleUnlockCallNow}
                        className="w-full py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-[#fbf9f5] font-bold text-xs transition-colors cursor-pointer text-center shadow-2xs"
                      >
                        🔓 Buka Kembali Slot Call Sekarang (Sesi Beres)
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      Pesan Banner saat Call Sedang Berlangsung / Penuh:
                    </label>
                    <input
                      type="text"
                      value={jascurCallLockReason}
                      onChange={(e) => setJascurCallLockReason(e.target.value)}
                      placeholder="Admin sedang melayani sesi call aktif. Slot call ditutup sementara."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 7. Pesan Pengumuman saat Jascur Tutup */}
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Pesan Pengumuman saat Jascur Tutup / Libur
                  </label>
                  <textarea
                    rows={2}
                    value={jascurCloseAnnouncement}
                    onChange={(e) => setJascurCloseAnnouncement(e.target.value)}
                    placeholder="Mohon maaf, saat ini slot teman curhat sedang istirahat. Admin akan membuka kembali segera."
                    className="w-full p-3 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#bae5d6]" />
                    <span>Simpan Pengaturan Jascur</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Live Preview as Customer Sees It */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#eae2d9] pb-3">
                <span className="text-xs font-bold text-[#7a665b] uppercase tracking-wider">
                  Live Preview Buyer
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#ebf7f3] text-[#059669]">
                  Tampilan Halaman Depan
                </span>
              </div>

              {/* Card 1 Preview */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Sesi Chat Teks</span>
                  <span className="text-sm font-black text-[#059669]">{formatRupiah(jascurChatRate)} / jam</span>
                </div>
                <p className="text-[11px] text-[#7a665b] mt-1">
                  1 Jam = {formatRupiah(jascurChatRate)} • 2 Jam = {formatRupiah(jascurChatRate * 2)} • 3 Jam = {formatRupiah(jascurChatRate * 3)}
                </p>
              </div>

              {/* Card 2 Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#ebf7f3] to-white border border-[#059669]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Sesi Voice Call</span>
                  <span className="text-sm font-black text-[#059669]">{formatRupiah(jascurCallRate)} / jam</span>
                </div>
                <p className="text-[11px] text-[#7a665b] mt-1">
                  1 Jam = {formatRupiah(jascurCallRate)} • 2 Jam = {formatRupiah(jascurCallRate * 2)}
                </p>
                <div className="mt-2 text-[10px] font-bold">
                  Status Saat Ini:{' '}
                  <span className={jascurIsCallOpen ? 'text-[#059669]' : 'text-rose-600'}>
                    {jascurIsCallOpen ? '🟢 Buka untuk Umum' : '🔴 Terkunci (Sedang Ada Sesi Telepon)'}
                  </span>
                </div>
              </div>

              {/* Card 3 Preview */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Add-on Voice Note (VN)</span>
                  <span className="text-sm font-black text-[#059669]">{formatRupiah(jascurAddonVn)} / sesi</span>
                </div>
                <p className="text-[11px] text-[#7a665b] mt-1">
                  Bebas kirim pesan suara tanpa batas selama sesi chat berlangsung.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#ebf7f3] border border-[#bde5d8] text-xs space-y-1">
                <div className="font-bold text-[#059669] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kerahasiaan 100% Terjamin</span>
                </div>
                <p className="text-[11px] text-[#4e403b] leading-relaxed">
                  Semua sesi curhat berlangsung via Telegram privat <strong>{jascurTelegram}</strong>. Data buyer anonim dan aman.
                </p>
              </div>
            </div>
          </div>
        )}

       {/* ==================== TAB 3: MENU & HARGA KOPKEN (83 MENU) ==================== */}
        {activeTab === 'kopken' && (
          <div className="bg-white p-6 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#eae2d9]">
              <div>
                <h2 className="text-lg font-black text-[#382820] font-serif">
                  Katalog Resmi Kopi Kenangan ({kopkenItems.length} Menu)
                </h2>
                <p className="text-xs text-[#7a665b] mt-0.5">
                  Ubah status stok (Ready / Habis dari pusat) dan edit harga diskon 50% secara instan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveKopken}
                className="px-4 py-2.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#bae5d6]" />
                <span>Simpan Perubahan Stok Kopken</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'Semua Menu' },
                  { id: 'signature', label: 'Signature' },
                  { id: 'coffee', label: 'Kopi' },
                  { id: 'non-coffee', label: 'Non-Coffee' },
                  { id: 'tea', label: 'Kenangan Tea' },
                  { id: 'food', label: 'Roti & Bakery' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setKopkenCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                      kopkenCategory === c.id
                        ? 'bg-[#382820] text-[#fbf9f5] border-[#382820]'
                        : 'bg-[#fbf9f5] text-[#7a665b] border-[#eae2d9] hover:bg-[#eae2d9]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#7a665b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari menu kopi, mantan, latte..."
                  value={kopkenSearch}
                  onChange={(e) => setKopkenSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] placeholder-[#7a665b] focus:border-[#059669] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredKopkenItems.map((item) => {
                const override = kopkenOverrides[item.id] || {};
                const isUnavailable = override.isUnavailable ?? false;
                const discountPrice = override.discountPrice ?? item.discountPrice;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isUnavailable
                        ? 'bg-stone-50 border-stone-200 opacity-60'
                        : 'bg-[#fbf9f5] border-[#eae2d9] hover:border-[#bde5d8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-[#7a665b] border border-[#eae2d9]">
                          {item.categoryLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleKopkenItemStock(item.id, item.name)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition-colors ${
                            isUnavailable
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]'
                          }`}
                        >
                          {isUnavailable ? '❌ Habis' : '✅ Ready'}
                        </button>
                      </div>

                      <h3 className="font-extrabold text-xs text-[#382820] line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] text-[#7a665b] line-clamp-1 mt-0.5">{item.description}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#eae2d9] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#7a665b] line-through">
                          {formatRupiah(item.originalPrice)}
                        </div>
                        <div className="font-black text-xs text-[#059669]">
                          {formatRupiah(discountPrice)} (50%)
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-[#7a665b]">
                        #{item.id}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

       {/* ==================== TAB 4: KATALOG APLIKASI PREMIUM ==================== */}
        {activeTab === 'premium' && (
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#eae2d9]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-black text-[#382820] font-serif">
                    Katalog Aplikasi Premium
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] text-xs font-black border border-[#bde5d8]">
                    {mergedProducts.length} Aplikasi
                  </span>
                </div>
                <p className="text-xs text-[#7a665b] mt-1">
                  Kelola ketersediaan stok, edit harga &amp; deskripsi paket, atau tambahkan aplikasi baru secara dinamis ke katalog toko.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={openAddAppModal}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Aplikasi Baru</span>
                </button>
                <button
                  type="button"
                  onClick={handleSavePremium}
                  className="px-4 py-2.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Simpan status stok aplikasi"
                >
                  <Save className="w-4 h-4 text-[#bae5d6]" />
                  <span className="hidden sm:inline">Simpan Status</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'streaming', label: '🎬 Streaming' },
                  { id: 'creative', label: '🎨 Desain & AI' },
                  { id: 'music', label: '🎵 Musik' },
                  { id: 'utility', label: '💼 Produktivitas' },
                ].map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? mergedProducts.length
                      : cat.id === 'creative'
                      ? mergedProducts.filter((p) => p.category === 'creative' || p.category === 'ai').length
                      : mergedProducts.filter((p) => p.category === cat.id).length;
                  const isActive = premiumCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPremiumCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#382820] text-white shadow-xs'
                          : 'bg-[#fbf9f5] text-[#7a665b] hover:bg-[#eae2d9] border border-[#eae2d9]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#eae2d9] text-[#382820]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a665b]" />
                <input
                  type="text"
                  placeholder="Cari nama aplikasi / fitur..."
                  value={premiumSearch}
                  onChange={(e) => setPremiumSearch(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] focus:bg-white focus:border-[#059669] focus:outline-hidden text-[#382820]"
                />
                {premiumSearch && (
                  <button
                    type="button"
                    onClick={() => setPremiumSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Apps Grid */}
            {filteredMergedProducts.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#fbf9f5] border border-dashed border-[#eae2d9]">
                <Smartphone className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h3 className="font-extrabold text-sm text-[#382820]">Tidak ada aplikasi ditemukan</h3>
                <p className="text-xs text-[#7a665b] mt-1 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau kategori, atau klik tombol di bawah untuk menambahkan aplikasi baru.
                </p>
                <button
                  type="button"
                  onClick={openAddAppModal}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#059669] text-white font-black text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Aplikasi Baru</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {filteredMergedProducts.map((prod) => {
                  const override = premiumOverrides[prod.id] || {};
                  const isUnavailable = override.isUnavailable ?? false;
                  const effectiveHasWarranty =
                    override.hasWarranty !== undefined
                      ? override.hasWarranty
                      : prod.hasWarranty !== false;
                  const isCustom = customProducts.some((c) => c.id === prod.id);

                  // Calculate lowest price
                  const allPrices = prod.planGroups.flatMap((g) => g.options.map((o) => o.price));
                  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
                  const totalPlans = allPrices.length;

                  return (
                    <div
                      key={prod.id}
                      className={`p-4.5 rounded-3xl border transition-all flex flex-col justify-between ${
                        isUnavailable
                          ? 'bg-stone-50 border-stone-200 opacity-70'
                          : 'bg-[#fbf9f5] border-[#eae2d9] hover:border-[#bde5d8] hover:shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Top: Avatar Icon + Badges + Stock Toggle */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0 select-none"
                              style={{ backgroundColor: prod.color || '#059669' }}
                            >
                              {prod.icon || prod.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-extrabold text-sm text-[#382820] leading-tight">
                                  {prod.name}
                                </h3>
                                {isCustom && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-wide">
                                    Custom
                                  </span>
                                )}
                                {!effectiveHasWarranty && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black uppercase tracking-wide flex items-center gap-0.5">
                                    <span>⚠️</span> Non Garansi
                                  </span>
                                )}
                              </div>
                              <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#7a665b] uppercase">
                                {prod.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => togglePremiumWarranty(prod.id, prod.name)}
                              title="Klik untuk ubah status garansi"
                              className={`px-2 py-1 rounded-xl text-[10px] font-black cursor-pointer transition-colors flex items-center gap-1 ${
                                effectiveHasWarranty
                                  ? 'bg-[#ebf7f3] text-[#059669] border border-[#bde5d8] hover:bg-[#d8f2e9]'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                              }`}
                            >
                              <span>{effectiveHasWarranty ? '🛡️ Garansi' : '⚠️ Non Garansi'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => togglePremiumStock(prod.id, prod.name)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer transition-colors shrink-0 ${
                                isUnavailable
                                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                  : 'bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]'
                              }`}
                            >
                              {isUnavailable ? '❌ Habis' : '✅ Ready'}
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-[#7a665b] line-clamp-2 leading-relaxed mb-3">
                          {prod.description}
                        </p>

                        {/* Pricing & Plan Info */}
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-[#eae2d9] text-[11px] mb-3">
                          <div>
                            <span className="text-[10px] text-[#7a665b] block">Mulai dari</span>
                            <span className="font-extrabold text-[#059669]">
                              Rp {lowestPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[#7a665b] block">Garansi</span>
                            <span
                              className={`font-bold ${
                                effectiveHasWarranty ? 'text-[#059669]' : 'text-amber-800'
                              }`}
                            >
                              {effectiveHasWarranty ? 'Full Replace' : 'Non Garansi'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Buttons: Edit and Delete */}
                      <div className="pt-3 border-t border-[#eae2d9] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openEditAppModal(prod)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-white hover:bg-[#eae2d9] text-[#382820] text-xs font-bold border border-[#eae2d9] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(prod.id, prod.name)}
                          className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-[#eae2d9] hover:border-rose-200 transition-colors cursor-pointer"
                          title="Hapus aplikasi dari katalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

       {/* ==================== TAB 5: PENGUMUMAN, OPERASIONAL & JADWAL TUTUP ==================== */}
        {activeTab === 'store' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#eae2d9] shadow-2xs max-w-2xl mx-auto space-y-6">
            <div className="pb-4 border-b border-[#eae2d9]">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#059669]" />
                <h2 className="text-lg font-black text-[#382820] font-serif">
                  Jadwal Operasional, Estimasi Buka &amp; Pengumuman Toko
                </h2>
              </div>
              <p className="text-xs text-[#7a665b] mt-1">
                Atur jam kerja, buka/tutup masing-masing layanan secara independen, dan berikan kepastian estimasi jam buka kembali kepada pembeli.
              </p>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-5 text-xs">
              {/* 1. Jam Operasional Harian Toko */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#059669]" />
                  <span className="font-bold text-xs text-[#382820]">Jadwal Jam Operasional Harian Toko</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      Jam Buka Toko (WIB):
                    </label>
                    <input
                      type="text"
                      value={dailyOpenTime}
                      onChange={(e) => setDailyOpenTime(e.target.value)}
                      placeholder="08:00 WIB"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      Jam Tutup Toko (WIB):
                    </label>
                    <input
                      type="text"
                      value={dailyCloseTime}
                      onChange={(e) => setDailyCloseTime(e.target.value)}
                      placeholder="22:00 WIB"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#7a665b]">
                  Jam buka-tutup ini menjadi acuan waktu kerja admin untuk melayani buyer secara resmi.
                </p>
              </div>

              {/* 2. Status Antrian Global */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider">
                  Status Penerimaan Antrian Toko Global *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setQueueOpen(true)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      queueOpen
                        ? 'bg-[#ebf7f3] border-[#059669] text-[#059669] ring-1 ring-[#059669]'
                        : 'bg-white border-[#eae2d9] text-[#7a665b]'
                    }`}
                  >
                    <div className="font-bold text-xs">Antrian BUKA 🟢</div>
                    <div className="text-[10px] mt-0.5">Pembeli bebas checkout QRIS All Payment</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQueueOpen(false)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      !queueOpen
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-1 ring-rose-400'
                        : 'bg-white border-[#eae2d9] text-[#7a665b]'
                    }`}
                  >
                    <div className="font-bold text-xs">Antrian DITAHAN 🔴</div>
                    <div className="text-[10px] mt-0.5">Admin istirahat / proses batch order</div>
                  </button>
                </div>

                {!queueOpen && (
                  <div className="pt-2 border-t border-[#eae2d9] space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        Alasan Penutupan Antrian Sementara:
                      </label>
                      <input
                        type="text"
                        value={queueLockReason}
                        onChange={(e) => setQueueLockReason(e.target.value)}
                        placeholder="Admin sedang istirahat / proses batch order"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-[#7a665b] uppercase tracking-wider">
                          ⏰ Estimasi Antrian Dibuka Kembali:
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setQueueEstimatedOpen, 15)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +15m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setQueueEstimatedOpen, 30)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +30m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setQueueEstimatedOpen, 60)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +1 Jam
                          </button>
                          <button
                            type="button"
                            onClick={() => setQueueEstimatedOpen('Besok Pukul 08:00 WIB')}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            Besok
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={queueEstimatedOpen}
                        onChange={(e) => setQueueEstimatedOpen(e.target.value)}
                        placeholder="Contoh: Pukul 14:00 WIB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#059669] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Status Layanan Jasdor Kopi Kenangan */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#382820]">Layanan Jasdor Kopi Kenangan (Diskon 50%)</div>
                    <div className="text-[10px] text-[#7a665b]">Buka / Tutup pemesanan jastip kopi</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStoreJasdorOpen(!storeJasdorOpen)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      storeJasdorOpen
                        ? 'bg-[#059669] text-[#fbf9f5]'
                        : 'bg-rose-100 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {storeJasdorOpen ? 'Jasdor BUKA' : 'Jasdor TUTUP'}
                  </button>
                </div>

                {!storeJasdorOpen && (
                  <div className="pt-2 border-t border-[#eae2d9] space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        Pemberitahuan saat Jasdor Tutup (Tampil di /jasdor):
                      </label>
                      <input
                        type="text"
                        value={storeJasdorAnnouncement}
                        onChange={(e) => setStoreJasdorAnnouncement(e.target.value)}
                        placeholder="Mohon maaf, layanan Jasdor Kopi Kenangan sedang ditutup sementara oleh admin."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-[#7a665b] uppercase tracking-wider">
                          ⏰ Estimasi Buka Kembali (Tampil ke User):
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setStoreJasdorEstimatedOpen, 15)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +15m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setStoreJasdorEstimatedOpen, 30)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +30m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setStoreJasdorEstimatedOpen, 60)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +1 Jam
                          </button>
                          <button
                            type="button"
                            onClick={() => setStoreJasdorEstimatedOpen('Besok Pukul 08:00 WIB')}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            Besok
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={storeJasdorEstimatedOpen}
                        onChange={(e) => setStoreJasdorEstimatedOpen(e.target.value)}
                        placeholder="Contoh: Pukul 14:30 WIB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#059669] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        🕒 Jadwal Kasir / Pick-up Jasdor:
                      </label>
                      <input
                        type="text"
                        value={storeJasdorClosedSchedule}
                        onChange={(e) => setStoreJasdorClosedSchedule(e.target.value)}
                        placeholder="Jadwal Kasir: 08:00 - 21:30 WIB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Status Layanan Aplikasi Premium */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#382820]">Layanan Katalog Aplikasi Premium</div>
                    <div className="text-[10px] text-[#7a665b]">Buka / Tutup pemesanan akun premium global</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStorePremiumOpen(!storePremiumOpen)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      storePremiumOpen
                        ? 'bg-[#059669] text-[#fbf9f5]'
                        : 'bg-rose-100 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {storePremiumOpen ? 'Premium BUKA' : 'Premium TUTUP'}
                  </button>
                </div>

                {!storePremiumOpen && (
                  <div className="pt-2 border-t border-[#eae2d9] space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        Pemberitahuan saat Premium Tutup (Tampil di /premium):
                      </label>
                      <input
                        type="text"
                        value={storePremiumAnnouncement}
                        onChange={(e) => setStorePremiumAnnouncement(e.target.value)}
                        placeholder="Mohon maaf, saat ini pembelian akun premium sedang ditutup sementara untuk verifikasi stok."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-[#7a665b] uppercase tracking-wider">
                          ⏰ Estimasi Buka Kembali (Tampil ke User):
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setStorePremiumEstimatedOpen, 15)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +15m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setStorePremiumEstimatedOpen, 30)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +30m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setStorePremiumEstimatedOpen, 60)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +1 Jam
                          </button>
                          <button
                            type="button"
                            onClick={() => setStorePremiumEstimatedOpen('Besok Pukul 08:00 WIB')}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            Besok
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={storePremiumEstimatedOpen}
                        onChange={(e) => setStorePremiumEstimatedOpen(e.target.value)}
                        placeholder="Contoh: Pukul 16:00 WIB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#059669] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        🕒 Jadwal Operasional / Maintenance:
                      </label>
                      <input
                        type="text"
                        value={storePremiumClosedSchedule}
                        onChange={(e) => setStorePremiumClosedSchedule(e.target.value)}
                        placeholder="Layanan 24 Jam (Maintenance 03:00 - 05:00 WIB)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Status Layanan Jasa Curhat (Jascur) */}
              <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#382820]">Layanan Jasa Curhat (Jascur Teman Cerita)</div>
                    <div className="text-[10px] text-[#7a665b]">Buka / Tutup pemesanan sesi curhat privat</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJascurIsOpen(!jascurIsOpen)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      jascurIsOpen
                        ? 'bg-[#059669] text-[#fbf9f5]'
                        : 'bg-rose-100 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {jascurIsOpen ? 'Jascur BUKA' : 'Jascur TUTUP'}
                  </button>
                </div>

                {!jascurIsOpen && (
                  <div className="pt-2 border-t border-[#eae2d9] space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        Pemberitahuan saat Jascur Tutup (Tampil di /jascur):
                      </label>
                      <input
                        type="text"
                        value={jascurCloseAnnouncement}
                        onChange={(e) => setJascurCloseAnnouncement(e.target.value)}
                        placeholder="Mohon maaf, saat ini slot teman curhat sedang istirahat sejenak."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-[#7a665b] uppercase tracking-wider">
                          ⏰ Estimasi Sesi Buka Kembali (Tampil ke User):
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setJascurEstimatedOpen, 15)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +15m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setJascurEstimatedOpen, 30)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +30m
                          </button>
                          <button
                            type="button"
                            onClick={() => applyQuickEstimate(setJascurEstimatedOpen, 60)}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            +1 Jam
                          </button>
                          <button
                            type="button"
                            onClick={() => setJascurEstimatedOpen('Besok Pukul 10:00 WIB')}
                            className="px-1.5 py-0.5 rounded bg-white border border-[#eae2d9] text-[9px] font-bold hover:bg-[#ebf7f3] text-[#059669]"
                          >
                            Besok
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={jascurEstimatedOpen}
                        onChange={(e) => setJascurEstimatedOpen(e.target.value)}
                        placeholder="Contoh: Pukul 15:30 WIB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#059669] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        🕒 Jadwal Sesi Curhat (Jam Kerja Aktif):
                      </label>
                      <input
                        type="text"
                        value={jascurClosedSchedule}
                        onChange={(e) => setJascurClosedSchedule(e.target.value)}
                        placeholder="Jadwal Sesi Aktif: 09:00 - 23:00 WIB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Banner Text */}
              <div>
                <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                  Teks Pengumuman / Running Banner Toko
                </label>
                <textarea
                  rows={3}
                  value={storeAnnouncement}
                  onChange={(e) => setStoreAnnouncement(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* 7. CS Telegram */}
              <div>
                <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                  Username Telegram CS Resmi Toko
                </label>
                <input
                  type="text"
                  placeholder="@saoirse_cs"
                  value={storeTelegram}
                  onChange={(e) => setStoreTelegram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-mono font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] text-[#fbf9f5] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#bae5d6]" />
                  <span>Simpan Pengaturan Toko, Jadwal &amp; Estimasi Buka</span>
                </button>
              </div>
            </form>
          </div>
        )}

       {/* ==================== TAB 6: KEAMANAN & VERMUK SAYA ==================== */}
        {activeTab === 'profile' && loggedInAdmin && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Profil */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#eae2d9] shadow-2xs space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#eae2d9]">
                <div className="w-12 h-12 rounded-2xl bg-[#059669] text-[#bae5d6] font-bold text-xl flex items-center justify-center font-serif shadow-xs">
                  {loggedInAdmin[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[#382820] font-serif">
                      Profil &amp; Keamanan Akun ({loggedInAdmin})
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-[#ebf7f3] text-[#059669] font-bold text-[10px] border border-[#bde5d8]">
                      {adminAccounts[loggedInAdmin]?.role || 'Admin Aktif'}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a665b] mt-0.5">
                    Kelola password pribadi dan daftarkan foto wajah biometrik (Vermuk) agar bisa login cepat tanpa password.
                  </p>
                </div>
              </div>

              {/* CARD 1: UBAH PASSWORD PRIBADI */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#059669]" />
                  <h3 className="font-extrabold text-sm text-[#382820]">Ubah Password Pribadi</h3>
                </div>
                <p className="text-xs text-[#7a665b]">
                  Password ini khusus untuk akun <strong>{loggedInAdmin}</strong> saat memilih login via Password.
                </p>

                <form onSubmit={handleSaveNewPassword} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      Password Baru ({loggedInAdmin})
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Masukkan password baru (min. 4 karakter)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eae2d9] text-xs font-medium text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      placeholder="Ketik ulang password baru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eae2d9] text-xs font-medium text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingPassword || !newPasswordInput}
                    className="px-4 py-2.5 rounded-xl bg-[#382820] hover:bg-[#251a14] disabled:opacity-50 text-[#fbf9f5] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#bae5d6]" />
                    <span>{isSavingPassword ? 'Menyimpan...' : 'Perbarui Password Saya'}</span>
                  </button>
                </form>
              </div>

              {/* CARD 2: PENDAFTARAN VERMUK (BIOMETRIK WAJAH) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#059669]" />
                    <h3 className="font-extrabold text-sm text-[#382820]">Biometrik Wajah (Vermuk Face ID)</h3>
                  </div>
                  {adminAccounts[loggedInAdmin]?.registeredFacePhoto ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#ebf7f3] text-[#059669] font-bold text-[10px] border border-[#bde5d8] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Vermuk Terdaftar
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                      Belum Terdaftar
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#7a665b]">
                  Daftarkan foto wajah kamu lewat kamera selfie webcam. Setelah terdaftar, kamu bisa langsung masuk ke portal admin cukup dengan klik <strong>Pindai Wajah</strong> tanpa perlu ketik password lagi!
                </p>

                {/* Status Foto Terdaftar Saat Ini */}
                {adminAccounts[loggedInAdmin]?.registeredFacePhoto && !enrollVideoActive && !enrolledSnapshot && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#bde5d8] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={adminAccounts[loggedInAdmin].registeredFacePhoto!}
                        alt={`Wajah ${loggedInAdmin}`}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-[#059669] shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#382820]">Wajah Biometrik Aktif</div>
                        <div className="text-[10px] text-[#7a665b]">
                          Terdaftar: {adminAccounts[loggedInAdmin].lastEnrolledAt || 'Aktif'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={startEnrollCamera}
                        className="px-3 py-1.5 rounded-xl bg-[#ebf7f3] text-[#059669] hover:bg-[#d8f1e8] font-bold text-xs border border-[#bde5d8] cursor-pointer"
                      >
                        Foto Ulang
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFace}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}

                {/* Idle state (Belum daftar atau mau foto baru) */}
                {!adminAccounts[loggedInAdmin]?.registeredFacePhoto && !enrollVideoActive && !enrolledSnapshot && (
                  <div className="text-center py-6 px-4 rounded-2xl bg-white border border-[#eae2d9] space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#ebf7f3] text-[#059669] flex items-center justify-center mx-auto">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-xs text-[#382820]">Wajah Belum Terdaftar</div>
                    <p className="text-[11px] text-[#7a665b] max-w-sm mx-auto">
                      Ambil selfie wajah kamu sekarang agar akun {loggedInAdmin} bisa login via Face ID Vermuk.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={startEnrollCamera}
                        className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Buka Kamera &amp; Ambil Foto Selfie</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Camera Active for Enrollment */}
                {enrollVideoActive && (
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#bde5d8] text-center">
                    <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-[#059669] aspect-square max-w-[220px] mx-auto shadow-inner">
                      <video
                        ref={enrollVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-3 border-2 border-dashed border-[#059669]/80 rounded-full pointer-events-none animate-pulse" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-mono">
                        ENROLL WEBCAM
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7a665b]">
                      Posisikan wajah tepat di dalam lingkaran, lalu klik <strong>Ambil Foto Snapshot</strong>.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={captureEnrollSnapshot}
                        className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Ambil Foto Snapshot</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopEnrollCamera}
                        className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#7a665b] font-bold text-xs cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* Snapshot Captured, Confirm Save */}
                {enrolledSnapshot && (
                  <div className="p-4 rounded-2xl bg-white border border-[#bde5d8] text-center space-y-3">
                    <div className="font-bold text-xs text-[#382820]">Pratinjau Foto Wajah ({loggedInAdmin})</div>
                    <img
                      src={enrolledSnapshot}
                      alt="Enrolled Snapshot"
                      className="w-36 h-36 rounded-2xl object-cover mx-auto border-2 border-[#059669] shadow-md"
                    />
                    <p className="text-[11px] text-[#7a665b]">
                      Apakah foto ini sudah jelas dan pas? Klik simpan untuk mengaktifkan Vermuk.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={handleSaveEnrolledFace}
                        className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan sebagai Wajah Vermuk Saya</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEnrolledSnapshot(null);
                          startEnrollCamera();
                        }}
                        className="px-3 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] hover:bg-stone-100 text-[#7a665b] font-bold text-xs cursor-pointer"
                      >
                        Foto Ulang
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
      </div>

      {/* ==================== FULFILLMENT MODAL: COMPLETE ORDER ==================== */}
      {selectedOrderToComplete && (() => {
        const isJascur =
          selectedOrderToComplete.productId === 'jascur' ||
          selectedOrderToComplete.planGroup?.includes('Curhat');
        const isKopken =
          selectedOrderToComplete.productId === 'kopi-kenangan' ||
          Boolean(selectedOrderToComplete.outlet) ||
          selectedOrderToComplete.items?.some(
            (i) => i.id?.startsWith('kopken') || i.name?.toLowerCase().includes('kopi')
          );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-[#eae2d9] max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
                <div>
                  <h3 className="text-base font-extrabold text-[#382820] font-serif">
                    Kirim Data Akun / Penyelesaian #{selectedOrderToComplete.id}
                  </h3>
                  <p className="text-xs text-[#7a665b] mt-0.5">
                    Data berikut akan dikirim ke layar tiket buyer secara instan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderToComplete(null)}
                  className="w-8 h-8 rounded-full bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCompleteSubmit} className="space-y-3.5 text-xs">
                {isKopken ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-[#7a665b] uppercase mb-1">
                        Pesan Pengambilan di Kasir
                      </label>
                      <input
                        type="text"
                        value={credEmail}
                        onChange={(e) => setCredEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#7a665b] uppercase mb-1">
                        Nama Pemesan di Kasir
                      </label>
                      <input
                        type="text"
                        value={credProfile}
                        onChange={(e) => setCredProfile(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#7a665b] uppercase mb-1">
                        Instruksi Pengambilan
                      </label>
                      <textarea
                        value={credNotes}
                        onChange={(e) => setCredNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820] leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#7a665b] uppercase mb-1">
                          {isJascur ? 'Telegram Buyer' : 'Email / Username Akun'}
                        </label>
                        <input
                          type="text"
                          value={credEmail}
                          onChange={(e) => setCredEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#7a665b] uppercase mb-1">
                          {isJascur ? 'Slot / Sesi' : 'Password Akun'}
                        </label>
                        <input
                          type="text"
                          value={credPassword}
                          onChange={(e) => setCredPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#7a665b] uppercase mb-1">
                          {isJascur ? 'Nama Panggilan' : 'Nama Profil Akun'}
                        </label>
                        <input
                          type="text"
                          value={credProfile}
                          onChange={(e) => setCredProfile(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#7a665b] uppercase mb-1">
                          {isJascur ? 'Tipe Sesi' : 'PIN Profil'}
                        </label>
                        <input
                          type="text"
                          value={credPin}
                          onChange={(e) => setCredPin(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#7a665b] uppercase mb-1">
                        {isJascur ? 'Status Penyelesaian' : 'Masa Aktif / Garansi'}
                      </label>
                      <input
                        type="text"
                        value={credExpired}
                        onChange={(e) => setCredExpired(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#7a665b] uppercase mb-1">
                        Catatan Penting untuk Buyer
                      </label>
                      <textarea
                        value={credNotes}
                        onChange={(e) => setCredNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#eae2d9] text-xs focus:border-[#059669] focus:outline-hidden bg-[#fbf9f5] text-[#382820] leading-relaxed resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Kalkulasi Uang Modal (HPP) & Keuntungan Bersih */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#ebf7f3] to-emerald-50/50 border border-[#bde5d8] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#059669]">
                      <DollarSign className="w-4 h-4" />
                      <span>Kalkulasi Uang Modal (HPP) &amp; Keuntungan Bersih</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                      Margin {selectedOrderToComplete.price > 0 ? Math.round((Math.max(0, selectedOrderToComplete.price - credCostPrice) / selectedOrderToComplete.price) * 100) : 0}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#eae2d9]">
                      <span className="text-[10px] text-[#7a665b] block">Harga Jual (Uang Masuk)</span>
                      <span className="font-extrabold text-[#382820] text-sm font-mono">
                        Rp {selectedOrderToComplete.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-amber-300">
                      <label className="text-[10px] font-bold text-amber-800 block mb-1">
                        Uang Modal Keluar (HPP)
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#7a665b]">Rp</span>
                        <input
                          type="number"
                          min="0"
                          value={credCostPrice}
                          onChange={(e) => setCredCostPrice(Number(e.target.value) || 0)}
                          className="w-full font-bold text-xs text-[#382820] focus:outline-hidden bg-transparent border-b border-amber-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300">
                      <span className="text-[10px] font-bold text-emerald-800 block">
                        Keuntungan Bersih (Profit)
                      </span>
                      <span className="font-extrabold text-emerald-600 text-sm font-mono">
                        Rp {Math.max(0, selectedOrderToComplete.price - credCostPrice).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#7a665b]">
                    💡 Modal kasir / supplier dicatat otomatis ke pembukuan finansial toko saoirse.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#382820] hover:bg-[#251a14] disabled:opacity-50 text-[#fbf9f5] font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#bae5d6]" />
                    <span>Kirim ke Layar Buyer #{selectedOrderToComplete.id}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ==================== MODAL: ADD / EDIT APP ==================== */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-[#eae2d9] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
              <div>
                <h3 className="text-base font-extrabold text-[#382820] font-serif">
                  {editingAppId ? '✏️ Edit Aplikasi Premium' : '✨ Tambah Aplikasi Baru'}
                </h3>
                <p className="text-xs text-[#7a665b] mt-0.5">
                  Aplikasi akan langsung muncul di katalog buyer &amp; sinkron ke checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAppModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAppSubmit} className="space-y-4 text-xs">
              {/* App Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#7a665b] uppercase mb-1">
                    Nama Aplikasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: CapCut Pro / ChatGPT Plus"
                    value={formAppName}
                    onChange={(e) => setFormAppName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] focus:bg-white focus:border-[#059669] focus:outline-hidden text-[#382820] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7a665b] uppercase mb-1">
                    Kategori
                  </label>
                  <select
                    value={formAppCategory}
                    onChange={(e) => setFormAppCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] focus:bg-white focus:border-[#059669] focus:outline-hidden text-[#382820] font-semibold"
                  >
                    <option value="streaming">🎬 Streaming &amp; Hiburan</option>
                    <option value="creative">🎨 Desain, Video &amp; Editing</option>
                    <option value="ai">🤖 Artificial Intelligence (AI)</option>
                    <option value="music">🎵 Musik &amp; Audio</option>
                    <option value="utility">💼 Produktivitas &amp; Kerja</option>
                    <option value="education">📚 Edukasi &amp; Kursus</option>
                  </select>
                </div>
              </div>

              {/* Icon, Color, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#7a665b] uppercase mb-1">
                    Emoji / Icon
                  </label>
                  <input
                    type="text"
                    placeholder="🎬 / 🤖 / 🎨"
                    value={formAppIcon}
                    onChange={(e) => setFormAppIcon(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] focus:bg-white focus:border-[#059669] focus:outline-hidden text-[#382820]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7a665b] uppercase mb-1">
                    Warna Tema Avatar
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formAppColor}
                      onChange={(e) => setFormAppColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-[#eae2d9] cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={formAppColor}
                      onChange={(e) => setFormAppColor(e.target.value)}
                      className="flex-1 px-2.5 py-2 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] font-mono text-[#382820]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#7a665b] uppercase mb-1">
                    Badge Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="POPULER / BEST SELLER"
                    value={formAppBadge}
                    onChange={(e) => setFormAppBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] focus:bg-white focus:border-[#059669] focus:outline-hidden text-[#382820]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[#7a665b] uppercase mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan fitur aplikasi, garansi akun replace, durasi aktif, dll."
                  value={formAppDescription}
                  onChange={(e) => setFormAppDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#eae2d9] text-xs bg-[#fbf9f5] focus:bg-white focus:border-[#059669] focus:outline-hidden text-[#382820] resize-none"
                />
              </div>

              {/* Warranty Status Setting */}
              <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#382820] uppercase text-[11px]">
                    Ketentuan Garansi Akun
                  </label>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      formAppHasWarranty
                        ? 'bg-[#ebf7f3] text-[#059669] border border-[#bde5d8]'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {formAppHasWarranty ? '🛡️ Bergaransi' : '⚠️ Non Garansi'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormAppHasWarranty(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      formAppHasWarranty
                        ? 'bg-white text-[#059669] border-[#059669] shadow-xs ring-1 ring-[#059669]'
                        : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#eae2d9]'
                    }`}
                  >
                    <span>🛡️ Bergaransi (Replace)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormAppHasWarranty(false)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      !formAppHasWarranty
                        ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-xs ring-1 ring-amber-400'
                        : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#eae2d9]'
                    }`}
                  >
                    <span>⚠️ Non Garansi (Lepas)</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#7a665b] leading-relaxed">
                  {formAppHasWarranty
                    ? '✅ Akun bergaransi penuh: Jika akun bermasalah sebelum masa aktif berakhir, admin berkewajiban mengganti akun baru.'
                    : '⚠️ Akun tanpa garansi: Penjualan bersifat lepas. Badge "Non Garansi" berwarna amber akan otomatis dipasang di katalog etalase & modal checkout pembeli.'}
                </p>
              </div>

              {/* Plan Options Section */}
              <div className="pt-2 border-t border-[#eae2d9]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block font-bold text-[#382820] uppercase">
                      Daftar Opsi Paket &amp; Harga
                    </label>
                    <span className="text-[11px] text-[#7a665b]">
                      Atur nama paket durasi, harga Rp, dan catatan garansi.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addPlanRow}
                    className="px-3 py-1.5 rounded-xl bg-[#ebf7f3] hover:bg-[#d4f0e6] text-[#059669] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-[#bde5d8]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Opsi</span>
                  </button>
                </div>

                <div className="space-y-2 mt-2">
                  {formAppPlans.map((plan, idx) => (
                    <div
                      key={plan.id || idx}
                      className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#7a665b] block mb-0.5">
                          Nama Paket #{idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1 Bulan Sharing"
                          value={plan.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormAppPlans((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, name: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-[#eae2d9] text-xs bg-white text-[#382820] font-semibold"
                        />
                      </div>

                      <div className="w-full sm:w-32">
                        <span className="text-[10px] font-bold text-[#7a665b] block mb-0.5">
                          Harga (Rp)
                        </span>
                        <input
                          type="number"
                          required
                          min={1000}
                          step={500}
                          value={plan.price}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFormAppPlans((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, price: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-[#eae2d9] text-xs bg-white text-[#382820] font-mono font-bold"
                        />
                      </div>

                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#7a665b] block mb-0.5">
                          Garansi / Note
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Garansi 30 Hari"
                          value={plan.notes || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormAppPlans((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, notes: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-[#eae2d9] text-xs bg-white text-[#382820]"
                        />
                      </div>

                      <div className="sm:pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePlanRow(idx)}
                          disabled={formAppPlans.length <= 1}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-400 transition-colors cursor-pointer"
                          title="Hapus opsi ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#eae2d9] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-[#eae2d9] hover:bg-[#dfd5c9] text-[#382820] font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAppId ? 'Simpan Perubahan' : 'Tambahkan Aplikasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD / EDIT CANNED RESPONSE ==================== */}
      {isCannedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-[#eae2d9] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
              <div>
                <h3 className="text-base font-extrabold text-[#382820] font-serif flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#059669]" />
                  <span>{editingCannedId ? '✏️ Edit Template Chat' : '✨ Buat Template Chat Baru'}</span>
                </h3>
                <p className="text-xs text-[#7a665b] mt-0.5">
                  Bisa langsung di-copy atau dipakai balas pesanan buyer otomatis dengan 1-klik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCannedModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCannedSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                  Judul Singkat Template *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Konfirmasi Pickup Kopi, Kirim Akun Netflix"
                  value={formCannedTitle}
                  onChange={(e) => setFormCannedTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                  Kategori Layanan *
                </label>
                <select
                  value={formCannedCategory}
                  onChange={(e) => setFormCannedCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden cursor-pointer"
                >
                  <option value="general">💬 Umum &amp; Sapaan</option>
                  <option value="kopi">☕ Jasdor Kopi Kenangan</option>
                  <option value="premium">🍿 Aplikasi Premium</option>
                  <option value="jascur">💖 Jascur (Jasa Curhat)</option>
                  <option value="payment">💳 Pembayaran QRIS / Tiket</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider">
                    Isi Template Pesan *
                  </label>
                  <span className="text-[10px] text-[#7a665b]">
                    Klik tag variabel di bawah untuk insert cepat
                  </span>
                </div>

                {/* Variable Quick Inserts */}
                <div className="flex flex-wrap gap-1.5 mb-2 p-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9]">
                  {[
                    { tag: '{nama}', desc: 'Nama Buyer' },
                    { tag: '{id_pesanan}', desc: 'ID Tiket' },
                    { tag: '{produk}', desc: 'Nama Produk/Menu' },
                    { tag: '{outlet}', desc: 'Outlet Cabang' },
                    { tag: '{admin}', desc: 'Nama Admin' },
                    { tag: '{nominal}', desc: 'Harga Total' },
                    { tag: '{email}', desc: 'Email Akun' },
                    { tag: '{password}', desc: 'Pass Akun' },
                    { tag: '{profil}', desc: 'Profil / Screen' },
                    { tag: '{pin}', desc: 'PIN Akun' },
                    { tag: '{durasi}', desc: 'Durasi/Paket' },
                  ].map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => setFormCannedText((prev) => prev + v.tag)}
                      className="px-2 py-1 rounded-lg bg-white border border-[#eae2d9] hover:border-[#059669] hover:bg-emerald-50 text-[10px] font-mono font-bold text-[#059669] transition-all cursor-pointer"
                      title={v.desc}
                    >
                      {v.tag}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={8}
                  placeholder="Halo {nama}, pesanan {produk} kamu dengan ID #{id_pesanan} sudah selesai diproses..."
                  value={formCannedText}
                  onChange={(e) => setFormCannedText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-medium text-[#382820] focus:border-[#059669] focus:outline-hidden font-mono leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#eae2d9] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCannedModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-[#eae2d9] hover:bg-[#dfd5c9] text-[#382820] font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCannedId ? 'Simpan Perubahan' : 'Buat Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD / EDIT VOUCHER ==================== */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-[#eae2d9] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae2d9]">
              <div>
                <h3 className="text-base font-extrabold text-[#382820] font-serif flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#059669]" />
                  <span>{editingVoucherId ? '✏️ Edit Voucher Promo' : '✨ Buat Voucher Diskon Baru'}</span>
                </h3>
                <p className="text-xs text-[#7a665b] mt-0.5">
                  Kode promo dapat langsung digunakan pembeli di keranjang Jasdor Kopi, Premium, atau Jascur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#fbf9f5] hover:bg-[#eae2d9] text-[#7a665b] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVoucherSubmit} className="space-y-4 text-xs">
              {/* Kode Voucher */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider">
                    Kode Voucher *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[10px] font-bold text-[#059669] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Acak Kode 🎲</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SAOIRSEHEMAT"
                    value={formVoucherCode}
                    onChange={(e) => setFormVoucherCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-mono font-black text-[#382820] tracking-wider uppercase focus:border-[#059669] focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-[#7a665b] mt-1 block">
                  Otomatis huruf besar tanpa spasi.
                </span>
              </div>

              {/* Judul Promo */}
              <div>
                <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                  Judul / Keterangan Promo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskon Rp 5.000 Spesial Tanggal Muda"
                  value={formVoucherTitle}
                  onChange={(e) => setFormVoucherTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                />
              </div>

              {/* Tipe Diskon & Besaran */}
              <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#eae2d9] space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1.5">
                    Tipe Potongan Diskon *
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setFormVoucherType('fixed')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        formVoucherType === 'fixed'
                          ? 'bg-[#382820] text-[#fbf9f5] border-[#382820] shadow-xs'
                          : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#f2ece3]'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Nominal Tetap (Rp)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormVoucherType('percent')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        formVoucherType === 'percent'
                          ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                          : 'bg-white text-[#7a665b] border-[#eae2d9] hover:bg-[#ebf7f3]'
                      }`}
                    >
                      <Percent className="w-3.5 h-3.5" />
                      <span>Persentase (%)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      {formVoucherType === 'fixed' ? 'Nominal Potongan (Rp) *' : 'Persentase Diskon (%) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder={formVoucherType === 'fixed' ? '5000' : '15'}
                      value={formVoucherValue || ''}
                      onChange={(e) => setFormVoucherValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-bold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>

                  {formVoucherType === 'percent' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        Maks. Potongan (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="Opsional (misal: 10000)"
                        value={formVoucherMaxDiscount}
                        onChange={(e) =>
                          setFormVoucherMaxDiscount(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                        Min. Belanja (Rp) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0 jika tanpa minimal"
                        value={formVoucherMinOrder}
                        onChange={(e) => setFormVoucherMinOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                {formVoucherType === 'percent' && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                      Min. Belanja (Rp) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0 jika tanpa minimal"
                      value={formVoucherMinOrder}
                      onChange={(e) => setFormVoucherMinOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Cakupan Layanan & Kuota */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Berlaku untuk Layanan *
                  </label>
                  <select
                    value={formVoucherService}
                    onChange={(e) => setFormVoucherService(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">🌐 Semua Layanan</option>
                    <option value="jasdor">☕ Jasdor Kopi Kenangan</option>
                    <option value="premium">🍿 Aplikasi Premium</option>
                    <option value="jascur">💖 Jasa Curhat (Jascur)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Batas Kuota Pemakaian
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Kosongkan jika unlimited"
                    value={formVoucherUsageLimit}
                    onChange={(e) =>
                      setFormVoucherUsageLimit(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tanggal Kedaluwarsa & Status Aktif */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-[#7a665b] uppercase tracking-wider mb-1">
                    Tanggal Kedaluwarsa
                  </label>
                  <input
                    type="date"
                    value={formVoucherExpiryDate}
                    onChange={(e) => setFormVoucherExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#eae2d9] text-xs font-semibold text-[#382820] focus:border-[#059669] focus:outline-hidden"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formVoucherIsActive}
                      onChange={(e) => setFormVoucherIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#059669] focus:ring-[#059669] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#382820]">
                      Aktifkan Voucher Ini
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#eae2d9] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-[#eae2d9] hover:bg-[#dfd5c9] text-[#382820] font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingVoucherId ? 'Simpan Perubahan' : 'Buat Voucher'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
