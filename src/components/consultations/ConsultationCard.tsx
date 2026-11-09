import React from 'react';
import {
  Star,
  Clock,
  Video,
  Phone,
  MessageSquare,
  FileText,
  MapPin,
  ShieldCheck,
  Calendar,
  Heart,
} from 'lucide-react';
import { Consultation, SessionType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

interface ConsultationCardProps {
  consultation: Consultation;
  onBook: (consultation: Consultation) => void;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onBook,
}) => {
  const { isRtl } = useLanguage();
  const { isInWishlist, toggleWishlist } = useCart();
  const isWished = isInWishlist(consultation.id);

  const sessionTypeIcons: Record<SessionType, { label: string; icon: any }> = {
    video: { label: isRtl ? 'اتصال مرئي' : 'Video', icon: Video },
    audio: { label: isRtl ? 'اتصال صوتي' : 'Voice', icon: Phone },
    chat: { label: isRtl ? 'محادثة فورية' : 'Chat', icon: MessageSquare },
    written: { label: isRtl ? 'استشارة كتابية' : 'Written', icon: FileText },
    in_person: { label: isRtl ? 'لقاء حضوري' : 'In-Person', icon: MapPin },
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Cover Image & Category Pill */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={consultation.image}
          alt={consultation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        <div className="absolute top-3 start-3">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[11px] font-bold">
            {consultation.category}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(consultation.id);
          }}
          className={`absolute top-3 end-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWished
              ? 'bg-rose-500 text-white'
              : 'bg-slate-900/60 text-white hover:text-rose-400'
          }`}
          title="حفظ للمفضلة"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Rating and Duration overlay */}
        <div className="absolute bottom-2.5 start-3 end-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold">{consultation.rating}</span>
            <span className="text-slate-300 text-[11px]">({consultation.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{consultation.durationMinutes} {isRtl ? 'دقيقة' : 'min'}</span>
          </div>
        </div>
      </div>

      {/* Consultant Avatar & Title Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Consultant Profile Line */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <img
              src={consultation.consultantAvatar}
              alt={consultation.consultantName}
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-400/50 shadow"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900 truncate">
                <span>{consultation.consultantName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-500 truncate">{consultation.consultantTitle}</div>
            </div>
          </div>

          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug mb-2">
            {isRtl ? consultation.title : consultation.titleEn}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {isRtl ? consultation.description : consultation.descriptionEn}
          </p>
        </div>

        <div>
          {/* Supported Session Channels */}
          <div className="pt-2 pb-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold">{isRtl ? 'طريقة الجلسة:' : 'Methods:'}</span>
            {consultation.sessionTypes.map((st) => {
              const info = sessionTypeIcons[st];
              const Icon = info.icon;
              return (
                <span
                  key={st}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                  title={info.label}
                >
                  <Icon className="w-3 h-3 text-amber-600" />
                  <span>{info.label}</span>
                </span>
              );
            })}
          </div>

          {/* Pricing & Booking CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">{isRtl ? 'قيمة الاستشارة' : 'Fee'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900">{consultation.price}</span>
                <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            <button
              onClick={() => onBook(consultation)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-[#0B192C] hover:from-amber-500 hover:to-amber-600 hover:text-slate-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isRtl ? 'احجز موعد الجلسة' : 'Book Session'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
