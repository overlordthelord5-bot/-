import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  MousePointer,
  ShoppingBag,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { INITIAL_AFFILIATE } from '../../data/mockData';

export const AffiliateDashboard: React.FC = () => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [affiliate, setAffiliate] = useState(INITIAL_AFFILIATE);
  const [copied, setCopied] = useState(false);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(affiliate.pendingBalance);
  const [iban, setIban] = useState('SA4480000123456789012345');
  const [bankName, setBankName] = useState('مصرف الراجحي (Al Rajhi Bank)');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliate.referralLink);
    setCopied(true);
    showToast(isRtl ? 'تم نسخ رابط الإحالة الخاص بك' : 'Referral Link Copied', affiliate.referralLink, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || payoutAmount > affiliate.pendingBalance) {
      showToast(isRtl ? 'خطأ' : 'Error', isRtl ? 'المبلغ يتجاوز الرصيد المعلق' : 'Amount exceeds pending balance', 'error');
      return;
    }

    try {
      const res = await fetch('/api/affiliate/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: payoutAmount, iban, bankName }),
      });
      const data = await res.json();
      if (data.success) {
        setAffiliate(data.affiliate);
        setIsPayoutOpen(false);
        showToast(
          isRtl ? 'تم تقديم طلب السحب بنجاح' : 'Payout Requested',
          isRtl ? `طلب سحب بقيمة ${payoutAmount} ريال قيد التدقيق الإداري` : 'Payout under review',
          'success'
        );
      }
    } catch {
      // Fallback
      setAffiliate((prev) => ({
        ...prev,
        pendingBalance: Math.max(0, prev.pendingBalance - payoutAmount),
      }));
      setIsPayoutOpen(false);
      showToast(isRtl ? 'تم تقديم طلب السحب' : 'Payout Requested', `${payoutAmount} SAR`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              {isRtl ? 'برنامج وسيط للعمولات والتسويق' : 'WASEET Affiliate Broker Engine'}
            </span>
            <span className="text-xs text-amber-300 font-bold">8% عمولة نقدية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRtl ? 'لوحة تحكم الوسيط والمسوق المعتمد' : 'Affiliate & Broker Dashboard'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isRtl
              ? 'شارك روابط إحالتك لأي استشارة أو منتج، تابع النقرات والتحويلات اللحظية، واسحب أرباحك مباشرة إلى حسابك البنكي.'
              : 'Share referral links, track live clicks & conversions, and withdraw earnings to your bank.'}
          </p>
        </div>

        <button
          onClick={() => setIsPayoutOpen(true)}
          disabled={affiliate.pendingBalance <= 0}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isRtl ? 'طلب سحب الأرباح' : 'Withdraw Earnings'}</span>
        </button>
      </div>

      {/* Referral Link & Code Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-600" />
          <span>{isRtl ? 'رابط الإحالة وكود الخصم الفريد الخاص بك:' : 'Your Unique Referral Link & Code:'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
            <input
              type="text"
              readOnly
              value={affiliate.referralLink}
              className="bg-transparent px-3 py-1 text-xs text-slate-800 font-mono font-semibold w-full outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ الرابط' : 'Copy')}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div>
              <span className="text-[10px] text-amber-800 font-bold block">{isRtl ? 'كود الإحالة:' : 'Referral Code:'}</span>
              <span className="text-sm font-mono font-black text-amber-900">{affiliate.code}</span>
            </div>
            <span className="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-lg">
              8% {isRtl ? 'عمولة' : 'Share'}
            </span>
          </div>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'الرصيد المعلق المتاح للسحب' : 'Pending Available Balance'}
          </span>
          <div className="text-xl font-black text-emerald-600">
            {affiliate.pendingBalance} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'إجمالي الأرباح المحققة' : 'Total Earned'}
          </span>
          <div className="text-xl font-black text-slate-900">
            {affiliate.totalEarned} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'إجمالي النقرات المسجلة' : 'Tracked Clicks'}
          </span>
          <div className="text-xl font-black text-cyan-600">{affiliate.totalClicks}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'الطلبات المكتملة المحولة' : 'Conversions'}
          </span>
          <div className="text-xl font-black text-amber-600">{affiliate.totalConversions}</div>
        </div>
      </div>

      {/* Payout Withdrawal Form */}
      {isPayoutOpen && (
        <form onSubmit={handleRequestPayout} className="bg-white p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">{isRtl ? 'طلب سحب الأرباح للحساب البنكي' : 'Request Payout'}</h3>
            <button onClick={() => setIsPayoutOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'المبلغ المراد سحبه (ر.س):' : 'Amount (SAR):'}</label>
              <input
                type="number"
                max={affiliate.pendingBalance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'اسم البنك المحلي:' : 'Bank Name:'}</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'رقم الآيبان (IBAN):' : 'IBAN:'}</label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPayoutOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              {isRtl ? 'تأكيد طلب التحويل' : 'Confirm Payout'}
            </button>
          </div>
        </form>
      )}

      {/* Recent Commission Conversions Ledger */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          {isRtl ? 'سجل العمولات والتحويلات الناتجة عن إحالاتك' : 'Commission Ledger & Conversions'}
        </h3>

        <div className="divide-y divide-slate-100">
          {affiliate.recentConversions.map((conv, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-bold text-slate-900">{conv.orderId}</span>
                <span className="text-slate-400 mx-2">•</span>
                <span className="text-slate-500">{conv.date}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isRtl ? 'قيمة الطلب الإجمالية:' : 'Order Value:'} {conv.amount} {isRtl ? 'ر.س' : 'SAR'}
                </div>
              </div>

              <div className="text-end">
                <div className="font-black text-emerald-600 text-sm">
                  +{conv.commission} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  8% {isRtl ? 'عمولة معتمدة' : 'Credited'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
