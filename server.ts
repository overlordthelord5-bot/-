import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USERS,
  INITIAL_CONSULTATIONS,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_CATALOGS,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_AFFILIATE,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYOUTS,
  INITIAL_PARTNERS,
  INITIAL_EXPERT_VERIFICATIONS,
  INITIAL_CONSULTATION_REQUESTS,
  INITIAL_ORDER_MESSAGES,
  INITIAL_DELIVERABLES,
  INITIAL_RFQS,
  INITIAL_PROPOSALS,
  INITIAL_VERIFIED_REVIEWS,
  INITIAL_DISPUTES,
  INITIAL_FINANCIAL_LEDGERS,
  INITIAL_ABUSE_REPORTS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_HELP_ARTICLES,
} from './src/data/mockData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Enterprise Database Store
const db = {
  users: [...INITIAL_USERS],
  consultations: [...INITIAL_CONSULTATIONS],
  services: [...INITIAL_SERVICES],
  products: [...INITIAL_PRODUCTS],
  stores: [...INITIAL_STORES],
  catalogs: [...INITIAL_CATALOGS],
  orders: [...INITIAL_ORDERS],
  bookings: [...INITIAL_BOOKINGS],
  affiliate: { ...INITIAL_AFFILIATE },
  payouts: [...INITIAL_PAYOUTS],
  tickets: [...INITIAL_TICKETS],
  auditLogs: [...INITIAL_AUDIT_LOGS],
  notifications: [...INITIAL_NOTIFICATIONS],
  partners: [...INITIAL_PARTNERS],
  expertVerifications: [...INITIAL_EXPERT_VERIFICATIONS],
  consultationRequests: [...INITIAL_CONSULTATION_REQUESTS],
  orderMessages: [...INITIAL_ORDER_MESSAGES],
  deliverables: [...INITIAL_DELIVERABLES],
  rfqs: [...INITIAL_RFQS],
  proposals: [...INITIAL_PROPOSALS],
  reviews: [...INITIAL_VERIFIED_REVIEWS],
  disputes: [...INITIAL_DISPUTES],
  ledgers: [...INITIAL_FINANCIAL_LEDGERS],
  abuseReports: [...INITIAL_ABUSE_REPORTS],
  settings: { ...INITIAL_PLATFORM_SETTINGS },
  helpArticles: [...INITIAL_HELP_ARTICLES],
  currentUser: { ...INITIAL_USERS[1] }, // Default to Client
};

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client notice:', err);
  }
}

