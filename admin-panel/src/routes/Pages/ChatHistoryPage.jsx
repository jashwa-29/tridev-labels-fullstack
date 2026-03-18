import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Eye, 
  Search, 
  RefreshCcw, 
  Calendar,
  User,
  Clock,
  MessageCircle,
  X,
  Bot
} from 'lucide-react';
import { chatService } from '@/services/chat.service';
import { Toast, Pagination } from '@/components';

const ChatHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await chatService.getHistory({ page, limit });
      setHistory(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to load chat history', err);
      showToast('System Sync Failure: Chat archives unavailable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const filteredHistory = history.filter(h => 
    (h.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.visitorId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Toast type="error" message={toast.type === 'error' ? toast.message : ''} onClose={() => setToast({ ...toast, show: false })} />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">Conversation History</h1>
          <p className="mt-2 text-slate-500 font-medium">Archived visitor transcripts and interaction logs.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter archives..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !h-12 pl-12 w-64 !bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>
          <button 
            onClick={fetchHistory}
            className="size-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center border border-slate-100"
            title="Refresh Archives"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-black leading-none">Archived Material</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Records: {total}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Visitor Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Payload</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Assigned Logic</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Synchronization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                         <RefreshCcw className="animate-spin" size={24} />
                       </div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Archive...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No Interaction Records Found</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((chat) => (
                  <tr key={chat._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-red-200">
                          {chat.name?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-black leading-none">{chat.name || 'Anonymous Visitor'}</p>
                          <p className="text-xs font-bold text-slate-400 mt-2">{chat.email || 'ID: ' + chat.visitorId.substring(0, 15)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex px-3 py-1 bg-slate-100 text-black text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {chat.messages.length} Units
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {chat.assignedTo ? (
                        <div className="flex items-center justify-center gap-2">
                           <div className="size-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                             <User size={12} />
                           </div>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{chat.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">System Flow</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right relative">
                      <div className="flex items-center justify-end gap-4">
                        <div className="flex flex-col items-end group-hover:hidden">
                           <p className="text-[11px] font-black text-black">
                             {new Date(chat.updatedAt).toLocaleDateString()}
                           </p>
                           <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                             {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedChat(chat);
                            setShowModal(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 btn-primary !h-10 !px-4 !text-[10px] shadow-lg shadow-red-100"
                        >
                          <Eye size={14} />
                          <span>View Transcript</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {total > limit && (
          <div className="p-8 border-t border-slate-50 bg-slate-50/30">
            <Pagination 
              currentPage={page} 
              totalItems={total} 
              itemsPerPage={limit} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>

      {/* Transcript Modal - Quotes Style */}
      {showModal && selectedChat && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="border-b border-slate-100 p-8 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-200">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedChat.name || 'Anonymous Visitor'}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Interaction Transcript</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="size-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-black transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col h-[60vh]">
              {/* Metadata Sub-header */}
              <div className="px-8 py-4 bg-white border-b border-slate-50 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center"><Clock size={14} /></div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Captured On</p>
                    <p className="text-[10px] font-black text-black">{new Date(selectedChat.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center"><User size={14} /></div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reference ID</p>
                    <p className="text-[10px] font-black text-black truncate max-w-[150px]">{selectedChat.visitorId}</p>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                {selectedChat.messages.map((msg, idx) => {
                  const isBot = msg.sender === 'bot';
                  const isAdmin = msg.isAdmin;

                  if (isBot) {
                    return (
                      <div key={idx} className="flex justify-center">
                        <div className="px-4 py-2 bg-slate-200/50 rounded-full text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                          <Bot size={12} />
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] space-y-2`}>
                        <div className={`rounded-2xl px-5 py-4 text-sm font-medium shadow-sm border
                          ${isAdmin 
                            ? 'bg-black text-white border-black rounded-tr-none' 
                            : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <p className={`text-[8px] font-black uppercase tracking-widest text-slate-400 ${isAdmin ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-8 bg-white flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn-primary min-w-[140px] shadow-xl shadow-red-200"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryPage;
