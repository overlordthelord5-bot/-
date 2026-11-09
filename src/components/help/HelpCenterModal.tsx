import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Store,
  Share2,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { HelpArticle } from '../../types';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupportTicket?: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenSupportTicket,
}) => {
  const { isRtl } = useLanguage();
  const { showToast } = useNotification();
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchArticles();
    }
  }, [isOpen]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/help-center');
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.articles || [];
      setArticles(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'all', labelAr: 'كافة المقالات', labelEn: 'All Articles', icon: BookOpen },
    { id: 'escrow', labelAr: 'الضمان والمدفوعات', labelEn: 'Escrow & Payments', icon: CreditCard },
    { id: 'consultations', labelAr: 'حجز واستشارات', labelEn: 'Consultations', icon: Briefcase },
    { id: 'disputes', labelAr: 'النزاعات والتحكيم', labelEn: 'Disputes & Refunds', icon: ShieldCheck },
    { id: 'verification', labelAr: 'توثيق الخبراء', labelEn: 'Verification & Badges', icon: FileText },
    { id: 'affiliates', labelAr: 'الوسطاء والتسويق', labelEn: 'Affiliates', icon: Share2 },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      art.titleAr.toLowerCase().includes(q) ||
      art.titleEn.toLowerCase().includes(q) ||
      art.contentAr.toLowerCase().includes(q) ||
      art.contentEn.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B192C] via-[#0F1E36] to-slate-950 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'مركز المساعدة وقاعدة المعرفة' : 'Help Center & Knowledge Base'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isRtl
                ? 'إرشادات تفصيلية حول حساب الضمان، توثيق الشهادات، إدارة المواعيد، وفض النزاعات'
                : 'Detailed guides on escrow protection, expert verification, scheduling, and disputes'}
            </p>

            {/* Instant Search input */}
            <div className="relative mt-4">
              <Search className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedArticle(null);
                }}
                placeholder={isRtl ? 'ابحث عن إجابة، كلمة مفتاحية، أو موضوع...' : 'Search articles, keywords, or topics...'}
                className="w-full py-2.5 ps-10 pe-4 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-amber-400 text-xs text-white placeholder-slate-400 outline-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedArticle(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-amber-300 shadow-sm'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedArticle ? (
            /* Detailed Article View */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <ArrowIcon className="w-4 h-4" />
                <span>{isRtl ? 'العودة لقائمة المقالات' : 'Back to Articles'}</span>
              </button>

              <div className="space-y-2 border-b pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {selectedArticle.category.toUpperCase()}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {isRtl ? selectedArticle.titleAr : selectedArticle.titleEn}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{isRtl ? 'آخر تحديث:' : 'Updated:'} {selectedArticle.updatedAt}</span>
                  <span>•</span>
                  <span>{selectedArticle.helpfulCount} {isRtl ? 'شخص وجدوا هذا مفيداً' : 'people found this helpful'}</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
                {isRtl ? selectedArticle.contentAr : selectedArticle.contentEn}
              </div>

              {/* Article Feedback */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-800">
                  {isRtl ? 'هل كان هذا المقال مفيداً لك؟' : 'Was this article helpful?'}
                </span>

                {feedbackGiven ? (
                  <span className="text-emerald-600 font-bold">
                    {isRtl ? 'شكراً لتقييمك، نقدّر مساهمتك!' : 'Thank you for your feedback!'}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFeedbackGiven(true);
                        showToast(isRtl ? 'شكراً لمشاركتك التقييم' : 'Feedback recorded', 'success');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 flex items-center gap-1.5 font-bold cursor-pointer transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'نعم، مفيد' : 'Yes'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setFeedbackGiven(true);
                        showToast(isRtl ? 'سنعمل على تحسين الشرح' : 'Thank you, we will improve this guide', 'info');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 flex items-center gap-1.5 font-bold cursor-pointer transition-all"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'لا، غير واضح' : 'No'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Articles Directory Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {filteredArticles.length} {isRtl ? 'مقالة معرفية متوفرة' : 'articles found'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedArticle(article);
                      setFeedbackGiven(false);
                    }}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 text-start transition-all space-y-2 cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {article.category}
                      </span>
                      <ArrowIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5" />
                    </div>

                    <h4 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {isRtl ? article.titleAr : article.titleEn}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {isRtl ? article.contentAr : article.contentEn}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {article.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Support Prompt */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>{isRtl ? 'لم تجد الإجابة التي تبحث عنها؟' : 'Did not find what you were looking for?'}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onOpenSupportTicket) onOpenSupportTicket();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold transition-all cursor-pointer"
          >
            {isRtl ? 'تواصل مع فريق الدعم والتحكيم' : 'Contact Support & Arbitration'}
          </button>
        </div>
      </div>
    </div>
  );
};
