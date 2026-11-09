import React from 'react';
import { ShieldCheck, Award, Handshake, FileText, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_PARTNERS } from '../../data/mockData';

export const PartnerDashboard: React.FC = () => {
  const { isRtl } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              {isRtl ? 'برنامج الشراكات التجارية' : 'Strategic Partnership Portal'}
            </span>
            <span className="text-xs text-amber-300 font-bold">Tier 1 Enterprise</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRtl ? 'بوابة الشركاء الاستراتيجيين لمنصة وسيط' : 'Strategic Partners Portal'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {isRtl
              ? 'متابعة اتفاقيات التعاون المؤسسي، تكامل الخدمات اللوجستية والتقنية، وتقارير العوائد المشتركة.'
              : 'Corporate agreements, enterprise integrations, and shared revenue reports.'}
          </p>
        </div>
      </div>

      {/* Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_PARTNERS.map((partner) => (
          <div key={partner.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <img src={partner.logo} alt="" className="w-12 h-12 rounded-2xl object-cover border" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{partner.name}</h4>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 uppercase">
                  {partner.type}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{partner.description}</p>

            <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'الخدمات المدمجة:' : 'Offerings:'}</span>
              {partner.featuredOfferings.map((off, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{off}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{isRtl ? 'حالة الاتفاقية: سارية' : 'Status: Active'}</span>
              <span className="text-emerald-600 font-bold">99.9% Uptime</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
