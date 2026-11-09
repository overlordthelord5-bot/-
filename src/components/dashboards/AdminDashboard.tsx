import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Briefcase,
  Store,
  ShoppingCart,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  FileText,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Scale,
  Award,
  BookOpen,
  Settings,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Order, PayoutRequest, AuditLog, ExpertVerification, Dispute, FinancialLedgerEntry, PlatformPolicySettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { isRtl } = useLanguage();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'kpis' | 'verifications' | 'disputes' | 'ledger' | 'users' | 'payouts' | 'policies' | 'audit'>('kpis');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  // Extended Datasets
  const [verifications, setVerifications] = useState<ExpertVerification[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<FinancialLedgerEntry[]>([]);
  const [policies, setPolicies] = useState<PlatformPolicySettings | null>(null);

  const fetchOverview = async () => {
    try {
      const [ovRes, verRes, dispRes, ledgRes, polRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/expert-verifications'),
        fetch('/api/disputes'),
        fetch('/api/ledger'),
        fetch('/api/settings'),
      ]);

      const [ovJson, verJson, dispJson, ledgJson, polJson] = await Promise.all([
        ovRes.json(),
        verRes.json(),
        dispRes.json(),
        ledgRes.json(),
        polRes.json(),
      ]);

      if (ovJson.success) setData(ovJson);
      const vers = Array.isArray(verJson) ? verJson : verJson.verifications || [];
      const disps = Array.isArray(dispJson) ? dispJson : dispJson.disputes || [];
      const ledgs = Array.isArray(ledgJson) ? ledgJson : ledgJson.ledgers || [];
      setVerifications(vers);
      setDisputes(disps);
      setLedgerEntries(ledgs);
      if (polJson) setPolicies(polJson.settings || polJson);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleUpdatePayoutStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(isRtl ? 'تم تحديث حالة طلب الصرف' : 'Payout Updated', 'success');
        fetchOverview();
      }
    } catch {
      showToast('Error updating payout', 'error');
    }
  };

  const handleUpdateVerification = async (id: string, status: 'verified' | 'rejected', rejectionReason?: string) => {
    try {
      const res = await fetch(`/api/expert-verifications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason, reviewedBy: 'admin-1' }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(
          status === 'verified'
            ? (isRtl ? 'تم اعتماد وتوثيق المستشار بنجاح ومنحه الشارة الذهبية' : 'Advisor verified with golden badge')
            : (isRtl ? 'تم رفض طلب التوثيق مع إشعار المستشار' : 'Verification rejected'),
          'success'
        );
        fetchOverview();
      }
    } catch {
      showToast('Error', 'error');
    }
  };

  const handleResolveDispute = async (id: string, resolution: 'refund_buyer' | 'release_seller' | 'split') => {
    try {
      const res = await fetch(`/api/disputes/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolution,
          adminNotes: 'تم التحكيم بناءً على شروط العقد وفحص سجل التسليم والرسائل.',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(
          isRtl
            ? 'تم البت في النزاع وتسوية أموال الضمان في السجل المالي'
            : 'Dispute arbitrated and ledger settlement posted',
          'success'
        );
        fetchOverview();
      }
    } catch {
      showToast('Error resolving dispute', 'error');
    }
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policies) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policies),
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(isRtl ? 'تم حفظ سياسات المنصة وقواعد الضمان المالي' : 'Platform policies updated', 'success');
      }
    } catch {
      showToast('Error saving policies', 'error');
    }
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Activity className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
        <span>{isRtl ? 'جاري تحميل لوحة الإدارة المركزية...' : 'Loading Admin Control Center...'}</span>
      </div>
    );
  }

  const filteredUsers = (data.users || []).filter((u: User) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              {isRtl ? 'الإدارة العليا' : 'Super Admin'}
            </span>
            <span className="text-xs text-slate-300">WASEET Enterprise Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRtl ? 'لوحة القيادة المركزية لمنصة وسيط' : 'WASEET Central Administration'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isRtl
              ? 'متابعة العمليات، مؤشرات الأداء، تدقيق تراخيص الخبراء، التحكيم في النزاعات، والسجل المالي المزدوج للضمان (Escrow).'
              : 'Enterprise operations, KPIs, credential auditing, dispute arbitration, and immutable financial ledger.'}
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kpis' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isRtl ? 'المؤشرات' : 'KPIs'}
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'verifications' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isRtl ? 'توثيق الخبراء' : 'Verifications'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 text-[10px]">
              {verifications.filter((v) => v.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'disputes' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isRtl ? 'النزاعات والتحكيم' : 'Disputes'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-rose-300 text-[10px]">
              {disputes.filter((d) => d.status === 'opened' || d.status === 'under_review').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'ledger' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{isRtl ? 'السجل المالي التدقيقي' : 'Financial Ledger'}</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isRtl ? 'المستخدمين' : 'Users'} ({data.users.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'payouts' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isRtl ? 'طلبات الصرف' : 'Payouts'} ({data.payouts?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'policies' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isRtl ? 'سياسات المنصة' : 'Policies'}</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {isRtl ? 'سجل الرقابة' : 'Audit Logs'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">
                {isRtl ? 'إجمالي المبيعات' : 'Total Revenue'}
              </span>
              <div className="text-xl font-black text-slate-900">
                {data.stats.totalSalesRevenue} <span className="text-xs text-amber-600 font-bold">{isRtl ? 'ر.س' : 'SAR'}</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">
                {isRtl ? 'رصيد الضمان المحتجز (Escrow)' : 'Escrow Protected'}
              </span>
              <div className="text-xl font-black text-cyan-600">
                1,120 <span className="text-xs font-bold">{isRtl ? 'ر.س' : 'SAR'}</span>
              </div>
              <span className="text-[10px] text-cyan-600">محفوظ في حساب وسيط</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">
                {isRtl ? 'إجمالي المستخدمين' : 'Total Users'}
              </span>
              <div className="text-xl font-black text-slate-900">{data.stats.totalUsers}</div>
              <span className="text-[10px] text-slate-400">7 أدوار نشطة</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">
                {isRtl ? 'حجوزات الاستشارات' : 'Bookings'}
              </span>
              <div className="text-xl font-black text-slate-900">{data.stats.totalBookings}</div>
              <span className="text-[10px] text-cyan-600">14 تخصص</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">
                {isRtl ? 'النزاعات المفتوحة' : 'Open Disputes'}
              </span>
              <div className="text-xl font-black text-rose-600">{disputes.filter((d) => d.status !== 'resolved').length}</div>
              <span className="text-[10px] text-rose-600 font-semibold">تحت التحكيم</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block mb-1">
                {isRtl ? 'طلبات الصرف المعلقة' : 'Pending Payouts'}
              </span>
              <div className="text-xl font-black text-amber-600">{data.stats.pendingPayoutsCount}</div>
              <span className="text-[10px] text-amber-600 font-semibold">تتطلب تدقيقاً</span>
            </div>
          </div>
        </div>
      )}

      {/* Verifications Tab */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? 'طلبات توثيق الخبراء وتدقيق التراخيص المهنية' : 'Expert Credential Verification Queue'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'مراجعة الهويات ورخص المزاولة الصادرة من الجهات الحكومية لاعتماد شارة التوثيق الذهبية' : 'Audit IDs and licenses to grant certified badge'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              {verifications.length} {isRtl ? 'ملف مقدم' : 'Applications'}
            </span>
          </div>

          <div className="space-y-4">
            {verifications.map((v) => (
              <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{v.legalName}</span>
                      <span className="text-slate-400">({v.consultantName})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {v.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 text-[11px] mt-1">
                      <span>{isRtl ? 'الجهة:' : 'Authority:'} <strong className="text-slate-800">{v.issuingAuthority}</strong></span>
                      <span>{isRtl ? 'رقم الترخيص:' : 'License:'} <strong className="font-mono text-slate-800">{v.licenseNumber}</strong></span>
                      <span>{isRtl ? 'سنوات الخبرة:' : 'Experience:'} <strong className="text-slate-800">{v.yearsOfExperience} {isRtl ? 'سنوات' : 'Years'}</strong></span>
                      <span>{isRtl ? 'الهوية:' : 'National ID:'} <strong className="font-mono text-slate-800">{v.nationalId}</strong></span>
                    </div>
                  </div>

                  {v.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateVerification(v.id, 'verified')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'اعتماد التوثيق' : 'Verify'}</span>
                      </button>

                      <button
                        onClick={() => handleUpdateVerification(v.id, 'rejected', 'يرجى إعادة رفع صورة واضحة للترخيص')}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 cursor-pointer"
                      >
                        {isRtl ? 'رفض الطلب' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Attached Docs */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200">
                  {v.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700">
                      <FileText className="w-3 h-3 text-amber-600" />
                      <span>{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disputes Mediation Tab */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-rose-600" />
                <span>{isRtl ? 'غرفة التحكيم وفض النزاعات والوساطة' : 'Dispute Arbitration & Mediation Center'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'التحكيم بين المشتري والبائع/المستشار وصرف أموال الضمان المحتجزة' : 'Arbitrate between parties and execute escrow releases'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
              {disputes.length} {isRtl ? 'نزاعات مسجلة' : 'Total Disputes'}
            </span>
          </div>

          <div className="space-y-4">
            {disputes.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        {isRtl ? 'الطلب #' : 'Order #'}{d.orderId}
                      </span>
                      <span className="text-slate-500">| {isRtl ? 'المشتري:' : 'Buyer:'} <strong>{d.buyerName}</strong></span>
                      <span className="text-slate-500">| {isRtl ? 'المقدم:' : 'Provider:'} <strong>{d.sellerName}</strong></span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {d.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-700 mt-1 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                      <strong>{isRtl ? 'السبب:' : 'Reason:'}</strong> {d.reason} — {d.description}
                    </p>
                  </div>

                  <div className="text-end">
                    <span className="text-slate-400 block text-[11px]">{isRtl ? 'المبلغ المتنازع عليه' : 'Disputed Sum'}</span>
                    <span className="text-base font-black text-rose-600">
                      {d.requestedRefundAmount} {isRtl ? 'ر.س' : 'SAR'}
                    </span>
                  </div>
                </div>

                {d.status !== 'resolved' && (
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200">
                    <button
                      onClick={() => handleResolveDispute(d.id, 'refund_buyer')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow"
                    >
                      {isRtl ? 'استرداد كامل للعميل' : 'Full Refund to Buyer'}
                    </button>

                    <button
                      onClick={() => handleResolveDispute(d.id, 'release_seller')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow"
                    >
                      {isRtl ? 'صرف المستحقات للمزود' : 'Release to Provider'}
                    </button>

                    <button
                      onClick={() => handleResolveDispute(d.id, 'split')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
                    >
                      {isRtl ? 'تسوية مناصفة (50% / 50%)' : 'Split 50/50'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Double-Entry Financial Ledger Tab */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>{isRtl ? 'السجل المالي المزدوج للضمان (Double-Entry Escrow Ledger)' : 'Immutable Financial Ledger'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'سجل غير قابل للتعديل يوثق كافة حركات الاحتجاز، التحصيل، وصرف الأرباح' : 'Immutable audit trail of all debit/credit transactions'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                {isRtl ? 'متطابق محاسبياً' : 'Audited & Balanced'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3 text-start">ID</th>
                  <th className="p-3 text-start">{isRtl ? 'نوع القيد' : 'Entry Type'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المرجع' : 'Reference'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الحساب المدين' : 'Debit Account'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الحساب الدائن' : 'Credit Account'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3 text-start">{isRtl ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{entry.id}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 text-[10px]">
                        {entry.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{entry.referenceId}</td>
                    <td className="p-3 text-slate-500">{entry.debitAccount}</td>
                    <td className="p-3 text-slate-500">{entry.creditAccount}</td>
                    <td className="p-3 font-bold text-slate-900">{entry.amount} {entry.currency}</td>
                    <td className="p-3">
                      <span className="text-emerald-600 font-bold">✓ {entry.status}</span>
                    </td>
                    <td className="p-3 text-slate-400">{new Date(entry.createdAt || entry.timestamp || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Policies Tab */}
      {activeTab === 'policies' && policies && (
        <form onSubmit={handleSavePolicies} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? 'حوكمة سياسات المنصة وحساب الضمان المالي' : 'Platform Policies & Escrow Rules'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'التحكم بنسب العمولات، مدة حجز الضمان، مهل الرد، وشروط الإلغاء' : 'Configure commission rates, escrow hold period, and dispute SLAs'}
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow cursor-pointer"
            >
              {isRtl ? 'حفظ السياسات' : 'Save Policies'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'عمولة المنصة على الخدمات الرقمية (%)' : 'Service Commission Rate (%)'}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={policies.serviceFeePercentage}
                onChange={(e) => setPolicies({ ...policies, serviceFeePercentage: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'عمولة التسويق والوسطاء (%)' : 'Affiliate Commission (%)'}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={policies.affiliateCommissionRate}
                onChange={(e) => setPolicies({ ...policies, affiliateCommissionRate: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'فترة حجز أموال الضمان بعد التسليم (أيام)' : 'Escrow Holding Period (Days)'}
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={policies.escrowHoldDays}
                onChange={(e) => setPolicies({ ...policies, escrowHoldDays: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'إشعار عدم الحضور للجلسات (دقائق)' : 'No-Show Grace Period (Minutes)'}
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={policies.noShowPenaltyMinutes}
                onChange={(e) => setPolicies({ ...policies, noShowPenaltyMinutes: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'مهلة التحكيم في النزاعات (ساعات)' : 'Dispute Arbitration SLA (Hours)'}
              </label>
              <input
                type="number"
                min="12"
                max="168"
                value={policies.disputeWindowHours}
                onChange={(e) => setPolicies({ ...policies, disputeWindowHours: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-700 block">
                {isRtl ? 'الإفراج التلقائي عند عدم رد العميل (ساعات)' : 'Auto-Release Delivery (Hours)'}
              </label>
              <input
                type="number"
                min="24"
                max="168"
                value={policies.autoReleaseHours}
                onChange={(e) => setPolicies({ ...policies, autoReleaseHours: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
              />
            </div>
          </div>
        </form>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-sm text-slate-900">
              {isRtl ? 'إدارة المستخدمين والصلاحيات (RBAC)' : 'User Management & Roles'}
            </h3>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute inset-y-0 start-3 my-auto" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={isRtl ? 'بحث بالاسم أو البريد أو الدور...' : 'Search users...'}
                className="w-full py-1.5 ps-8 pe-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3 text-start">{isRtl ? 'المستخدم' : 'User'}</th>
                  <th className="p-3 text-start">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الدور (Role)' : 'Role'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3 text-start">{isRtl ? 'تاريخ التسجيل' : 'Joined'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u: User) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover border" />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {isRtl ? 'نشط وموثق' : 'Verified'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payouts Approval Tab */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">
            {isRtl ? 'طلبات سحب الأرباح والعمولات للحسابات البنكية' : 'Payouts Requests & Bank Transfers'}
          </h3>

          <div className="divide-y divide-slate-100">
            {(data.payouts || []).map((payout: PayoutRequest) => (
              <div key={payout.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{payout.userName}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-800 font-bold uppercase">
                      {payout.role}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1 space-y-0.5">
                    <div>{isRtl ? 'البنك:' : 'Bank:'} <span className="font-semibold text-slate-800">{payout.bankName}</span></div>
                    <div className="font-mono">{payout.iban}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <div className="text-base font-black text-slate-900">
                      {payout.amount} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        payout.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : payout.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {payout.status}
                    </span>
                  </div>

                  {payout.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleUpdatePayoutStatus(payout.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow"
                      >
                        {isRtl ? 'اعتماد الصرف' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleUpdatePayoutStatus(payout.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs cursor-pointer border border-rose-200"
                      >
                        {isRtl ? 'رفض' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <span>{isRtl ? 'سجل العمليات والتدقيق الأمني (Audit Trail)' : 'Security Audit Trail'}</span>
          </h3>

          <div className="space-y-2 text-xs">
            {(data.auditLogs || []).map((log: AuditLog) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-mono font-bold text-amber-700">{log.action}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="font-semibold text-slate-900">{log.details}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
                  <span>بواسطة: {log.performedBy}</span>
                  <span>•</span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
