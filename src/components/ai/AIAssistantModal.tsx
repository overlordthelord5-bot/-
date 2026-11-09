import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: isRtl
        ? 'مرحباً بك! أنا "مساعد وسيط الذكي" (WASEET AI). يسعدني مساعدتك في استكشاف الاستشارات التخصصية، طلب الخدمات الاحترافية، ترشيح المنتجات المناسبة لنشاطك، أو مساعدتك في صياغة عروضك كبائع أو استشاري. كيف يمكنني خدمتك اليوم؟'
        : 'Welcome to WASEET AI Advisor! I can recommend consultations, professional services, office hardware, and help you draft vendor listings.',
      timestamp: 'الآن',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      labelAr: 'اقترح لي استشارة لتأسيس متجري الإلكتروني',
      labelEn: 'Suggest an e-commerce startup consultation',
      query: 'أرغب في تأسيس متجر إلكتروني جديد في السعودية، ما هي أفضل استشارة ودراسة جدوى تناسبني؟',
    },
    {
      labelAr: 'أفضل أجهزة نقاط البيع POS للأنشطة التجارية',
      labelEn: 'Best smart POS terminals for retail',
      query: 'ما هي مواصفات جهاز نقطة البيع الذكي المتوفر في وسيط وهل يدعم بطاقات مدى وNFC؟',
    },
    {
      labelAr: 'كيف أحقق أرباحاً من برنامج وسيط للعمولات؟',
      labelEn: 'How to earn with WASEET affiliate broker program',
      query: 'اشرح لي آلية برنامج وسيط للتسويق بالعمولة ونسبة الأرباح وكيفية سحب الرصيد.',
    },
    {
      labelAr: 'مساعدة البائع: كتابة وصف تسويقي احترافي لمنتج',
      labelEn: 'Help seller: Write attractive product copy',
      query: 'أنا بائع جديد في وسيط، ساعدني في كتابة عنوان ووصف تسويقي جذاب لطقم مكتبي فاخر.',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      const replyText = data.reply || (isRtl ? 'تمت معالجة استفسارك بنجاح.' : 'Response processed.');

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: isRtl
          ? 'منصة وسيط: يمكنك دائماً استكشاف أقسام الاستشارات والمنتجات مباشرة من القائمة العلوية.'
          : 'You can explore consultations and products directly from the top menu.',
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md h-full sm:h-[650px] bg-slate-900 border border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B192C] p-4 border-b border-amber-500/20 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">
                  {isRtl ? 'مساعد وسيط الذكي' : 'WASEET AI Advisor'}
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isRtl ? 'استشارات وترشيحات ذكية فورية' : 'Smart marketplace recommendations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-950/60 p-2.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-amber-300 whitespace-nowrap border border-slate-700 transition-colors cursor-pointer shrink-0"
            >
              {isRtl ? item.labelAr : item.labelEn}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-cyan-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line text-xs font-normal">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1 ${
                    msg.sender === 'user' ? 'text-amber-900 text-end' : 'text-slate-400 text-end'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>{isRtl ? 'جاري تحليل الطلب وصياغة التوصيات الذكية...' : 'Analyzing & generating smart recommendations...'}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRtl ? 'اسأل مساعد وسيط الذكي عن أي استشارة أو منتج...' : 'Ask WASEET AI about any service or item...'}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 disabled:opacity-40 transition-all cursor-pointer font-bold shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-slate-500 text-center mt-2">
            {isRtl
              ? 'مساعد وسيط مدعوم بنماذج الذكاء الاصطناعي من Google Gemini — قد تحتاج التوصيات لمراجعة.'
              : 'WASEET AI is powered by Google Gemini — verify critical advice.'}
          </p>
        </div>
      </div>
    </div>
  );
};