// Helper: Record immutable ledger entry
function recordLedgerEntry(entry: {
  transactionType: any;
  referenceId: string;
  referenceType: any;
  debit: number;
  credit: number;
  balanceAfter: number;
  partyId: string;
  partyName: string;
  notes: string;
}) {
  const newEntry = {
    id: `led_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ...entry,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
  db.ledgers.unshift(newEntry);
  return newEntry;
}

// ==================== AUTH & ROLES ====================
app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ success: true, user: db.currentUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (user) {
    db.currentUser = user;
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'USER_LOGIN',
      performedBy: user.name,
      target: user.email,
      details: `تسجيل دخول ناجح بصلاحية ${user.role}`,
      timestamp: new Date().toISOString(),
      ip: req.ip || '127.0.0.1',
    });
    return res.json({ success: true, user });
  }
  return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const targetUser = db.users.find((u) => u.role === role);
  if (targetUser) {
    db.currentUser = targetUser;
    return res.json({ success: true, user: targetUser });
  }
  const newUser = {
    id: `usr_${role}_${Date.now()}`,
    name: `مستخدم ${role}`,
    nameEn: `${role.toUpperCase()} User`,
    email: `${role}@waseet.com`,
    role,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.users.push(newUser);
  db.currentUser = newUser;
  res.json({ success: true, user: newUser });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, role = 'client', phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'الاسم والبريد الإلكتروني مطلوبان' });
  }
  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    nameEn: name,
    email,
    role,
    phone: phone || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString().split('T')[0],
    isVerified: role === 'client',
    verificationStatus: role === 'consultant' ? ('pending' as const) : ('verified' as const),
    walletBalance: 0,
    escrowBalance: 0,
  };
  db.users.push(newUser);
  db.currentUser = newUser;
  res.json({ success: true, user: newUser });
});

// ==================== 1. EXPERT CREDENTIAL VERIFICATION ====================
app.get('/api/expert-verifications', (req: Request, res: Response) => {
  if (db.currentUser.role === 'admin') {
    return res.json({ success: true, verifications: db.expertVerifications });
  }
  const userVer = db.expertVerifications.filter((v) => v.userId === db.currentUser.id);
  res.json({ success: true, verifications: userVer });
});

app.post('/api/expert-verifications', (req: Request, res: Response) => {
  const { specialty, nationalIdNumber, certificateTitles, yearsExperience } = req.body;
  const newVer = {
    id: `ver_${Date.now()}`,
    userId: db.currentUser.id,
    userName: db.currentUser.name,
    specialty: specialty || 'استشارات متخصصة',
    nationalIdNumber: nationalIdNumber || '10XXXXXXXX',
    certificateTitles: certificateTitles || ['شهادة معتمدة'],
    documents: [
      { name: 'national_id.pdf', url: '/docs/id.pdf', type: 'الهوية الوطنية' },
      { name: 'accreditation_license.pdf', url: '/docs/license.pdf', type: 'رخصة المزاولة' },
    ],
    yearsExperience: Number(yearsExperience) || 5,
    status: 'pending' as const,
    submittedAt: new Date().toISOString().split('T')[0],
  };

  db.expertVerifications.unshift(newVer);
  db.currentUser.verificationStatus = 'pending';

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'EXPERT_VERIFICATION_SUBMITTED',
    performedBy: db.currentUser.name,
    target: newVer.specialty,
    details: 'تقديم ملف توثيق الخبير ومراجعة الشهادات المهنية',
    timestamp: new Date().toISOString(),
    ip: req.ip || '127.0.0.1',
  });

  res.json({ success: true, verification: newVer });
});

app.put('/api/expert-verifications/:id/review', (req: Request, res: Response) => {
  const { status, rejectionReason } = req.body;
  const ver = db.expertVerifications.find((v) => v.id === req.params.id);
  if (!ver) return res.status(404).json({ success: false, message: 'طلب التوثيق غير موجود' });

  ver.status = status;
  ver.reviewedBy = db.currentUser.name;
  ver.reviewedAt = new Date().toISOString().split('T')[0];
  if (rejectionReason) ver.rejectionReason = rejectionReason;

  const targetUser = db.users.find((u) => u.id === ver.userId);
  if (targetUser) {
    targetUser.verificationStatus = status;
    targetUser.isVerified = status === 'verified';
  }

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'EXPERT_VERIFICATION_DECISION',
    performedBy: db.currentUser.name,
    target: ver.userName || ver.legalName || 'Expert',
    details: `قرار التوثيق: ${status}`,
    timestamp: new Date().toISOString(),
    ip: req.ip || '127.0.0.1',
  });

  res.json({ success: true, verification: ver });
});

// ==================== 2. CONSULTATION CUSTOM REQUESTS ====================
app.get('/api/consultation-requests', (req: Request, res: Response) => {
  if (db.currentUser.role === 'admin' || db.currentUser.role === 'consultant') {
    return res.json({ success: true, requests: db.consultationRequests });
  }
  const userRequests = db.consultationRequests.filter((r) => r.clientId === db.currentUser.id);
  res.json({ success: true, requests: userRequests });
});

app.post('/api/consultation-requests', (req: Request, res: Response) => {
  const { title, problemDescription, category, urgency, budget, proposedDates, ndaRequired } = req.body;
  const newReq = {
    id: `cr_${Date.now()}`,
    clientId: db.currentUser.id,
    clientName: db.currentUser.name,
    title,
    problemDescription,
    category: category || 'entrepreneurship',
    urgency: urgency || 'medium',
    attachments: [
      { name: 'problem_brief.pdf', size: '1.2 MB', url: '/uploads/brief.pdf' },
    ],
    proposedDates: proposedDates || ['2026-11-12 10:00 AM', '2026-11-13 02:00 PM'],
    budget: Number(budget) || 750,
    ndaRequired: !!ndaRequired,
    status: 'pending' as const,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };
  db.consultationRequests.unshift(newReq);
  res.json({ success: true, request: newReq });
});

// ==================== 3 & 4 & 5. CONSULTATIONS & BOOKINGS STATE MACHINE ====================
app.get('/api/consultations', (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice } = req.query;
  let items = [...db.consultations];
  if (category && category !== 'all') {
    items = items.filter((c) => c.category === category);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter((c) => 
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) || 
      c.consultantName.toLowerCase().includes(q)
    );
  }
  if (minPrice) items = items.filter((c) => c.price >= Number(minPrice));
  if (maxPrice) items = items.filter((c) => c.price <= Number(maxPrice));
  res.json({ success: true, consultations: items });
});

app.post('/api/consultations/book', (req: Request, res: Response) => {
  const { consultationId, date, time, timezone, sessionType, notes, clientPhone } = req.body;
  const cons = db.consultations.find((c) => c.id === consultationId);
  if (!cons) return res.status(404).json({ success: false, message: 'الاستشارة غير موجودة' });

  const bookingId = `bk_${Date.now()}`;
  const booking = {
    id: bookingId,
    consultationId: cons.id,
    consultationTitle: cons.title,
    consultantName: cons.consultantName,
    consultantId: cons.consultantId,
    clientId: db.currentUser.id,
    clientName: db.currentUser.name,
    clientEmail: db.currentUser.email,
    clientPhone: clientPhone || db.currentUser.phone || '+966 50 000 0000',
    date: date || '2026-11-15',
    time: time || '10:00 AM',
    timezone: timezone || 'Asia/Riyadh',
    sessionType: sessionType || 'video',
    price: cons.price,
    status: 'confirmed' as const,
    meetingLink: `https://meet.waseet.com/session-${cons.id}-${Date.now().toString().slice(-4)}`,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(booking);

  // Escrow entry in Ledger for session fee
  recordLedgerEntry({
    transactionType: 'escrow_hold',
    referenceId: bookingId,
    referenceType: 'booking',
    debit: cons.price,
    credit: 0,
    balanceAfter: cons.price,
    partyId: db.currentUser.id,
    partyName: db.currentUser.name,
    notes: `حجز قيمة الجلسة الاستشارية (${cons.title}) في حساب الضمان Escrow`,
  });

  res.json({ success: true, booking });
});

