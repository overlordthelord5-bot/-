import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Store,
  Share2,
  Users,
  CheckCircle2,
  Search,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenAI: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenAI,
  searchQuery,
  setSearchQuery,
}) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#0F1E36] to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {isRtl
                ? 'WASEET — المنظومة الشاملة للتجارة والاستشارات والخدمات'
                : 'WASEET — The Unified Ecosystem for Advisory, Services & Commerce'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {isRtl ? (
              <>
                كل ما تحتاجه لأعمالك، <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  في مكان واحد متكامل.
                </span>
              </>
            ) : (
              <>
                Everything your business needs, <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  in one unified marketplace.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {isRtl
              ? 'احجز استشارتك مع نخبة المستشارين في 14 مجالاً تخصصياً، اطلب الخدمات المهنية، تسوق الأجهزة المكتبية والقوالب الرقمية المعتمدة، واربح كشريك أو وسيط بالعمولة.'
              : 'Book certified advisors across 14 specialties, order custom digital services, purchase verified office hardware and legal templates, or earn via our high-converting affiliate broker engine.'}
          </p>

          {/* Hero Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-900/90 rounded-2xl p-2 border border-amber-500/30 shadow-2xl backdrop-blur-md">
              <Search className="w-5 h-5 text-amber-400 ms-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRtl
                    ? 'جرب البحث عن: استشارة قانونية، جهاز نقاط بيع، قوالب مالية، متجر سلة...'
                    : 'Search: Legal advisory, POS terminal, financial templates, branding...'
                }
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 outline-none"
              />
              <button
                onClick={() => {
                  if (searchQuery) onNavigate('search');
                  else onNavigate('consultations');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>{isRtl ? 'استكشف الآن' : 'Search Now'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px] text-slate-300">
              <span className="text-slate-400">{isRtl ? 'الأكثر بحثاً:' : 'Trending:'}</span>
              <button
                onClick={() => {
                  setSearchQuery('استشارة');
                  onNavigate('consultations');
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {isRtl ? 'استشارات الأعمال' : 'Business Advisory'}
              </button>
              <button
                onClick={() => {
                  setSearchQuery('نقاط بيع');
                  onNavigate('products');
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {isRtl ? 'أجهزة نقاط البيع POS' : 'POS Devices'}
              </button>
              <button
                onClick={() => {
                  setSearchQuery('قوالب');
                  onNavigate('products');
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {isRtl ? 'قوالب مالية وقانونية' : 'Financial Templates'}
              </button>
              <button
                onClick={() => {
                  setSearchQuery('هوية');
                  onNavigate('services');
                }}
                className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {isRtl ? 'تصميم هوية بصرية' : 'Brand Identity'}
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('consultations')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>{isRtl ? 'احجز استشارة متخصصة' : 'Book a Consultation'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 hover:border-amber-400/40 shadow-lg transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'تسوق المنتجات والكتالوجات' : 'Explore Products & Catalogs'}</span>
            </button>

            <button
              onClick={onOpenAI}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 border border-cyan-400/40 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isRtl ? 'اسأل مساعد وسيط الذكي' : 'Ask WASEET AI'}</span>
            </button>
          </div>
        </div>

        {/* Live Marketplace Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">+15,000</div>
              <div className="text-xs text-slate-400">{isRtl ? 'عميل ومنشأة مستفيدة' : 'Active Clients & SMEs'}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">+450</div>
              <div className="text-xs text-slate-400">{isRtl ? 'مستشار وخبير معتمد' : 'Verified Consultants'}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">+1,200</div>
              <div className="text-xs text-slate-400">{isRtl ? 'منتج وخدمة متاحة' : 'Products & Services'}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">99.4%</div>
              <div className="text-xs text-slate-400">{isRtl ? 'نسبة رضا المستفيدين' : 'Client Satisfaction'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
