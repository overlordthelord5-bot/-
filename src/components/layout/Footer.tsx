import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPolicy: (type: 'terms' | 'privacy' | 'refund' | 'shipping' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy }) => {
  const { isRtl } = useLanguage();

  return (
    <footer className="bg-[#07101E] text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40">
                <span className="text-slate-950 font-black text-xl">W</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  {isRtl ? 'منصة وسيط' : 'WASEET'}
                </span>
                <span className="text-[10px] block text-amber-400 font-bold">
                  {isRtl ? 'كل ما تحتاجه، في مكان واحد.' : 'Everything you need, in one place.'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {isRtl
                ? 'المنصة الرقمية الرائدة في المملكة العربية السعودية والخليج للربط بين المستشارين المعتمدين، مقدمي الخدمات المهنية، المتاجر الإلكترونية، وأصحاب الكتالوجات والوسطاء المسوقين بالعمولة.'
                : 'The premier GCC digital marketplace uniting verified consultants, digital services, e-commerce stores, digital catalogs, and affiliate broker networks.'}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'مرخصة ومسجلة رسميًا في المملكة العربية السعودية' : 'Licensed & Compliant in Saudi Arabia'}</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> +966 11 800 9090
              </span>
              <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> support@waseet.com
              </span>
              <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {isRtl ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
              </span>
            </div>
          </div>

          {/* Market Sectors */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-slate-800 pb-2">
              {isRtl ? 'قطاعات المنصة' : 'Marketplace'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('consultations')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'الاستشارات المتخصصة (14 مجال)' : 'Advisory Consultations'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'الخدمات الرقمية والمهنية' : 'Professional Services'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'المنتجات المادية والمكتبية' : 'Physical Hardware & Goods'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'المنتجات والقوالب الرقمية' : 'Digital Templates & E-Books'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stores')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'المتاجر الإلكترونية المعتمدة' : 'Verified Stores'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalogs')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'الكتالوجات الرقمية التفاعلية' : 'Interactive Catalogs'}
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Growth */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-slate-800 pb-2">
              {isRtl ? 'الأعمال والشراكات' : 'Business & Growth'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('affiliates')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>{isRtl ? 'برنامج وسيط للعمولات' : 'Affiliate Program'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">8%</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('partners')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'الشركاء والجهات المؤسسية' : 'Corporate Partners'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'بوابة البائعين والاستشاريين' : 'Seller & Consultant Portal'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'مركز العناية بالعملاء والنزاعات' : 'Customer Support & Disputes'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('about')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'عن وسيط ورؤيتنا' : 'About WASEET'}
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-slate-800 pb-2">
              {isRtl ? 'السياسات والضمان' : 'Policies & Safety'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'سياسة الخصوصية وأمن البيانات' : 'Privacy & Security Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'سياسة الاسترجاع والضمان' : 'Refund & Return Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-amber-400 transition-colors">
                  {isRtl ? 'سياسة الشحن والتسليم' : 'Shipping & Delivery Terms'}
                </button>
              </li>
            </ul>

            <div className="pt-3">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                {isRtl ? 'طرق الدفع المعتمدة والآمنة' : 'Secure Payment Methods'}
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-300">
                <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">مدى Mada</span>
                <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Apple Pay</span>
                <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Visa</span>
                <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Mastercard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} WASEET - وسيط. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <span>{isRtl ? 'صُنع بحرفية متقنة لمنظومة التجارة والاستشارات الحديثة' : 'Crafted with excellence for modern business'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
