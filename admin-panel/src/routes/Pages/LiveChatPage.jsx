import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { User, MessageCircle, Send, Clock, CheckCircle, AlertCircle, Loader2, Volume2, BellRing, Sparkles, ChevronUp, ChevronDown, Bot } from 'lucide-react';
import Toast from "@/components/Toast";
import { chatService } from '@/services/chat.service';

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const LiveChatPage = () => {
    const socketRef = useRef(null);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [inputText, setInputText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [volume, setVolume] = useState(0.8);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [visitorTyping, setVisitorTyping] = useState({}); // { [visitorId]: boolean }
    const [cannedReplies, setCannedReplies] = useState([]);
    const [showCanned, setShowCanned] = useState(false);

    const messagesEndRef = useRef(null);
    const activeChatIdRef = useRef(null);
    const lastMessageCountRef = useRef({});
    const triggerNotificationRef = useRef(null);
    const audioRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Sync ref with state
    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    const playNotificationSound = (customVolume = null) => {
        if (!audioRef.current) {
            audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        }
        try {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = customVolume !== null ? customVolume : volume;
            const p = audioRef.current.play();
            if (p) p.catch(() => {});
        } catch (err) {}
    };

    const triggerNotification = (title, body, force = false) => {
        playNotificationSound();
        if (Notification.permission === "granted" && (document.hidden || force)) {
            try {
                new Notification(title, { body, icon: "/logo.png", silent: true });
            } catch (e) {}
        }
    };

    useEffect(() => {
        triggerNotificationRef.current = triggerNotification;
    });

    // Fetch Canned Replies
    useEffect(() => {
        const fetchCanned = async () => {
            try {
                const res = await chatService.getSettings('admin_canned_replies');
                if (res.success) setCannedReplies(res.data || []);
            } catch (err) { console.error(err); }
        };
        fetchCanned();
    }, []);

    // Socket Setup
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);

        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL, { withCredentials: true, autoConnect: true });
            const socket = socketRef.current;

            socket.on('connect', () => {
                setIsConnected(true);
                socket.emit('admin_join');
            });

            socket.on('chat_updated', (updatedChat) => {
                if (!updatedChat?.visitorId) return;
                const prevCount = lastMessageCountRef.current[updatedChat.visitorId] || 0;
                const newCount = updatedChat.messages?.length || 0;
                
                if (newCount > prevCount) {
                    const lastMsg = updatedChat.messages[newCount - 1];
                    if (lastMsg && lastMsg.sender !== 'admin' && lastMsg.sender !== 'bot') {
                        showToast(`Msg from ${updatedChat.name || 'Visitor'}`, "info");
                        triggerNotificationRef.current(`Message: ${updatedChat.name || 'Visitor'}`, lastMsg.text);
                    }
                }
                lastMessageCountRef.current[updatedChat.visitorId] = newCount;
                setChats(prev => {
                    const exists = prev.find(c => c.visitorId === updatedChat.visitorId);
                    return exists ? prev.map(c => c.visitorId === updatedChat.visitorId ? updatedChat : c) : [updatedChat, ...prev];
                });
            });

            socket.on('visitor_typing', ({ visitorId }) => setVisitorTyping(prev => ({ ...prev, [visitorId]: true })));
            socket.on('visitor_stop_typing', ({ visitorId }) => setVisitorTyping(prev => ({ ...prev, [visitorId]: false })));

            socket.on('active_chats_initial', (initial) => {
                if (Array.isArray(initial)) {
                    setChats(initial);
                    initial.forEach(c => lastMessageCountRef.current[c.visitorId] = c.messages?.length || 0);
                }
            });

            socket.on('connect_error', () => setIsConnected(false));
            socket.on('disconnect', () => setIsConnected(false));
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, activeChatId]);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleSend = (textOverride = '') => {
        const text = textOverride || inputText;
        if (!text.trim() || !activeChatId || !currentUser) return;
        const currentChat = chats.find(c => c.visitorId === activeChatId);
        if (currentChat?.assignedTo?.toString() !== currentUser._id?.toString() && currentChat?.assignedTo?.toString() !== currentUser.id?.toString()) {
            return showToast("You must join this chat first", "error");
        }

        socketRef.current.emit('send_message', {
            visitorId: activeChatId,
            text,
            sender: 'admin',
            isAdmin: true,
            adminId: currentUser._id || currentUser.id
        });
        if (!textOverride) setInputText('');
        setShowCanned(false);
        emitTyping(false);
    };

    const emitTyping = (isTyping) => {
        if (socketRef.current && activeChatId) {
            socketRef.current.emit(isTyping ? 'admin_typing' : 'admin_stop_typing', { visitorId: activeChatId });
        }
    };

    const handleInputChange = (val) => {
        setInputText(val);
        emitTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
    };

    const handleClaim = () => {
        if (!socketRef.current || !activeChatId || !currentUser) return;
        setIsJoining(true);
        socketRef.current.emit('admin_claim', { visitorId: activeChatId, adminId: currentUser._id || currentUser.id });
        setTimeout(() => setIsJoining(false), 3000);
    };

    const handleClose = () => {
        socketRef.current.emit('close_chat', { visitorId: activeChatId, adminId: currentUser._id || currentUser.id });
        setActiveChatId(null);
        setShowCloseConfirm(false);
        showToast("Session Archived");
    };

    const activeChat = chats.find(c => c.visitorId === activeChatId);
    const isClaimedByMe = activeChat?.assignedTo && currentUser && (activeChat.assignedTo.toString() === (currentUser._id || currentUser.id)?.toString());

    return (
        <div className="h-[calc(100vh-120px)] grid lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
             {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

            {/* Sidebar */}
            <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Support</h3>
                        <div className={`size-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-2 px-3 border border-slate-100 text-[10px] font-black uppercase text-slate-400">
                        {chats.filter(c => c.status !== 'closed').length} ACTIVE SESSIONS
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    {chats.filter(c => c.status !== 'closed').map(chat => (
                        <button
                            key={chat.visitorId}
                            onClick={() => setActiveChatId(chat.visitorId)}
                            className={`w-full text-left p-4 rounded-2xl transition-all border ${activeChatId === chat.visitorId ? 'bg-red-50 border-red-100' : 'hover:bg-slate-50 border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                    {chat.name?.charAt(0) || 'V'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate uppercase tracking-tight">{chat.name || 'Visitor'}</h4>
                                    <p className="text-[10px] text-slate-400 truncate uppercase mt-0.5">
                                        {chat.messages?.[chat.messages.length - 1]?.text || 'No messages'}
                                    </p>
                                </div>
                                {visitorTyping[chat.visitorId] && (
                                    <div className="flex gap-0.5">
                                        <div className="size-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="size-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
                {activeChat ? (
                    <>
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                    {activeChat.name?.charAt(0) || 'V'}
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 tracking-tight">{activeChat.name || 'Visitor'}</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeChat.email || 'No email provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isClaimedByMe && (
                                    <button onClick={() => setShowCloseConfirm(true)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all border border-red-100">
                                        Finish Session
                                    </button>
                                )}
                                {!activeChat.assignedTo && (
                                    <button onClick={handleClaim} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100">
                                        Join Chat
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                            {activeChat.messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-5 py-3.5 text-sm font-medium shadow-sm border
                                        ${msg.sender === 'bot' ? 'bg-amber-50 border-amber-100 text-amber-900 mx-auto' : 
                                          msg.isAdmin ? 'bg-slate-900 text-white border-slate-800 rounded-br-none' : 
                                          'bg-white text-slate-700 border-slate-100 rounded-bl-none'}`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {visitorTyping[activeChatId] && (
                                <div className="flex items-center gap-2 animate-pulse pl-2">
                                    <div className="size-2 bg-slate-300 rounded-full" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visitor is typing...</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input & Canned Replies */}
                        <div className="p-6 bg-white border-t border-slate-100 relative">
                            {showCanned && (
                                <div className="absolute bottom-full left-6 right-6 mb-2 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-3 animate-in slide-in-from-bottom-2 duration-300 z-50">
                                    <div className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">Canned Replies</div>
                                    <div className="grid gap-1 max-h-48 overflow-y-auto pr-2 [scrollbar-width:thin]">
                                        {cannedReplies.map((r, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSend(r.value)}
                                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all text-slate-600 truncate"
                                            >
                                                {r.label}: <span className="font-medium opacity-60 italic">{r.value}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowCanned(!showCanned)}
                                    className={`size-12 rounded-2xl flex items-center justify-center transition-all ${showCanned ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
                                >
                                    <Sparkles size={20} />
                                </button>
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        className="w-full h-12 bg-slate-50 px-6 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white border border-slate-100 text-sm font-bold placeholder:text-slate-300"
                                        placeholder="Type your response..."
                                        value={inputText}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleSend()}
                                    disabled={!inputText.trim()}
                                    className="size-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
                        <Bot size={80} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Select a Session</h3>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showCloseConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 p-6">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="size-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Archive Chat?</h3>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">This will move the conversation to history and disconnect the user.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowCloseConfirm(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                            <button onClick={handleClose} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-100">Archive</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveChatPage;
