import React from 'react';
import { X, ShieldCheck, FileText, Truck, RotateCcw, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type PolicyType = 'terms' | 'privacy' | 'refund' | 'shipping' | 'about';

interface PolicyModalProps {
  type: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  const { isRtl } = useLanguage();

  if (!type) return null;

  const contentMap: Record<PolicyType, { titleAr: string; titleEn: string; icon: any; bodyAr: string; bodyEn: string }> = {
    terms: {
      titleAr: 'الشروط والأحكام العامة لمنصة وسيط',
      titleEn: 'WASEET Platform Terms & Conditions',
      icon: FileText,
      bodyAr: `مرحباً بك في منصة وسيط (WASEET). تُنظم هذه الشروط العلاقة بين المستخدمين (العملاء، المستشارين، البائعين، والوسطاء).
1. أهلية الاستخدام: يشترط في مستخدم المنصة بلوغ السن القانوني وأهلية التعاقد التجاري.
2. التزامات المستشارين والبائعين: يلتزم المستشارون بتقديم الاستشارات وفق أعلى معايير المهنية والسرية التامة لبيانات العميل. ويلتزم البائعون بمطابقة المنتجات المعروضة للمواصفات السعودية.
3. العمولات والتحصيل: يتم تحصيل المبالغ عبر بوابات الدفع الآمنة المعتمدة، وتخضع لرسوم المنصة والعمولات المقررة لكل تصنيف.
4. حقوق الملكية الفكرية: جميع المحتويات والعلامات التجارية لـ WASEET محمية بالكامل.`,
      bodyEn: `Welcome to WASEET. These terms govern the relationship between clients, consultants, vendors, and affiliates. All advisors must maintain confidentiality, and sellers must guarantee authentic GCC-compliant goods. Payments are processed via authorized financial channels.`,
    },
    privacy: {
      titleAr: 'سياسة الخصوصية وأمن البيانات وحماية المستهلك',
      titleEn: 'Privacy & Data Protection Policy',
      icon: ShieldCheck,
      bodyAr: `نحن في وسيط نلتزم بحماية خصوصيتك وبياناتك المالية والشخصية:
1. جمع البيانات: نقوم بجمع البيانات الضرورية فقط لإتمام عمليات الشراء، حجز الاستشارات، وتوصيل الشحنات.
2. حماية المدفوعات: لا نقوم بتخزين أي بيانات حساسة للبطاقات البنكية، ويتم التشفير وفق أعلى المعايير المصرفية (PCI-DSS).
3. عدم مشاركة البيانات: لا يتم بيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض دعائية دون موافقتك الصريحة.
4. سرية الاستشارات: تخضع جميع الجلسات الاستشارية (المرئية، الصوتية، والكتابية) لسرية مهنية صارمة.`,
      bodyEn: `WASEET is committed to top-tier consumer privacy. We collect minimal operational data, strictly never store raw card numbers, enforce SSL/PCI-DSS standards, and ensure 100% advisory confidentiality.`,
    },
    refund: {
      titleAr: 'سياسة الاسترجاع والضمان والاستبدال',
      titleEn: 'Refund, Return & Guarantee Policy',
      icon: RotateCcw,
      bodyAr: `1. المنتجات المادية: يحق للعميل طلب إرجاع أو استبدال المنتج خلال 14 يوماً من تاريخ الاستلام شريطة أن يكون بحالته وتغليفه الأصلي، مع تحمل تكلفة الشحن إلا في حال وجود عيب مصنعي.
2. الاستشارات: يحق للعميل إلغاء أو إعادة جدولة الجلسة قبل موعدها المحدد بـ 24 ساعة واسترداد كامل المبلغ. في حال تغيب المستشار، يُعاد المبلغ فوراً لمحفظة العميل مع جلسة تعويضية مجانية.
3. المنتجات الرقمية: نظراً لطبيعة الملفات الرقمية التنزيلية الفورية، لا يمكن استرجاعها بعد اكتمال التنزيل، ويتم تعويض العميل في حال وجود خلل تقني بالملف.`,
      bodyEn: `Physical items may be returned within 14 days in original condition. Consultation sessions can be rescheduled or refunded with 24-hour advance notice. Digital downloads are non-refundable once downloaded, backed by replacement guarantee for corrupt files.`,
    },
    shipping: {
      titleAr: 'سياسة الشحن والتسليم اللوجستي',
      titleEn: 'Shipping & Delivery Logistics Policy',
      icon: Truck,
      bodyAr: `1. شركاء الشحن: نتعاون مع كبرى الشركات المعتمدة (أرامكس، سمسا، وسُبل).
2. مدة التوصيل: داخل المدن الرئيسية (الرياض، جدة، الدمام) خلال 1 - 2 يوم عمل. باقي مدن ومحافظات المملكة خلال 2 - 4 أيام عمل.
3. الشحن المجاني: متاح لجميع الطلبات المادية التي تتجاوز قيمتها 500 ريال سعودي.
4. التتبع المباشر: يحصل العميل فور شحن الطلب على رقم تتبع لحظي وتنبيهات عبر الرسائل القصيرة وإشعارات المنصة.`,
      bodyEn: `We partner with Aramex and SMSA to ensure fast, reliable delivery across the GCC. Orders above 500 SAR enjoy complimentary shipping. Real-time SMS and dashboard tracking are provided with every order.`,
    },
    about: {
      titleAr: 'عن منصة وسيط (WASEET) — الرؤية والرسالة',
      titleEn: 'About WASEET Ecosystem',
      icon: Info,
      bodyAr: `وسيط هي المنصة الرقمية متعددة الأنشطة الأكثر تطوراً في المملكة والخليج، صُممت لتكون حلقة الوصل الموثوقة والذكية بين:
- رواد الأعمال والشركات الباحثة عن استشارات ودراسات جدوى معتمدة.
- الخبراء والمستشارين والمحامين والمهندسين.
- البائعين والمتاجر الإلكترونية وعتاد المكاتب الحديثة.
- الوسطاء والمسوقين الطامحين لتحقيق عوائد مالية مجزية.
شعارنا: "كل ما تحتاجه، في مكان واحد."`,
      bodyEn: `WASEET is an all-in-one digital marketplace bridging enterprise clients with certified consultants, verified e-commerce merchants, and affiliate marketing brokers. Motto: Everything you need, in one place.`,
    },
  };

  const current = contentMap[type];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0B192C] text-white p-5 rounded-t-3xl flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              {isRtl ? current.titleAr : current.titleEn}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
          <p>{isRtl ? current.bodyAr : current.bodyEn}</p>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              {isRtl ? 'فهمت وموافق' : 'Understood'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
