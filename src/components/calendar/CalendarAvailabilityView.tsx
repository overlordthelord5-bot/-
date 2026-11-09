import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Download,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  RotateCcw,
  Shield,
  Save,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';

export const CalendarAvailabilityView: React.FC = () => {
  const { isRtl } = useLanguage();
  const { showToast } = useNotification();

  const [timezone, setTimezone] = useState<string>('Asia/Riyadh');
  const [bufferTime, setBufferTime] = useState<number>(15);
  const [advanceNoticeHours, setAdvanceNoticeHours] = useState<number>(12);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState<number>(30);

  // Weekly Working Hours Schedule
  const [schedule, setSchedule] = useState([
    { dayAr: 'الأحد', dayEn: 'Sunday', active: true, slots: [{ from: '09:00', to: '13:00' }, { from: '16:00', to: '20:00' }] },
    { dayAr: 'الإثنين', dayEn: 'Monday', active: true, slots: [{ from: '09:00', to: '13:00' }, { from: '16:00', to: '20:00' }] },
    { dayAr: 'الثلاثاء', dayEn: 'Tuesday', active: true, slots: [{ from: '09:00', to: '13:00' }, { from: '16:00', to: '20:00' }] },
    { dayAr: 'الأربعاء', dayEn: 'Wednesday', active: true, slots: [{ from: '09:00', to: '13:00' }, { from: '16:00', to: '20:00' }] },
    { dayAr: 'الخميس', dayEn: 'Thursday', active: true, slots: [{ from: '09:00', to: '14:00' }] },
    { dayAr: 'الجمعة', dayEn: 'Friday', active: false, slots: [] },
    { dayAr: 'السبت', dayEn: 'Saturday', active: true, slots: [{ from: '10:00', to: '14:00' }] },
  ]);

  const timezones = [
    { id: 'Asia/Riyadh', label: 'توقيت مكة والرياض (UTC+3 / KSA)' },
    { id: 'Asia/Dubai', label: 'توقيت دبي وأبوظبي (UTC+4 / UAE)' },
    { id: 'Africa/Cairo', label: 'توقيت القاهرة (UTC+2 / Egypt)' },
    { id: 'UTC', label: 'التوقيت العالمي الموحد (UTC/GMT)' },
    { id: 'Europe/London', label: 'توقيت لندن (UTC+0 / BST)' },
    { id: 'America/New_York', label: 'توقيت نيويورك (UTC-5 / EST)' },
  ];

  const handleToggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    if (updated[index].active && updated[index].slots.length === 0) {
      updated[index].slots.push({ from: '09:00', to: '17:00' });
    }
    setSchedule(updated);
  };

  const handleAddSlot = (dayIndex: number) => {
    const updated = [...schedule];
    updated[dayIndex].slots.push({ from: '14:00', to: '18:00' });
    setSchedule(updated);
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...schedule];
    updated[dayIndex].slots = updated[dayIndex].slots.filter((_, idx) => idx !== slotIndex);
    setSchedule(updated);
  };

  const handleSaveSettings = () => {
    showToast(
      isRtl ? 'تم حفظ إعدادات التوفر والمواعيد بنجاح' : 'Availability schedule saved successfully',
      'success'
    );
  };

  // Generate iCal (.ics) file for Google Calendar / Apple Calendar
  const handleDownloadICalFeed = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WASEET Platform//Consultant Availability Feed//AR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:WASEET Appointments Feed
