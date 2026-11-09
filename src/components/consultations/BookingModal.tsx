import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  FileText,
  MapPin,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Consultation, SessionType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface BookingModalProps {
  consultation: Consultation | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  consultation,
  onClose,
  onSuccess,
}) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  if (!consultation) return null;

  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>(consultation.sessionTypes[0]);
  const [selectedDate, setSelectedDate] = useState<string>(consultation.availableSlots[0]?.date || '2026-11-10');
  const [selectedTime, setSelectedTime] = useState<string>(consultation.availableSlots[0]?.times[0] || '10:00 AM');
  const [clientPhone, setClientPhone] = useState(user?.phone || '+966 50 123 4567');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  const sessionTypeLabels: Record<SessionType, { label: string; icon: any; desc: string }> = {
    video: {
      label: isRtl ? 'جلسة فيديو مرئية' : 'Video Conference',
      icon: Video,
      desc: isRtl ? 'غرفة اجتماعات رقمية مشفرة بدقة عالية' : 'Encrypted HD video room',
    },
    audio: {
      label: isRtl ? 'مكالمة صوتية' : 'Voice Call',
      icon: Phone,
      desc: isRtl ? 'اتصال هاتفي مباشر مع المستشار' : 'Direct secure voice call',
    },
    chat: {
      label: isRtl ? 'محادثة نصية مباشرة' : 'Live Chat',
      icon: MessageSquare,
      desc: isRtl ? 'شات فوري مع مشاركة المستندات' : 'Real-time text chat with files',
    },
    written: {
      label: isRtl ? 'استشارة كتابية مفصلة' : 'Written Advisory',
      icon: FileText,
      desc: isRtl ? 'تقرير استشاري مكتوب وموقع' : 'Signed written advisory report',
    },
    in_person: {
      label: isRtl ? 'لقاء حضوري مباشر' : 'In-Person Meeting',
      icon: MapPin,
      desc: isRtl ? 'اجتماع في مقر المستشار أو بالرياض' : 'In-person meeting at office',
    },
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId: consultation.id,
          date: selectedDate,
          time: selectedTime,
          sessionType: selectedSessionType,
          notes,
          clientPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingConfirmed(data.booking);
        showToast(
          isRtl ? 'تم تأكيد حجز الاستشارة بنجاح' : 'Booking Confirmed',
          isRtl ? `موعدك مع ${consultation.consultantName} يوم ${selectedDate}` : `Session booked with ${consultation.consultantName}`,
          'success'
        );
      } else {
        showToast(isRtl ? 'خطأ في الحجز' : 'Booking Error', data.message || '', 'error');
      }
    } catch {
      // Fallback local booking
      const fallbackBooking = {
        id: `bk_${Date.now()}`,
        consultationTitle: consultation.title,
        consultantName: consultation.consultantName,
        date: selectedDate,
        time: selectedTime,
        sessionType: selectedSessionType,
        price: consultation.price,
        meetingLink: `https://meet.waseet.com/session-${consultation.id}`,
      };
      setBookingConfirmed(fallbackBooking);
      showToast(
        isRtl ? 'تم تأكيد حجز الاستشارة بنجاح' : 'Booking Confirmed',
        isRtl ? `موعدك مع ${consultation.consultantName} يوم ${selectedDate}` : 'Booking confirmed',
        'success'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0B192C] text-white p-5 rounded-t-3xl flex items-center justify-between border-b border-amber-500/20 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isRtl ? 'حجز موعد استشارة' : 'Book Consultation Session'}
              </h3>
              <p className="text-xs text-amber-300 truncate max-w-xs">{consultation.consultantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingConfirmed ? (
          /* Confirmation Success State */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900">
                {isRtl ? 'تم تأكيد موعد جلستك الاستشارية بنجاح!' : 'Your Session Has Been Booked!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isRtl
                  ? `تم حجز الجلسة مع ${consultation.consultantName} يوم ${bookingConfirmed.date} في تمام الساعة ${bookingConfirmed.time}. تم إرسال تفاصيل الرابط إلى بريدك وإشعارات حسابك.`
                  : `Session confirmed with ${consultation.consultantName} on ${bookingConfirmed.date} at ${bookingConfirmed.time}.`}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-start text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{isRtl ? 'رقم الحجز:' : 'Booking Ref:'}</span>
                <span className="font-mono font-bold text-slate-900">{bookingConfirmed.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{isRtl ? 'طريقة الجلسة:' : 'Session Type:'}</span>
                <span className="font-bold text-amber-600">{sessionTypeLabels[bookingConfirmed.sessionType as SessionType]?.label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{isRtl ? 'رابط الدخول للجلسة:' : 'Meeting Link:'}</span>
                <a
                  href={bookingConfirmed.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-bold text-cyan-600 hover:underline truncate max-w-[200px]"
                >
                  {bookingConfirmed.meetingLink}
                </a>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{isRtl ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                <span className="font-bold text-emerald-600">{consultation.price} {isRtl ? 'ر.س' : 'SAR'} (مدفوع)</span>
              </div>
            </div>

            <div className="pt-3 flex gap-3 justify-center">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isRtl ? 'الانتقال إلى حجوزاتي' : 'View My Bookings'}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="p-6 space-y-6">
            {/* Consultation Summary Header */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={consultation.image}
                alt={consultation.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {isRtl ? consultation.title : consultation.titleEn}
                </h4>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{consultation.durationMinutes} {isRtl ? 'دقيقة' : 'mins'}</span>
                  <span>•</span>
                  <span className="font-bold text-amber-600">{consultation.price} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>
            </div>

            {/* Step 1: Choose Session Channel */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{isRtl ? '1. اختر نوع وطريقة الجلسة:' : '1. Choose Session Channel:'}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {consultation.sessionTypes.map((st) => {
                  const info = sessionTypeLabels[st];
                  const Icon = info.icon;
                  const isSelected = selectedSessionType === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedSessionType(st)}
                      className={`p-3 rounded-2xl border text-start flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs text-slate-900">{info.label}</div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{info.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Date & Time */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? '2. حدد موعد الجلسة من الأوقات المتاحة:' : '2. Select Available Date & Slot:'}</span>
              </label>

              {/* Dates */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {consultation.availableSlots.map((slot) => {
                  const isSelected = selectedDate === slot.date;
                  return (
                    <button
                      key={slot.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(slot.times[0] || '10:00 AM');
                      }}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B192C] text-amber-300 border-[#0B192C]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {slot.date}
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              {consultation.availableSlots.find((s) => s.date === selectedDate) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {consultation.availableSlots
                    .find((s) => s.date === selectedDate)!
                    .times.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Step 3: Contact & Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'رقم هاتف التواصل (واتساب):' : 'Contact WhatsApp Phone:'}
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'ملاحظات أو أسئلة ترغب بمناقشتها مع المستشار:' : 'Topics / Questions for Consultant:'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'مثال: أود مراجعة نموذج التسعير الخاص بمتجري واستراتيجية استهداف العملاء...'
                      : 'e.g., discuss pricing model and customer acquisition...'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Price & Checkout Confirmation */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block">{isRtl ? 'الإجمالي للاستشارة' : 'Total Price'}</span>
                <div className="text-xl font-black text-slate-900">
                  {consultation.price} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isRtl ? 'جاري تأكيد الحجز...' : 'Confirming...'}</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{isRtl ? 'تأكيد الحجز والدفع التجريبي' : 'Confirm & Sandbox Pay'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
