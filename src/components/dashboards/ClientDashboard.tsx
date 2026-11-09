import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Calendar,
  Heart,
  HelpCircle,
  Clock,
  Download,
  Truck,
  Video,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Order, ConsultationBooking, SupportTicket } from '../../types';

interface ClientDashboardProps {
  onOpenOrderWorkspace?: (order: Order) => void;
  onOpenVideoMeeting?: (booking: ConsultationBooking) => void;
  onOpenDispute?: (order: Order) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onOpenOrderWorkspace,
  onOpenVideoMeeting,
  onOpenDispute,
}) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'tickets'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'orders' | 'consultations' | 'billing'>('orders');
  const [ticketMsg, setTicketMsg] = useState('');

  const fetchData = async () => {
    try {
      const [ordRes, bkRes, tktRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/bookings').then((r) => r.json()),
        fetch('/api/support/tickets').then((r) => r.json()),
      ]);
      if (ordRes.success) setOrders(ordRes.orders);
      if (bkRes.success) setBookings(bkRes.bookings);
      if (tktRes.success) setTickets(tktRes.tickets);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: ticketSubject,
          category: ticketCategory,
          message: ticketMsg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isRtl ? 'تم فتح تذكرة الدعم' : 'Support Ticket Created', data.ticket.ticketNumber, 'success');
        setIsNewTicketOpen(false);
        setTicketSubject('');
        setTicketMsg('');
        fetchData();
      }
    } catch {
      showToast('Error', 'Failed to create ticket', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Overview Card */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{user?.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                {isRtl ? 'عميل موثق' : 'Verified Client'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isRtl ? 'طلباتي ومشترياتي' : 'My Orders'} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bookings' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isRtl ? 'حجوزات الاستشارات' : 'Consultations'} ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tickets' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تذاكر الدعم' : 'Support'} ({tickets.length})</span>
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            {isRtl ? 'سجل الطلبات والمشتريات' : 'Orders History'}
          </h3>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              {isRtl ? 'لم تقم بإجراء أي طلبات حتى الآن.' : 'No orders yet.'}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.status}
                      </span>
                      <span className="text-slate-900 font-black text-sm">
                        {order.total} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{item.title}</div>
                            <div className="text-[11px] text-slate-500">
                              {item.quantity} x {item.price} {isRtl ? 'ر.س' : 'SAR'}
                            </div>
                          </div>
                        </div>

                        {item.digital && (
                          <button
                            onClick={() =>
                              showToast(isRtl ? 'جاري تنزيل الملف' : 'Downloading file', item.title, 'success')
                            }
                            className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center gap-1 cursor-pointer border border-cyan-200"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'تنزيل فوري' : 'Download'}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Workspace & Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>{isRtl ? 'وسيلة الشحن:' : 'Delivery:'} <strong className="text-slate-900">{order.shippingProvider}</strong></span>
                      {order.trackingNumber && (
                        <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 ms-2">
                          {order.trackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenDispute && (
                        <button
                          onClick={() => onOpenDispute(order)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer"
                        >
                          {isRtl ? 'فتح نزاع وساطة' : 'Dispute'}
                        </button>
                      )}

                      {onOpenOrderWorkspace && (
                        <button
                          onClick={() => onOpenOrderWorkspace(order)}
                          className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'مساحة العمل والتسليم' : 'Workspace & Deliverables'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            {isRtl ? 'حجوزات ومواعيد الجلسات الاستشارية' : 'Consultation Bookings'}
          </h3>

          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              {isRtl ? 'لا توجد حجوزات استشارية سابقة.' : 'No bookings yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600">{b.consultantName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {b.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {b.consultationTitle}
                  </h4>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{b.date} • {b.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Video className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{b.sessionType}</span>
                    </div>
                  </div>

                  <div>
                    {onOpenVideoMeeting ? (
                      <button
                        onClick={() => onOpenVideoMeeting(b)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isRtl ? 'دخول غرفة وسيط المرئية الآمنة' : 'Join Virtual Session'}</span>
                      </button>
                    ) : b.meetingLink ? (
                      <a
                        href={b.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isRtl ? 'دخول غرفة الجلسة الافتراضية' : 'Join Virtual Session'}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              {isRtl ? 'تذاكر الدعم والاستفسارات' : 'Support Tickets'}
            </h3>
            <button
              onClick={() => setIsNewTicketOpen(!isNewTicketOpen)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'فتح تذكرة جديدة' : 'New Ticket'}</span>
            </button>
          </div>

          {/* New Ticket Form */}
          {isNewTicketOpen && (
            <form onSubmit={handleCreateTicket} className="bg-white p-5 rounded-3xl border-2 border-amber-500/30 shadow-md space-y-3">
              <h4 className="font-bold text-xs text-slate-900">
                {isRtl ? 'إنشاء تذكرة استفسار أو شكوى جديدة' : 'Create New Ticket'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {isRtl ? 'موضوع التذكرة:' : 'Subject:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder={isRtl ? 'مثال: استفسار عن مواعيد الجلسة' : 'e.g., Session query'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {isRtl ? 'التصنيف:' : 'Category:'}
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e: any) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  >
                    <option value="orders">{isRtl ? 'الطلبات والشحن' : 'Orders & Shipping'}</option>
                    <option value="consultations">{isRtl ? 'الاستشارات والمواعيد' : 'Consultations'}</option>
                    <option value="billing">{isRtl ? 'المدفوعات والفواتير' : 'Billing'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 font-semibold mb-1">
                  {isRtl ? 'تفاصيل الرسالة:' : 'Message:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                >
                  {isRtl ? 'إرسال التذكرة' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          )}

          {/* Tickets list */}
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-700">{t.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{t.subject}</h4>
                <div className="text-slate-600">{t.messages[t.messages.length - 1]?.content}</div>
                <div className="text-[10px] text-slate-400 pt-1">{t.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