X-WR-TIMEZONE:${timezone}
BEGIN:VEVENT
UID:waseet-slot-feed-001@waseet.sa
DTSTAMP:20261107T000000Z
DTSTART:20261108T060000Z
DTEND:20261108T070000Z
SUMMARY:جلسة استشارية معتمدة - منصة وسيط
DESCRIPTION:رابط الاجتماع المشفر: https://waseet.sa/meeting/meet-live-99
LOCATION:غرفة وسيط المرئية الآمنة
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'waseet-appointments-sync.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      isRtl ? 'تم تنزيل ملف مزامنة التقويم iCal (.ics) المتوافق مع Google & Outlook' : 'iCal (.ics) calendar sync file downloaded',
      'success'
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Title & Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200 mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-cyan-600" />
            <span>{isRtl ? 'إدارة المواعيد والتقويم الذكي' : 'Smart Availability & Schedule Sync'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isRtl ? 'جدول التوفر ومزامنة التقويم والمناطق الزمنية' : 'Availability Calendar & Timezone Engine'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl
              ? 'تحديد ساعات العمل الأسبوعية، فترات الراحة بين الجلسات، التبديل التلقائي للمناطق الزمنية ومزامنة iCal'
              : 'Weekly working hours, buffer intervals, automated timezone conversions, and calendar sync (.ics)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadICalFeed}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{isRtl ? 'مزامنة iCal (Google / Apple)' : 'Export iCal (.ics)'}</span>
          </button>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? 'حفظ الجدول' : 'Save Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Timezone and Rules Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>{isRtl ? 'المنطقة الزمنية المعتمدة' : 'Primary Timezone'}</span>
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 outline-none"
          >
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span>{isRtl ? 'فترة الراحة الفاصلة (Buffer)' : 'Buffer Between Sessions'}</span>
          </label>
          <select
            value={bufferTime}
            onChange={(e) => setBufferTime(Number(e.target.value))}
            className="w-full p-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 outline-none"
          >
            <option value={0}>{isRtl ? 'بدون فاصل' : 'No buffer'}</option>
            <option value={10}>10 {isRtl ? 'دقائق' : 'minutes'}</option>
            <option value={15}>15 {isRtl ? 'دقيقة (موصى به)' : 'minutes (Recommended)'}</option>
            <option value={30}>30 {isRtl ? 'دقيقة' : 'minutes'}</option>
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isRtl ? 'الحد الأدنى للإشعار بالحجز' : 'Minimum Notice Hours'}</span>
          </label>
          <select
            value={advanceNoticeHours}
            onChange={(e) => setAdvanceNoticeHours(Number(e.target.value))}
            className="w-full p-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 outline-none"
          >
            <option value={2}>2 {isRtl ? 'ساعات' : 'hours'}</option>
            <option value={6}>6 {isRtl ? 'ساعات' : 'hours'}</option>
            <option value={12}>12 {isRtl ? 'ساعة' : 'hours'}</option>
            <option value={24}>24 {isRtl ? 'ساعة (يوم كامل)' : 'hours (1 day)'}</option>
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isRtl ? 'سياسة إعادة الجدولة' : 'Reschedule Window'}</span>
          </label>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-center">
            {isRtl ? 'مسموح حتى 4 ساعات قبل الموعد' : 'Allowed up to 4h prior'}
          </div>
        </div>
      </div>

      {/* Weekly Schedule Days */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 text-sm">
          {isRtl ? 'الفترات الزمنية الأسبوعية المتكررة' : 'Weekly Recurring Availability Windows'}
        </h3>

        <div className="space-y-3">
          {schedule.map((day, dayIdx) => (
            <div
              key={day.dayEn}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                day.active ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              {/* Day Toggle */}
              <div className="flex items-center gap-3 w-40">
                <input
                  type="checkbox"
                  checked={day.active}
                  onChange={() => handleToggleDay(dayIdx)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className={`font-black text-xs ${day.active ? 'text-slate-900' : 'text-slate-500'}`}>
                  {isRtl ? day.dayAr : day.dayEn}
                </span>
              </div>

              {/* Slots List */}
              <div className="flex-1">
                {day.active ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {day.slots.map((slot, slotIdx) => (
                      <div
                        key={slotIdx}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{slot.from}</span>
                        <span className="text-slate-400">-</span>
                        <span>{slot.to}</span>
                        <button
                          onClick={() => handleRemoveSlot(dayIdx, slotIdx)}
                          className="ms-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="حذف الفترة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddSlot(dayIdx)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-dashed border-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isRtl ? 'إضافة فترة' : 'Add Slot'}</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-bold">
                    {isRtl ? 'يوم إجازة مغلق' : 'Unavailable / Day Off'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No-show & Cancellation Policy Card */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-black">
          <Shield className="w-4 h-4 text-amber-700" />
          <span>{isRtl ? 'سياسة عدم الحضور (No-Show) وحماية حقوق الأطراف' : 'No-Show & Fair Cancellation Enforcement'}</span>
        </div>
        <p className="leading-relaxed text-[11px] text-amber-800">
          {isRtl
            ? 'إذا تخلف العميل عن الحضور بعد 15 دقيقة من بدء الجلسة، يُسجل النظام حالة عدم حضور (No-Show) ويتم صرف مستحقات المستشار كاملة من حساب الضمان تعويضاً عن حجز الوقت. في حال تخلف المستشار، يتم استرداد المبلغ كاملاً للعميل فوراً مع تسجيل ملاحظة على معدل التزام المستشار.'
            : 'If a client fails to attend within 15 minutes, a No-Show is recorded and escrow funds are released to compensate the advisor. If the advisor misses the appointment, client is refunded 100% immediately.'}
        </p>
      </div>
    </div>
  );
};