app.get('/api/bookings', (req: Request, res: Response) => {
  if (db.currentUser.role === 'admin') {
    return res.json({ success: true, bookings: db.bookings });
  }
  if (db.currentUser.role === 'consultant') {
    const list = db.bookings.filter((b) => b.consultantName.includes(db.currentUser.name) || b.consultantId === db.currentUser.id);
    return res.json({ success: true, bookings: list });
  }
  const userBookings = db.bookings.filter((b) => b.clientId === db.currentUser.id || b.clientEmail === db.currentUser.email);
  res.json({ success: true, bookings: userBookings });
});

// Reschedule Booking Workflow
app.post('/api/bookings/:id/reschedule', (req: Request, res: Response) => {
  const { newDate, newTime, reason } = req.body;
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

  if (!booking.rescheduleHistory) booking.rescheduleHistory = [];
  booking.rescheduleHistory.push({
    fromDate: booking.date,
    fromTime: booking.time,
    toDate: newDate,
    toTime: newTime,
    reason: reason || 'طلب إعادة جدولة',
    timestamp: new Date().toISOString(),
  });

  booking.date = newDate;
  booking.time = newTime;
  booking.status = 'rescheduled';

  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: booking.clientId,
    title: 'تمت إعادة جدولة موعد الاستشارة',
    titleEn: 'Consultation Rescheduled',
    message: `الموعد الجديد: ${newDate} الساعة ${newTime}. السبب: ${reason || 'بناءً على طلبك'}`,
    messageEn: `New slot: ${newDate} at ${newTime}`,
    type: 'booking',
    isRead: false,
    link: '/client/bookings',
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, booking });
});

// Cancel Booking & Refund Policy
app.post('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  const { reason } = req.body;
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

  booking.status = 'cancelled';
  booking.cancellationReason = reason || 'إلغاء من قبل العميل';
  booking.refundStatus = 'full';

  // Return funds from escrow to client wallet
  const clientUser = db.users.find((u) => u.id === booking.clientId);
  if (clientUser) {
    clientUser.walletBalance = (clientUser.walletBalance || 0) + booking.price;
  }

  recordLedgerEntry({
    transactionType: 'buyer_refund',
    referenceId: booking.id,
    referenceType: 'booking',
    debit: 0,
    credit: booking.price,
    balanceAfter: clientUser?.walletBalance || booking.price,
    partyId: booking.clientId,
    partyName: booking.clientName,
    notes: `استرداد كامل لمبلغ الجلسة الملغاة (${booking.consultationTitle})`,
  });

  res.json({ success: true, booking });
});

// No-Show Report
app.post('/api/bookings/:id/no-show', (req: Request, res: Response) => {
  const { reportedParty } = req.body; // 'client' or 'consultant'
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

  booking.status = 'no_show';

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'BOOKING_NO_SHOW',
    performedBy: db.currentUser.name,
    target: booking.id,
    details: `تسجيل حالة عدم حضور من جانب ${reportedParty}`,
    timestamp: new Date().toISOString(),
    ip: req.ip || '127.0.0.1',
  });

  res.json({ success: true, booking });
});

