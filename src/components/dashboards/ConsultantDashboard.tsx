import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  DollarSign,
  Plus,
  CheckCircle,
  Users,
  ShieldCheck,
  Star,
  ExternalLink,
  Settings2,
  CalendarCheck,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { INITIAL_CONSULTATIONS, INITIAL_BOOKINGS } from '../../data/mockData';
import { ConsultationBooking } from '../../types';
import { VideoMeetingModal } from '../video/VideoMeetingModal';
import { CalendarAvailabilityView } from '../calendar/CalendarAvailabilityView';

export const ConsultantDashboard: React.FC = () => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'sessions' | 'availability' | 'listings'>('sessions');
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS.slice(0, 2));
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeMeetingBooking, setActiveMeetingBooking] = useState<ConsultationBooking | null>(null);

  // New consultation state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('entrepreneurship');
  const [newPrice, setNewPrice] = useState(500);
  const [newDuration, setNewDuration] = useState(60);

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created = {
      id: `c_${Date.now()}`,
      title: newTitle,
      titleEn: newTitle,
      description: 'جلسة استشارية جديدة مقدمة من ' + (user?.name || 'المستشار'),
      descriptionEn: 'New advisory session provided by consultant',
      category: newCategory,
      consultantId: user?.id || 'usr_consultant',
      consultantName: user?.name || 'د. طارق المنصور',
      consultantTitle: 'مستشار وخبير معتمد',
      consultantAvatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewCount: 0,
      price: Number(newPrice),
      currency: 'SAR',
      durationMinutes: Number(newDuration),
      sessionTypes: ['video', 'audio', 'chat'] as any,
      availableSlots: [
        { date: '2026-11-15', times: ['10:00 AM', '02:00 PM'] },
      ],
      languages: ['العربية', 'English'],
      terms: 'إعادة الجدولة قبل 24 ساعة.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    };

    setConsultations((prev) => [created, ...prev]);
    setIsAddOpen(false);
    showToast(isRtl ? 'تمت إضافة الاستشارة بنجاح' : 'Consultation Created', newTitle, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Consultant Header */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{user?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {isRtl ? 'مستشار أعمال معتمد وموثق' : 'Verified Consultant'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user?.bio || 'خبير استراتيجيات الأعمال وتطوير النماذج التشغيلية'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة استشارة جديدة' : 'Add Consultation'}</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'رصيد المحفظة المتاح' : 'Wallet Balance'}
          </span>
          <div className="text-xl font-black text-slate-900">
            {user?.walletBalance || 18750} <span className="text-xs text-amber-600 font-bold">{isRtl ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'الجلسات المكتملة' : 'Completed Sessions'}
          </span>
          <div className="text-xl font-black text-slate-900">94</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'متوسط تقييم العملاء' : 'Average Rating'}
          </span>
          <div className="text-xl font-black text-amber-600 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>4.95</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'الحجوزات القادمة' : 'Upcoming Bookings'}
          </span>
          <div className="text-xl font-black text-cyan-600">{bookings.length}</div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sessions'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{isRtl ? 'حجوزات وجلسات العملاء' : 'Client Sessions'}</span>
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'availability'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isRtl ? 'إدارة المواعيد والتوافر (Calendar)' : 'Availability & iCal'}</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'listings'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isRtl ? 'خدماتي واستشاراتي المعروضة' : 'My Listings'}</span>
        </button>
      </div>

      {/* Tab Content 1: Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isRtl ? 'مواعيد وجلسات العملاء القادمة' : 'Upcoming Client Sessions'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {isRtl ? 'يمكنك بدء الجلسة المرئية مباشرة' : 'Join live video session directly'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {bookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{b.clientName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{b.clientPhone}</span>
                  </div>
                  <div className="text-slate-600 font-medium mt-1">{b.consultationTitle}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{b.date} • {b.time}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{b.sessionType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-900 text-sm">
                    {b.price} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                  </span>
                  <button
                    onClick={() => setActiveMeetingBooking(b)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'بدء الجلسة المرئية' : 'Join Room'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Availability */}
      {activeTab === 'availability' && (
        <CalendarAvailabilityView />
      )}

      {/* Tab Content 3: Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isRtl ? 'الاستشارات التخصصية المنشورة' : 'Active Consultations'}
            </h3>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              + {isRtl ? 'إضافة استشارة' : 'Add New'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400/60 transition-all flex gap-3">
                <img src={c.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{c.title}</h4>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">{c.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-black text-amber-600">{c.price} {isRtl ? 'ر.س' : 'SAR'}</span>
                    <span className="text-[11px] text-slate-400">{c.durationMinutes} دقيقة</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Consultation Modal */}
      {isAddOpen && (
        <form onSubmit={handleCreateConsultation} className="bg-white p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">{isRtl ? 'إضافة استشارة تخصصية جديدة' : 'Add New Consultation'}</h3>
            <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'عنوان الاستشارة:' : 'Title:'}</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isRtl ? 'مثال: استشارة دراسة الجدوى وتأسيس النماذج المالية' : 'Title'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'التصنيف:' : 'Category:'}</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              >
                <option value="entrepreneurship">{isRtl ? 'ريادة أعمال' : 'Entrepreneurship'}</option>
                <option value="financial">{isRtl ? 'استشارات مالية' : 'Financial'}</option>
                <option value="legal">{isRtl ? 'استشارات قانونية' : 'Legal'}</option>
                <option value="tech">{isRtl ? 'تقنية وتحول رقمي' : 'Tech'}</option>
                <option value="marketing">{isRtl ? 'تسويق ونمو' : 'Marketing'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'سعر الجلسة (ر.س):' : 'Price (SAR):'}</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'مدة الجلسة (بالدقائق):' : 'Duration (Mins):'}</label>
              <input
                type="number"
                required
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              {isRtl ? 'حفظ ونشر الاستشارة' : 'Publish Consultation'}
            </button>
          </div>
        </form>
      )}

      {/* Video Meeting Modal */}
      {activeMeetingBooking && (
        <VideoMeetingModal
          booking={activeMeetingBooking}
          onClose={() => setActiveMeetingBooking(null)}
        />
      )}
    </div>
  );
};
