import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Scale,
  CheckCircle,
  FileText,
  DollarSign,
  X,
  Send,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Dispute } from '../../types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  sellerId?: string;
  sellerName?: string;
  orderAmount?: number;
  onDisputeCreated?: (dispute: Dispute) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  orderId = 'ord-101',
  sellerId = 'cons-1',
  sellerName = 'د. عبد الرحمن السالم',
  orderAmount = 350,
  onDisputeCreated,
}) => {
  const { isRtl } = useLanguage();
  const { showToast } = useNotification();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [reason, setReason] = useState<string>('quality_mismatch');
  const [description, setDescription] = useState('');
  const [desiredResolution, setDesiredResolution] = useState<'refund_full' | 'refund_partial' | 'rework'>('refund_full');
  const [refundAmount, setRefundAmount] = useState<number>(orderAmount);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>(['chat_screenshot_specs.png', 'delivery_flaws.pdf']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast(isRtl ? 'يرجى كتابة تفاصيل المشكلة والأسباب' : 'Please provide dispute details', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        orderId,
        buyerId: 'usr-client-1',
        buyerName: 'سارة عبد الله',
        sellerId,
        sellerName,
        reason,
        description,
        desiredResolution,
        requestedRefundAmount: desiredResolution === 'refund_partial' ? refundAmount : orderAmount,
        evidence: evidenceFiles.map((f) => ({ name: f, url: '#', uploadedAt: new Date().toISOString() })),
      };

      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          isRtl
            ? 'تم فتح النزاع رسمياً وتجميد أموال الضمان (Escrow) لحين البت'
            : 'Dispute opened and escrow funds frozen pending mediation',
          'success'
        );
        if (onDisputeCreated) {
          onDisputeCreated(data.dispute);
        }
        onClose();
      } else {
        showToast(data.error || 'Failed to open dispute', 'error');
      }
    } catch (e) {
      showToast(isRtl ? 'حدث خطأ في تقديم النزاع' : 'Error submitting dispute', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-[#1E0F1C] to-slate-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  {isRtl ? 'فتح نزاع وطلب وساطة واسترداد' : 'Dispute Mediation & Refund Request'}
                </h2>
              </div>
              <p className="text-xs text-rose-200 mt-1">
                {isRtl
                  ? `الطلب #${orderId} • الطرف الآخر: ${sellerName}`
                  : `Order #${orderId} • Counterparty: ${sellerName}`}
              </p>
            </div>
          </div>
        </div>

        {/* Escrow Guarantee Notice */}
        <div className="p-4 bg-amber-50 border-b border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-black block mb-0.5">
              {isRtl ? 'حماية الضمان المالي المشدد (WASEET Escrow Protection)' : 'WASEET Escrow Protection Active'}
            </span>
            {isRtl
              ? `المبلغ (${orderAmount} ر.س) محتجز بأمان في حساب الضمان، وسيتم تجميد الصرف فوراً حتى التحكيم العادل وإعادة الحقوق لأصحابها.`
              : `The payment (${orderAmount} SAR) is held safely in escrow and frozen until mediator resolution.`}
          </div>
        </div>

        {/* Dispute Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              {isRtl ? 'سبب النزاع الأساسي' : 'Primary Dispute Reason'} *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-rose-500 outline-none font-semibold text-slate-800"
            >
              <option value="quality_mismatch">{isRtl ? 'مخرجات العمل لا تطابق الشروط المتفق عليها' : 'Deliverables do not match specifications'}</option>
              <option value="missed_deadline">{isRtl ? 'تأخر غير مبرر في التسليم أو تجاوز الموعد' : 'Unjustified delivery delay / missed deadline'}</option>
              <option value="non_responsive">{isRtl ? 'الطرف الآخر لا يستجيب في مساحة العمل' : 'Counterparty is unresponsive in workspace'}</option>
              <option value="no_show">{isRtl ? 'عدم الحضور للجلسة الاستشارية في الموعد' : 'No-show for scheduled consultation session'}</option>
              <option value="unauthorized_change">{isRtl ? 'تعديلات جوهرية غير متفق عليها في نطاق العمل' : 'Unauthorized major scope alteration'}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              {isRtl ? 'الحل العادل المطلوب' : 'Desired Resolution'} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  desiredResolution === 'refund_full'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="resolution"
                  className="hidden"
                  checked={desiredResolution === 'refund_full'}
                  onChange={() => setDesiredResolution('refund_full')}
                />
                <span>{isRtl ? 'استرداد كامل المبلغ' : 'Full Refund'}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{orderAmount} {isRtl ? 'ر.س' : 'SAR'}</span>
              </label>

              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  desiredResolution === 'refund_partial'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="resolution"
                  className="hidden"
                  checked={desiredResolution === 'refund_partial'}
                  onChange={() => setDesiredResolution('refund_partial')}
                />
                <span>{isRtl ? 'استرداد جزئي' : 'Partial Refund'}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{isRtl ? 'تحديد مبلغ' : 'Custom'}</span>
              </label>

              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  desiredResolution === 'rework'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="resolution"
                  className="hidden"
                  checked={desiredResolution === 'rework'}
                  onChange={() => setDesiredResolution('rework')}
                />
                <span>{isRtl ? 'إلزام الطرف بالإصلاح' : 'Mandatory Rework'}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{isRtl ? 'تصحيح المخرجات' : 'Fix Deliverables'}</span>
              </label>
            </div>
          </div>

          {desiredResolution === 'refund_partial' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {isRtl ? 'المبلغ المطلوب استرداده (ر.س)' : 'Refund Amount (SAR)'}
              </label>
              <input
                type="number"
                min="1"
                max={orderAmount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              {isRtl ? 'شرح تفاصيل النزاع والأدلة' : 'Dispute Description & Supporting Facts'} *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isRtl
                  ? 'اذكر بالتفصيل ما تم الاتفاق عليه، والمخرجات الفعلية التي تم استلامها، ومحاولات التواصل السابقة...'
                  : 'Describe what was agreed upon, what was delivered, and timeline of events...'
              }
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-rose-500 outline-none leading-relaxed"
            />
          </div>

          {/* Evidence Attachments */}
          <div className="space-y-1.5">
            <span className="block text-slate-700 font-bold">
              {isRtl ? 'الأدلة المرفقة (محادثات، مسودات، لقطات شاشة)' : 'Evidence Attachments'}
            </span>
            <div className="flex flex-wrap gap-2">
              {evidenceFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-[11px]">{f}</span>
                  <button
                    type="button"
                    onClick={() => setEvidenceFiles(evidenceFiles.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-rose-600 font-bold ms-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? (isRtl ? 'جاري الفتح...' : 'Opening...') : (isRtl ? 'تأكيد فتح النزاع وتجميد الضمان' : 'Submit Dispute')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
