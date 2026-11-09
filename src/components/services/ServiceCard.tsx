import React from 'react';
import {
  Star,
  Clock,
  ShieldCheck,
  Check,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Service } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Service Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        <div className="absolute top-3 start-3">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-400/30 text-[11px] font-bold">
            {service.category}
          </span>
        </div>

        <div className="absolute bottom-2.5 start-3 end-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold">{service.rating}</span>
            <span className="text-slate-300 text-[11px]">({service.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{service.deliveryTimeDays} {isRtl ? 'أيام للتسليم' : 'Days Delivery'}</span>
          </div>
        </div>
      </div>

      {/* Provider Details & Title */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={service.providerAvatar}
              alt={service.providerName}
              className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
            />
            <span className="text-xs font-semibold text-slate-700 truncate">{service.providerName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>

          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug mb-2">
            {isRtl ? service.title : service.titleEn}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {isRtl ? service.description : service.descriptionEn}
          </p>

          {/* Key Package Feature Bullets */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 mb-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>{isRtl ? 'تشمل الباقات:' : 'Packages Include:'}</span>
            </div>
            {service.packages.basic.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Starting Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block">{isRtl ? 'تبدأ الباقات من' : 'Starting From'}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">{service.basePrice}</span>
              <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(service)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isRtl ? 'عرض الباقات والطلب' : 'View Packages'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
