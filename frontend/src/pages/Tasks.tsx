import React from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const tasksData = [
  { id: 1, title: 'GST-3B Monthly Filing', client: 'Reliance Industries', priority: 'High', deadline: '20th Apr', assignee: 'Mehul S.', status: 'In Progress' },
  { id: 2, title: 'Annual Audit Verification', client: 'HDFC Bank', priority: 'Critical', deadline: '30th Apr', assignee: 'Sarah J.', status: 'Blocked' },
  { id: 3, title: 'TDS Reconciliation', client: 'Tata Consultancy', priority: 'Medium', deadline: '25th Apr', assignee: 'Rahul K.', status: 'To Do' },
  { id: 4, title: 'ROC Form MGT-7', client: 'Zomato Ltd', priority: 'High', deadline: '15th May', assignee: 'Mehul S.', status: 'To Do' },
  { id: 5, title: 'Invoicing Setup', client: 'Byjus', priority: 'Low', deadline: '10th May', assignee: 'Unassigned', status: 'In Progress' },
];

const Tasks: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Tasks & Workflow</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track compliance deadlines and internal firm operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} />
            View Calendar
          </button>
          <button style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Plus size={20} />
            Create Task
          </button>
        </div>
      </div>

      {/* Board Columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {['To Do', 'In Progress', 'Completed'].map((column) => (
          <div key={column} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{column}</span>
                <span style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  {tasksData.filter(t => column === 'Completed' ? t.status === 'Completed' : t.status === column).length || 0}
                </span>
              </div>
              <button style={{ color: 'var(--text-secondary)' }}><Plus size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tasksData.filter(t => t.status === column || (column === 'Completed' && t.status === 'Done')).map((task) => (
                <div key={task.id} className="glass-panel" style={{ 
                  padding: '20px', 
                  borderRadius: '20px', 
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      color: task.priority === 'Critical' ? 'var(--danger)' : task.priority === 'High' ? 'var(--warning)' : 'var(--primary)'
                    }}>
                      {task.priority}
                    </span>
                    <button style={{ color: 'var(--text-secondary)' }}><ArrowRight size={14} /></button>
                  </div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{task.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {task.client[0]}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{task.client}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Clock size={14} />
                      {task.deadline}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '-4px' }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: 'var(--accent)', 
                        border: '2px solid var(--background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {task.assignee === 'Unassigned' ? '?' : task.assignee[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
