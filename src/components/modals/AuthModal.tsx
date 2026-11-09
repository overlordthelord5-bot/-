import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const { isRtl } = useLanguage();
  const { login, register, availableUsers } = useAuth();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const ok = await login(email);
      if (ok) {
        showToast(isRtl ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully', '', 'success');
        onClose();
      } else {
        showToast(isRtl ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials', '', 'error');
      }
    } else {
      const ok = await register(name, email, selectedRole, phone);
      if (ok) {
        showToast(isRtl ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully', '', 'success');
        onClose();
      }
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    await login(userEmail);
    showToast(isRtl ? 'تم تسجيل الدخول السريع' : 'Quick login successful', userEmail, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B192C] text-white p-5 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">
              {mode === 'login' ? (isRtl ? 'تسجيل الدخول إلى وسيط' : 'Sign In to WASEET') : (isRtl ? 'إنشاء حساب جديد' : 'Create New Account')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'إنشاء حساب جديد' : 'Sign Up'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isRtl ? 'الاسم الكامل:' : 'Full Name:'}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRtl ? 'محمد الشمري' : 'Full Name'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isRtl ? 'نوع الحساب:' : 'Account Role:'}</label>
                <select
                  value={selectedRole}
                  onChange={(e: any) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                >
                  <option value="client">{isRtl ? 'عميل (شراء واستشارات)' : 'Client'}</option>
                  <option value="consultant">{isRtl ? 'مستشار وخبير' : 'Consultant'}</option>
                  <option value="seller">{isRtl ? 'بائع ومتجر' : 'Seller'}</option>
                  <option value="affiliate">{isRtl ? 'وسيط ومسوق بالعمولة' : 'Affiliate Broker'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isRtl ? 'رقم الجوال:' : 'Phone:'}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@waseet.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{isRtl ? 'كلمة المرور:' : 'Password:'}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {mode === 'login' ? (isRtl ? 'تسجيل الدخول' : 'Sign In') : (isRtl ? 'تأكيد وإنشاء الحساب' : 'Create Account')}
          </button>

          {/* 1-Click Fast Role Sign-in */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 text-center">
              {isRtl ? 'أو اختر دوراً للدخول الفوري المباشر (للتجربة والتقييم):' : 'Or 1-click test login as:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {availableUsers.slice(0, 6).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-slate-700 hover:text-slate-950 text-start flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block truncate">{u.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-400 uppercase">{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
