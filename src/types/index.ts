export type UserRole = 
  | 'visitor'
  | 'client'
  | 'consultant'
  | 'seller'
  | 'affiliate'
  | 'partner'
  | 'support'
  | 'admin';

export interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  isVerified?: boolean;
  walletBalance?: number;
  escrowBalance?: number;
  createdAt: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  timezone?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export type ConsultationCategory = 
  | 'management'
  | 'financial'
  | 'accounting'
  | 'legal'
  | 'tech'
  | 'marketing'
  | 'hr'
  | 'entrepreneurship'
  | 'education'
  | 'design'
  | 'realestate'
  | 'ecommerce'
  | 'logistics'
  | 'career';

export type SessionType = 'video' | 'audio' | 'chat' | 'written' | 'in_person';

export interface WeeklyScheduleDay {
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  active: boolean;
  slots: { start: string; end: string }[];
}

export interface Consultation {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: ConsultationCategory;
  consultantId: string;
  consultantName: string;
  consultantTitle: string;
  consultantAvatar: string;
  rating: number;
  reviewCount: number;
  price: number; // in SAR
  currency: string;
  durationMinutes: number;
  sessionTypes: SessionType[];
  availableSlots: { date: string; times: string[] }[];
  languages: string[];
  terms: string;
  image: string;
  featured?: boolean;
  timezone?: string;
  bufferMinutes?: number;
  approvalStatus?: 'approved' | 'pending_moderation' | 'rejected';
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'rescheduled'
  | 'cancelled'
  | 'no_show';

export interface ConsultationBooking {
  id: string;
  consultationId: string;
  consultationTitle: string;
  consultantName: string;
  consultantId?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  timezone: string;
  sessionType: SessionType;
  price: number;
  status: BookingStatus;
  meetingLink?: string;
  notes?: string;
  rescheduleHistory?: { fromDate: string; fromTime: string; toDate: string; toTime: string; reason: string; timestamp: string }[];
  cancellationReason?: string;
  refundStatus?: 'none' | 'full' | 'partial';
  deliverablesId?: string;
  createdAt: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  deliveryDaysExtra: number;
  description: string;
}

export interface ServicePackage {
  name: string;
  nameEn: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
  featuresEn: string[];
}

export interface Service {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  currency: string;
  deliveryTimeDays: number;
  packages: {
    basic: ServicePackage;
    standard: ServicePackage;
    premium: ServicePackage;
  };
  addons?: ServiceAddon[];
  stages: string[];
  requirements: string[];
  image: string;
  featured?: boolean;
  approvalStatus?: 'approved' | 'pending_moderation' | 'rejected';
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  type: 'physical' | 'digital';
  price: number;
  compareAtPrice?: number;
  currency: string;
  sku: string;
  barcode?: string;
  stock: number;
  weightKg?: number;
  brand?: string;
  category: string;
  sellerId: string;
  sellerName: string;
  storeName: string;
  rating: number;
  reviewCount: number;
  images: string[];
  downloadUrl?: string;
  fileSize?: string;
  fileFormat?: string;
  maxDownloads?: number;
  variants?: ProductVariant[];
  shippingOptions?: { name: string; cost: number; days: string }[];
  featured?: boolean;
  approvalStatus?: 'approved' | 'pending_moderation' | 'rejected';
}

export interface Store {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  sellerId: string;
  sellerName: string;
  logo: string;
  banner: string;
  rating: number;
  salesCount: number;
  productsCount: number;
  shippingPolicy: string;
  returnPolicy: string;
  verified: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  type: 'product' | 'service' | 'consultation';
  price: number;
  image: string;
  description: string;
  linkId: string;
}

export interface CatalogSection {
  id: string;
  title: string;
  titleEn: string;
  items: CatalogItem[];
}

export interface Catalog {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  storeId: string;
  storeName: string;
  coverImage: string;
  themeColor: string;
  sections: CatalogSection[];
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'service' | 'consultation';
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
  selectedOption?: string;
  selectedAddons?: string[];
  digital?: boolean;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'in_escrow'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  escrowStatus: 'held_in_escrow' | 'released' | 'refunded' | 'disputed';
  escrowReleaseDueDate: string;
  paymentMethod: 'credit_card' | 'apple_pay' | 'bank_transfer' | 'cash_on_delivery';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    street: string;
    postalCode?: string;
  };
  trackingNumber?: string;
  shippingProvider?: string;
  affiliateCode?: string;
  affiliateCommission?: number;
  deliverablesId?: string;
  disputeId?: string;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  userId: string;
  code: string;
  referralLink: string;
  commissionRatePercent: number;
  totalClicks: number;
  totalConversions: number;
  totalEarned: number;
  pendingBalance: number;
  withdrawnBalance: number;
  recentConversions: {
    orderId: string;
    amount: number;
    commission: number;
    date: string;
  }[];
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  role: 'affiliate' | 'seller' | 'consultant';
  amount: number;
  iban: string;
  bankName: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'corporate' | 'technology' | 'logistics' | 'financial';
  description: string;
  agreementStatus: 'active' | 'pending' | 'renewing';
  joinedDate: string;
  featuredOfferings: string[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'orders' | 'consultations' | 'billing' | 'account' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'client' | 'support' | 'admin';
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: 'order' | 'booking' | 'commission' | 'support' | 'system' | 'dispute' | 'rfq' | 'escrow';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ==================== ADVANCED ENTERPRISE PLATFORM TYPES ====================

// 1. Expert Verification
export interface ExpertVerification {
  id: string;
  userId?: string;
  userName?: string;
  consultantId?: string;
  consultantName?: string;
  legalName?: string;
  specialty?: string;
  nationalIdNumber?: string;
  nationalId?: string;
  licenseNumber?: string;
  issuingAuthority?: string;
  certificateTitles?: string[];
  documents: { name: string; url: string; type: string; uploadedAt?: string }[];
  yearsExperience?: number;
  yearsOfExperience?: number;
  notes?: string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt?: string;
}

// 2. Consultation Custom Request
export interface ConsultationRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  problemDescription: string;
  category: ConsultationCategory;
  urgency: 'low' | 'medium' | 'urgent';
  attachments: { name: string; size: string; url: string }[];
  proposedDates: string[];
  budget: number;
  preferredConsultantId?: string;
  preferredConsultantName?: string;
  ndaRequired: boolean;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

// 6. Contextual In-App Order / Booking Chat Message
export interface OrderMessage {
  id: string;
  orderId?: string;
  bookingId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachments?: { name: string; size: string; url: string }[];
  createdAt: string;
  read: boolean;
}

// 8. Deliverables & Outputs Handover
export interface DeliverableSubmission {
  id: string;
  orderId?: string;
  bookingId?: string;
  title: string;
  executiveSummary: string;
  actionPoints: string[];
  files: { name: string; size: string; url: string; format: string }[];
  status: 'submitted' | 'revision_requested' | 'accepted';
  revisionNotes?: string;
  submittedAt: string;
  acceptedAt?: string;
}

// 9 & 10. RFQ (Request for Quotations) & Custom Proposals
export interface RFQ {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deliveryDaysMax: number;
  requiredSkills: string[];
  status: 'open' | 'evaluating' | 'awarded' | 'closed';
  proposalsCount: number;
  createdAt: string;
}

export interface RFQProposal {
  id: string;
  rfqId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  bidAmount: number;
  deliveryDays: number;
  coverLetter: string;
  milestones: { title: string; days: number; amount: number }[];
  status: 'submitted' | 'counter_offered' | 'accepted' | 'rejected';
  counterAmount?: number;
  createdAt: string;
}

// 12. Verified Post-Transaction Review
export interface VerifiedReview {
  id: string;
  targetId: string; // consultantId or productId or serviceId
  targetType: 'consultant' | 'service' | 'product';
  orderId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  overallRating: number;
  communicationRating: number;
  expertiseRating: number;
  deliveryRating: number;
  comment: string;
  isVerifiedTransaction: boolean;
  flaggedSuspicious?: boolean;
  createdAt: string;
}

// 14. Dispute & Escrow Resolution
export type DisputeStatus = 
  | 'opened'
  | 'evidence_submission'
  | 'under_investigation'
  | 'under_review'
  | 'resolved'
  | 'resolved_full_refund'
  | 'resolved_partial_refund'
  | 'resolved_vendor_release'
  | 'dismissed';

export interface Dispute {
  id: string;
  orderId?: string;
  bookingId?: string;
  openedById?: string;
  openedByName?: string;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  initiatorRole?: 'client' | 'seller' | 'consultant';
  respondentId?: string;
  respondentName?: string;
  amount?: number;
  requestedRefundAmount?: number;
  reason: string;
  description: string;
  desiredResolution?: string;
  evidence: { name: string; url: string; uploaderRole?: string; uploadedAt?: string }[];
  status: DisputeStatus;
  resolutionSummary?: string;
  refundedAmount?: number;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

// 16. Immutable Financial Ledger Entry
export interface FinancialLedgerEntry {
  id: string;
  transactionType?: 
    | 'escrow_hold'
    | 'escrow_release'
    | 'platform_commission'
    | 'affiliate_commission'
    | 'buyer_refund'
    | 'payout_withdrawal'
    | 'dispute_deduction';
  type?: string;
  referenceId: string;
  referenceType?: 'order' | 'booking' | 'payout' | 'dispute';
  debit?: number;
  credit?: number;
  debitAccount?: string;
  creditAccount?: string;
  amount?: number;
  currency?: string;
  status?: string;
  balanceAfter?: number;
  partyId?: string;
  partyName?: string;
  notes?: string;
  timestamp?: string;
  createdAt?: string;
}

// 19. Abuse & Fraud Reporting
export interface AbuseReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedEntityId: string;
  entityType: 'user' | 'review' | 'message' | 'product' | 'rfq';
  reason: 'spam' | 'harassment' | 'fraud_scam' | 'fake_credentials' | 'off_platform_payment';
  details: string;
  status: 'pending' | 'under_review' | 'action_taken' | 'dismissed';
  createdAt: string;
}

// 21. Dynamic Platform Policy Settings
export interface PlatformPolicySettings {
  platformCommissionPercent?: number;
  serviceFeePercentage?: number;
  affiliateCommissionPercent?: number;
  affiliateCommissionRate?: number;
  escrowAutoReleaseDays?: number;
  escrowHoldDays?: number;
  noShowPenaltyMinutes?: number;
  disputeWindowHours?: number;
  autoReleaseHours?: number;
  cancellationPenaltyPercent?: number;
  freeShippingThreshold?: number;
  allowVisitorBrowsing?: boolean;
  requireExpertIdVerification?: boolean;
  fraudDetectionSensitivity?: 'low' | 'medium' | 'strict';
  maintenanceMode?: boolean;
}

// 25. Help Center & Knowledge Base Article
export interface HelpArticle {
  id: string;
  category: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  tags: string[];
  updatedAt?: string;
  helpfulCount?: number;
}
