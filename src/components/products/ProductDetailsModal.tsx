import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Download,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  FileText,
  Barcode,
  Share2,
} from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  const { isRtl } = useLanguage();
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { showToast } = useNotification();

  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        type: 'product',
        title: product.name,
        price: product.price,
        image: product.images[0],
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        digital: product.type === 'digital',
      },
      quantity
    );
    showToast(
      isRtl ? 'تمت إضافة المنتج إلى السلة' : 'Product Added to Cart',
      `${product.name} (x${quantity})`,
      'success'
    );
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        type: 'product',
        title: product.name,
        price: product.price,
        image: product.images[0],
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        digital: product.type === 'digital',
      },
      quantity
    );
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleSimulateDownload = () => {
    setIsDownloaded(true);
    showToast(
      isRtl ? 'بدأ تنزيل الملف الرقمي' : 'Downloading Digital File',
      product.name,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0B192C] text-white p-5 rounded-t-3xl flex items-center justify-between border-b border-amber-500/20 z-10">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                product.type === 'digital'
                  ? 'bg-cyan-900/80 text-cyan-300 border-cyan-400/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {product.type === 'digital' ? (isRtl ? 'منتج رقمي' : 'Digital Product') : (isRtl ? 'منتج مادي' : 'Physical Product')}
            </span>
            <span className="text-xs text-slate-400">SKU: {product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller & Store Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isRtl ? 'البائع والمتجر:' : 'Seller & Store:'}</span>
                <span className="font-bold text-slate-900">{product.storeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isRtl ? 'العلامة التجارية:' : 'Brand:'}</span>
                <span className="font-semibold text-amber-600">{product.brand || 'وسيط براند'}</span>
              </div>
              {product.barcode && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5" /> {isRtl ? 'الباركود الدولي:' : 'Barcode:'}
                  </span>
                  <span className="font-mono text-slate-700">{product.barcode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} {isRtl ? 'تقييم' : 'reviews'})</span>
                </div>

                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isRtl ? 'ضمان وسيط الأصلي' : 'Verified Genuine'}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {isRtl ? product.name : product.nameEn}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isRtl ? product.description : product.descriptionEn}
              </p>

              {/* Digital Product Specifics */}
              {product.type === 'digital' ? (
                <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200/60 space-y-2 text-xs">
                  <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-cyan-600" />
                    <span>{isRtl ? 'مواصفات الملف الرقمي والتنزيل:' : 'Digital Download Details:'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">{isRtl ? 'حجم الملف:' : 'File Size:'}</span>
                      <span className="font-semibold">{product.fileSize || '35.4 MB'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isRtl ? 'صيغة الملف:' : 'Format:'}</span>
                      <span className="font-semibold">{product.fileFormat || 'ZIP / PDF / Excel'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isRtl ? 'صلاحية التنزيل:' : 'Max Downloads:'}</span>
                      <span className="font-semibold">{product.maxDownloads || 10} {isRtl ? 'مرات' : 'times'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isRtl ? 'طريقة الاستلام:' : 'Access:'}</span>
                      <span className="font-semibold text-emerald-600">{isRtl ? 'تنزيل فوري بعد الدفع' : 'Immediate'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Physical Product Specifics */
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>{isRtl ? 'الشحن والتوصيل والمخزون:' : 'Shipping & Inventory:'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">{isRtl ? 'الوزن التقريبي:' : 'Weight:'}</span>
                      <span className="font-semibold">{product.weightKg || 1} كجم</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isRtl ? 'حالة المخزون:' : 'Stock:'}</span>
                      <span className="font-semibold text-emerald-600">{product.stock} {isRtl ? 'قطعة متوفرة' : 'units'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price & Discount */}
              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{product.price}</span>
                <span className="text-sm font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {product.compareAtPrice} {isRtl ? 'ر.س' : 'SAR'}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity & Buy CTAs */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {product.type === 'physical' && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">{isRtl ? 'الكمية:' : 'Quantity:'}</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>{isRtl ? 'أضف إلى السلة' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isRtl ? 'شراء فوري الآن' : 'Buy Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
