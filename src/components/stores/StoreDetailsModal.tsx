import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  Truck,
  RotateCcw,
  ShoppingCart,
  Download,
  Package,
} from 'lucide-react';
import { Store, Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { INITIAL_PRODUCTS } from '../../data/mockData';

interface StoreDetailsModalProps {
  store: Store | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const StoreDetailsModal: React.FC<StoreDetailsModalProps> = ({
  store,
  onClose,
  onSelectProduct,
}) => {
  const { isRtl } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  if (!store) return null;

  const storeProducts = INITIAL_PRODUCTS.filter(
    (p) => p.sellerId === store.sellerId || p.storeName.includes(store.name)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
        {/* Banner */}
        <div className="relative h-44 bg-slate-800">
          <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-xl bg-black/60 hover:bg-black text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Profile */}
        <div className="px-6 pb-6 relative">
          <div className="-mt-12 mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <img
                src={store.logo}
                alt={store.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-black text-slate-900">{isRtl ? store.name : store.nameEn}</h2>
                  {store.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-800">{store.rating}</span>
                  </div>
                  <span>•</span>
                  <span>+{store.salesCount} {isRtl ? 'طلب منجز' : 'Sales'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                <Mail className="w-3.5 h-3.5 text-cyan-600" />
                <span>{store.contactEmail}</span>
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{store.contactPhone}</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            {isRtl ? store.description : store.descriptionEn}
          </p>

          {/* Store Policies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {isRtl ? 'سياسة الشحن للمتجر:' : 'Store Shipping Policy:'}
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">{store.shippingPolicy}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
                {isRtl ? 'سياسة الاسترجاع والضمان:' : 'Store Return Policy:'}
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">{store.returnPolicy}</p>
            </div>
          </div>

          {/* Store Products */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              {isRtl ? 'منتجات وخدمات المتجر:' : 'Store Catalog & Items:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {storeProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white shadow-sm flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h4>
                      <div className="text-[11px] font-black text-amber-600 mt-0.5">
                        {p.price} {isRtl ? 'ر.س' : 'SAR'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: p.id,
                        type: 'product',
                        title: p.name,
                        price: p.price,
                        image: p.images[0],
                        sellerId: p.sellerId,
                        sellerName: p.sellerName,
                        digital: p.type === 'digital',
                      });
                      showToast(isRtl ? 'تمت الإضافة للسلة' : 'Added to cart', p.name, 'success');
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
