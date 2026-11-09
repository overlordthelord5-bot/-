import React, { useState } from 'react';
import {
  X,
  Check,
  Clock,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Service } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ServiceOrderModalProps {
  service: Service | null;
  onClose: () => void;
}

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({ service, onClose }) => {
  const { isRtl } = useLanguage();
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { showToast } = useNotification();

  if (!service) return null;

  const [activePackage, setActivePackage] = useState<'basic' | 'standard' | 'premium'>('standard');
  const currentPkg = service.packages[activePackage];

  const handleAddToCart = () => {
    addToCart({
      id: `${service.id}_${activePackage}`,
      type: 'service',
      title: `${service.title} (${currentPkg.name})`,
      price: currentPkg.price,
      image: service.image,
      sellerId: service.providerId,
      sellerName: service.providerName,
      selectedOption: currentPkg.name,
      digital: true,
    });
    showToast(
      isRtl ? 'تمت إضافة باقة الخدمة للسلة' : 'Package Added to Cart',
      `${service.title} - ${currentPkg.name}`,
      'success'
    );
    onClose();
  };

  const handleInstantOrder = () => {
    addToCart({
      id: `${service.id}_${activePackage}`,
      type: 'service',
      title: `${service.title} (${currentPkg.name})`,
      price: currentPkg.price,
      image: service.image,
      sellerId: service.providerId,
      sellerName: service.providerName,
      selectedOption: currentPkg.name,
      digital: true,
    });
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0B192C] text-white p-5 rounded-t-3xl flex items-center justify-between border-b border-amber-500/20 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isRtl ? 'تفاصيل الخدمة والباقات' : 'Service & Packages'}
              </h3>
              <p className="text-xs text-amber-300 truncate max-w-xs">{service.providerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Title & Description */}
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-1.5 leading-snug">
              {isRtl ? service.title : service.titleEn}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isRtl ? service.description : service.descriptionEn}
            </p>
          </div>

          {/* Package Selection Tabs */}
          <div className="space-y-3">
            <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
              {(['basic', 'standard', 'premium'] as const).map((pkgKey) => {
                const pkg = service.packages[pkgKey];
                const isSelected = activePackage === pkgKey;
                return (
                  <button
                    key={pkgKey}
                    onClick={() => setActivePackage(pkgKey)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300 shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div>{isRtl ? pkg.name : pkg.nameEn}</div>
                    <div className="text-[11px] font-black text-amber-400 mt-0.5">
                      {pkg.price} {isRtl ? 'ر.س' : 'SAR'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Package Card */}
            <div className="p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-50/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/40">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {isRtl ? currentPkg.name : currentPkg.nameEn}
                  </h4>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {currentPkg.price} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>

                <div className="text-end text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isRtl ? `مدة التنفيذ: ${currentPkg.deliveryDays} أيام` : `Delivery: ${currentPkg.deliveryDays} days`}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold">
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{isRtl ? `التعديلات المتاحة: ${currentPkg.revisions}` : `Revisions: ${currentPkg.revisions}`}</span>
                  </div>
                </div>
              </div>

              {/* Features Included */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  {isRtl ? 'المزايا المضمنة في هذه الباقة:' : 'Features Included:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isRtl ? currentPkg.features : currentPkg.featuresEn).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stages of Work */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              {isRtl ? 'مراحل تنفيذ العمل:' : 'Work Stages:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handleAddToCart}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isRtl ? 'إضافة للسلة' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleInstantOrder}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isRtl ? 'طلب الخدمة والدفع الآن' : 'Order & Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