// ==================== 6. CONTEXTUAL ORDER IN-APP MESSAGING ====================
app.get('/api/orders/:id/messages', (req: Request, res: Response) => {
  const thread = db.orderMessages.filter(
    (m) => m.orderId === req.params.id || m.bookingId === req.params.id
  );
  res.json({ success: true, messages: thread });
});

app.post('/api/orders/:id/messages', (req: Request, res: Response) => {
  const { content, attachments } = req.body;
  if (!content) return res.status(400).json({ success: false, message: 'الرسالة مطلوبة' });

  const msg = {
    id: `msg_${Date.now()}`,
    orderId: req.params.id,
    senderId: db.currentUser.id,
    senderName: db.currentUser.name,
    senderRole: db.currentUser.role,
    content,
    attachments: attachments || [],
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
  };

  db.orderMessages.push(msg);
  res.json({ success: true, message: msg });
});

// ==================== 8. DELIVERABLES & OUTPUTS SUBMISSION ====================
app.get('/api/orders/:id/deliverables', (req: Request, res: Response) => {
  const del = db.deliverables.find(
    (d) => d.orderId === req.params.id || d.bookingId === req.params.id
  );
  res.json({ success: true, deliverable: del || null });
});

app.post('/api/orders/:id/deliverables', (req: Request, res: Response) => {
  const { title, executiveSummary, actionPoints, files } = req.body;
  const newDel = {
    id: `del_${Date.now()}`,
    orderId: req.params.id,
    bookingId: req.params.id,
    title: title || 'مخرجات الخدمة والتسليم النهائي',
    executiveSummary: executiveSummary || '',
    actionPoints: actionPoints || [],
    files: files || [{ name: 'Final_Deliverable.zip', size: '4.5 MB', url: '/files/final.zip', format: 'ZIP' }],
    status: 'submitted' as const,
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.deliverables.unshift(newDel);
  res.json({ success: true, deliverable: newDel });
});

app.put('/api/orders/:id/deliverables/review', (req: Request, res: Response) => {
  const { decision, revisionNotes } = req.body; // 'accepted' or 'revision_requested'
  const del = db.deliverables.find((d) => d.id === req.params.id || d.orderId === req.params.id);
  if (!del) return res.status(404).json({ success: false, message: 'التسليم غير موجود' });

  del.status = decision;
  if (decision === 'revision_requested') {
    del.revisionNotes = revisionNotes || 'مطلوب تعديلات إضافية';
  } else if (decision === 'accepted') {
    del.acceptedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Auto-release escrow to vendor
    const order = db.orders.find((o) => o.id === del.orderId || o.orderNumber === del.orderId);
    if (order && order.escrowStatus === 'held_in_escrow') {
      order.escrowStatus = 'released';
      order.status = 'completed';

      recordLedgerEntry({
        transactionType: 'escrow_release',
        referenceId: order.orderNumber,
        referenceType: 'order',
        debit: 0,
        credit: order.total,
        balanceAfter: order.total,
        partyId: order.items[0]?.sellerId || 'vendor',
        partyName: order.items[0]?.sellerName || 'البائع',
        notes: `تحرير أموال الضمان بعد قبول العميل للتسليم النهائي للطلب ${order.orderNumber}`,
      });
    }
  }

  res.json({ success: true, deliverable: del });
});

// ==================== 9 & 10. RFQ (REQUEST FOR QUOTATION) & PROPOSALS ====================
app.get('/api/rfq', (req: Request, res: Response) => {
  res.json({ success: true, rfqs: db.rfqs });
});

app.post('/api/rfq', (req: Request, res: Response) => {
  const { title, description, category, budgetMin, budgetMax, deliveryDaysMax, requiredSkills } = req.body;
  const newRfq = {
    id: `rfq_${Date.now()}`,
    clientId: db.currentUser.id,
    clientName: db.currentUser.name,
    clientAvatar: db.currentUser.avatar,
    title,
    description,
    category: category || 'tech',
    budgetMin: Number(budgetMin) || 1000,
    budgetMax: Number(budgetMax) || 5000,
    deliveryDaysMax: Number(deliveryDaysMax) || 14,
    requiredSkills: requiredSkills || ['حلول أعمال', 'استشارات'],
    status: 'open' as const,
    proposalsCount: 0,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.rfqs.unshift(newRfq);
  res.json({ success: true, rfq: newRfq });
});

app.get('/api/rfq/:id/proposals', (req: Request, res: Response) => {
  const list = db.proposals.filter((p) => p.rfqId === req.params.id);
  res.json({ success: true, proposals: list });
});

app.post('/api/rfq/:id/proposals', (req: Request, res: Response) => {
  const { bidAmount, deliveryDays, coverLetter, milestones } = req.body;
  const rfq = db.rfqs.find((r) => r.id === req.params.id);
  if (!rfq) return res.status(404).json({ success: false, message: 'طلب عروض الأسعار غير موجود' });

  const newProp = {
    id: `prop_${Date.now()}`,
    rfqId: rfq.id,
    providerId: db.currentUser.id,
    providerName: db.currentUser.name,
    providerAvatar: db.currentUser.avatar,
    providerRating: db.currentUser.rating || 5.0,
    bidAmount: Number(bidAmount),
    deliveryDays: Number(deliveryDays),
    coverLetter,
    milestones: milestones || [{ title: 'المرحلة الأولى', days: 5, amount: bidAmount }],
    status: 'submitted' as const,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.proposals.unshift(newProp);
  rfq.proposalsCount += 1;

  res.json({ success: true, proposal: newProp });
});

app.put('/api/proposals/:id/status', (req: Request, res: Response) => {
  const { status, counterAmount } = req.body;
  const prop = db.proposals.find((p) => p.id === req.params.id);
  if (!prop) return res.status(404).json({ success: false, message: 'العرض غير موجود' });

  prop.status = status;
  if (counterAmount) prop.counterAmount = counterAmount;

  if (status === 'accepted') {
    const rfq = db.rfqs.find((r) => r.id === prop.rfqId);
    if (rfq) rfq.status = 'awarded';
  }

  res.json({ success: true, proposal: prop });
});

// ==================== 12. VERIFIED TRANSACTION REVIEWS ====================
app.get('/api/reviews', (req: Request, res: Response) => {
  const { targetId } = req.query;
  let items = [...db.reviews];
  if (targetId) {
    items = items.filter((r) => r.targetId === targetId);
  }
  res.json({ success: true, reviews: items });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { targetId, targetType, orderId, overallRating, communicationRating, expertiseRating, deliveryRating, comment } = req.body;

  // Anti-fraud check: ensure client has actually completed an order
  const hasOrder = db.orders.some(
    (o) => (o.id === orderId || o.orderNumber === orderId || o.userId === db.currentUser.id)
  ) || db.bookings.some((b) => b.clientId === db.currentUser.id);

  const newReview = {
    id: `rev_${Date.now()}`,
    targetId,
    targetType: targetType || 'consultant',
    orderId: orderId || 'VERIFIED-TX',
    clientId: db.currentUser.id,
    clientName: db.currentUser.name,
    clientAvatar: db.currentUser.avatar,
    overallRating: Number(overallRating) || 5,
    communicationRating: Number(communicationRating) || 5,
    expertiseRating: Number(expertiseRating) || 5,
    deliveryRating: Number(deliveryRating) || 5,
    comment,
    isVerifiedTransaction: !!hasOrder,
    flaggedSuspicious: !hasOrder,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.reviews.unshift(newReview);
  res.json({ success: true, review: newReview });
});

// ==================== 14. DISPUTES & ESCROW ARBITRATION ====================
app.get('/api/disputes', (req: Request, res: Response) => {
  if (db.currentUser.role === 'admin' || db.currentUser.role === 'support') {
    return res.json({ success: true, disputes: db.disputes });
  }
  const userDisputes = db.disputes.filter(
    (d) => d.openedById === db.currentUser.id || d.respondentId === db.currentUser.id
  );
  res.json({ success: true, disputes: userDisputes });
});

app.post('/api/disputes', (req: Request, res: Response) => {
  const { orderId, respondentId, respondentName, amount, reason, description } = req.body;
  const newDispute = {
    id: `dsp_${Date.now()}`,
    orderId: orderId || 'ORD-DISPUTED',
    openedById: db.currentUser.id,
    openedByName: db.currentUser.name,
    initiatorRole: db.currentUser.role as any,
    respondentId: respondentId || 'vendor',
    respondentName: respondentName || 'الطرف الآخر',
    amount: Number(amount) || 500,
    reason: reason || 'quality_unmet',
    description,
    evidence: [{ name: 'claim_statement.pdf', url: '/evidence/claim.pdf', uploaderRole: db.currentUser.role }],
    status: 'under_investigation' as const,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.disputes.unshift(newDispute);

  // Freeze order escrow status
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (order) {
    order.escrowStatus = 'disputed';
    order.status = 'disputed';
  }

  res.json({ success: true, dispute: newDispute });
});

app.put('/api/disputes/:id/resolve', (req: Request, res: Response) => {
  const { resolution, summary, refundedAmount } = req.body;
  const dispute = db.disputes.find((d) => d.id === req.params.id);
  if (!dispute) return res.status(404).json({ success: false, message: 'النزاع غير موجود' });

  dispute.status = resolution;
  dispute.resolutionSummary = summary || 'تم إنهاء النزاع من قبل فريق التحكيم';
  dispute.resolvedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
  if (refundedAmount) dispute.refundedAmount = Number(refundedAmount);

  // If refund decided, credit buyer
  if (resolution === 'resolved_full_refund' || resolution === 'resolved_partial_refund') {
    const buyer = db.users.find((u) => u.id === dispute.openedById);
    const refundVal = Number(dispute.refundedAmount || dispute.amount || 0);
    if (buyer) {
      buyer.walletBalance = (buyer.walletBalance || 0) + refundVal;
    }

    recordLedgerEntry({
      transactionType: 'buyer_refund',
      referenceId: dispute.id,
      referenceType: 'dispute',
      debit: 0,
      credit: refundVal,
      balanceAfter: Number(buyer?.walletBalance || refundVal),
      partyId: dispute.openedById || 'client-1',
      partyName: dispute.openedByName || 'Client',
      notes: `استرداد أموال بحكم تحكيم النزاع ${dispute.id}`,
    });
  }

  res.json({ success: true, dispute });
});

// ==================== 15 & 16. IMMUTABLE FINANCIAL LEDGER ====================
app.get('/api/ledger', (req: Request, res: Response) => {
  if (db.currentUser.role === 'admin') {
    return res.json({ success: true, ledgers: db.ledgers });
  }
  const userLedger = db.ledgers.filter((l) => l.partyId === db.currentUser.id);
  res.json({ success: true, ledgers: userLedger });
});

// Release Escrow Early Endpoint
app.post('/api/escrow/:orderId/release', (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.orderId || o.orderNumber === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

  order.escrowStatus = 'released';
  order.status = 'completed';

  recordLedgerEntry({
    transactionType: 'escrow_release',
    referenceId: order.orderNumber,
    referenceType: 'order',
    debit: 0,
    credit: order.total,
    balanceAfter: order.total,
    partyId: order.items[0]?.sellerId || 'usr_seller',
    partyName: order.items[0]?.sellerName || 'البائع',
    notes: `تحرير فوري للأموال المحتجزة في الضمان بطلب من المشتري للطلب ${order.orderNumber}`,
  });

  res.json({ success: true, order });
});

// ==================== 19. ABUSE & CONTENT MODERATION ====================
app.get('/api/abuse-reports', (req: Request, res: Response) => {
  res.json({ success: true, reports: db.abuseReports });
});

app.post('/api/abuse-reports', (req: Request, res: Response) => {
  const { reportedEntityId, entityType, reason, details } = req.body;
  const newReport = {
    id: `ab_${Date.now()}`,
    reporterId: db.currentUser.id,
    reporterName: db.currentUser.name,
    reportedEntityId: reportedEntityId || 'unknown',
    entityType: entityType || 'user',
    reason: reason || 'spam',
    details: details || '',
    status: 'pending' as const,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.abuseReports.unshift(newReport);
  res.json({ success: true, report: newReport });
});

// ==================== 21. PLATFORM POLICIES SETTINGS ====================
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  if (db.currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'غير مصرح لغير المدير' });
  }
  db.settings = { ...db.settings, ...req.body };
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'SETTINGS_UPDATE',
    performedBy: db.currentUser.name,
    target: 'Platform Settings',
    details: 'تحديث معايير عمولات المنصة وفترة تحرير الضمان وسياسات الإلغاء',
    timestamp: new Date().toISOString(),
    ip: req.ip || '127.0.0.1',
  });
  res.json({ success: true, settings: db.settings });
});

