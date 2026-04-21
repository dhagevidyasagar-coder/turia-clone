import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  User,
  Calendar,
  Tag,
  ArrowRight,
  X,
  Zap,
  ShieldCheck,
  LayoutGrid,
  List,
  CheckSquare,
  FileText,
  Building2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  deadline: string;
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  client?: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'TDS Quarterly Return', client: 'Reliance Industries', category: 'TDS / TCS', priority: 'High', deadline: '31st May', assignee: 'Sarah', status: 'To Do' },
    { id: 2, title: 'GST-3B Monthly Filing', client: 'Zomato Operations', category: 'GST', priority: 'High', deadline: '20th Apr', assignee: 'Mehul', status: 'In Progress' },
    { id: 3, title: 'MCA Annual Filing', client: 'Tata Consultancy', category: 'MCA', priority: 'Critical', deadline: '30th Oct', assignee: 'Rahul', status: 'To Do' },
    { id: 4, title: 'Advance Tax Payment', client: 'Infosys Ltd', category: 'Income tax', priority: 'Medium', deadline: '15th Jun', assignee: 'Priya', status: 'To Do' },
  ]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'GST', 'MCA', 'TDS / TCS', 'Income tax', 'Audit', 'Compliance'];
  const statusColumns: Task['status'][] = ['To Do', 'In Progress', 'Completed'];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'badge-pink';
      case 'High': return 'badge-pink';
      case 'Medium': return 'badge-blue';
      default: return 'badge-green';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return 'var(--brand-blue)';
      default: return 'var(--text-secondary)';
    }
  };

  const filteredTasks = tasks.filter(t => 
    (activeCategory === 'All' || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.client?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', padding: '0 8px' }}>
        <div>
          <h1 className="display-serif" style={{ fontSize: '42px', marginBottom: '8px' }}>Firm Workflow</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: '600' }}>Manage statutory deliverables and practitioner assignments.</p>
        </div>
        <button className="premium-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={20} strokeWidth={3} /> Provision New Task
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="card" style={{ padding: '24px 32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckSquare size={24} color="var(--brand-blue)" />
                <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Active Tasks</p>
                    <p style={{ fontSize: '18px', fontWeight: '800' }}>{tasks.filter(t => t.status !== 'Completed').length}</p>
                </div>
            </div>
            <div style={{ padding: '0 48px', borderLeft: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={24} color="#f59e0b" />
                <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Due Today</p>
                    <p style={{ fontSize: '18px', fontWeight: '800' }}>3</p>
                </div>
            </div>
            <div style={{ padding: '0 48px', borderLeft: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={24} color="#10b981" />
                <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>Compliance Rate</p>
                    <p style={{ fontSize: '18px', fontWeight: '800' }}>94.2%</p>
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                    type="text" placeholder="Search tasks or clients..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '48px', width: '280px' }} 
                />
            </div>
            <div style={{ display: 'flex', background: 'var(--background)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-strong)' }}>
                <button 
                  onClick={() => setViewMode('board')}
                  style={{ padding: '8px', background: viewMode === 'board' ? 'white' : 'transparent', borderRadius: '6px', color: viewMode === 'board' ? 'var(--brand-blue)' : 'var(--text-secondary)', boxShadow: viewMode === 'board' ? 'var(--shadow-sm)' : 'none' }}
                ><LayoutGrid size={18} /></button>
                <button 
                  onClick={() => setViewMode('list')}
                  style={{ padding: '8px', background: viewMode === 'list' ? 'white' : 'transparent', borderRadius: '6px', color: viewMode === 'list' ? 'var(--brand-blue)' : 'var(--text-secondary)', boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none' }}
                ><List size={18} /></button>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '800',
              background: activeCategory === cat ? 'var(--primary)' : 'transparent',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              transition: '0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content View */}
      {viewMode === 'board' ? (
        <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '32px' }} className="hide-scrollbar">
          {statusColumns.map(status => (
            <div key={status} style={{ minWidth: '360px', width: '360px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(status) }} />
                    <h3 className="ui-heading" style={{ fontSize: '14px', textTransform: 'uppercase' }}>{status}</h3>
                 </div>
                 <span style={{ fontSize: '12px', fontWeight: '800', opacity: 0.5 }}>{filteredTasks.filter(t => t.status === status).length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredTasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span className={`badge ${getPriorityBadge(task.priority)}`} style={{ fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '6px' }}>{task.priority.toUpperCase()}</span>
                      <MoreVertical size={16} color="var(--text-secondary)" />
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>{task.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                        <Tag size={13} /> {task.category}
                        <Calendar size={13} /> {task.deadline}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', border: '1px solid var(--border-strong)' }}>{task.assignee[0]}</div>
                            <span style={{ fontSize: '12px', fontWeight: '700' }}>{task.assignee}</span>
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight size={16} color="var(--brand-blue)" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="data-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                <th style={{ padding: '16px 24px' }}>Task Description</th>
                <th style={{ padding: '16px 24px' }}>Client</th>
                <th style={{ padding: '16px 24px' }}>Category</th>
                <th style={{ padding: '16px 24px' }}>Priority</th>
                <th style={{ padding: '16px 24px' }}>Deadline</th>
                <th style={{ padding: '16px 24px' }}>Assignee</th>
                <th style={{ padding: '16px 24px' }}>Status</th>
                <th style={{ padding: '16px 24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="row-hover">
                  <td style={{ padding: '20px 24px' }}>
                    <p style={{ fontWeight: '800', fontSize: '14px' }}>{task.title}</p>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px' }}>
                        <Building2 size={14} color="var(--text-secondary)" /> {task.client}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{task.category}</span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span className={`badge ${getPriorityBadge(task.priority)}`} style={{ fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '6px' }}>{task.priority.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        <Calendar size={14} /> {task.deadline}
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', border: '1px solid var(--border-strong)' }}>{task.assignee[0]}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{task.assignee}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(task.status) }} />
                        <span style={{ fontSize: '13px', fontWeight: '800', color: getStatusColor(task.status) }}>{task.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="card" 
                style={{ width: '600px', padding: 0, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
            >
                <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-strong)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="display-serif" style={{ fontSize: '28px', fontStyle: 'italic' }}>Provision Workflow</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>New Statutory Deliverable</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--background)', padding: '10px', borderRadius: '12px' }}><X size={20} /></button>
                </div>

                <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Task Title / Description</label>
                        <input placeholder="e.g. GSTR-3B Monthly Review" style={{ width: '100%', background: 'var(--background)' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Associate Client</label>
                            <select style={{ width: '100%', background: 'var(--background)' }}>
                                <option>Reliance Industries</option>
                                <option>Zomato Operations</option>
                                <option>Tata Consultancy</option>
                                <option>Infosys Ltd</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Statutory Category</label>
                            <select style={{ width: '100%', background: 'var(--background)' }}>
                                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Staff Assignee</label>
                            <input placeholder="Staff member name..." style={{ width: '100%', background: 'var(--background)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Filing Deadline</label>
                            <input type="date" style={{ width: '100%', background: 'var(--background)' }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(44, 127, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(44, 127, 255, 0.1)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Zap size={20} color="var(--brand-blue)" />
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--brand-blue)' }}>AI will automatically track this deadline and nudge the assignee 3 days prior.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                        <button onClick={() => setShowAddModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-strong)', padding: '16px', borderRadius: '12px', fontWeight: '700' }}>Discard</button>
                        <button className="premium-btn" style={{ flex: 2, justifyContent: 'center' }}>
                            <ShieldCheck size={20} /> Deploy to Workflow
                        </button>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .badge { display: inline-block; }
        .row-hover:hover { background: rgba(0,0,0,0.02); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Tasks;
