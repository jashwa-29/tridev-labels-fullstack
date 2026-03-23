import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Trash2, 
  Eye, 
  Search, 
  Calendar, 
  Tag, 
  Database,
  RefreshCcw,
  ArrowRight,
  AlertCircle,
  FileText,
  Package,
  X
} from 'lucide-react';
import { historyService } from '@/services/history.service';
import { Toast, DeleteModal, Pagination } from '@/components';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await historyService.getAll({ page, limit });
      setHistory(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to load history', err);
      showToast('Critical system sync failure. Audit logs offline.', 'error');
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

  const handleDelete = async () => {
    try {
      await historyService.delete(deleteId);
      showToast('Audit record purged from core memory.');
      fetchHistory();
    } catch (err) {
      showToast('Purge failed. Protocol protection active.', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const filteredHistory = history.filter(h => 
    h.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Toast type="error" message={toast.type === 'error' ? toast.message : ''} onClose={() => setToast({ ...toast, show: false })} />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter">Operational History</h1>
          <p className="mt-2 text-slate-500 font-medium">Complete audit trail and system state modifications.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !h-12 pl-12 w-64 !bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>
          <button 
            onClick={fetchHistory}
            className="size-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center border border-slate-100"
            title="Refresh Logs"
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
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-black leading-none">Activity Stream</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Logs: {total}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Module</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Identifier</th>
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
                       <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Logs...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-sm font-black text-slate-300 uppercase tracking-widest">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((record) => (
                  <tr key={record._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${record.modelName === 'Blog' ? 'bg-black' : 'bg-slate-400'}`}>
                          {record.modelName === 'Blog' ? <FileText size={18} /> : <Package size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-black leading-none">{record.modelName}</p>
                          <p className="text-xs font-bold text-slate-400 mt-2 truncate max-w-[150px]">
                            {record.data.title || record.data.pageTitle || record.data.cardTitle || 'ID: ' + record.originalId.substring(0,8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                        ${record.action === 'Delete' 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}
                      >
                        {record.action}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-mono text-[10px] font-black text-slate-300">
                       #{record._id.substring(record._id.length - 8)}
                    </td>
                    <td className="px-8 py-6 text-right relative">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex flex-col items-end group-hover:hidden">
                           <p className="text-[11px] font-black text-black">
                             {new Date(record.timestamp).toLocaleDateString()}
                           </p>
                           <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                             {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all duration-300">
                          <button 
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowModal(true);
                            }}
                            className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-black hover:border-black transition-all shadow-sm"
                            title="Inspect State"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setDeleteId(record._id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all shadow-sm"
                            title="Purge Log"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

      {/* Snapshot Modal - Quotes Style */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="border-b border-slate-100 p-8 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl">
                  <Database size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Record Snapshot</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Immutable Activity Detail</p>
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
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Calendar size={12} /> Execution Time
                  </label>
                  <p className="text-sm font-black text-slate-900 bg-slate-50 rounded-xl p-4">
                    {new Date(selectedRecord.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Tag size={12} /> State Operation
                  </label>
                  <p className={`text-sm font-black rounded-xl p-4 border ${selectedRecord.action === 'Delete' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {selectedRecord.action}
                  </p>
                </div>
              </div>

              {/* Data Archive */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText size={12} /> Payload Archive
                  </label>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest font-mono">Format: JSON</span>
                </div>
                <div className="bg-slate-900 rounded-[1.5rem] p-8 overflow-hidden relative group">
                  <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 max-h-[300px]">
                    {JSON.stringify(selectedRecord.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-8 bg-white flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 italic uppercase tracking-widest">
                Captured at time of {selectedRecord.action.toLowerCase()}
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn-primary min-w-[140px] shadow-xl shadow-red-200"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDelete={handleDelete} 
        title="Confirm Data Purge"
        description="This operational log entry will be permanently removed from the system audit trail. This is a secure deletion."
      />

      {/* Understated Toast */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
    </div>
  );
};

export default HistoryPage;
