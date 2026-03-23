"use client";

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { User, MessageCircle, Send, Clock, CheckCircle, AlertCircle, Loader2, Volume2, VolumeX, BellRing, BellOff, Sparkles, ChevronUp, ChevronDown, Bot, MoreVertical, Settings } from 'lucide-react';
import Toast from '@/components/admin/ui/Toast';
import { chatService } from '@/components/admin/services/chat.service';
import { format } from 'date-fns';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '').replace(/\/$/, '');

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
    const [showSettings, setShowSettings] = useState(false);
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
        if (!isSoundEnabled) return;
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

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) return;
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    const triggerNotification = (title, body, force = false) => {
        playNotificationSound();
        if (Notification.permission === "granted" && (document.hidden || force)) {
            try {
                new Notification(title, { body, icon: "/tridev-logo.png", silent: true });
            } catch (e) {}
        }
    };

    useEffect(() => {
        triggerNotificationRef.current = triggerNotification;
    });

    useEffect(() => {
        if ("Notification" in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

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
        const user = JSON.parse((typeof window !== "undefined" ? (typeof window !== "undefined" ? localStorage.getItem('user') : null) : null) || '{}');
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
                    return exists ? prev.map(c => c.visitorId === updatedChat.visitorId ? updatedChat : c) : [updatedChat, ...prev].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                });
            });

            socket.on('visitor_typing', ({ visitorId }) => setVisitorTyping(prev => ({ ...prev, [visitorId]: true })));
            socket.on('visitor_stop_typing', ({ visitorId }) => setVisitorTyping(prev => ({ ...prev, [visitorId]: false })));

            socket.on('active_chats_initial', (initial) => {
                if (Array.isArray(initial)) {
                    setChats(initial.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
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
            <div className="lg:col-span-1 flex flex-col gap-4 min-h-0 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-3 relative">
                
                {/* Header Controls */}
                <div className="p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-50 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                            <MessageCircle size={20} className="fill-indigo-600/20" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight leading-none">Live Sessions</h3>
                            <div className="flex items-center gap-1.5 mt-1 opacity-75">
                                <div className={`size-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{isConnected ? 'Online' : 'Reconnecting...'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`size-10 rounded-xl flex items-center justify-center transition-all ${showSettings ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-400 border border-slate-200'}`}
                    >
                        <Settings size={18} />
                    </button>
                </div>

                {/* Settings Dropdown */}
                {showSettings && (
                    <div className="absolute top-[88px] right-4 left-4 bg-white border border-slate-100 shadow-2xl rounded-[1.5rem] p-5 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isSoundEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                        {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Sound Alerts</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">For new messages</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { setIsSoundEnabled(!isSoundEnabled); if(!isSoundEnabled) playNotificationSound(volume); }}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${isSoundEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isSoundEnabled ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                            
                            {isSoundEnabled && (
                                <div className="pl-[52px]">
                                    <input 
                                        type="range" min="0" max="1" step="0.1" value={volume} 
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            )}

                            <div className="h-px bg-slate-100 w-full" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${notificationPermission === 'granted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {notificationPermission === 'granted' ? <BellRing size={16} /> : <BellOff size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{notificationPermission}</p>
                                    </div>
                                </div>
                                {notificationPermission !== 'granted' && (
                                    <button 
                                        onClick={requestNotificationPermission}
                                        className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                                    >
                                        Allow
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between px-2 pt-2 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {chats.filter(c => c.status !== 'closed').length} ACTIVE
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2 [scrollbar-width:thin]">
                    {chats.filter(c => c.status !== 'closed').map(chat => {
                        const lastMsg = chat.messages?.[chat.messages.length - 1];
                        let MsgDate = new Date();
                        try {
                            const rawDate = lastMsg?.timestamp || chat.updatedAt;
                            if (rawDate) MsgDate = new Date(rawDate);
                            if (isNaN(MsgDate)) MsgDate = new Date();
                        } catch (e) {}

                        const isUnread = lastMessageCountRef.current[chat.visitorId] < (chat.messages?.length || 0);

                        return (
                        <button
                            key={chat.visitorId}
                            onClick={() => { setActiveChatId(chat.visitorId); lastMessageCountRef.current[chat.visitorId] = chat.messages?.length || 0; }}
                            className={`w-full text-left p-3.5 rounded-2xl transition-all border group relative overflow-hidden
                                ${activeChatId === chat.visitorId 
                                    ? 'bg-slate-900 border-slate-800 text-white shadow-lg' 
                                    : isUnread 
                                        ? 'bg-indigo-50 border-indigo-100/50' 
                                        : 'bg-slate-50 hover:bg-slate-100 border-transparent'}`}
                        >
                            {isUnread && activeChatId !== chat.visitorId && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                            )}
                            <div className="flex items-start gap-3">
                                <div className={`relative size-12 rounded-[1rem] flex items-center justify-center font-black shadow-sm shrink-0
                                    ${activeChatId === chat.visitorId ? 'bg-white/10 text-white' : 'bg-white text-slate-700'}`}>
                                    {chat.name?.charAt(0) || 'V'}
                                    {chat.status === 'active' && <div className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 border-2 border-white rounded-full z-10" />}
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={`font-black text-sm truncate uppercase tracking-tight ${activeChatId === chat.visitorId ? 'text-white' : 'text-slate-900'}`}>{chat.name || 'Visitor'}</h4>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${activeChatId === chat.visitorId ? 'text-slate-400' : 'text-slate-400'}`}>
                                            {format(MsgDate, 'HH:mm')}
                                        </span>
                                    </div>
                                    <p className={`text-[11px] font-medium truncate mb-1 ${activeChatId === chat.visitorId ? 'text-slate-300' : isUnread ? 'text-indigo-900 font-bold' : 'text-slate-500'}`}>
                                        {visitorTyping[chat.visitorId] ? <span className="text-indigo-500 animate-pulse italic">typing...</span> : (lastMsg?.text || 'No messages')}
                                    </p>
                                    {chat.email && <p className={`text-[9px] font-bold uppercase tracking-widest truncate opacity-50 ${activeChatId === chat.visitorId ? 'text-indigo-200' : ''}`}>{chat.email}</p>}
                                </div>
                            </div>
                        </button>
                    )})}
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative h-full">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 backdrop-blur-xl bg-white/90 sticky top-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-inner">
                                        <User size={24} className="opacity-50" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 border-2 border-white rounded-full" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeChat.name || 'Visitor'}</h2>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest">Web</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>{activeChat.email || 'No email'}</span>
                                        {activeChat.phone && <><span>•</span><span>{activeChat.phone}</span></>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isClaimedByMe && (
                                    <button onClick={() => setShowCloseConfirm(true)} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all border border-red-100 hover:border-red-600 shadow-sm">
                                        End Session
                                    </button>
                                )}
                                {!activeChat.assignedTo && (
                                    <button onClick={handleClaim} className="px-6 py-2.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wide shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                                        <span>Join Chat</span>
                                        <CheckCircle size={14} />
                                    </button>
                                )}
                                <button className="size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
                            {activeChat.messages.map((msg, idx) => {
                                const isAdminMsg = msg.isAdmin;
                                const isBotMsg = msg.sender === 'bot';
                                let msgTime = '';
                                try {
                                    if (msg.timestamp) {
                                        const d = new Date(msg.timestamp);
                                        if (!isNaN(d)) msgTime = format(d, 'h:mm a');
                                    }
                                } catch (e) {}
                                
                                return (
                                <div key={idx} className={`flex ${isAdminMsg ? 'justify-end' : isBotMsg ? 'justify-center' : 'justify-start'}`}>
                                    <div className={`flex flex-col ${isAdminMsg ? 'items-end' : isBotMsg ? 'items-center' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                                        
                                        {!isAdminMsg && !isBotMsg && idx === 0 && (
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{activeChat.name || 'Visitor'}</span>
                                        )}

                                        <div className={`relative px-5 py-3.5 text-sm font-medium shadow-sm border
                                            ${isBotMsg 
                                                ? 'bg-amber-50 border-amber-200 text-amber-900 rounded-2xl mx-auto flex items-center gap-2' 
                                                : isAdminMsg 
                                                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-[1.5rem] rounded-br-sm shadow-indigo-100' 
                                                    : 'bg-white text-slate-700 border-slate-100 rounded-[1.5rem] rounded-bl-sm'}`}
                                        >
                                            {isBotMsg && <Bot size={16} className="text-amber-500 shrink-0" />}
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        </div>
                                        
                                        {!isBotMsg && (
                                            <div className="flex items-center gap-1.5 mt-1.5 mx-1 opacity-70">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{msgTime}</span>
                                                {isAdminMsg && <CheckCircle size={10} className="text-emerald-500" />}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )})}
                            
                            {visitorTyping[activeChatId] && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                                        <div className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* Input & Canned Replies Area */}
                        <div className="p-4 md:p-6 bg-white border-t border-slate-100 relative shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
                            {showCanned && (
                                <div className="absolute bottom-[calc(100%+12px)] left-6 right-6 bg-white border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-2 animate-in slide-in-from-bottom-2 duration-300 z-50">
                                    <div className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 flex items-center justify-between">
                                        <span>Canned Replies</span>
                                        <button onClick={() => setShowCanned(false)} className="hover:text-slate-900"><ChevronDown size={14}/></button>
                                    </div>
                                    <div className="grid gap-1 min-h-[50px] max-h-48 overflow-y-auto p-2 [scrollbar-width:thin]">
                                        {cannedReplies.length === 0 ? (
                                            <div className="text-center p-4 text-xs font-medium text-slate-400 italic">No canned replies available - add them in Settings</div>
                                        ) : cannedReplies.map((r, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSend(r.value)}
                                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all text-slate-700 truncate group border border-transparent hover:border-slate-100"
                                            >
                                                <span className="text-indigo-600 mr-2 group-hover:underline">{r.label}:</span> 
                                                <span className="font-medium opacity-60 italic">{r.value}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isClaimedByMe ? (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowCanned(!showCanned)}
                                        className={`size-12 md:size-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${showCanned ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 border border-slate-100'}`}
                                        title="Canned Replies"
                                    >
                                        <Sparkles size={20} className={showCanned ? 'fill-white/20' : ''} />
                                    </button>
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" 
                                            className="w-full h-12 md:h-14 bg-slate-50 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white border border-slate-200 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium transition-all shadow-inner"
                                            placeholder="Type your message here..."
                                            value={inputText}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleSend()}
                                        disabled={!inputText.trim()}
                                        className="size-12 md:size-14 shrink-0 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:shadow-none disabled:bg-slate-200 disabled:text-slate-400"
                                    >
                                        <Send size={20} className={inputText.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-12 md:h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 uppercase tracking-widest shadow-inner">
                                    Join chat to reply
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-200 relative overflow-hidden bg-slate-50/50">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 border border-slate-100">
                                <MessageCircle size={40} className="text-slate-300 fill-slate-100" />
                            </div>
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">Ready to Connect</h3>
                            <p className="text-sm font-medium text-slate-400 max-w-xs text-center leading-relaxed">Select a session from the sidebar to view chat history and assist your visitors.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Close Chat Modal */}
            {showCloseConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-6">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="size-20 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">End Session?</h3>
                        <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">This will move the conversation to the history tab and optionally send the visitor a transcript.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowCloseConfirm(false)} className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl font-black uppercase tracking-wide transition-colors">Go Back</button>
                            <button onClick={handleClose} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-wide shadow-xl shadow-red-200 transition-colors">End Session</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveChatPage;







