import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, MessageCircle, Trash2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGES = 30;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Hi! I'm Sahayak. Ask me anything about the site, your roadmap, or lessons.",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const canSend = input.trim().length > 0 && !loading;

  const systemContext = useMemo(() => (
    'You are Sahayak, a helpful assistant for an education dashboard. ' +
    'Answer concisely and help users navigate features (roadmap, lessons, profiles). '
  ), []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }), 50);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  const handleSend = async () => {
    if (!canSend) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev.slice(-MAX_MESSAGES + 1), userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemContext },
            ...messages,
            userMsg,
          ],
          model: 'gemini-1.5-flash',
        }),
      });
      const data = await res.json();
      const replyText = data?.reply?.trim?.() || 'Sorry, I could not get an answer.';
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'There was an error reaching the assistant.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="group relative w-14 h-14 rounded-full border border-accent/30 bg-dark-secondary shadow-lg hover:shadow-accent/20 hover:border-accent/50 transition-all overflow-hidden"
        aria-label="Open chatbot"
      >
        {/* Logo filled with Transform gradient (Hero: from-accent to-accent-light) using mask */}
        <div className="absolute inset-0 p-2">
          <div
            aria-hidden
            className="w-full h-full bg-gradient-to-r from-accent to-accent-light opacity-90 group-hover:opacity-100"
            style={{
              WebkitMaskImage: 'url(/S.svg)',
              maskImage: 'url(/S.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
        </div>
        <span className="sr-only">Open assistant</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] rounded-xl border border-gray-800 bg-dark-secondary/95 backdrop-blur-md shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-accent to-accent-light"
                  aria-hidden
                  style={{
                    WebkitMaskImage: 'url(/S.svg)',
                    maskImage: 'url(/S.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain'
                  }}
                />
                <div>
                  <p className="text-sm font-semibold">Sahayak Assistant</p>
                  <p className="text-[11px] text-gray-400">Powered by Sahayak-AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button title="Clear chat" className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => setMessages([{ role: 'assistant', content: "Hi! I'm Sahayak. Ask me anything about the site, your roadmap, or lessons." }])}>
                  <Trash2 className="w-4 h-4" />
                </button>
                <button title="Close" className="p-1.5 rounded-md text-gray-400 hover:text-accent hover:bg-accent/10" onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="max-h-[50vh] overflow-y-auto p-3 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm border ${m.role === 'user' ? 'bg-accent/20 border-accent/30 text-gray-100' : 'bg-dark-tertiary border-gray-800 text-gray-200'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-gray-800 p-2">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask anything..."
                  className="flex-1 resize-none rounded-lg bg-dark-tertiary border border-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-accent/40 placeholder:text-gray-500"
                />
                <button
                  title="Send message"
                  disabled={!canSend}
                  onClick={handleSend}
                  className={`p-2 rounded-lg border ${canSend ? 'bg-accent/20 border-accent/40 text-accent hover:bg-accent/30' : 'bg-dark-tertiary border-gray-800 text-gray-500 cursor-not-allowed'} `}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-[10px] text-gray-500 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Avoid sharing personal data.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
