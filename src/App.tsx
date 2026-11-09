import React, { useState } from 'react';
import {
  Sparkles,
  Briefcase,
  Store as StoreIcon,
  BookOpen,
  Share2,
  ShieldCheck,
  Star,
  Users,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  Heart,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ConsultationCard } from './components/consultations/ConsultationCard';
import { BookingModal } from './components/consultations/BookingModal';
import { ServiceCard } from './components/services/ServiceCard';
import { ServiceOrderModal } from './components/services/ServiceOrderModal';
import { ProductCard } from './components/products/ProductCard';
import { ProductDetailsModal } from './components/products/ProductDetailsModal';
import { StoreCard } from './components/stores/StoreCard';
import { StoreDetailsModal } from './components/stores/StoreDetailsModal';
import { CatalogCard } from './components/catalogs/CatalogCard';
import { CatalogViewerModal } from './components/catalogs/CatalogViewerModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { AuthModal } from './components/modals/AuthModal';
import { PolicyModal, PolicyType } from './components/modals/PolicyModal';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { ConsultantDashboard } from './components/dashboards/ConsultantDashboard';
import { SellerDashboard } from './components/dashboards/SellerDashboard';
import { AffiliateDashboard } from './components/dashboards/AffiliateDashboard';
import { PartnerDashboard } from './components/dashboards/PartnerDashboard';
import { SupportDashboard } from './components/dashboards/SupportDashboard';
import { RFQMarketplace } from './components/rfq/RFQMarketplace';
import { OrderWorkspaceModal } from './components/orders/OrderWorkspaceModal';
import { VideoMeetingModal } from './components/video/VideoMeetingModal';
import { ExpertVerificationModal } from './components/verification/ExpertVerificationModal';
import { DisputeModal } from './components/disputes/DisputeModal';
import { HelpCenterModal } from './components/help/HelpCenterModal';
import { CalendarAvailabilityView } from './components/calendar/CalendarAvailabilityView';

import {
  INITIAL_CONSULTATIONS,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_CATALOGS,
  INITIAL_PARTNERS,
} from './data/mockData';
import { Consultation, Service, Product, Store, Catalog, Order, ConsultationBooking } from './types';

