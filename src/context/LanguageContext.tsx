import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  isRtl: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'platform_name': 'وسيط',
    'platform_tagline': 'كل ما تحتاجه، في مكان واحد.',
    'nav_home': 'الرئيسية',
    'nav_consultations': 'الاستشارات',
    'nav_services': 'الخدمات',
    'nav_products': 'المنتجات',
    'nav_stores': 'المتاجر',
    'nav_catalogs': 'الكتالوجات',
    'nav_affiliates': 'الوسطاء',
    'nav_partners': 'الشركاء',
    'search_placeholder': 'ابحث عن استشارة، خدمة، منتج، متجر، أو كتالوج...',
    'search_all': 'الكل',
    'cart': 'السلة',
    'wishlist': 'المفضلة',
    'login': 'تسجيل الدخول',
    'register': 'إنشاء حساب',
    'logout': 'تسجيل الخروج',
    'dashboard': 'لوحة التحكم',
    'currency': 'ر.س',
    'sar': 'ريال سعودي',
    'explore_services': 'استكشف الخدمات والاستشارات',
    'shop_products': 'تسوق المنتجات والكتالوجات',
    'verified_expert': 'خبير معتمد',
    'book_now': 'احجز جلستك الآن',
    'order_service': 'اطلب الخدمة',
    'add_to_cart': 'أضف للسلة',
    'buy_now': 'شراء فوري',
    'digital_download': 'تنزيل رقمي فوري',
    'in_stock': 'متوفر بالمخزون',
    'out_of_stock': 'نفد من المخزون',
    'role_visitor': 'زائر',
    'role_client': 'عميل',
    'role_consultant': 'مستشار',
    'role_seller': 'بائع',
    'role_affiliate': 'وسيط مسوق',
    'role_partner': 'شريك',
    'role_support': 'خدمة العملاء',
    'role_admin': 'المدير العام',
    'ai_assistant_title': 'مساعد وسيط الذكي',
    'ai_assistant_sub': 'مستشارك الرقمي لاختيار أفضل الخدمات والمنتجات',
    'affiliate_program_title': 'برنامج وسيط للعمولات والتسويق',
  },
  en: {
    'platform_name': 'WASEET',
    'platform_tagline': 'Everything you need, in one place.',
    'nav_home': 'Home',
    'nav_consultations': 'Consultations',
    'nav_services': 'Services',
    'nav_products': 'Products',
    'nav_stores': 'Stores',
    'nav_catalogs': 'Catalogs',
    'nav_affiliates': 'Affiliates / Brokers',
    'nav_partners': 'Partners',
    'search_placeholder': 'Search consultations, services, products, stores, catalogs...',
    'search_all': 'All',
    'cart': 'Cart',
    'wishlist': 'Wishlist',
    'login': 'Sign In',
    'register': 'Sign Up',
    'logout': 'Sign Out',
    'dashboard': 'Dashboard',
    'currency': 'SAR',
    'sar': 'SAR',
    'explore_services': 'Explore Services & Advisory',
    'shop_products': 'Shop Products & Catalogs',
    'verified_expert': 'Verified Expert',
    'book_now': 'Book Session Now',
    'order_service': 'Order Service',
    'add_to_cart': 'Add to Cart',
    'buy_now': 'Buy Now',
    'digital_download': 'Instant Digital Download',
    'in_stock': 'In Stock',
    'out_of_stock': 'Out of Stock',
    'role_visitor': 'Visitor',
    'role_client': 'Client',
    'role_consultant': 'Consultant',
    'role_seller': 'Seller',
    'role_affiliate': 'Affiliate Broker',
    'role_partner': 'Partner',
    'role_support': 'Support Agent',
    'role_admin': 'Admin',
    'ai_assistant_title': 'WASEET AI Assistant',
    'ai_assistant_sub': 'Your smart advisor for choosing services & products',
    'affiliate_program_title': 'WASEET Affiliate & Broker Program',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ar');

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('waseet_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    const saved = localStorage.getItem('waseet_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLang(saved);
    } else {
      setLang('ar');
    }
  }, []);

  const t = (key: string, fallback?: string): string => {
    return translations[lang]?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, isRtl: lang === 'ar', setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
