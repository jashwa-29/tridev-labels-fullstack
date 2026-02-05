import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { 
  FileText, 
  Phone, 
  User, 
  MessageSquare, 
  Calendar,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  Circle,
  X,
  Building,
  Layers,
  Search
} from "lucide-react";
import { Toast, DeleteModal } from '@/components';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const API_URL = import.meta.env.VITE_API_BASE_URL;

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, read, unread

  const token = localStorage.getItem("token");

  // Fetch quotes from API
  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/api/quotes?source=service`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(res.data.data || []);
    } catch (err) {
      setError("Failed to load quote requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Update quote status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/api/quotes/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(prev => prev.map(q => q._id === id ? { ...q, status } : q));
      setSuccess("Status updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  // Delete quote
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await axios.delete(`${API_URL}/api/quotes/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(prev => prev.filter(q => q._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      setSuccess("Quote deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete quote.");
      setShowDeleteModal(false);
    }
  };

  // Action cell renderer
  const ActionCellRenderer = (props) => {
    return (
      <div className="flex items-center gap-2 h-full">
        <button
          onClick={() => {
            setSelectedQuote(props.data);
            setShowDetailModal(true);
          }}
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
          title="View Details"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => handleDeleteClick(props.data._id)}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  };

  // Status cell renderer
  const StatusCellRenderer = (props) => {
    const isRead = props.value === 'read';
    return (
      <button
        onClick={() => updateStatus(props.data._id, isRead ? 'unread' : 'read')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
          isRead 
            ? 'bg-green-50 text-green-700 hover:bg-green-100' 
            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
        }`}
      >
        {isRead ? <CheckCircle size={14} /> : <Circle size={14} />}
        {isRead ? 'Read' : 'Unread'}
      </button>
    );
  };

  // Date cell renderer
  const DateCellRenderer = (props) => {
    const date = new Date(props.value);
    return (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-xs text-slate-500">
          {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    );
  };

  // Service badge renderer
  const ServiceCellRenderer = (props) => {
    const service = props.value || 'General Inquiry';
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
        <Layers size={12} />
        {service}
      </span>
    );
  };

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      width: 130,
      filter: true,
      sortable: true,
    },
    {
      headerName: "Name",
      field: "name",
      filter: true,
      sortable: true,
      width: 180,
      cellStyle: { fontWeight: '600' }
    },
    {
      headerName: "Company",
      field: "company",
      filter: true,
      sortable: true,
      width: 180,
      cellRenderer: (props) => {
        return props.value ? (
          <div className="flex items-center gap-2">
            <Building size={14} className="text-slate-400" />
            <span className="text-sm">{props.value}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-sm italic">N/A</span>
        );
      }
    },
    {
      headerName: "Email",
      field: "email",
      filter: true,
      sortable: true,
      width: 220,
    },
    {
      headerName: "Phone",
      field: "phone",
      filter: true,
      sortable: true,
      width: 150,
    },
    {
      headerName: "Service Interest",
      field: "service",
      filter: true,
      sortable: true,
      width: 200,
      cellRenderer: ServiceCellRenderer,
    },
    {
      headerName: "Message Preview",
      field: "message",
      filter: true,
      width: 250,
      cellRenderer: (props) => {
        const message = props.value || '';
        return (
          <div className="text-sm text-slate-600 truncate" title={message}>
            {message.substring(0, 50)}{message.length > 50 ? '...' : ''}
          </div>
        );
      }
    },
    {
      headerName: "Received",
      field: "createdAt",
      cellRenderer: DateCellRenderer,
      sortable: true,
      sort: 'desc',
      width: 150,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      width: 120,
      pinned: 'right',
      sortable: false,
      filter: false,
    },
  ], []);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  // Filtered quotes based on search and status
  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      // Status filter
      if (statusFilter !== 'all' && quote.status !== statusFilter) {
        return false;
      }
      
      // Search filter
      if (searchText) {
        const search = searchText.toLowerCase();
        return (
          quote.name?.toLowerCase().includes(search) ||
          quote.email?.toLowerCase().includes(search) ||
          quote.phone?.toLowerCase().includes(search) ||
          quote.company?.toLowerCase().includes(search) ||
          quote.service?.toLowerCase().includes(search) ||
          quote.message?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  }, [quotes, searchText, statusFilter]);

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Status', 'Name', 'Company', 'Email', 'Phone', 'Service Interest', 'Message', 'Received'],
      ...filteredQuotes.map(q => [
        q.status,
        q.name,
        q.company || '',
        q.email,
        q.phone,
        q.service || '',
        q.message,
        new Date(q.createdAt).toLocaleString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toast Notifications */}
      <Toast type="success" message={success} />
      <Toast type="error" message={error} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title">Quote Requests</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage customer quote requests from service pages.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchQuotes}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Quotes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{quotes.length}</p>
            </div>
            <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {quotes.filter(q => q.status === 'unread').length}
              </p>
            </div>
            <div className="size-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Circle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Processed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {quotes.filter(q => q.status === 'read').length}
              </p>
            </div>
            <div className="size-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone, company, service, or message..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-2">Filter:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({quotes.length})
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                statusFilter === 'unread'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <Circle size={14} />
              Pending ({quotes.filter(q => q.status === 'unread').length})
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                statusFilter === 'read'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <CheckCircle size={14} />
              Processed ({quotes.filter(q => q.status === 'read').length})
            </button>
          </div>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={filteredQuotes}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            rowHeight={60}
            animateRows={true}
            loading={loading}
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading quotes...</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">No quote requests found</span>'
          />
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedQuote && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowDetailModal(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedQuote.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Quote Request Details</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <User size={14} /> Name
                  </label>
                  <p className="text-sm font-medium text-slate-900 bg-slate-50 rounded-lg p-3">
                    {selectedQuote.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Building size={14} /> Company
                  </label>
                  <p className="text-sm font-medium text-slate-900 bg-slate-50 rounded-lg p-3">
                    {selectedQuote.company || 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Phone size={14} /> Phone
                  </label>
                  <p className="text-sm font-medium text-slate-900 bg-slate-50 rounded-lg p-3">
                    {selectedQuote.phone}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Phone size={14} /> Email
                  </label>
                  <p className="text-sm font-medium text-slate-900 bg-slate-50 rounded-lg p-3">
                    {selectedQuote.email}
                  </p>
                </div>
              </div>

              {selectedQuote.service && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Layers size={14} /> Service Interest
                  </label>
                  <p className="text-sm font-medium text-slate-900 bg-red-50 rounded-lg p-3 border border-red-100">
                    {selectedQuote.service}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MessageSquare size={14} /> Message / Requirements
                </label>
                <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.message}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Calendar size={14} /> Received
                </label>
                <p className="text-sm font-medium text-slate-900 bg-slate-50 rounded-lg p-3">
                  {new Date(selectedQuote.createdAt).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 flex gap-3 justify-end">
              <button
                onClick={() => {
                  updateStatus(selectedQuote._id, selectedQuote.status === 'read' ? 'unread' : 'read');
                  setSelectedQuote({ ...selectedQuote, status: selectedQuote.status === 'read' ? 'unread' : 'read' });
                }}
                className="btn-secondary"
              >
                Mark as {selectedQuote.status === 'read' ? 'Pending' : 'Processed'}
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Quote?"
        message="Are you sure you want to delete this quote request? This action cannot be undone."
      />
    </div>
  );
};

export default QuotesPage;
