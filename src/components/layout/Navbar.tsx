import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Globe,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Store as StoreIcon,
  BookOpen,
  Share2,
  Menu,
  X,
  SlidersHorizontal,
  Bell,
  CheckCircle,
  HelpCircle,
  Award,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenHelp?: () => void;
  onOpenVerification?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAI,
  onOpenAuth,
  onOpenHelp,
  onOpenVerification,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { lang, toggleLang, isRtl, t } = useLanguage();
  const { user, role, switchRole, logout } = useAuth();
  const { items, totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rolesList: { role: UserRole; labelAr: string; labelEn: string; desc: string; icon: any }[] = [
    { role: 'visitor', labelAr: 'الزائر', labelEn: 'Visitor', desc: 'تصفح عام وبحث واستكشاف', icon: Globe },
    { role: 'client', labelAr: 'العميل', labelEn: 'Client', desc: 'حجز استشارات، طلبات، وسلة', icon: UserIcon },
    { role: 'consultant', labelAr: 'مستشار', labelEn: 'Consultant', desc: 'إدارة الاستشارات والمواعيد والأرباح', icon: Briefcase },
    { role: 'seller', labelAr: 'بائع', labelEn: 'Seller', desc: 'إدارة المتجر والمنتجات والمخزون', icon: StoreIcon },
    { role: 'affiliate', labelAr: 'وسيط مسوق', labelEn: 'Affiliate', desc: 'روابط الإحالة وعمولات المبيعات', icon: Share2 },
    { role: 'partner', labelAr: 'شريك تجاري', labelEn: 'Partner', desc: 'الاتفاقيات والخدمات المؤسسية', icon: ShieldCheck },
    { role: 'support', labelAr: 'خدمة العملاء', labelEn: 'Support', desc: 'إدارة التذاكر وحل الاستفسارات', icon: SlidersHorizontal },
    { role: 'admin', labelAr: 'المدير العام', labelEn: 'Admin', desc: 'تحكم كامل بالمنصة والمستخدمين', icon: ShieldCheck },
  ];

  const currentRoleInfo = rolesList.find((r) => r.role === role) || rolesList[1];

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl">
      {/* Top Bar: Role Switcher & Live Context Switch */}
      <div className="bg-[#07101E] border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              {isRtl ? 'منصة وسيط الرقمية المتكاملة' : 'WASEET Digital Ecosystem'}
            </span>
            <span className="hidden sm:inline text-slate-400">
              {isRtl ? 'استشارات • خدمات • منتجات • كتالوجات • تسويق بالعمولة' : 'Consultations • Services • E-Commerce • Catalogs'}
            </span>
          </div>

          {/* Quick Role Switcher for Testing & Demonstration */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all font-medium text-xs cursor-pointer"
            >
              <span className="text-slate-400 font-normal">{isRtl ? 'محاكاة الدور:' : 'Simulate Role:'}</span>
              <span className="font-bold flex items-center gap-1">
                <currentRoleInfo.icon className="w-3.5 h-3.5 text-amber-400" />
                {isRtl ? currentRoleInfo.labelAr : currentRoleInfo.labelEn}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div
                className={`absolute top-full mt-2 w-72 rounded-2xl bg-[#0F1E36] border border-amber-500/30 shadow-2xl p-2 z-50 text-slate-200 ${
                  isRtl ? 'left-0' : 'right-0'
                }`}
              >
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-amber-400 font-bold flex items-center justify-between">
                  <span>{isRtl ? 'اختر الدور لاختبار المنصة وصلاحياتها' : 'Select role to test permissions'}</span>
                  <span className="bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px]">RBAC</span>
                </div>
                <div className="py-1 max-h-80 overflow-y-auto space-y-1">
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-start text-xs transition-colors cursor-pointer ${
                        role === item.role
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${role === item.role ? 'text-amber-400' : 'text-slate-400'}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {isRtl ? item.labelAr : item.labelEn}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                      </div>
                      {role === item.role && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-start cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40 transform group-hover:scale-105 transition-all">
              <span className="text-slate-950 font-black text-xl tracking-tighter">W</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {isRtl ? 'وسيط' : 'WASEET'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Marketplace
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                {isRtl ? 'كل ما تحتاجه، في مكان واحد' : 'Everything you need, in one place'}
              </p>
            </div>
          </button>
        </div>

        {/* Global Instant Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-2">
          <div className="relative w-full flex items-center">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full py-2.5 ps-10 pe-24 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-16 text-slate-400 hover:text-white text-xs px-2 cursor-pointer"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  setActiveTab('search');
                }
              }}
              className="absolute end-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
            >
              {isRtl ? 'بحث' : 'Search'}
            </button>
          </div>
        </div>

        {/* Action Controls & Menus */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Advisor Trigger Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs border border-cyan-400/30 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer transform hover:scale-105"
            title="مساعد وسيط الذكي"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="hidden sm:inline">{isRtl ? 'مساعد وسيط الذكي' : 'AI Assistant'}</span>
            <span className="sm:hidden">{isRtl ? 'الذكي' : 'AI'}</span>
          </button>

          {/* Help Center Trigger */}
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title={isRtl ? 'مركز المساعدة وقاعدة المعرفة' : 'Help Center'}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">{isRtl ? 'المساعدة' : 'Help'}</span>
            </button>
          )}

          {/* Expert Verification Trigger */}
          {onOpenVerification && (
            <button
              onClick={onOpenVerification}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-colors text-xs font-bold cursor-pointer"
              title={isRtl ? 'توثيق الخبراء والشهادات' : 'Expert Verification'}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'توثيق الخبير' : 'Verify'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'text-rose-400 border-rose-500/30' : 'text-slate-300 hover:text-rose-400'
            }`}
            title="المفضلة"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
            title="سلة التسوق"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors cursor-pointer"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-ping">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifMenuOpen && (
              <div
                className={`absolute top-full mt-2 w-80 rounded-2xl bg-[#0F1E36] border border-amber-500/30 shadow-2xl p-3 z-50 ${
                  isRtl ? 'left-0' : 'right-0'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-sm text-white">{isRtl ? 'الإشعارات' : 'Notifications'}</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      {isRtl ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                    </button>
                  )}
                </div>
                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      {isRtl ? 'لا توجد إشعارات جديدة' : 'No notifications'}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.isRead ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-800 border-amber-500/30 text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-amber-300">{isRtl ? n.title : n.titleEn}</div>
                        <p className="text-[11px] mt-0.5 text-slate-300 leading-relaxed">
                          {isRtl ? n.message : n.messageEn}
                        </p>
                        <div className="text-[9px] text-slate-500 mt-1">{n.createdAt}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 ps-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-white transition-all cursor-pointer"
              >
                <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate text-amber-300">
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-amber-400/40"
                />
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  className={`absolute top-full mt-2 w-56 rounded-2xl bg-[#0F1E36] border border-amber-500/30 shadow-2xl p-2 z-50 text-slate-200 ${
                    isRtl ? 'left-0' : 'right-0'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="font-bold text-sm text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-amber-400">{user.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {isRtl ? currentRoleInfo.labelAr : currentRoleInfo.labelEn}
                    </span>
                  </div>

                  <div className="py-1 text-xs space-y-1">
                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-start flex items-center gap-2 text-white font-medium cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                      <span>{isRtl ? 'لوحة التحكم المركزية' : 'Main Dashboard'}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-start flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 text-cyan-400" />
                      <span>{isRtl ? 'طلباتي ومشترياتي' : 'My Orders'}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('bookings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-start flex items-center gap-2 cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>{isRtl ? 'حجوزات الاستشارات' : 'Consultation Bookings'}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('support');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-start flex items-center gap-2 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                      <span>{isRtl ? 'تذاكر الدعم الفني' : 'Support Tickets'}</span>
                    </button>

                    <div className="border-t border-slate-800 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-400 text-start flex items-center gap-2 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              >
                {t('login')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="border-t border-slate-800/80 bg-[#07101E]/80 backdrop-blur-md px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-2 no-scrollbar gap-1 sm:gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t('nav_home')}
            </button>

            <button
              onClick={() => handleNavClick('consultations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'consultations'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              {t('nav_consultations')}
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {t('nav_services')}
            </button>

            <button
              onClick={() => handleNavClick('products')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {t('nav_products')}
            </button>

            <button
              onClick={() => handleNavClick('stores')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'stores'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <StoreIcon className="w-3.5 h-3.5" />
              {t('nav_stores')}
            </button>

            <button
              onClick={() => handleNavClick('catalogs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'catalogs'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t('nav_catalogs')}
            </button>

            <button
              onClick={() => handleNavClick('affiliates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'affiliates'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'الوسطاء والتسويق' : 'Affiliates'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                8%
              </span>
            </button>

            <button
              onClick={() => handleNavClick('partners')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              {t('nav_partners')}
            </button>

            <button
              onClick={() => handleNavClick('rfq')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rfq'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'عروض المشاريع RFQ' : 'Project RFQs'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {isRtl ? 'مناقصات' : 'Tenders'}
              </span>
            </button>
          </div>

          {/* Role specific direct dashboard tab */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isRtl ? `لوحة ${currentRoleInfo.labelAr}` : `${currentRoleInfo.labelEn} Dashboard`}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0F1E36] border-b border-slate-800 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full py-2 ps-9 pe-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleNavClick('home')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => handleNavClick('consultations')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_consultations')}
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_services')}
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_products')}
            </button>
            <button
              onClick={() => handleNavClick('stores')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_stores')}
            </button>
            <button
              onClick={() => handleNavClick('catalogs')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_catalogs')}
            </button>
            <button
              onClick={() => handleNavClick('rfq')}
              className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-start flex items-center justify-between"
            >
              <span>{isRtl ? 'عروض المشاريع RFQ' : 'Project RFQs'}</span>
              <span className="text-[10px]">★</span>
            </button>
            <button
              onClick={() => handleNavClick('affiliates')}
              className="p-2.5 rounded-xl bg-slate-900 text-start text-white font-medium"
            >
              {t('nav_affiliates')}
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-start"
            >
              {isRtl ? 'لوحة التحكم' : 'Dashboard'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
