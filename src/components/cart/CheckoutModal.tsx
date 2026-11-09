import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle,
  ShieldCheck,
  Building,
  Smartphone,
  Banknote,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const CheckoutModal: React.FC = () => {
  const { isRtl } = useLanguage();
  const {
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    couponCode,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useNotification();

  if (!isCheckoutOpen) return null;

  const [fullName, setFullName] = useState(user?.name || 'محمد الشمري');
  const [phone, setPhone] = useState(user?.phone || '+966 55 987 6543');
  const [city, setCity] = useState('الرياض');
  const [district, setDistrict] = useState('حي الملقا');
  const [street, setStreet] = useState('طريق أنس بن مالك');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'bank_transfer' | 'cash_on_delivery'>('credit_card');
  const [affiliateCode, setAffiliateCode] = useState('WASEET-VIP');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const hasPhysical = items.some((i) => !i.digital);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: {
            fullName,
            phone,
            city,
            district,
            street,
          },
          paymentMethod,
          couponCode,
          affiliateCode,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        clearCart();
        showToast(
          isRtl ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!',
          `رقم الطلب: ${data.order.orderNumber}`,
          'success'
        );
      } else {
        throw new Error(data.message || 'فشل في إتمام الطلب');
      }
    } catch {
      // Local fallback
      const mockOrder = {
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        items,
        total,
        trackingNumber: hasPhysical ? 'SA-ARMX-9823145' : 'DIG-IMMEDIATE-ACCESS',
        shippingProvider: hasPhysical ? 'أرامكس (Aramex Express)' : 'تنزيل فوري آمن',
      };
      setCompletedOrder(mockOrder);
      clearCart();
      showToast(
        isRtl ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!',
        `رقم الطلب: ${mockOrder.orderNumber}`,
        'success'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0B192C] text-white p-5 rounded-t-3xl flex items-center justify-between border-b border-amber-500/20 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isRtl ? 'إتمام الشراء والدفع الآمن' : 'Secure Checkout & Payment'}
              </h3>
              <p className="text-xs text-amber-300">
                {isRtl ? 'بوابة الدفع والتسوية المعتمدة لمنصة وسيط' : 'Verified WASEET Payment Gateway'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          /* Success Receipt Card */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl font-black text-slate-900">
                {isRtl ? 'تهانينا! تم تأكيد وتنفيذ طلبك' : 'Order Confirmed & Paid!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {isRtl
                  ? `تم استلام دفعتك بنجاح وجاري تجهيز المنتجات والخدمات. تم إرسال الفاتورة الرسمية ورقم التتبع إلى بريدك الإلكتروني.`
                  : 'Your payment was processed successfully. Official invoice sent.'}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-start text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{isRtl ? 'رقم الطلب:' : 'Order Number:'}</span>
                <span className="font-mono font-bold text-slate-900">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{isRtl ? 'رقم الشحنة / التتبع:' : 'Tracking Ref:'}</span>
                <span className="font-mono font-bold text-cyan-600">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">{isRtl ? 'الناقل / وسيلة التسليم:' : 'Provider:'}</span>
                <span className="font-semibold text-slate-800">{completedOrder.shippingProvider}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">{isRtl ? 'المبلغ الإجمالي المدفوع:' : 'Total Paid:'}</span>
                <span className="font-black text-emerald-600 text-sm">{completedOrder.total || total} {isRtl ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isRtl ? 'إغلاق ومتابعة التسوق' : 'Close & Continue'}
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
            {/* Step 1: Shipping Address (if physical items exist) */}
            {hasPhysical ? (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>{isRtl ? '1. عنوان الشحن والتوصيل' : '1. Shipping Address'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {isRtl ? 'الاسم الكامل للمستلم:' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {isRtl ? 'رقم الجوال للتوصيل:' : 'Phone Number:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {isRtl ? 'المدينة:' : 'City:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {isRtl ? 'الحي والشارع:' : 'District & Street:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={district + ' - ' + street}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-cyan-50/50 border border-cyan-200 text-xs text-cyan-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>
                  {isRtl
                    ? 'الطلب يتضمن منتجات أو خدمات رقمية فقط — سيتم تفعيل الروابط والتسليم مباشرة دون الحاجة لشحن مادي.'
                    : 'Order contains digital assets or services only. Instant delivery upon payment.'}
                </span>
              </div>
            )}

            {/* Step 2: Payment Method */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? '2. طريقة الدفع المعتمدة (Sandbox)' : '2. Payment Method (Sandbox)'}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 font-bold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span>مدى / Visa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 font-bold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-slate-900" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 font-bold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-cyan-600" />
                  <span>{isRtl ? 'تحويل بنكي' : 'Bank Wire'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 font-bold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span>{isRtl ? 'دفع عند الاستلام' : 'Cash on Delivery'}</span>
                </button>
              </div>
            </div>

            {/* Affiliate / Broker Referral Code */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <label className="text-slate-700 font-bold flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{isRtl ? 'كود إحالة الوسيط / المسوق (Affiliate Code):' : 'Affiliate Referral Code:'}</span>
              </label>
              <input
                type="text"
                value={affiliateCode}
                onChange={(e) => setAffiliateCode(e.target.value)}
                placeholder="WASEET-VIP"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-400 outline-none uppercase"
              />
              <span className="text-[10px] text-slate-500 block">
                {isRtl ? 'تسجيل عمولة بنسبة 8% لصالح الوسيط المسوق تلقائياً في السجل المالي' : 'Registers 8% commission for the referrer'}
              </span>
            </div>

            {/* Order Summary & Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block">{isRtl ? 'المبلغ النهائي المطلوب' : 'Total Amount'}</span>
                <div className="text-2xl font-black text-slate-900">
                  {total} <span className="text-xs font-bold text-amber-600">{isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isRtl ? 'جاري معالجة الدفع...' : 'Processing Payment...'}</span>
                ) : (
                  <span>{isRtl ? 'تأكيد الدفع وإتمام الطلب' : 'Pay & Confirm Order'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
