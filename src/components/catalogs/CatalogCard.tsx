import React from 'react';
import { BookOpen, Eye, Share2, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { Catalog } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CatalogCardProps {
  catalog: Catalog;
  onOpen: (catalog: Catalog) => void;
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ catalog, onOpen }) => {
  const { isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const totalItems = catalog.sections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div
      onClick={() => onOpen(catalog)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden bg-slate-900">
        <img
          src={catalog.coverImage}
          alt={catalog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent" />

        <div className="absolute top-3 start-3">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] shadow">
            {isRtl ? 'كتالوج تفاعلي' : 'Digital Catalog'}
          </span>
        </div>

        <div className="absolute bottom-2.5 start-3 end-3 flex items-center justify-between text-xs text-white">
          <span className="font-semibold text-amber-300 truncate max-w-[150px]">{catalog.storeName}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{catalog.viewCount} {isRtl ? 'مشاهدة' : 'Views'}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-1.5">
            {isRtl ? catalog.title : catalog.titleEn}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {catalog.description}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pb-2">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {catalog.sections.length} {isRtl ? 'أقسام رئيسية' : 'Sections'} • {totalItems} {isRtl ? 'عنصر ومنتج' : 'Items'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">{catalog.createdAt}</span>

          <span className="text-amber-600 font-bold flex items-center gap-1 group-hover:underline">
            <span>{isRtl ? 'تصفح الكتالوج' : 'Browse Catalog'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