// ==================== 25. SEARCHABLE HELP CENTER ====================
app.get('/api/help-center', (req: Request, res: Response) => {
  const { q } = req.query;
  let items = [...db.helpArticles];
  if (q) {
    const searchStr = (q as string).toLowerCase();
    items = items.filter(
      (a) =>
        a.titleAr.toLowerCase().includes(searchStr) ||
        a.contentAr.toLowerCase().includes(searchStr) ||
        a.tags.some((t) => t.toLowerCase().includes(searchStr))
    );
  }
  res.json({ success: true, articles: items });
});

// ==================== ORIGINAL E-COMMERCE & CHECKOUT ROUTES ====================
app.get('/api/services', (req: Request, res: Response) => {
  res.json({ success: true, services: db.services });
});

app.get('/api/products', (req: Request, res: Response) => {
  res.json({ success: true, products: db.products });
});

app.get('/api/stores', (req: Request, res: Response) => {
  res.json({ success: true, stores: db.stores });
});

app.get('/api/catalogs', (req: Request, res: Response) => {
  res.json({ success: true, catalogs: db.catalogs });
});

app.get('/api/orders', (req: Request, res: Response) => {
  if (db.currentUser.role === 'admin' || db.currentUser.role === 'support') {
    return res.json({ success: true, orders: db.orders });
  }
  if (db.currentUser.role === 'seller') {
    const sellerOrders = db.orders.filter((o) =>
      o.items.some((item) => item.sellerId === db.currentUser.id || item.sellerName === db.currentUser.name)
    );
    return res.json({ success: true, orders: sellerOrders });
  }
  const userOrders = db.orders.filter((o) => o.userId === db.currentUser.id || o.userEmail === db.currentUser.email);
  res.json({ success: true, orders: userOrders });
});

