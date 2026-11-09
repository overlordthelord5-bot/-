import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Send,
  Download,
  Paperclip,
  CheckCircle,
  RotateCcw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Order, OrderMessage, DeliverableSubmission } from '../../types';

interface OrderWorkspaceModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenDispute?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
}

export const OrderWorkspaceModal: React.FC<OrderWorkspaceModalProps> = ({
  order,
  onClose,
  onOpenDispute,
  onOrderUpdated,
}) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  if (!order) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'deliverables' | 'escrow'>('chat');
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [deliverable, setDeliverable] = useState<DeliverableSubmission | null>(null);

  // Deliverable submit form for vendor
  const [isSubmitDeliverableOpen, setIsSubmitDeliverableOpen] = useState(false);
  const [delTitle, setDelTitle] = useState('');
  const [delSummary, setDelSummary] = useState('');
  const [delActions, setDelActions] = useState('');

  const fetchWorkspaceData = async () => {
    try {
      const [msgRes, delRes] = await Promise.all([
        fetch(`/api/orders/${order.orderNumber}/messages`).then((r) => r.json()),
        fetch(`/api/orders/${order.orderNumber}/deliverables`).then((r) => r.json()),
      ]);
      if (msgRes.success) setMessages(msgRes.messages);
      if (delRes.success) setDeliverable(delRes.deliverable);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [order]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    try {
      const res = await fetch(`/api/orders/${order.orderNumber}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputMsg }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setInputMsg('');
      }
    } catch {
      // Local fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          orderId: order.orderNumber,
          senderId: user?.id || 'usr',
          senderName: user?.name || 'أنا',
          senderRole: user?.role || 'client',
          content: inputMsg,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        },
      ]);
      setInputMsg('');
    }
  };

  const handleReviewDeliverable = async (decision: 'accepted' | 'revision_requested') => {
    try {
      const res = await fetch(`/api/orders/${order.orderNumber}/deliverables/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (data.success) {
        setDeliverable(data.deliverable);
        showToast(
          decision === 'accepted' ? (isRtl ? 'تم قبول التسليم النهائي وتحرير أموال الضمان' : 'Deliverables Accepted') : (isRtl ? 'تم طلب تعديلات إضافية' : 'Revision Requested'),
          '',
          decision === 'accepted' ? 'success' : 'info'
        );
      }
    } catch {
      showToast('Error', 'Failed to review', 'error');
    }
  };

  const handleReleaseEscrowEarly = async () => {
    try {
      const res = await fetch(`/api/escrow/${order.orderNumber}/release`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        showToast(isRtl ? 'تم تحرير أموال الضمان للبائع بنجاح' : 'Escrow Released to Vendor', '', 'success');
        order.escrowStatus = 'released';
        order.status = 'completed';
      }
    } catch {
      showToast('Error', 'Failed to release', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full h-[620px] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0B192C] text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-400 text-sm">{order.orderNumber}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-semibold">{order.items[0]?.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{isRtl ? 'المشتري:' : 'Buyer:'} {order.userName}</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">{order.total} {isRtl ? 'ر.س' : 'SAR'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDispute && (
              <button
                onClick={() => onOpenDispute(order)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{isRtl ? 'فتح نزاع رسمي' : 'Dispute'}</span>
              </button>
            )}

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex gap-2 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat' ? 'bg-[#0B192C] text-amber-300 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المحادثة وسجل العمل' : 'Order Chat'} ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deliverables')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'deliverables' ? 'bg-[#0B192C] text-amber-300 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مخرجات التسليم النهائي' : 'Deliverables'}</span>
            {deliverable && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'escrow' ? 'bg-[#0B192C] text-amber-300 shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isRtl ? 'حساب الضمان (Escrow)' : 'Escrow Vault'}</span>
          </button>
        </div>

        {/* Tab 1: Live Contextual Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-4">
            <div className="flex-1 overflow-y-auto space-y-3 pe-2">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-900 text-center">
                {isRtl
                  ? 'جميع المحادثات داخل وسيط مسجلة رسمياً لحماية حقوق الطرفين في حال النزاع المالي.'
                  : 'All order discussions are recorded in our escrow audit ledger.'}
              </div>

              {messages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-400 mb-0.5 px-1">{m.senderName} ({m.senderRole})</div>
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#0B192C] text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {m.content}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 px-1">{m.createdAt}</div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={isRtl ? 'اكتب رسالتك أو استفسارك بخصوص هذا الطلب...' : 'Type message regarding this order...'}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إرسال' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Deliverables & Handover */}
        {activeTab === 'deliverables' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {deliverable ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{deliverable.submittedAt}</span>
                    <h3 className="font-bold text-sm text-slate-900">{deliverable.title}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      deliverable.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {deliverable.status === 'accepted' ? (isRtl ? 'تم القبول والاعتماد' : 'Accepted') : (isRtl ? 'قيد مراجعة العميل' : 'Under Review')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block">{isRtl ? 'الملخص التنفيذي للمخرجات:' : 'Executive Summary:'}</span>
                  <p className="text-slate-600 leading-relaxed">{deliverable.executiveSummary}</p>
                </div>

                {deliverable.actionPoints?.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-800 block">{isRtl ? 'خطة العمل والتوصيات:' : 'Action Points:'}</span>
                    {deliverable.actionPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attached Deliverables Files */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-slate-800 block">{isRtl ? 'الملفات المرفقة للتنزيل:' : 'Deliverable Files:'}</span>
                  {deliverable.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{file.name}</div>
                        <div className="text-[10px] text-slate-400">{file.size} • {file.format}</div>
                      </div>
                      <button
                        onClick={() => showToast(isRtl ? 'جاري تنزيل الملف' : 'Downloading', file.name, 'success')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تنزيل' : 'Download'}</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Client Approval Controls */}
                {deliverable.status !== 'accepted' && user?.role === 'client' && (
                  <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      onClick={() => handleReviewDeliverable('revision_requested')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      {isRtl ? 'طلب تعديلات إضافية' : 'Request Revision'}
                    </button>
                    <button
                      onClick={() => handleReviewDeliverable('accepted')}
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow"
                    >
                      {isRtl ? 'قبول المخرجات وتحرير الضمان' : 'Accept & Release Escrow'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">
                  {isRtl ? 'لم يقم مقدم الخدمة بتسليم المخرجات بعد' : 'No deliverables submitted yet'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isRtl
                    ? 'الأموال محفوظة بالكامل في الضمان Escrow ولن يتم تحريرها حتى تستلم عملك كاملاً.'
                    : 'Funds remain locked in Escrow until full delivery.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Escrow Vault & Auto-Release Countdown */}
        {activeTab === 'escrow' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">{isRtl ? 'حساب الضمان البنكي الآمن (WASEET Escrow Vault)' : 'WASEET Escrow Protection'}</span>
              </div>
              <p className="text-emerald-900 leading-relaxed text-[11px]">
                {isRtl
                  ? 'تم حجز إجمالي مبلغ الطلب في حساب الضمان المنفصل، ولا يستطيع أي طرف سحبه حتى يكتمل التسليم والفحص.'
                  : 'Total payment is held safely in escrow. Release occurs upon buyer satisfaction.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">{isRtl ? 'المبلغ المحتجز:' : 'Amount in Escrow:'}</span>
                <span className="text-base font-black text-slate-900">{order.total} ر.س</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">{isRtl ? 'حالة الضمان:' : 'Status:'}</span>
                <span className="font-bold text-emerald-600 uppercase">{order.escrowStatus}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">{isRtl ? 'موعد التحرير التلقائي:' : 'Auto Release Date:'}</span>
                <span className="font-bold text-slate-800">{order.escrowReleaseDueDate || '2026-11-14'}</span>
              </div>
            </div>

            {order.escrowStatus === 'held_in_escrow' && user?.role === 'client' && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {isRtl ? 'هل استلمت الطلب وفحصته بنجاح؟' : 'Satisfied with delivery?'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isRtl ? 'يمكنك تحرير الأموال للبائع مبكراً دون الانتظار' : 'Release escrow early to vendor'}
                  </span>
                </div>

                <button
                  onClick={handleReleaseEscrowEarly}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow"
                >
                  {isRtl ? 'تحرير الأموال للبائع الآن' : 'Release Funds Early'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
