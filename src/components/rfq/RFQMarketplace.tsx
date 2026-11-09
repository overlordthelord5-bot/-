import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  DollarSign,
  Clock,
  Send,
  CheckCircle,
  Briefcase,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { RFQ, RFQProposal } from '../../types';

export const RFQMarketplace: React.FC = () => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [proposals, setProposals] = useState<RFQProposal[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // New RFQ form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tech');
  const [budgetMin, setBudgetMin] = useState(3000);
  const [budgetMax, setBudgetMax] = useState(7000);
  const [deliveryDaysMax, setDeliveryDaysMax] = useState(14);
  const [skills, setSkills] = useState('استراتيجيات الأعمال, دراسات الجدوى');

  // Proposal form state
  const [bidAmount, setBidAmount] = useState(4500);
  const [deliveryDays, setDeliveryDays] = useState(10);
  const [coverLetter, setCoverLetter] = useState('');

  const fetchRfqs = async () => {
    try {
      const res = await fetch('/api/rfq');
      const data = await res.json();
      if (data.success) {
        setRfqs(data.rfqs);
        if (!selectedRfq && data.rfqs.length > 0) {
          loadProposals(data.rfqs[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  const loadProposals = async (rfq: RFQ) => {
    setSelectedRfq(rfq);
    try {
      const res = await fetch(`/api/rfq/${rfq.id}/proposals`);
      const data = await res.json();
      if (data.success) {
        setProposals(data.proposals);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          budgetMin,
          budgetMax,
          deliveryDaysMax,
          requiredSkills: skills.split(',').map((s) => s.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isRtl ? 'تم طرح طلب عرض السعر RFQ بنجاح' : 'RFQ Posted Successfully', title, 'success');
        setIsCreateOpen(false);
        setTitle('');
        setDescription('');
        fetchRfqs();
      }
    } catch {
      showToast('Error', 'Failed to post RFQ', 'error');
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq || !coverLetter) return;

    try {
      const res = await fetch(`/api/rfq/${selectedRfq.id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidAmount,
          deliveryDays,
          coverLetter,
          milestones: [
            { title: 'المرحلة الأولى: المسح والتخطيط', days: Math.round(deliveryDays / 2), amount: Math.round(bidAmount * 0.4) },
            { title: 'المرحلة الثانية: التنفيذ والتسليم النهائي', days: Math.round(deliveryDays / 2), amount: Math.round(bidAmount * 0.6) },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isRtl ? 'تم تقديم عرضك المالي والفني بنجاح' : 'Proposal Submitted', `${bidAmount} SAR`, 'success');
        setIsProposalOpen(false);
        setCoverLetter('');
        loadProposals(selectedRfq);
      }
    } catch {
      showToast('Error', 'Failed to submit proposal', 'error');
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isRtl ? 'تمت ترسية المشروع وقبول العرض!' : 'Proposal Accepted', '', 'success');
        if (selectedRfq) loadProposals(selectedRfq);
        fetchRfqs();
      }
    } catch {
      showToast('Error', 'Failed to update', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#0F1E36] to-[#1E3E62] rounded-3xl p-6 sm:p-8 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              {isRtl ? 'نظام طلب عروض الأسعار والمناقصات (RFQ)' : 'RFQ & Custom Bidding Engine'}
            </span>
            <span className="text-xs text-slate-300">Inspired by Upwork & Enterprise RFQs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRtl ? 'سوق المشاريع وطلب عروض الأسعار المخصصة' : 'Projects & RFQ Marketplace'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            {isRtl
              ? 'اطرح متطلبات مشروعك الخاص، استقبل عروض أسعار تفصيلية من الخبراء والاستشاريين، تفاوض على المراحل، وادفع عبر حساب الضمان Escrow بعد الترسية.'
              : 'Post custom requirements, receive milestone proposals, negotiate bids, and secure funds in escrow upon awarding.'}
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'طرح طلب مشروع جديد (RFQ)' : 'Post New RFQ'}</span>
        </button>
      </div>

      {/* Main Grid: Projects List on Left, Selected RFQ & Proposals on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: RFQ Listings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">{isRtl ? 'طلبات المشاريع المتاحة' : 'Open RFQ Projects'}</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {rfqs.length} {isRtl ? 'مشروع' : 'Projects'}
            </span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto">
            {rfqs.map((rfq) => {
              const isSelected = selectedRfq?.id === rfq.id;
              return (
                <div
                  key={rfq.id}
                  onClick={() => loadProposals(rfq)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {rfq.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rfq.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700'
                          : rfq.status === 'awarded'
                          ? 'bg-cyan-50 text-cyan-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rfq.status === 'open' ? (isRtl ? 'مفتوح لاستقبال العروض' : 'Open') : rfq.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug mb-2">{rfq.title}</h4>

                  <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                    <div className="font-black text-slate-900">
                      {rfq.budgetMin} - {rfq.budgetMax} <span className="text-[10px] text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                      <Users className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{rfq.proposalsCount} {isRtl ? 'عروض مقدمة' : 'Bids'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected RFQ Deep View & Proposals */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          {selectedRfq ? (
            <div className="space-y-6">
              {/* RFQ Header */}
              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={selectedRfq.clientAvatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{selectedRfq.clientName}</span>
                      <span className="text-[10px] text-slate-400">{selectedRfq.createdAt}</span>
                    </div>
                  </div>

                  {user?.role === 'consultant' || user?.role === 'seller' ? (
                    <button
                      onClick={() => setIsProposalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'تقديم عرض سعر ومراحل' : 'Submit Bid'}</span>
                    </button>
                  ) : null}
                </div>

                <h2 className="text-lg font-black text-slate-900 leading-snug">{selectedRfq.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedRfq.description}</p>

                {/* Specs Box */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">{isRtl ? 'الميزانية التقديرية:' : 'Budget:'}</span>
                    <span className="font-black text-slate-900">{selectedRfq.budgetMin} - {selectedRfq.budgetMax} ر.س</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">{isRtl ? 'أقصى مدة تسليم:' : 'Max Delivery:'}</span>
                    <span className="font-bold text-slate-800">{selectedRfq.deliveryDaysMax} {isRtl ? 'يوم' : 'Days'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">{isRtl ? 'حالة الترسية:' : 'Status:'}</span>
                    <span className="font-bold text-emerald-600">{selectedRfq.status}</span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedRfq.requiredSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proposals Received */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>{isRtl ? 'عروض الأسعار والتفاوض المقدمة' : 'Submitted Proposals'}</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">{proposals.length}</span>
                </div>

                {proposals.length === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
                    {isRtl ? 'لم يتم تقديم عروض لهذا المشروع بعد. كن أول من يقدم عرضه!' : 'No proposals submitted yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proposals.map((prop) => (
                      <div
                        key={prop.id}
                        className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                          prop.status === 'accepted'
                            ? 'border-emerald-500 bg-emerald-50/30'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img src={prop.providerAvatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                            <div>
                              <span className="font-bold text-slate-900 block">{prop.providerName}</span>
                              <div className="text-[10px] text-amber-600 flex items-center gap-0.5">
                                <Award className="w-3 h-3" />
                                <span>تقييم {prop.providerRating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-end">
                            <div className="text-base font-black text-slate-900">
                              {prop.bidAmount} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {prop.deliveryDays} {isRtl ? 'أيام للتسليم' : 'Days'}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed text-[11px]">{prop.coverLetter}</p>

                        {/* Milestones */}
                        <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block">{isRtl ? 'مراحل العمل والدفع:' : 'Milestones:'}</span>
                          {prop.milestones.map((m, idx) => (
                            <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                              <span>{m.title} ({m.days} {isRtl ? 'يوم' : 'd'})</span>
                              <span className="font-bold text-slate-900">{m.amount} ر.س</span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              prop.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {prop.status === 'accepted' ? (isRtl ? 'تمت الترسية والقبول' : 'Awarded') : prop.status}
                          </span>

                          {prop.status !== 'accepted' && (user?.id === selectedRfq.clientId || user?.role === 'admin') && (
                            <button
                              onClick={() => handleAcceptProposal(prop.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow"
                            >
                              {isRtl ? 'قبول العرض وترسية المشروع' : 'Accept & Award'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              {isRtl ? 'اختر مشروعاً من القائمة لعرض التفاصيل والعروض' : 'Select an RFQ project'}
            </div>
          )}
        </div>
      </div>

      {/* Post RFQ Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleCreateRfq} className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{isRtl ? 'طرح طلب عرض سعر جديد (RFQ)' : 'Post New RFQ'}</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'عنوان المشروع أو الاستشارة المطلوبة:' : 'Project Title:'}</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isRtl ? 'مثال: إعداد دراسة جدوى استثمارية لمتجر سحابي' : 'Title'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'وصف المتطلبات والمخرجات المطلوبة:' : 'Description & Scope:'}</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isRtl ? 'اشرح بالتفصيل أهداف المشروع، حجم الأعمال، والملفات المطلوبة...' : 'Details'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'الحد الأدنى (ر.س):' : 'Min Budget:'}</label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'الحد الأقصى (ر.س):' : 'Max Budget:'}</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'مدة التسليم (أيام):' : 'Deadline (Days):'}</label>
                  <input
                    type="number"
                    value={deliveryDaysMax}
                    onChange={(e) => setDeliveryDaysMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                {isRtl ? 'نشر واستقبال العروض' : 'Post RFQ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submit Proposal Modal */}
      {isProposalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleSubmitProposal} className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{isRtl ? 'تقديم عرض سعر ومراحل للمشروع' : 'Submit Proposal'}</h3>
              <button type="button" onClick={() => setIsProposalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'قيمة العرض المالي (ر.س):' : 'Bid Amount (SAR):'}</label>
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'مدة التنفيذ المقترحة (أيام):' : 'Delivery Days:'}</label>
                  <input
                    type="number"
                    required
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'رسالة العرض الفني ومنهجية العمل:' : 'Cover Letter & Approach:'}</label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={isRtl ? 'اشرح خبرتك السابقة، المنهجية التي ستتبعها، ومخرجات التسليم المقترحة...' : 'Explain your methodology'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsProposalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs"
              >
                {isRtl ? 'إرسال العرض للعميل' : 'Submit Bid'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