app.post('/api/checkout', (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod, couponCode, affiliateCode } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'السلة فارغة' });
  }

  const subtotal = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
  const hasPhysical = items.some((it: any) => !it.digital);
  const shippingCost = hasPhysical ? (subtotal > 500 ? 0 : 35) : 0;
  
  let discount = 0;
  if (couponCode && couponCode.toUpperCase() === 'WASEET10') {
    discount = Math.round(subtotal * 0.1);
  }

  const total = Math.max(0, subtotal + shippingCost - discount);
  const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  let affiliateCommission = 0;
  if (affiliateCode || db.affiliate.code) {
    affiliateCommission = Math.round(subtotal * ((db.settings.affiliateCommissionPercent || 8) / 100));
    db.affiliate.totalConversions += 1;
    db.affiliate.totalEarned += affiliateCommission;
    db.affiliate.pendingBalance += affiliateCommission;
    db.affiliate.recentConversions.unshift({
      orderId: orderNumber,
      amount: subtotal,
      commission: affiliateCommission,
      date: new Date().toISOString().split('T')[0],
    });
  }

  const order = {
    id: `ord_${Date.now()}`,
    orderNumber,
    userId: db.currentUser.id,
    userName: db.currentUser.name,
    userEmail: db.currentUser.email,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    currency: 'SAR',
    status: 'in_escrow' as const,
    escrowStatus: 'held_in_escrow' as const,
    escrowReleaseDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: paymentMethod || 'credit_card',
    paymentStatus: 'paid' as const,
    shippingAddress: shippingAddress || {
      fullName: db.currentUser.name,
      phone: db.currentUser.phone || '+966 50 123 4567',
      city: 'الرياض',
      district: 'حي الملقا',
      street: 'طريق أنس بن مالك',
    },
    trackingNumber: hasPhysical ? `SA-ARMX-${Math.floor(1000000 + Math.random() * 9000000)}` : 'DIG-IMMEDIATE-ACCESS',
    shippingProvider: hasPhysical ? 'أرامكس (Aramex Express)' : 'تنزيل فوري آمن',
    affiliateCode: affiliateCode || (affiliateCommission > 0 ? db.affiliate.code : undefined),
    affiliateCommission,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  db.orders.unshift(order);

  // Escrow ledger recording
  recordLedgerEntry({
    transactionType: 'escrow_hold',
    referenceId: orderNumber,
    referenceType: 'order',
    debit: total,
    credit: 0,
    balanceAfter: total,
    partyId: db.currentUser.id,
    partyName: db.currentUser.name,
    notes: `حجز أموال المشتري للطلب ${orderNumber} في حساب الضمان البنكي Escrow`,
  });

  res.json({ success: true, order });
});

