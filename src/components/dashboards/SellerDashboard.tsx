import React, { useState } from 'react';
import {
  Store,
  Package,
  Plus,
  ShoppingCart,
  DollarSign,
  Truck,
  Barcode,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../../data/mockData';
import { Product, Order } from '../../types';
import { OrderWorkspaceModal } from '../orders/OrderWorkspaceModal';

export const SellerDashboard: React.FC = () => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.slice(0, 4));
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedWorkspaceOrder, setSelectedWorkspaceOrder] = useState<Order | null>(null);

  // New product state
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState<'physical' | 'digital'>('physical');
  const [prodPrice, setProdPrice] = useState(250);
  const [prodStock, setProdStock] = useState(50);
  const [prodSku, setProdSku] = useState('PROD-NEW-01');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    const newProd: Product = {
      id: `p_${Date.now()}`,
      name: prodName,
      nameEn: prodName,
      description: 'منتج جديد أضيف إلى متجر ' + (user?.name || 'البائع'),
      descriptionEn: 'New product listed by seller',
      type: prodType,
      price: Number(prodPrice),
      currency: 'SAR',
      sku: prodSku,
      stock: Number(prodStock),
      category: 'office_tech',
      sellerId: user?.id || 'usr_seller',
      sellerName: user?.name || 'سلطان القحطاني',
      storeName: 'تقنيات الأعمال الذكية',
      rating: 5.0,
      reviewCount: 0,
      images: ['https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80'],
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsAddOpen(false);
    showToast(isRtl ? 'تمت إضافة المنتج بنجاح إلى المتجر' : 'Product Added', prodName, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-400">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{isRtl ? 'متجر تقنيات الأعمال الذكية' : 'Smart Business Tech'}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isRtl ? 'بائع معتمد وموثق' : 'Verified Merchant'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isRtl ? 'المالك: سلطان القحطاني • السجل التجاري: 101089281' : 'Owner: Sultan Al-Qahtani'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة منتج مادي أو رقمي' : 'Add Product'}</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'أرباح المتجر المتاحة للسحب' : 'Available Balance'}
          </span>
          <div className="text-xl font-black text-slate-900">
            53,200 <span className="text-xs text-amber-600 font-bold">{isRtl ? 'ر.س' : 'SAR'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'إجمالي المنتجات المعروضة' : 'Active Products'}
          </span>
          <div className="text-xl font-black text-slate-900">{products.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'طلبات بانتظار الشحن والتسليم' : 'Pending Orders'}
          </span>
          <div className="text-xl font-black text-amber-600">{orders.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            {isRtl ? 'تقييم المتجر العام' : 'Store Rating'}
          </span>
          <div className="text-xl font-black text-emerald-600">4.9 / 5.0</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isRtl ? 'المخزون والمنتجات' : 'Inventory'}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isRtl ? 'الطلبات والضمان المالي (Escrow)' : 'Orders & Escrow'}</span>
        </button>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">{isRtl ? 'إضافة منتج مادي أو رقمي جديد' : 'Add New Product'}</h3>
            <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'اسم المنتج:' : 'Product Name:'}</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder={isRtl ? 'مثال: جهاز نقطة بيع إلكتروني' : 'Name'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'نوع المنتج:' : 'Type:'}</label>
              <select
                value={prodType}
                onChange={(e: any) => setProdType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              >
                <option value="physical">{isRtl ? 'منتج مادي (يحتاج شحن وتوصيل)' : 'Physical (Requires shipping)'}</option>
                <option value="digital">{isRtl ? 'منتج رقمي (تنزيل فوري)' : 'Digital (Instant download)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'السعر (ر.س):' : 'Price (SAR):'}</label>
              <input
                type="number"
                required
                value={prodPrice}
                onChange={(e) => setProdPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'الكمية بالمخزون:' : 'Stock:'}</label>
              <input
                type="number"
                required
                value={prodStock}
                onChange={(e) => setProdStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">{isRtl ? 'رمز التخزين SKU:' : 'SKU:'}</label>
              <input
                type="text"
                required
                value={prodSku}
                onChange={(e) => setProdSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              {isRtl ? 'إضافة إلى المتجر' : 'Add to Store'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">
            {isRtl ? 'مخزون المنتجات وإدارتها' : 'Products Inventory'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3 text-start">{isRtl ? 'المنتج' : 'Product'}</th>
                  <th className="p-3 text-start">SKU</th>
                  <th className="p-3 text-start">{isRtl ? 'النوع' : 'Type'}</th>
                  <th className="p-3 text-start">{isRtl ? 'السعر' : 'Price'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المخزون' : 'Stock'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-bold text-slate-900 line-clamp-1">{p.name}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{p.sku}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.type === 'digital' ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="p-3 font-black text-slate-900">{p.price} {isRtl ? 'ر.س' : 'SAR'}</td>
                    <td className="p-3">
                      <span className="font-bold text-emerald-600">{p.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Escrow Table */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {isRtl ? 'الطلبات ومتابعة الضمان المالي' : 'Customer Orders & Escrow'}
            </h3>
            <span className="text-xs text-slate-500">
              {isRtl ? 'أموال المشتري محمية في الضمان لحين تأكيد الاستلام' : 'Buyer funds held in escrow until fulfillment'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3 text-start">{isRtl ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="p-3 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="p-3 text-start">{isRtl ? 'حالة الضمان المالي' : 'Escrow Status'}</th>
                  <th className="p-3 text-start">{isRtl ? 'حالة الطلب' : 'Status'}</th>
                  <th className="p-3 text-center">{isRtl ? 'الإجراءات ومساحة العمل' : 'Workspace'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="p-3 font-medium text-slate-800">{o.userName}</td>
                    <td className="p-3 font-black text-slate-900">{o.total} {isRtl ? 'ر.س' : 'SAR'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {o.escrowStatus || 'held_in_escrow'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedWorkspaceOrder(o)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isRtl ? 'مساحة العمل والتسليم' : 'Workspace'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Workspace Modal */}
      {selectedWorkspaceOrder && (
        <OrderWorkspaceModal
          order={selectedWorkspaceOrder}
          onClose={() => setSelectedWorkspaceOrder(null)}
          onOrderUpdated={(updated: Order) => {
            setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
          }}
        />
      )}
    </div>
  );
};
