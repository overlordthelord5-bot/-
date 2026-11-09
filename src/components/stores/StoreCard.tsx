import React from 'react';
import { Star, ShieldCheck, ShoppingBag, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Store } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface StoreCardProps {
  store: Store;
  onOpenStore: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onOpenStore }) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      onClick={() => onOpenStore(store)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Banner */}
      <div className="relative h-28 bg-slate-800 overflow-hidden">
        <img
          src={store.banner}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2.5 end-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1 font-bold">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{store.rating}</span>
        </div>
      </div>

      {/* Profile & Info */}
      <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
        {/* Floating Logo */}
        <div className="-mt-8 mb-2 flex items-end justify-between">
          <div className="relative">
            <img
              src={store.logo}
              alt={store.name}
              className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            {store.verified && (
              <span className="absolute -bottom-1 -end-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span>{store.productsCount} {isRtl ? 'منتج وخدمة' : 'Items'}</span>
          </span>
        </div>

        <div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1 mb-1">
            {isRtl ? store.name : store.nameEn}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {isRtl ? store.description : store.descriptionEn}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            {isRtl ? `+${store.salesCount} طلب منجز` : `${store.salesCount}+ Sales`}
          </span>

          <span className="text-amber-600 font-bold flex items-center gap-1 group-hover:underline">
            <span>{isRtl ? 'زيارة المتجر' : 'Visit Store'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