// Payouts & Affiliate
app.get('/api/affiliate', (req: Request, res: Response) => {
  res.json({ success: true, affiliate: db.affiliate, payouts: db.payouts });
});

app.post('/api/affiliate/request-payout', (req: Request, res: Response) => {
  const { amount, iban, bankName } = req.body;
  if (!amount || amount > db.affiliate.pendingBalance) {
    return res.status(400).json({ success: false, message: 'المبلغ المطلوب غير متاح في الرصيد المعلق' });
  }
  const payout = {
    id: `pay_${Date.now()}`,
    userId: db.currentUser.id,
    userName: db.currentUser.name,
    role: db.currentUser.role as any,
    amount: Number(amount),
    iban: iban || 'SA0000000000000000000000',
    bankName: bankName || 'مصرف الراجحي',
    status: 'pending' as const,
    createdAt: new Date().toISOString().split('T')[0],
  };
  db.payouts.unshift(payout);
  db.affiliate.pendingBalance -= Number(amount);
  res.json({ success: true, payout, affiliate: db.affiliate });
});

// Admin overview
app.get('/api/admin/overview', (req: Request, res: Response) => {
  const totalSalesRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);
  const totalEscrowHeld = db.orders
    .filter((o) => o.escrowStatus === 'held_in_escrow')
    .reduce((sum, o) => sum + o.total, 0);

  res.json({
    success: true,
    stats: {
      totalUsers: db.users.length,
      totalOrders: db.orders.length,
      totalSalesRevenue,
      totalEscrowHeld,
      totalConsultations: db.consultations.length,
      totalBookings: db.bookings.length,
      totalProducts: db.products.length,
      totalStores: db.stores.length,
      pendingPayoutsCount: db.payouts.filter((p) => p.status === 'pending').length,
      openDisputesCount: db.disputes.filter((d) => d.status === 'under_investigation' || d.status === 'opened').length,
      pendingVerificationsCount: db.expertVerifications.filter((v) => v.status === 'pending').length,
      openRfqsCount: db.rfqs.filter((r) => r.status === 'open').length,
      platformCommissionRate: `${db.settings.platformCommissionPercent}%`,
    },
    users: db.users,
    auditLogs: db.auditLogs.slice(0, 25),
    payouts: db.payouts,
    disputes: db.disputes,
    verifications: db.expertVerifications,
    ledgers: db.ledgers.slice(0, 30),
    settings: db.settings,
  });
});

