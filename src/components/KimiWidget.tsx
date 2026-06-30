import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function KimiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Bonjour ! Je suis Kimi, votre assistant IA. Comment puis-je vous aider aujourd\'hui ?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Je traite votre demande...' },
      ]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 120 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease }}
            style={{
              width: 380,
              height: 520,
              background: 'rgba(18, 18, 31, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(30, 30, 45, 0.8)',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginBottom: 72,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '16px 20px',
                borderBottom: '1px solid rgba(30, 30, 45, 0.8)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>
                  Kimi AI
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#8B8B9E' }}>En ligne</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B8B9E',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:
                      msg.role === 'user'
                        ? 'rgba(6, 182, 212, 0.15)'
                        : 'rgba(18, 18, 31, 0.8)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(30, 30, 45, 0.6)'}`,
                    color: '#FFFFFF',
                    fontSize: 13,
                    lineHeight: 1.5,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    {msg.role === 'ai' ? <Bot size={12} color="#06B6D4" /> : <User size={12} color="#8B5CF6" />}
                    <span style={{ fontSize: 10, color: '#4A4A5E', fontWeight: 500 }}>
                      {msg.role === 'ai' ? 'Kimi' : 'Vous'}
                    </span>
                  </div>
                  {msg.text}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(30, 30, 45, 0.8)',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez une question..."
                className="gal-input"
                style={{ flex: 1, fontSize: 13 }}
              />
              <button
                onClick={handleSend}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'filter 0.15s ease',
                }}
              >
                <Send size={16} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      >
        {isOpen ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </motion.button>
    </div>
  );
}