function MainApp() {
  const { isRtl, t } = useLanguage();
  const { user, role, switchRole } = useAuth();
  const { wishlist } = useCart();
  const { showToast } = useNotification();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [policyType, setPolicyType] = useState<PolicyType | null>(null);

  // Advanced Enterprise Modals State
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [workspaceOrder, setWorkspaceOrder] = useState<Order | null>(null);
  const [meetingBooking, setMeetingBooking] = useState<ConsultationBooking | null>(null);
  const [disputeModalData, setDisputeModalData] = useState<{
    isOpen: boolean;
    orderId?: string;
    sellerId?: string;
    sellerName?: string;
    orderAmount?: number;
  }>({ isOpen: false });

  // Selected Entities for Modals
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);

  // Filtered Products State
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'physical' | 'digital'>('all');

  // Consultation Categories Definition
  const categoriesList = [
    { id: 'all', nameAr: 'كافة التصنيفات', nameEn: 'All Categories' },
    { id: 'entrepreneurship', nameAr: 'ريادة الأعمال والشركات', nameEn: 'Entrepreneurship' },
    { id: 'legal', nameAr: 'الاستشارات القانونية', nameEn: 'Legal Advisory' },
    { id: 'financial', nameAr: 'التخطيط والنمذجة المالية', nameEn: 'Financial Planning' },
    { id: 'tech', nameAr: 'التقنية والتحول السحابي', nameEn: 'Tech & Cloud' },
    { id: 'marketing', nameAr: 'التسويق ونمو المبيعات', nameEn: 'Marketing & Growth' },
    { id: 'design', nameAr: 'التصميم وتجربة المستخدم', nameEn: 'UI/UX & Branding' },
    { id: 'logistics', nameAr: 'سلاسل الإمداد والتخزين', nameEn: 'Logistics & 3PL' },
    { id: 'hr', nameAr: 'الموارد البشرية والرواتب', nameEn: 'Human Resources' },
  ];

  // Search Results Filter
  const filteredConsultations = INITIAL_CONSULTATIONS.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.consultantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredServices = INITIAL_SERVICES.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    const matchesType = productTypeFilter === 'all' || p.type === productTypeFilter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const wishlistedItems = [
    ...INITIAL_PRODUCTS.filter((p) => wishlist.includes(p.id)),
    ...INITIAL_CONSULTATIONS.filter((c) => wishlist.includes(c.id)),
  ];

  const renderDashboardByRole = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'consultant':
        return <ConsultantDashboard />;
      case 'seller':
        return <SellerDashboard />;
      case 'affiliate':
        return <AffiliateDashboard />;
      case 'partner':
        return <PartnerDashboard />;
      case 'support':
        return <SupportDashboard />;
      case 'client':
      default:
        return (
          <ClientDashboard
            onOpenOrderWorkspace={(ord) => setWorkspaceOrder(ord)}
            onOpenVideoMeeting={(b) => setMeetingBooking(b)}
            onOpenDispute={(ord) =>
              setDisputeModalData({
                isOpen: true,
                orderId: ord.id,
                sellerName: ord.items[0]?.title || 'Vendor',
                orderAmount: ord.total,
              })
            }
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Universal Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <HeroSection
              onNavigate={setActiveTab}
              onOpenAI={() => setIsAIOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
              {/* Category Carousel / Explorer */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                      {isRtl ? 'تصنيفات شاملة ومتخصصة' : 'Specialized Sectors'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {isRtl ? 'استكشف قطاعات الأعمال والخدمات' : 'Explore Business Sectors'}
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveTab('consultations')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRtl ? 'عرض كافة الاستشارات' : 'View All'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('consultations');
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-900 hover:text-amber-300 text-slate-700 font-bold text-xs border border-slate-200 hover:border-slate-900 shadow-sm transition-all whitespace-nowrap cursor-pointer transform hover:-translate-y-0.5"
                    >
                      {isRtl ? cat.nameAr : cat.nameEn}
                    </button>
                  ))}
                </div>
              </section>

              {/* Featured Consultations */}
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                      {isRtl ? 'جلسات استشارية مرئية وصوتية' : 'Live Advisory Sessions'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {isRtl ? 'استشارات الأعمال المعتمدة' : 'Featured Verified Consultations'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl
                        ? 'احجز موعد جلستك مباشرة مع كبار المستشارين والخبراء القانونيين والماليين'
                        : 'Book your session directly with certified legal, financial, and strategic experts'}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('consultations')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isRtl ? 'استعراض كل الاستشارات (14 مجال)' : 'Browse All Consultations'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INITIAL_CONSULTATIONS.slice(0, 4).map((c) => (
                    <ConsultationCard
                      key={c.id}
                      consultation={c}
                      onBook={(cons) => setSelectedConsultation(cons)}
                    />
                  ))}
                </div>
              </section>

              {/* High-Demand Professional Services */}
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
                      {isRtl ? 'تنفيذ وتسليم احترافي' : 'Professional Execution'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {isRtl ? 'الخدمات الرقمية الأكثر طلباً' : 'In-Demand Digital Services'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl
                        ? 'هويات بصرية، متاجر سلة وشوبيفاي، دراسات جدوى معتمدة، وحملات نمو مبيعات'
                        : 'Brand identities, e-commerce stores, certified feasibility studies, and ads growth'}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('services')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isRtl ? 'عرض كافة الخدمات' : 'View All Services'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {INITIAL_SERVICES.map((s) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      onSelect={(serv) => setSelectedService(serv)}
                    />
                  ))}
                </div>
              </section>

              {/* Physical & Digital Products Marketplace */}
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                      {isRtl ? 'شحن فوري وتنزيل رقمي' : 'Immediate Shipping & Downloads'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {isRtl ? 'سوق المنتجات المادية والرقمية' : 'Hardware & Digital Marketplace'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRtl
                        ? 'أجهزة نقاط البيع POS، طقوم المكاتب الفاخرة، القوالب المالية، والعقود القانونية الجاهزة'
                        : 'Smart POS terminals, executive desk sets, financial spreadsheets, and legal contracts'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                      <button
                        onClick={() => setProductTypeFilter('all')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          productTypeFilter === 'all' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        {isRtl ? 'الكل' : 'All'}
                      </button>
                      <button
                        onClick={() => setProductTypeFilter('physical')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          productTypeFilter === 'physical' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        {isRtl ? 'مادي' : 'Physical'}
                      </button>
                      <button
                        onClick={() => setProductTypeFilter('digital')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          productTypeFilter === 'digital' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        {isRtl ? 'رقمي' : 'Digital'}
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveTab('products')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isRtl ? 'المتجر' : 'Shop'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.slice(0, 4).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </section>

              {/* Verified Stores Showcase */}
              <section className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                      {isRtl ? 'متاجر موثقة ومعتمدة' : 'Verified Vendor Stores'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {isRtl ? 'المتاجر الإلكترونية الشريكة' : 'Partner E-Commerce Stores'}
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveTab('stores')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRtl ? 'استعراض كافة المتاجر' : 'View All Stores'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INITIAL_STORES.map((s) => (
                    <StoreCard
                      key={s.id}
                      store={s}
                      onOpenStore={(st) => setSelectedStore(st)}
                    />
                  ))}
                </div>
              </section>

              {/* Interactive Digital Catalogs */}
              <section className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
                      {isRtl ? 'تصفح تفاعلي ومباشر' : 'Interactive Catalogs'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {isRtl ? 'كتالوجات العروض والحلول الرقمية' : 'Digital Catalogs'}
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveTab('catalogs')}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRtl ? 'كافة الكتالوجات' : 'All Catalogs'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {INITIAL_CATALOGS.map((cat) => (
                    <CatalogCard
                      key={cat.id}
                      catalog={cat}
                      onOpen={(c) => setSelectedCatalog(c)}
                    />
                  ))}
                </div>
              </section>

              {/* Affiliate & Broker Banner */}
              <section className="bg-gradient-to-r from-[#0B192C] via-[#0F1E36] to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRtl ? 'برنامج وسيط للعمولات والتسويق' : 'WASEET Affiliate Broker Engine'}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                    {isRtl ? (
                      <>
                        حقق دخلاً إضافياً بنسبة <span className="text-amber-400">8% عمولة نقدية</span> على كل مبيعة.
                      </>
                    ) : (
                      <>
                        Earn <span className="text-amber-400">8% cash commission</span> on every referral order.
                      </>
                    )}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isRtl
                      ? 'سواء كنت صانع محتوى، مسوقاً، أو وسيط أعمال؛ احصل فوراً على رابط إحالتك الفريد، تتبع أرباحك لحظياً، واسحب رصيدك مباشرة لحسابك البنكي.'
                      : 'Whether you are a creator, marketer, or broker; get your referral link, track live sales, and request IBAN payouts.'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('affiliates')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{isRtl ? 'انضم لبرنامج الوسطاء الآن' : 'Join Affiliate Program'}</span>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('affiliate');
                        setActiveTab('dashboard');
                      }}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                    >
                      {isRtl ? 'تجربة لوحة تحكم الوسيط' : 'Demo Broker Dashboard'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Frequently Asked Questions */}
              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {isRtl ? 'الأسئلة الشائعة' : 'FAQ'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isRtl ? 'كل ما تحتاج معرفته عن منصة وسيط' : 'Frequently Asked Questions'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isRtl ? 'كيف يتم حجز وتنفيذ الجلسات الاستشارية؟' : 'How are consultations booked and held?'}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {isRtl
                        ? 'تختار المستشار والموعد المناسب لك، ثم تختار طريقة الجلسة (مرئي، صوتي، محادثة، أو كتابي). فور إتمام الحجز، يصلك رابط مباشر للغرفة الافتراضية مع تذكير عبر البريد والرسائل.'
                        : 'Choose your advisor, date and channel (video, voice, chat, written). A secure meeting link is generated immediately.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isRtl ? 'كيف أحصل على المنتجات الرقمية بعد الدفع؟' : 'How do I access digital products?'}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {isRtl
                        ? 'المنتجات الرقمية (القوالب المالية، العقود القانونية، ملفات التصميم) تتاح للتنزيل الفوري والمباشر بمجرد إتمام الدفع، كما تُحفظ بروابطها في لوحة حسابك للأبد.'
                        : 'Digital templates and documents are unlocked instantly after checkout with download links saved in your dashboard.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isRtl ? 'ما هي ضمانات الشراء والدفع على وسيط؟' : 'What guarantees does WASEET provide?'}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {isRtl
                        ? 'نطبق سياسة حماية المشتري بنسبة 100%؛ حيث لا يتم تحويل مستحقات البائع إلا بعد تأكيد استلام الشحنة أو تسليم الخدمة وموافقة العميل.'
                        : '100% buyer protection escrow: vendor payouts are released only upon successful verified delivery.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isRtl ? 'كيف أسجل كبائع أو استشاري في وسيط؟' : 'How to register as seller or advisor?'}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {isRtl
                        ? 'انقر على زر "إنشاء حساب"، حدد نوع الحساب كـ "بائع" أو "مستشار"، وارفع وثائق العمل أو السجل التجاري لاعتماد حسابك وتدشين متجرك فوراً.'
                        : 'Register your account as seller or consultant, upload credentials or commercial registration, and launch your storefront.'}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Consultations View */}
        {activeTab === 'consultations' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                {isRtl ? '14 مجالاً تخصصياً معتمداً' : '14 Certified Specialties'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isRtl ? 'دليل الاستشارات المتخصصة' : 'Consultations Directory'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isRtl
                  ? 'جلسات استشارية مرئية وصوتية وكتابية مع نخبة الخبراء المعتمدين في المملكة والخليج'
                  : 'Live video, audio, and written sessions with verified GCC consultants'}
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-amber-300 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isRtl ? cat.nameAr : cat.nameEn}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredConsultations.map((c) => (
                <ConsultationCard
                  key={c.id}
                  consultation={c}
                  onBook={(cons) => setSelectedConsultation(cons)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Services View */}
        {activeTab === 'services' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
                {isRtl ? 'باقات متكاملة مع ضمان التنفيذ' : 'Guaranteed Packages'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isRtl ? 'الخدمات المهنية والرقمية' : 'Professional Services'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isRtl
                  ? 'تصميم هويات، متاجر سلة وشوبيفاي، دراسات جدوى معتمدة، وحملات نمو مبيعات'
                  : 'Brand identity, e-commerce stores, certified feasibility studies, and digital campaigns'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  onSelect={(serv) => setSelectedService(serv)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Products View */}
        {activeTab === 'products' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  {isRtl ? 'أجهزة مكتبية وقوالب رقمية' : 'Hardware & Digital Goods'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {isRtl ? 'سوق المنتجات والتجهيزات' : 'Products Marketplace'}
                </h1>
              </div>

              {/* Type Switcher */}
              <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setProductTypeFilter('all')}
                  className={`px-4 py-1.5 rounded-xl transition-all ${
                    productTypeFilter === 'all' ? 'bg-white text-slate-950 shadow' : 'text-slate-600'
                  }`}
                >
                  {isRtl ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setProductTypeFilter('physical')}
                  className={`px-4 py-1.5 rounded-xl transition-all ${
                    productTypeFilter === 'physical' ? 'bg-white text-slate-950 shadow' : 'text-slate-600'
                  }`}
                >
                  {isRtl ? 'منتجات مادية' : 'Physical'}
                </button>
                <button
                  onClick={() => setProductTypeFilter('digital')}
                  className={`px-4 py-1.5 rounded-xl transition-all ${
                    productTypeFilter === 'digital' ? 'bg-white text-slate-950 shadow' : 'text-slate-600'
                  }`}
                >
                  {isRtl ? 'منتجات وقوالب رقمية' : 'Digital'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewDetails={(prod) => setSelectedProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stores View */}
        {activeTab === 'stores' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                {isRtl ? 'متاجر معتمدة وموثقة' : 'Verified Vendor Hub'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isRtl ? 'المتاجر الإلكترونية الشريكة' : 'E-Commerce Stores'}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {INITIAL_STORES.map((s) => (
                <StoreCard
                  key={s.id}
                  store={s}
                  onOpenStore={(st) => setSelectedStore(st)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Catalogs View */}
        {activeTab === 'catalogs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
                {isRtl ? 'تصفح رقمي تفاعلي' : 'Digital Catalogs'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isRtl ? 'الكتالوجات الرقمية التفاعلية' : 'Interactive Catalogs'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isRtl
                  ? 'تصفح كتالوجات البائعين وحزم التحول الرقمي مع إمكانية مشاركتها بروابط مباشرة أو رموز QR'
                  : 'Flip through vendor catalogs with shareable direct links and QR codes'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {INITIAL_CATALOGS.map((cat) => (
                <CatalogCard
                  key={cat.id}
                  catalog={cat}
                  onOpen={(c) => setSelectedCatalog(c)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Affiliates Tab */}
        {activeTab === 'affiliates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AffiliateDashboard />
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <PartnerDashboard />
          </div>
        )}

        {/* Wishlist View */}
        {activeTab === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-current" />
              <h1 className="text-2xl font-black text-slate-900">
                {isRtl ? 'قائمة المفضلة' : 'Wishlist'} ({wishlistedItems.length})
              </h1>
            </div>

            {wishlistedItems.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">
                  {isRtl ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isRtl ? 'انقر على أيقونة القلب على أي استشارة أو منتج لحفظه هنا' : 'Click the heart icon on any item to save it.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedItems.map((item: any) =>
                  'consultantName' in item ? (
                    <ConsultationCard
                      key={item.id}
                      consultation={item}
                      onBook={(cons) => setSelectedConsultation(cons)}
                    />
                  ) : (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* RFQ Projects Marketplace */}
        {activeTab === 'rfq' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <RFQMarketplace />
          </div>
        )}

        {/* Availability Calendar & Schedule */}
        {activeTab === 'calendar' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <CalendarAvailabilityView />
          </div>
        )}

        {/* Direct Client Views */}
        {activeTab === 'orders' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ClientDashboard
              onOpenOrderWorkspace={(ord) => setWorkspaceOrder(ord)}
              onOpenVideoMeeting={(b) => setMeetingBooking(b)}
              onOpenDispute={(ord) =>
                setDisputeModalData({
                  isOpen: true,
                  orderId: ord.id,
                  sellerName: ord.items[0]?.title || 'Vendor',
                  orderAmount: ord.total,
                })
              }
            />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ClientDashboard
              onOpenOrderWorkspace={(ord) => setWorkspaceOrder(ord)}
              onOpenVideoMeeting={(b) => setMeetingBooking(b)}
              onOpenDispute={(ord) =>
                setDisputeModalData({
                  isOpen: true,
                  orderId: ord.id,
                  sellerName: ord.items[0]?.title || 'Vendor',
                  orderAmount: ord.total,
                })
              }
            />
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SupportDashboard />
          </div>
        )}

        {/* Central Dynamic Role Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {renderDashboardByRole()}
          </div>
        )}

        {/* Search View */}
        {activeTab === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-600 block">
                {isRtl ? 'محرك البحث الشامل لمنصة وسيط' : 'Unified Search Engine'}
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                {isRtl ? `نتائج البحث عن: "${searchQuery}"` : `Search Results for: "${searchQuery}"`}
              </h1>
            </div>

            {/* Results count */}
            <div className="flex gap-4 text-xs font-bold text-slate-500 border-b pb-2">
              <span>{filteredConsultations.length} {isRtl ? 'استشارة' : 'Consultations'}</span>
              <span>•</span>
              <span>{filteredServices.length} {isRtl ? 'خدمة' : 'Services'}</span>
              <span>•</span>
              <span>{filteredProducts.length} {isRtl ? 'منتج' : 'Products'}</span>
            </div>

            {/* Consultations Results */}
            {filteredConsultations.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900">{isRtl ? 'الاستشارات المطابقة' : 'Matching Consultations'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredConsultations.map((c) => (
                    <ConsultationCard
                      key={c.id}
                      consultation={c}
                      onBook={(cons) => setSelectedConsultation(cons)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Products Results */}
            {filteredProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900">{isRtl ? 'المنتجات المطابقة' : 'Matching Products'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating AI Assistant Trigger Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 start-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-amber-400 border border-amber-500/40 shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-md"
        title="مساعد وسيط الذكي"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>
        <span className="font-black text-xs hidden sm:inline text-white">
          {isRtl ? 'مساعد وسيط الذكي' : 'WASEET AI'}
        </span>
      </button>

      {/* Universal Modals */}
      <BookingModal
        consultation={selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
        onSuccess={() => setActiveTab('bookings')}
      />

      <ServiceOrderModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <StoreDetailsModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CatalogViewerModal
        catalog={selectedCatalog}
        onClose={() => setSelectedCatalog(null)}
      />

      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsAIOpen(false);
        }}
      />

      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />

      <PolicyModal
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

      {/* Enterprise Operational Modals */}
      <OrderWorkspaceModal
        order={workspaceOrder}
        onClose={() => setWorkspaceOrder(null)}
        onOpenDispute={(ord) => {
          setWorkspaceOrder(null);
          setDisputeModalData({
            isOpen: true,
            orderId: ord.id,
            sellerName: ord.items[0]?.title || 'Vendor',
            orderAmount: ord.total,
          });
        }}
      />

      <VideoMeetingModal
        booking={meetingBooking}
        onClose={() => setMeetingBooking(null)}
      />

      <ExpertVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />

      <DisputeModal
        isOpen={disputeModalData.isOpen}
        onClose={() => setDisputeModalData({ isOpen: false })}
        orderId={disputeModalData.orderId}
        sellerName={disputeModalData.sellerName}
        orderAmount={disputeModalData.orderAmount}
      />

      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onOpenSupportTicket={() => {
          setIsHelpOpen(false);
          setActiveTab('support');
        }}
      />

      {/* Cart & Checkout Drawers */}
      <CartDrawer />
      <CheckoutModal />

      {/* Universal Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenPolicy={(type) => setPolicyType(type)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