// AI Assistant Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'الرسالة مطلوبة' });

  if (ai) {
    try {
      const systemInstruction = `أنت "مساعد وسيط الذكي" (WASEET AI Advisor).
منصة وسيط هي سوق إلكتروني متكامل للاستشارات والخدمات والتجارة والكتالوجات ونظام عروض المشاريع RFQ وحسابات الضمان Escrow.
أجب باحترافية باللغة العربية، وأرشد العميل لأفضل الخيارات وأعطه نصائح عملية.`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: { systemInstruction },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI_TIMEOUT')), 4000)
      );

      const response: any = await Promise.race([aiPromise, timeoutPromise]);
      const reply = response.text || 'أهلاً بك في وسيط!';
      return res.json({ success: true, reply });
    } catch {
      // Graceful fallback
    }
  }

  // Fallback responses
  const q = message.toLowerCase();
  let reply = '';
  if (q.includes('استشار') || q.includes('قانون') || q.includes('جدوى')) {
    reply = `يوفر وسيط نخبة من الاستشاريين المعتمدين والموثقين (د. طارق المنصور، المحامية سارة الغامدي، فهد المطيري). يمكنك حجز جلسة فيديو مباشرة مع مزامنة التقويم وضمان كامل لحقوقك عبر حساب الضمان Escrow.`;
  } else if (q.includes('rfq') || q.includes('مشروع') || q.includes('عرض سعر')) {
    reply = `يمكنك الآن طرح متطلبات مشروعك في قسم "عروض المشاريع RFQ" وتحديد الميزانية والمواعيد، لتستقبل عروضاً مخصصة من الخبراء والتفاوض معهم مباشرة.`;
  } else if (q.includes('ضمان') || q.includes('escrow') || q.includes('استرداد')) {
    reply = `جميع المدفوعات في وسيط محمية بنظام Escrow البنكي؛ لا يتم تحرير المبلغ للبائع أو الاستشاري إلا بعد استلامك وفحصك للمخرجات أو الشحنة، مع وجود نظام تحكيم نزاعات رسمي.`;
  } else {
    reply = `مرحباً بك في منصة وسيط (WASEET)! أنا هنا لمساعدتك في استكشاف الاستشارات، طلب عروض الأسعار RFQ، تتبع الشحنات، وحماية مدفوعاتك بالضمان. كيف ترغب أن أخدمك اليوم؟`;
  }

  res.json({ success: true, reply });
});

// Setup Vite dev middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`WASEET Advanced Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
