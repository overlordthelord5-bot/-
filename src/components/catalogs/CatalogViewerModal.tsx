import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Share2,
  Check,
  ShoppingCart,
  QrCode,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Catalog } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface CatalogViewerModalProps {
  catalog: Catalog | null;
  onClose: () => void;
}

export const CatalogViewerModal: React.FC<CatalogViewerModalProps> = ({ catalog, onClose }) => {
  const { isRtl } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  if (!catalog) return null;

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const currentSection = catalog.sections[activeSectionIndex] || catalog.sections[0];
  const catalogUrl = `${window.location.origin}/catalogs/${catalog.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    showToast(isRtl ? 'تم نسخ رابط الكتالوج' : 'Link Copied', catalogUrl, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleAddItem = (item: any) => {
    addToCart({
      id: item.linkId || item.id,
      type: item.type,
      title: item.title,
      price: item.price,
      image: item.image,
      sellerId: catalog.storeId,
      sellerName: catalog.storeName,
    });
    showToast(
      isRtl ? 'تمت إضافة العنصر من الكتالوج إلى السلة' : 'Item Added to Cart',
      item.title,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Catalog Modal Top Bar */}
        <div className="bg-[#0B192C] text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {isRtl ? catalog.title : catalog.titleEn}
              </h3>
              <p className="text-xs text-amber-300">{catalog.storeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="عرض رمز QR"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isRtl ? 'مشاركة الكتالوج' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QR Code Popup view */}
        {showQr && (
          <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <span className="font-bold text-white block">{isRtl ? 'امسح الكود لفتح الكتالوج بالجوال' : 'Scan to open on mobile'}</span>
                <span className="text-[11px] text-slate-400">{catalogUrl}</span>
              </div>
            </div>
            <button
              onClick={() => setShowQr(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{isRtl ? 'الأقسام:' : 'Sections:'}</span>
          {catalog.sections.map((section, idx) => {
            const isSelected = idx === activeSectionIndex;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B192C] text-amber-300 shadow-sm'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {isRtl ? section.title : section.titleEn} ({section.items.length})
              </button>
            );
          })}
        </div>

        {/* Catalog Body / Items Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {isRtl ? currentSection.title : currentSection.titleEn}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl ? 'تصفح العناصر والمنتجات وأضف ما يناسبك مباشرة إلى سلة المشتريات' : 'Browse items and add directly to your cart'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSection.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 inline-block mb-1">
                    {item.type}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-black text-slate-900">
                    {item.price} <span className="text-[10px] text-amber-600 font-bold">{isRtl ? 'ر.س' : 'SAR'}</span>
                  </div>

                  <button
                    onClick={() => handleAddItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'طلب' : 'Order'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="text-[11px]">
            {isRtl ? 'القسم' : 'Section'} {activeSectionIndex + 1} {isRtl ? 'من' : 'of'} {catalog.sections.length}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeSectionIndex === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold cursor-pointer"
            >
              {isRtl ? 'السابق' : 'Previous'}
            </button>
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.min(catalog.sections.length - 1, prev + 1))}
              disabled={activeSectionIndex === catalog.sections.length - 1}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold cursor-pointer"
            >
              {isRtl ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
