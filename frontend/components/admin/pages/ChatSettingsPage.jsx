"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, MessageCircle, User, Bot, AlertCircle, Loader2, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import { chatService } from '@/components/admin/services/chat.service';
import { Toast } from '@/components/admin/ui';

const ChatSettingsPage = () => {
    const [visitorFaqs, setVisitorFaqs] = useState([]);
    const [adminCanned, setAdminCanned] = useState([]);
    const [adminCommands, setAdminCommands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('visitor');
    const [collapsedPaths, setCollapsedPaths] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const [faqsRes, cannedRes, commandsRes] = await Promise.all([
                chatService.getSettings('visitor_faqs'),
                chatService.getSettings('admin_canned_replies'),
                chatService.getSettings('admin_commands')
            ]);

            if (faqsRes.success) setVisitorFaqs(faqsRes.data || []);
            if (cannedRes.success) setAdminCanned(cannedRes.data || []);
            if (commandsRes.success) setAdminCommands(commandsRes.data || []);
        } catch (err) {
            console.error(err);
            showToast("Failed to load settings.", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    // --- RECURSIVE HELPERS ---

    const updateDeepFaq = (list, path, field, val) => {
        const newList = JSON.parse(JSON.stringify(list));
        let current = newList;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].followUps;
        }
        current[path[path.length - 1]][field] = val;
        return newList;
    };

    const addDeepFollowUp = (list, path) => {
        const newList = JSON.parse(JSON.stringify(list));
        let current = newList;
        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                if (!current[path[i]].followUps) current[path[i]].followUps = [];
                current[path[i]].followUps.push({ label: '', value: '', answer: '', followUps: [] });
            } else {
                current = current[path[i]].followUps;
            }
        }
        return newList;
    };

    const removeDeepFaq = (list, path) => {
        const newList = JSON.parse(JSON.stringify(list));
        let current = newList;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].followUps;
        }
        current.splice(path[path.length - 1], 1);
        return newList;
    };

    const addItem = (type) => {
        if (type === 'visitor') setVisitorFaqs([...visitorFaqs, { label: '', value: '', answer: '', followUps: [] }]);
        else if (type === 'canned') setAdminCanned([...adminCanned, { label: '', value: '' }]);
        else if (type === 'commands') setAdminCommands([...adminCommands, { label: '', value: '' }]);
    };

    const removeItem = (type, index) => {
        if (type === 'visitor') setVisitorFaqs(visitorFaqs.filter((_, i) => i !== index));
        else if (type === 'canned') setAdminCanned(adminCanned.filter((_, i) => i !== index));
        else if (type === 'commands') setAdminCommands(adminCommands.filter((_, i) => i !== index));
    };

    const updateItem = (type, index, field, val, path = null) => {
        if (type === 'visitor') {
            if (path) setVisitorFaqs(updateDeepFaq(visitorFaqs, path, field, val));
            else {
                const newList = [...visitorFaqs];
                newList[index][field] = val;
                setVisitorFaqs(newList);
            }
        } else if (type === 'canned') {
            const newList = [...adminCanned];
            newList[index][field] = val;
            setAdminCanned(newList);
        } else if (type === 'commands') {
            const newList = [...adminCommands];
            newList[index][field] = val;
            setAdminCommands(newList);
        }
    };

    const toggleCollapse = (pathKey) => {
        setCollapsedPaths(prev => ({ ...prev, [pathKey]: !prev[pathKey] }));
    };

    const handleSave = async (key) => {
        setSaving(true);
        let value;
        if (key === 'visitor_faqs') value = visitorFaqs;
        else if (key === 'admin_canned_replies') value = adminCanned;
        else if (key === 'admin_commands') value = adminCommands;

        try {
            const res = await chatService.updateSettings({ key, value });
            if (res.success) showToast("Settings updated successfully!");
        } catch (err) { showToast("Failed to save.", "error"); }
        finally { setSaving(false); }
    };

    // --- RECURSIVE RENDERER ---

    const renderFaqItem = (faq, idx, path = []) => {
        const currentPath = [...path, idx];
        const pathKey = currentPath.join('-');
        const isNested = path.length > 0;
        const isCollapsed = collapsedPaths[pathKey];
        
        const depthColors = ['border-indigo-100 bg-indigo-50/20', 'border-emerald-100 bg-emerald-50/20', 'border-amber-100 bg-amber-50/20'];
        const colorClass = depthColors[Math.min(path.length, depthColors.length - 1)];

        return (
            <div key={pathKey} className={`rounded-2xl border-2 mb-4 overflow-hidden transition-all ${colorClass} ${isNested ? 'ml-8 border-dashed' : 'border-slate-100 shadow-sm'}`}>
                <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/50 transition-colors"
                    onClick={() => toggleCollapse(pathKey)}
                >
                    <div className="flex items-center gap-3">
                        <div className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-90'}`}>
                            <ChevronRight size={18} className="text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest leading-none mb-1">
                                {isNested ? `Branch Level ${path.length}` : 'Core Category'}
                            </span>
                            <span className="text-sm font-bold text-slate-700">{faq.label || 'Untitled Pathway'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isNested) setVisitorFaqs(removeDeepFaq(visitorFaqs, currentPath));
                                else removeItem('visitor', idx);
                            }}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {!isCollapsed && (
                    <div className="p-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Label</label>
                                <input 
                                    type="text" 
                                    value={faq.label}
                                    onChange={(e) => updateItem('visitor', idx, 'label', e.target.value, isNested ? currentPath : null)}
                                    placeholder="Button text..."
                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Trigger Value</label>
                                <input 
                                    type="text" 
                                    value={faq.value}
                                    onChange={(e) => updateItem('visitor', idx, 'value', e.target.value, isNested ? currentPath : null)}
                                    placeholder="Internal ID..."
                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Bot Answer</label>
                            <textarea 
                                value={faq.answer}
                                onChange={(e) => updateItem('visitor', idx, 'answer', e.target.value, isNested ? currentPath : null)}
                                placeholder="Auto-reply text... Leave empty for Menu Only flow."
                                rows="2"
                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none resize-none"
                            />
                        </div>

                        {/* Branching */}
                        <div className="mt-4 pt-4 border-t border-slate-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Downstream Pathways</span>
                                <button 
                                    onClick={() => setVisitorFaqs(addDeepFollowUp(visitorFaqs, currentPath))}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase shadow-sm hover:scale-105 transition-all"
                                >
                                    <Plus size={12} strokeWidth={3} /> Add Branch
                                </button>
                            </div>
                            {faq.followUps?.length > 0 ? (
                                <div className="space-y-1">
                                    {faq.followUps.map((sub, sIdx) => renderFaqItem(sub, sIdx, currentPath))}
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center opacity-40">
                                    <span className="text-[9px] font-black uppercase tracking-widest">End of Journey</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="flex justify-center p-20 animate-pulse text-slate-300 font-black uppercase tracking-widest text-xs">Syncing Registry...</div>;

    return (
        <div className="space-y-8 pb-20">
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Messaging Automation</h1>
                    <p className="text-slate-500 font-medium">Configure nested bot flows, button triggers, and agent shortcuts.</p>
                </div>
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-100">
                    {['visitor', 'canned', 'commands'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {t === 'visitor' ? 'Flows' : t === 'canned' ? 'Canned' : 'Shortcuts'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                            {activeTab === 'visitor' ? <Bot size={22} /> : activeTab === 'canned' ? <MessageCircle size={22} /> : <Sparkles size={22} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab} Configuration</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {activeTab === 'visitor' ? 'Multi-level branching for bot automation' : 'Instant responses for manual sessions'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleSave(activeTab === 'visitor' ? 'visitor_faqs' : activeTab === 'canned' ? 'admin_canned_replies' : 'admin_commands')}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {saving ? 'Syncing...' : 'Sync Config'}
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'visitor' && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-6">
                                <button onClick={() => addItem('visitor')} className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase transition-all">
                                    <Plus size={14} strokeWidth={3} /> Add Core Category
                                </button>
                            </div>
                            {visitorFaqs.map((faq, idx) => renderFaqItem(faq, idx))}
                        </div>
                    )}

                    {(activeTab === 'canned' || activeTab === 'commands') && (
                        <div className="grid gap-4">
                            <div className="flex justify-end mb-4">
                                <button onClick={() => addItem(activeTab)} className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase transition-all">
                                    <Plus size={14} strokeWidth={3} /> New Entry
                                </button>
                            </div>
                            {(activeTab === 'canned' ? adminCanned : adminCommands).map((item, idx) => (
                                <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                                    <div className="flex gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-400">Trigger/Label</label>
                                                    <input 
                                                        type="text" 
                                                        value={item.label}
                                                        onChange={(e) => updateItem(activeTab, idx, 'label', e.target.value)}
                                                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                                                    />
                                                </div>
                                                <div className="flex-[2] space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-400">Content</label>
                                                    <textarea 
                                                        value={item.value}
                                                        onChange={(e) => updateItem(activeTab, idx, 'value', e.target.value)}
                                                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium outline-none resize-none"
                                                        rows="2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeItem(activeTab, idx)} className="p-3 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatSettingsPage;






