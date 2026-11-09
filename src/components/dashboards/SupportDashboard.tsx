import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Send,
  User as UserIcon,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { INITIAL_TICKETS } from '../../data/mockData';
import { SupportTicket } from '../../types';

export const SupportDashboard: React.FC = () => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(tickets[0]);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: user?.id || 'usr_support',
      senderName: user?.name || 'فريق الدعم الفني',
      senderRole: 'support' as const,
      content: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = {
      ...selectedTicket,
      status: 'in_progress' as const,
      messages: [...selectedTicket.messages, newMsg],
    };

    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTicket(updated);
    setReplyText('');
    showToast(isRtl ? 'تم إرسال الرد على التذكرة' : 'Reply Sent', selectedTicket.ticketNumber, 'success');
  };

  const handleResolveTicket = (status: 'resolved' | 'closed') => {
    const updated = { ...selectedTicket, status };
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTicket(updated);
    showToast(isRtl ? 'تم تحديث حالة التذكرة' : 'Status Updated', status, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              {isRtl ? 'مركز العناية بالعملاء والنزاعات' : 'Customer Care & Resolution'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRtl ? 'إدارة استفسارات وشكاوى منصة وسيط' : 'Support Tickets Queue'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isRtl
              ? 'الرد على العملاء، متابعة الشحنات والطلبات، حل النزاعات وتصعيد الحالات الحرجة.'
              : 'Direct customer response, dispute management, and rapid ticket resolution.'}
          </p>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Queue Column */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs text-slate-900">{isRtl ? 'قائمة التذاكر الواردة' : 'Incoming Tickets'}</h3>
            <span className="text-xs text-slate-400 font-bold">{tickets.length}</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900">{t.ticketNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        t.status === 'open'
                          ? 'bg-rose-50 text-rose-700'
                          : t.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{t.subject}</h4>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{t.userName}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Conversation Thread */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-700">{selectedTicket.ticketNumber}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 text-xs">{selectedTicket.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{selectedTicket.subject}</h3>
                    <div className="text-xs text-slate-500">
                      {isRtl ? 'المرسل:' : 'From:'} {selectedTicket.userName} ({selectedTicket.userEmail})
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveTicket('resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 cursor-pointer"
                    >
                      {isRtl ? 'تم الحل' : 'Mark Resolved'}
                    </button>
                    <button
                      onClick={() => handleResolveTicket('closed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      {isRtl ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="space-y-3 py-4 max-h-80 overflow-y-auto">
                  {selectedTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        m.senderRole === 'support' || m.senderRole === 'admin'
                          ? 'bg-amber-50/60 border border-amber-200 ms-6'
                          : 'bg-slate-50 border border-slate-200 me-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={m.senderRole === 'support' ? 'text-amber-800' : 'text-slate-900'}>
                          {m.senderName} ({m.senderRole})
                        </span>
                        <span className="text-slate-400 font-normal">{m.timestamp}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{m.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isRtl ? 'اكتب ردك للعميل هنا...' : 'Write reply to customer...'}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isRtl ? 'إرسال' : 'Send'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              {isRtl ? 'اختر تذكرة من القائمة لعرض التفاصيل' : 'Select a ticket'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
