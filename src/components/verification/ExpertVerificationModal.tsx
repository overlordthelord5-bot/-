import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Building,
  Award,
  X,
  FileCheck,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { ExpertVerification } from '../../types';

interface ExpertVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultantId?: string;
  consultantName?: string;
}

export const ExpertVerificationModal: React.FC<ExpertVerificationModalProps> = ({
  isOpen,
  onClose,
  consultantId = 'cons-1',
  consultantName = 'د. عبد الرحمن السالم',
}) => {
  const { isRtl } = useLanguage();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'status' | 'apply'>('status');
  const [existingVerification, setExistingVerification] = useState<ExpertVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    legalName: consultantName,
    nationalId: '1098273645',
    licenseNumber: 'LIC-SOCPA-2024-8891',
    issuingAuthority: 'الهيئة السعودية للمراجعين والمحاسبين (SOCPA)',
    yearsOfExperience: 14,
    specialty: 'استشارات مالية وضريبية وقضائية',
    uploadedIdCard: true,
    uploadedLicense: true,
    uploadedDegree: true,
    consentBackgroundCheck: true,
    notes: 'حاصل على زمالة SOCPA وشهادة مستشار مالي معتمد مع خبرة 14 عاماً في الشركات المساهمة.',
  });

  useEffect(() => {
    if (isOpen) {
      fetchVerificationStatus();
    }
  }, [isOpen]);

  const fetchVerificationStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/expert-verifications');
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.verifications || [];
      if (list.length > 0) {
        const match = list.find((v: ExpertVerification) => v.consultantId === consultantId || v.userId === consultantId) || list[0];
        setExistingVerification(match);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentBackgroundCheck) {
      showToast(isRtl ? 'يجب الموافقة على فحص السجلات والتحقق الأمني' : 'You must accept background verification consent', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        consultantId,
        consultantName: formData.legalName,
        legalName: formData.legalName,
        nationalId: formData.nationalId,
        licenseNumber: formData.licenseNumber,
        issuingAuthority: formData.issuingAuthority,
        yearsOfExperience: Number(formData.yearsOfExperience),
        documents: [
          { name: 'National_ID_Verified.pdf', url: '#', type: 'national_id', uploadedAt: new Date().toISOString() },
          { name: 'SOCPA_Accreditation_Certificate.pdf', url: '#', type: 'license', uploadedAt: new Date().toISOString() },
          { name: 'PhD_Finance_Degree.pdf', url: '#', type: 'degree', uploadedAt: new Date().toISOString() }
        ],
        notes: formData.notes
      };

      const res = await fetch('/api/expert-verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setExistingVerification(result.verification);
        setActiveTab('status');
        showToast(isRtl ? 'تم إرسال ملف التوثيق للاعتماد بنجاح! يتم التدقيق خلال 24 ساعة' : 'Verification application submitted! Under review within 24 hours', 'success');
      }
    } catch (e) {
      showToast(isRtl ? 'حدث خطأ في تقديم الطلب' : 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  {isRtl ? 'نظام توثيق الخبراء والشهادات المهنية' : 'Expert Verification & Credentials Engine'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  WASEET Trust
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isRtl
                  ? 'تدقيق الهويات الوطنية، التراخيص المهنية، والشهادات الأكاديمية الصادرة من الجهات المعتمدة'
                  : 'Rigorous compliance auditing for licenses, government IDs, and academic accreditations'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {isRtl ? 'حالة التوثيق الحالية' : 'Verification Status'}
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'apply'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {isRtl ? 'تقديم / تحديث وثائق التوثيق' : 'Submit Credentials'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {loading ? (
                <div className="py-12 text-center text-slate-400">
                  <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
                  <span className="text-xs font-bold">{isRtl ? 'جاري فحص حالة التوثيق...' : 'Checking verification status...'}</span>
                </div>
              ) : existingVerification ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div
                    className={`p-5 rounded-2xl border flex items-start gap-4 ${
                      existingVerification.status === 'verified'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : existingVerification.status === 'pending'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        existingVerification.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-600'
                          : existingVerification.status === 'pending'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {existingVerification.status === 'verified' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : existingVerification.status === 'pending' ? (
                        <Clock className="w-6 h-6 animate-pulse" />
                      ) : (
                        <AlertTriangle className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm uppercase tracking-wide">
                          {existingVerification.status === 'verified'
                            ? (isRtl ? 'مستشار موثق ومعتمد رسمياً' : 'Officially Verified & Accredited')
                            : existingVerification.status === 'pending'
                            ? (isRtl ? 'طلب التوثيق قيد المراجعة والتدقيق' : 'Verification Under Audit Review')
                            : (isRtl ? 'تم رفض التوثيق لملاحظات نظامية' : 'Verification Rejected')}
                        </span>
                        <span className="text-xs font-mono font-bold bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200">
                          {existingVerification.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">
                        {existingVerification.status === 'verified'
                          ? (isRtl
                              ? 'تمت مطابقة الهوية الوطنية ورخصة المزاولة الصادرة من الجهة الحكومية بنجاح. تظهر شارة التوثيق الذهبية في صفحة الاستشاري.'
                              : 'National ID and governmental license verified. The golden verification badge is displayed on your profile.')
                          : existingVerification.status === 'pending'
                          ? (isRtl
                              ? 'ملف الاعتماد قيد تدقيق فريق الامتثال القانوني لمنصة وسيط. متوسط وقت الاعتماد: أقل من 24 ساعة.'
                              : 'Your credentials are being reviewed by the WASEET compliance team. Average review time: < 24 hours.')
                          : (existingVerification.rejectionReason || (isRtl ? 'يرجى إعادة رفع رخصة المزاولة واضحة المعالم.' : 'Please re-upload a clear copy of your license.'))}
                      </p>
                    </div>
                  </div>

                  {/* Verification Record Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[11px] mb-1">{isRtl ? 'الاسم النظامي' : 'Legal Name'}</span>
                      <span className="font-bold text-slate-800">{existingVerification.legalName}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[11px] mb-1">{isRtl ? 'جهة الإصدار والاعتماد' : 'Issuing Authority'}</span>
                      <span className="font-bold text-slate-800">{existingVerification.issuingAuthority}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[11px] mb-1">{isRtl ? 'رقم الترخيص المهني' : 'License Number'}</span>
                      <span className="font-bold font-mono text-slate-800">{existingVerification.licenseNumber}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[11px] mb-1">{isRtl ? 'سنوات الخبرة المعتمدة' : 'Verified Experience'}</span>
                      <span className="font-bold text-slate-800">{existingVerification.yearsOfExperience} {isRtl ? 'سنوات' : 'Years'}</span>
                    </div>
                  </div>

                  {/* Documents Verified */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      {isRtl ? 'الوثائق والمرفقات المدققة' : 'Verified Attached Documents'}
                    </span>
                    <div className="space-y-2">
                      {existingVerification.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center gap-2 text-slate-800 font-medium">
                            <FileCheck className="w-4 h-4 text-emerald-600" />
                            <span>{doc.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {isRtl ? 'تحديث الوثائق أو إضافة شهادات جديدة' : 'Update Credentials or Upload More'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      {isRtl ? 'لم يتم تقديم وثائق التوثيق بعد' : 'No Credentials Submitted Yet'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      {isRtl
                        ? 'يوفر التوثيق شارة التميز الذهبية، يضاعف ثقة العملاء، ويمنحك أولوية الظهور في نتائج بحث وسيط.'
                        : 'Verification awards the golden badge, quadruples customer trust, and ranks your services top of search.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                  >
                    {isRtl ? 'بدء تقديم طلب التوثيق الآن' : 'Start Verification Application'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'apply' && (
            <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isRtl ? 'الاسم الرباعي الرسمي' : 'Official Legal Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isRtl ? 'رقم الهوية الوطنية / الإقامة' : 'National ID / Residency No.'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isRtl ? 'جهة إصدار الترخيص المهني' : 'Issuing Authority'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                    placeholder={isRtl ? 'مثل: وزارة العدل، هيئة المحاسبين SOCPA' : 'e.g. Ministry of Justice, SOCPA'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isRtl ? 'رقم رخصة المزاولة المهنية' : 'License / Registration No.'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isRtl ? 'سنوات الخبرة العملية' : 'Years of Experience'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isRtl ? 'التخصص الاستشاري الأساسي' : 'Primary Specialization'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Uploads checklist */}
              <div className="space-y-2 pt-2">
                <span className="block text-slate-700 font-bold">
                  {isRtl ? 'رفع الوثائق الثبوتية (PDF, PNG, JPG بحد أقصى 15MB)' : 'Upload Supporting Documents'} *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-dashed border-amber-400/80 bg-amber-50/50 flex flex-col items-center justify-center text-center">
                    <FileCheck className="w-5 h-5 text-amber-600 mb-1" />
                    <span className="font-bold text-slate-800 text-[11px]">{isRtl ? 'الهوية الوطنية' : 'National ID'}</span>
                    <span className="text-[10px] text-emerald-600 mt-1 font-semibold">{isRtl ? 'تم الرفع جاهز' : 'Ready'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-dashed border-amber-400/80 bg-amber-50/50 flex flex-col items-center justify-center text-center">
                    <FileCheck className="w-5 h-5 text-amber-600 mb-1" />
                    <span className="font-bold text-slate-800 text-[11px]">{isRtl ? 'رخصة المزاولة' : 'Practice License'}</span>
                    <span className="text-[10px] text-emerald-600 mt-1 font-semibold">{isRtl ? 'تم الرفع جاهز' : 'Ready'}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-dashed border-amber-400/80 bg-amber-50/50 flex flex-col items-center justify-center text-center">
                    <FileCheck className="w-5 h-5 text-amber-600 mb-1" />
                    <span className="font-bold text-slate-800 text-[11px]">{isRtl ? 'الشهادة الأكاديمية' : 'Degree / Diploma'}</span>
                    <span className="text-[10px] text-emerald-600 mt-1 font-semibold">{isRtl ? 'تم الرفع جاهز' : 'Ready'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isRtl ? 'نبذة عن الاعتمادات والإنجازات' : 'Credentials Summary & Accreditations'}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentBackgroundCheck}
                  onChange={(e) => setFormData({ ...formData, consentBackgroundCheck: e.target.checked })}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  {isRtl
                    ? 'أقر بصحة جميع البيانات والمستندات المرفقة، وأفوّض منصة وسيط بالتحقق منها لدى الجهات الرسمية ذات العلاقة، مع الالتزام بميثاق أخلاقيات الاستشارات.'
                    : 'I certify that all submitted information is accurate and authorize WASEET to verify it with relevant authorities.'}
                </span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال ملف التوثيق للاعتماد' : 'Submit for Verification')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
