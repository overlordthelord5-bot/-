import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  FileText,
  Clock,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ConsultationBooking } from '../../types';

interface VideoMeetingModalProps {
  booking: ConsultationBooking | null;
  onClose: () => void;
}

export const VideoMeetingModal: React.FC<VideoMeetingModalProps> = ({ booking, onClose }) => {
  const { isRtl } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useNotification();

  if (!booking) return null;

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'notes' | 'chat'>('notes');
  const [notes, setNotes] = useState('• مناقشة متطلبات التوسع وخفض تكلفة اكتساب العميل CAC\n• صياغة مسودة اتفاقية الشركاء المؤسسين');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: booking.consultantName, text: 'أهلاً بك! تم الاتصال بنجاح ويمكننا البدء في مناقشة النقاط المحددة.', time: '10:00' },
  ]);
  const [elapsedSeconds, setElapsedSeconds] = useState(140);
  const [providerMode, setProviderMode] = useState<'demo' | 'jitsi' | 'daily'>('demo');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: user?.name || 'أنا',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-none sm:rounded-3xl shadow-2xl w-full max-w-6xl h-full sm:h-[90vh] flex flex-col overflow-hidden text-white">
        {/* Top Meeting Bar */}
        <div className="bg-[#07101E] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md">
                  {booking.consultationTitle}
                </span>
                <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  {isRtl ? 'مشفر E2EE' : 'Encrypted'}
                </span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <span>{booking.consultantName} & {booking.clientName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimer(elapsedSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Integration Provider Mode Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 text-[11px]">
              <span className="text-slate-400">{isRtl ? 'مزود الخدمة:' : 'Provider:'}</span>
              <select
                value={providerMode}
                onChange={(e: any) => setProviderMode(e.target.value)}
                className="bg-transparent font-bold text-amber-400 outline-none cursor-pointer"
              >
                <option value="demo" className="bg-slate-800 text-white">{isRtl ? 'وضع المحاكاة (Demo Mode)' : 'Demo Mode'}</option>
                <option value="jitsi" className="bg-slate-800 text-white">Jitsi Meet API</option>
                <option value="daily" className="bg-slate-800 text-white">Daily.co WebRTC</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مغادرة الجلسة' : 'Leave'}</span>
            </button>
          </div>
        </div>

        {/* Video Canvas & Side Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Video Viewport */}
          <div className="flex-1 bg-slate-950 p-4 relative flex flex-col items-center justify-center">
            {/* Simulation Video Feeds */}
            <div className="w-full h-full max-h-[500px] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Consultant Screen */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-3 start-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{booking.consultantName}</span>
                </div>
              </div>

              {/* Client Screen */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
                {isVideoOn ? (
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-slate-500 space-y-2">
                    <VideoOff className="w-10 h-10 mx-auto" />
                    <span className="text-xs">{isRtl ? 'الكاميرا مغلقة' : 'Camera Off'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-3 start-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white">
                  <span>{booking.clientName} ({isRtl ? 'أنت' : 'You'})</span>
                </div>
              </div>
            </div>

            {/* Screen sharing banner */}
            {isSharingScreen && (
              <div className="absolute top-6 bg-cyan-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                <Monitor className="w-4 h-4 animate-pulse" />
                <span>{isRtl ? 'أنت تشارك شاشتك الآن مع المستشار' : 'You are sharing your screen'}</span>
              </div>
            )}

            {/* In-Call Controls Bottom Bar */}
            <div className="absolute bottom-6 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700 shadow-2xl">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'كتم الميكروفون' : 'تشغيل الميكروفون'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isVideoOn ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsSharingScreen(!isSharingScreen)}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  isSharingScreen ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="مشاركة الشاشة"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Panel: Meeting Collaborative Notes & In-Meeting Chat */}
          <div className="w-full md:w-80 bg-slate-900 border-s border-slate-800 flex flex-col justify-between shrink-0">
            {/* Panel Switcher */}
            <div className="flex border-b border-slate-800 p-2 gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveSidePanel('notes')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeSidePanel === 'notes' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isRtl ? 'الملاحظات والقرارات' : 'Action Notes'}</span>
              </button>

              <button
                onClick={() => setActiveSidePanel('chat')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeSidePanel === 'chat' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isRtl ? 'محادثة الجلسة' : 'Chat'}</span>
              </button>
            </div>

            {/* Notes Panel */}
            {activeSidePanel === 'notes' ? (
              <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    {isRtl ? 'ملاحظات وتوصيات الجلسة المباشرة:' : 'Live Collaborative Notes:'}
                  </span>
                  <textarea
                    rows={12}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={() =>
                    showToast(isRtl ? 'تم حفظ مخرجات وملاحظات الجلسة' : 'Notes Saved', '', 'success')
                  }
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs"
                >
                  {isRtl ? 'حفظ وتصدير التوصيات' : 'Export Notes to PDF'}
                </button>
              </div>
            ) : (
              /* Chat Panel */
              <div className="p-4 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-3 overflow-y-auto max-h-80 pe-1">
                  {chatMessages.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isRtl ? 'اكتب في محادثة الجلسة...' : 'Chat...'}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    {isRtl ? 'إرسال' : 'Send'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
