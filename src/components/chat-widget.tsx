import { type FormEvent, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { askAssistant, type ChatMessage } from '@/lib/api';

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: 'Hello! I can answer questions about STRUCTURE’s services and how to start a project. How can I help?',
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, open, busy]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user', content: text } as ChatMessage];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      // Skip the local welcome message; the API expects the conversation to start with the visitor.
      const { reply } = await askAssistant(next.slice(1).slice(-10));
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: err instanceof Error ? err.message : 'Something went wrong. Please call 77 3600 8486.' }]);
    } finally {
      setBusy(false);
    }
  };

  return <div className="chat-widget" data-testid="chat-widget">
    {open && <div className="chat-panel" role="dialog" aria-label="Chat with STRUCTURE assistant">
      <div className="chat-head"><span>STRUCTURE Assistant</span><button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={16} /></button></div>
      <div className="chat-body" aria-live="polite">
        {messages.map((m, i) => <p key={i} className={`chat-msg ${m.role}`}>{m.content}</p>)}
        {busy && <p className="chat-msg assistant">Typing…</p>}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={send}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about our services…" maxLength={1000} aria-label="Your message" />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={16} /></button>
      </form>
    </div>}
    <button type="button" className="chat-toggle" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close chat' : 'Open chat'} data-testid="button-chat-toggle"><MessageCircle size={22} /></button>
  </div>;
}
