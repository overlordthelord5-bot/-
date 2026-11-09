import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Check,
  Package,
  Download,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { isRtl } = useLanguage();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingCost,
    discount,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={`fixed inset-y-0 ${
          isRtl ? 'left-0' : 'right-0'
        } max-w-full flex pl-10`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 bg-[#0B192C] text-white flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-white">
                {isRtl ? 'سلة المشتريات' : 'Shopping Cart'}
              </h3>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {items.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">
                  {isRtl ? 'سلة التسوق فارغة حالياً' : 'Your cart is empty'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isRtl
                    ? 'استكشف الاستشارات، الخدمات الرقمية، والأجهزة المكتبية المتاحة على وسيط'
                    : 'Explore consultations, digital services, and office equipment available on WASEET.'}
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 hover:border-slate-300 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      {item.digital ? (
                        <span className="flex items-center gap-0.5 text-cyan-600 font-semibold">
                          <Download className="w-3 h-3" />
                          {isRtl ? 'تنزيل رقمي' : 'Digital'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-amber-700 font-semibold">
                          <Package className="w-3 h-3" />
                          {isRtl ? 'منتج مادي' : 'Physical'}
                        </span>
                      )}
                      <span>•</span>
                      <span className="truncate">{item.sellerName}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="text-xs font-black text-slate-900">
                        {item.price * item.quantity} <span className="text-[10px] text-amber-600 font-bold">{isRtl ? 'ر.س' : 'SAR'}</span>
                      </div>

                      <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute inset-y-0 start-2.5 my-auto" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={isRtl ? 'كود الخصم (جرب WASEET10)' : 'Coupon (try WASEET10)'}
                      className="w-full py-1.5 ps-8 pe-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none uppercase font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold cursor-pointer"
                  >
                    {isRtl ? 'تطبيق' : 'Apply'}
                  </button>
                </div>

                {couponCode && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {isRtl ? 'تم تفعيل خصم 10% (WASEET10)' : '10% Discount Applied'}
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      {isRtl ? 'إلغاء' : 'Remove'}
                    </button>
                  </div>
                )}
                {couponMsg && !couponMsg.success && (
                  <p className="text-[11px] text-rose-500 font-semibold">{couponMsg.message}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>{isRtl ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-bold text-slate-900">{subtotal} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{isRtl ? 'رسوم الشحن والتوصيل:' : 'Shipping:'}</span>
                  <span className="font-bold text-slate-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600">{isRtl ? 'مجاني' : 'FREE'}</span>
                    ) : (
                      `${shippingCost} ${isRtl ? 'ر.س' : 'SAR'}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{isRtl ? 'قيمة الخصم:' : 'Discount:'}</span>
                    <span>-{discount} {isRtl ? 'ر.س' : 'SAR'}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{isRtl ? 'الإجمالي النهائي:' : 'Total:'}</span>
                  <span className="text-amber-600">{total} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isRtl ? 'متابعة وإتمام الدفع الآمن' : 'Proceed to Checkout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
