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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  assignee: string;
  status: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tasks');
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Simulation
    setTimeout(() => {
        const newTask: Task = {
            id: Date.now(),
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            priority: formData.get('priority') as string,
            deadline: formData.get('deadline') as string,
            assignee: formData.get('assignee') as string,
            status: 'To Do'
        };
        setTasks([newTask, ...tasks]);
        setIsCreating(false);
        setShowAddModal(false);
    }, 1500);
  };

  const handleToggleComplete = (id: number) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Completed' ? 'To Do' : 'Completed' } : t
    ));
  };

  const handleNextStatus = (id: number, currentStatus: string) => {
    let nextStatus = 'To Do';
    if (currentStatus === 'To Do') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';
    
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  const categories = ['All', 'GST', 'MCA', 'TDS / TCS', 'Professional Tax', 'PF', 'ESI', 'Income tax', 'Advance Tax'];
  const fullCategories = ['GST', 'MCA', 'TDS / TCS', 'Professional Tax', 'PF', 'ESI', 'Income tax', 'Advance Tax', 'Audit'];
  
  const filteredTasks = tasks.filter(t => 
    activeCategory === 'All' || t.category === activeCategory
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'var(--danger)';
      case 'Medium': return 'var(--warning)';
      case 'Low': return 'var(--info)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Tasks & Workflow</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track statutory filings and service deliveries across your firm.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Create Task
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }} className="hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              background: activeCategory === cat ? 'var(--primary)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              border: '1px solid ' + (activeCategory === cat ? 'var(--primary)' : 'var(--border)'),
              transition: '0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {['To Do', 'In Progress', 'Completed'].map(status => (
          <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'Completed' ? 'var(--success)' : status === 'In Progress' ? 'var(--primary)' : 'var(--text-secondary)' }} />
                {status}
              </h3>
              <span style={{ fontSize: '12px', fontWeight: '700', padding: '2px 10px', background: 'var(--border)', borderRadius: '20px' }}>
                {filteredTasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTasks.filter(t => t.status === status).map((task) => (
                <div key={task.id} className="card task-card" style={{ padding: '20px', cursor: 'grab' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                        padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                        background: getPriorityColor(task.priority) + '10',
                        color: getPriorityColor(task.priority),
                        border: `1px solid ${getPriorityColor(task.priority)}20`
                    }}>
                        {task.priority.toUpperCase()}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {task.status !== 'Completed' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }}
                            className="status-action-btn"
                            title="Mark as Completed"
                            style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '6px', borderRadius: '8px', border: '1px solid var(--success-border)' }}
                          >
                              <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 0, border: 'none' }}>
                            <MoreVertical size={16} />
                        </button>
                    </div>
                  </div>
                  <h4 style={{ 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    marginBottom: '16px', 
                    color: task.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Tag size={13} /> {task.category}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Calendar size={13} /> {task.deadline}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                            {task.assignee[0]}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>{task.assignee}</span>
                    </div>
                     <div 
                        onClick={() => handleNextStatus(task.id, task.status)}
                        className="hover-icon" 
                        style={{ cursor: 'pointer', padding: '4px', visibility: task.status === 'Completed' ? 'hidden' : 'visible' }}
                      >
                        <ArrowRight size={16} color="var(--primary)" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
                onClick={() => setShowAddModal(true)}
                style={{ 
                    width: '100%', padding: '12px', background: 'var(--background)', color: 'var(--text-secondary)', 
                    border: '1px dashed var(--border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600' 
                }}
            >
              + Add {status === 'To Do' ? 'new task' : 'card'}
            </button>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.4)', 
            backdropFilter: 'blur(4px)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="card" style={{ width: '550px', padding: 0, margin: 'auto' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '800' }}>Provision New Firm Task</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', padding: 4 }}><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateTask} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Task Description</label>
                    <input name="title" required placeholder="e.g. GSTR-1 Review for Reliance Industries" style={{ width: '100%', background: 'var(--background)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Statutory Category</label>
                        <select name="category" required style={{ width: '100%', background: 'var(--background)' }}>
                            {fullCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Priority Level</label>
                        <select name="priority" required style={{ width: '100%', background: 'var(--background)' }}>
                            <option value="High">🔴 High Sensitivity</option>
                            <option value="Medium">🟠 Standard Flow</option>
                            <option value="Low">🔵 Low Urgency</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Due Date</label>
                        <input name="deadline" required type="date" style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Staff Assignee</label>
                        <input name="assignee" required placeholder="Name of Staff" style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isCreating}
                    style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', fontWeight: '700', borderRadius: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    {isCreating ? (
                        <>
                            <Zap size={18} className="spin" /> Synchronizing Task...
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={18} /> Provision Task to Workflow
                        </>
                    )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

       <style>{`
        .task-card:hover { transform: translateY(-4px); border-color: var(--primary); transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .status-action-btn { transition: all 0.2s; opacity: 0.7; }
        .status-action-btn:hover { opacity: 1; transform: scale(1.1); background: var(--success) !important; color: white !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Tasks;
