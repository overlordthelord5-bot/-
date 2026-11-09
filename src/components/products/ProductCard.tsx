import React from 'react';
import {
  Star,
  ShoppingCart,
  Download,
  Package,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { isRtl } = useLanguage();
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { showToast } = useNotification();
  const isWished = isInWishlist(product.id);

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      type: 'product',
      title: product.name,
      price: product.price,
      image: product.images[0],
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      digital: product.type === 'digital',
    });
    showToast(
      isRtl ? 'تمت إضافة المنتج إلى السلة' : 'Product Added to Cart',
      product.name,
      'success'
    );
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Product Image & Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10" />

        {/* Type Badge (Digital vs Physical) */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5 items-start">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${
              product.type === 'digital'
                ? 'bg-cyan-900/80 text-cyan-300 border-cyan-400/40'
                : 'bg-slate-900/80 text-amber-300 border-amber-400/30'
            }`}
          >
            {product.type === 'digital' ? (
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {isRtl ? 'منتج رقمي فوري' : 'Digital Product'}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                {isRtl ? 'منتج مادي مشحون' : 'Physical Product'}
              </span>
            )}
          </span>

          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow">
              {isRtl ? `خصم ${discountPercent}%` : `${discountPercent}% OFF`}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
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

        {/* Store & Stock info */}
        <div className="absolute bottom-2.5 start-3 end-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-[11px] truncate max-w-[150px]">
            <span className="text-amber-400 font-semibold">{product.storeName}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-slate-200">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold">{product.rating}</span>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>SKU: {product.sku}</span>
            {product.type === 'physical' && (
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                {isRtl ? `متبقي ${product.stock}` : `${product.stock} in stock`}
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors leading-snug mb-1.5">
            {isRtl ? product.name : product.nameEn}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {isRtl ? product.description : product.descriptionEn}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">{product.price}</span>
              <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
            </div>
            {product.compareAtPrice && (
              <span className="text-xs text-slate-400 line-through">
                {product.compareAtPrice} {isRtl ? 'ر.س' : 'SAR'}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isRtl ? 'أضف للسلة' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
