"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { MessageCircle, X, Send, User, Bot, Phone, Mail, UserCircle, Sparkles, RotateCcw, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '').replace(/\/$/, '');

// --- Visual Components ---

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start mb-4"
  >
    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 flex-shrink-0">
        <Bot size={16} className="text-slate-600" />
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
      </div>
    </div>
  </motion.div>
);

const StepProgress = ({ currentStep }) => {
  const steps = [
    { key: 'ask_name', icon: UserCircle, label: 'Name' },
    { key: 'ask_phone', icon: Phone, label: 'Phone' },
    { key: 'ask_email', icon: Mail, label: 'Email' },
    { key: 'chat_live', icon: MessageCircle, label: 'Support' },
  ];
  const currentIdx = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-1 py-3 px-4 bg-white border-b border-slate-100 shadow-sm z-10">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentIdx;
        const isDone = idx < currentIdx;

        return (
          <React.Fragment key={step.key}>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-500
              ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
                : isDone ? 'bg-emerald-50 text-emerald-600' 
                : 'text-slate-300'}`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-3 h-[2px] rounded-full transition-colors duration-500 ${isDone ? 'bg-emerald-400' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('ask_name');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', email: '' });
  const [visitorId, setVisitorId] = useState(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [faqOptions, setFaqOptions] = useState([]);
  const [initialFaqs, setInitialFaqs] = useState([]);
  const [menuHistory, setMenuHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // --- Core Lifecycle ---

  // Fetch FAQ Options dynamically
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/chat-settings/visitor_faqs`);
        const data = await res.json();
        if (data.success) {
          setFaqOptions(data.data);
          setInitialFaqs(data.data);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();
  }, []);

  // Initialize Visitor ID
  useEffect(() => {
    let storedId = localStorage.getItem('tridev_visitor_id');
    if (!storedId) {
      storedId = 'visitor_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('tridev_visitor_id', storedId);
    }
    setVisitorId(storedId);
  }, []);

  // Initialize Socket
  useEffect(() => {
    if (!visitorId) return;

    const newSocket = io(SOCKET_URL, { autoConnect: true });
    setSocket(newSocket);

    newSocket.on('connect', () => {
        newSocket.emit('join_chat', visitorId);
    });

    newSocket.on('chat_history', (history) => {
        if (history?.length > 0) {
            setMessages(history);
            const last = history[history.length - 1];
            if (last.sender === 'bot') {
                 if (last.text.includes('name')) setStep('ask_name');
                 else if (last.text.includes('phone')) setStep('ask_phone');
                 else if (last.text.includes('email')) setStep('ask_email');
                 else setStep('chat_live');
            } else setStep('chat_live');
        }
    });

    newSocket.on('receive_message', (msg) => {
        setMessages(prev => [...prev, msg]);
        if (!isOpen) setUnreadCount(c => c + 1);
    });

    newSocket.on('bot_typing', ({ isTyping }) => setIsBotTyping(isTyping));
    newSocket.on('admin_typing', ({ isTyping }) => setIsAdminTyping(isTyping));
    
    newSocket.on('new_quick_replies', (replies) => {
        setFaqOptions(replies);
        if (replies.length > 0) {
            setMenuHistory(prev => [...prev, initialFaqs]); // Basic menu stack
        }
    });

    newSocket.on('chat_closed', () => {
        setIsClosed(true);
        setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: 'This session has ended. Do you need to chat another time? Just send a message to start again!',
            timestamp: new Date() 
        }]);
    });

    return () => newSocket.close();
  }, [visitorId, isOpen, initialFaqs]);

  // UI Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping, isAdminTyping, isOpen]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
    else if (!hasGreeted) {
        // Auto-open logic
        const timer = setTimeout(() => setIsOpen(true), 4000);
        return () => clearTimeout(timer);
    }
  }, [isOpen, hasGreeted]);

  // Initial Bot Flow
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
        setHasGreeted(true);
        setTimeout(() => {
            botReply("Hi! Welcome to Tridev Labels. I'm your digital assistant. May I know your name to get started?");
        }, 1000);
    }
  }, [isOpen, hasGreeted, messages]);

  // --- Handlers ---

  const botReply = (text) => {
    setIsBotTyping(true);
    setTimeout(() => {
        setIsBotTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text, timestamp: new Date() }]);
    }, 1200);
  };

  const emitTyping = (isTyping) => {
    if (!socket || step !== 'chat_live') return;
    socket.emit(isTyping ? 'visitor_typing' : 'visitor_stop_typing', { visitorId });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    emitTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
  };

  const sendToServer = (text) => {
    if (socket) {
        socket.emit('send_message', { 
            visitorId, text, sender: 'user', isAdmin: false, timestamp: new Date() 
        });
    }
  };

  const handleSend = (overrideText = '') => {
    const text = (overrideText || inputText).trim();
    if (!text) return;

    if (isClosed) {
        // Reset Logic
        window.location.reload(); // Simple reload for full reset
        return;
    }

    if (overrideText === '') setInputText('');
    emitTyping(false);

    if (step === 'chat_live') {
        sendToServer(text);
    } else {
        const userMsg = { sender: 'user', text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        if (step === 'ask_name') {
            const name = text.replace(/^(i am|my name is|im|i'm)\s+/gi, '').trim();
            if (name.length < 2) return botReply("Could you please provide your full name?");
            setUserDetails(prev => ({ ...prev, name }));
            socket.emit('update_visitor_info', { visitorId, name, message: userMsg });
            setStep('ask_phone');
            botReply(`Nice to meet you, ${name.split(' ')[0]}! What is your phone number?`);
        } else if (step === 'ask_phone') {
            const phone = text.replace(/\D/g, '');
            if (phone.length < 10) return botReply("Please enter a valid 10-digit phone number.");
            setUserDetails(prev => ({ ...prev, phone }));
            socket.emit('update_visitor_info', { visitorId, phone, message: userMsg });
            setStep('ask_email');
            botReply("Great. And your email address?");
        } else if (step === 'ask_email') {
            const email = text.toLowerCase().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
            if (!email) return botReply("That doesn't look like a valid email. Please check and try again.");
            const finalDetails = { ...userDetails, email: email[0] };
            setUserDetails(finalDetails);
            socket.emit('update_visitor_info', { visitorId, ...finalDetails, message: userMsg });
            setStep('chat_live');
            botReply("Connecting you to our team... Feel free to ask anything!");
        }
    }
  };

  const handleFaqClick = (faq) => {
    // 1. Send the message as if the user typed it
    handleSend(faq.label);

    // 2. If it has sub-options (followUps), show them immediately in the menu
    if (faq.followUps && faq.followUps.length > 0) {
        setMenuHistory(prev => [...prev, faqOptions]); // Store current as parent
        setFaqOptions(faq.followUps);
    }
  };

  const goBackMenu = () => {
    if (menuHistory.length > 0) {
        const prevMenu = menuHistory[menuHistory.length - 1];
        setFaqOptions(prevMenu);
        setMenuHistory(prev => prev.slice(0, -1));
    }
  };

  const resetFaqs = () => {
    setFaqOptions(initialFaqs);
    setMenuHistory([]);
  };

  // --- Render ---

  return (
    <>
      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[9999] group"
      >
        <div className="relative">
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-1 z-10 size-6 bg-red-600 border-2 border-white text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
          <div className="size-16 rounded-3xl bg-slate-900 shadow-2xl shadow-red-100 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-active:scale-95 group-hover:-rotate-12 group-hover:bg-red-600">
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </div>
        </div>
      </button>

      {/* Main Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-28 right-8 z-[9999] w-[90vw] sm:w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                            <Bot size={24} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-base tracking-tight leading-none">Tridev Assistant</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                            <span className="size-1.5 bg-emerald-500 rounded-full" />
                            Live Support Active
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/30 hover:text-white transition-colors">
                    <ChevronDown size={24} />
                </button>
            </div>

            <StepProgress currentStep={step} />

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 [scrollbar-width:none]">
                {messages.map((msg, idx) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.9, y: 10, originX: isUser ? 1 : 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-sm font-medium leading-relaxed
                                ${isUser 
                                    ? 'bg-red-600 text-white rounded-br-none shadow-xl shadow-red-100' 
                                    : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-none'
                                }
                            `}>
                                {msg.text}
                            </div>
                        </motion.div>
                    );
                })}
                {isBotTyping && <TypingIndicator />}
                {isAdminTyping && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Support is typing...</p>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* FAQ Menu */}
            {faqOptions.length > 0 && step === 'chat_live' && (
                <div className="px-6 py-4 bg-white border-t border-slate-50 flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-500">
                    {menuHistory.length > 0 && (
                        <button 
                            onClick={goBackMenu}
                            className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all hover:bg-red-600 active:scale-95"
                        >
                            <ChevronDown size={14} className="rotate-90" />
                            Back
                        </button>
                    )}
                    {faqOptions.map((faq, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleFaqClick(faq)}
                            className="bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-full text-xs font-bold border border-slate-100 transition-all flex items-center gap-2 group"
                        >
                            <Sparkles size={12} className="group-hover:animate-spin-slow" />
                            {faq.label}
                        </button>
                    ))}
                    {menuHistory.length > 0 && (
                        <button 
                            onClick={resetFaqs}
                            className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                            title="Reset to main menu"
                        >
                            <RotateCcw size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* Input Footer */}
            <div className="p-6 bg-white border-t border-slate-100">
                <div className="flex items-center gap-3 bg-slate-50 rounded-[1.5rem] p-2 pl-5 border border-slate-100 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/5 transition-all">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={
                            isClosed ? "Session ended. Type to restart..." :
                            step === 'ask_name' ? "Tell us your name..." :
                            "Type a message..."
                        }
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={!inputText.trim()}
                        className="size-11 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-100 flex items-center justify-center disabled:opacity-50 hover:bg-red-700 transition-all active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 opacity-30 group">
                    <div className="size-1 bg-slate-400 rounded-full group-hover:bg-red-500 transition-colors" />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Tridev Labels Intelligence</p>
                    <div className="size-1 bg-slate-400 rounded-full group-hover:bg-red-500 transition-colors" />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}