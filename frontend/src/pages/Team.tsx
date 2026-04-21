import React, { useState } from 'react';

import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  User,
  Shield,
  Clock,
  TrendingUp,
  Brain,
  Award,
  Circle,
  Briefcase,
  Mail,
  Phone,
  BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  role: 'Partner' | 'CA' | 'Article' | 'Staff';
  department: string;
  tasks_active: number;
  efficiency: string;
  status: 'Online' | 'Offline' | 'In Meeting';
  email: string;
}

const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([
    { id: 1, name: 'Vidyasagar Dhage', role: 'Partner', department: 'Statutory Audit', tasks_active: 12, efficiency: '98%', status: 'Online', email: 'v.dhage@turia.com' },
    { id: 2, name: 'Sarah Jenkins', role: 'CA', department: 'Direct Tax', tasks_active: 24, efficiency: '92%', status: 'In Meeting', email: 's.jenkins@turia.com' },
    { id: 3, name: 'Mehul Sharma', role: 'Article', department: 'Indirect Tax (GST)', tasks_active: 45, efficiency: '85%', status: 'Online', email: 'm.sharma@turia.com' },
    { id: 4, name: 'Rahul K.', role: 'Staff', department: 'Operations', tasks_active: 8, efficiency: '95%', status: 'Offline', email: 'r.k@turia.com' },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Partner': return '#8b5cf6';
      case 'CA': return '#3b82f6';
      case 'Article': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Staff & Office Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your firm's workforce, internal permissions, and productivity metrics.</p>
        </div>
        <button className="premium-btn" style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          <Plus size={20} />
          Onboard Team Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={24} color="#3b82f6" />
                </div>
                <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Headcount</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '800' }}>42 Members</h3>
                </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>+4 Joined this month</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart2 size={24} color="#8b5cf6" />
                </div>
                <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Avg. Productivity</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '800' }}>92.4%</h3>
                </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>↑ 2.1% from last quarter</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={24} color="#f59e0b" />
                </div>
                <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Billable Hours</p>
                    <h3 style={{ fontSize: '24px', fontWeight: '800' }}>1,840h</h3>
                </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>Current Billing cycle (Apr)</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: '800' }}>Employee Directory</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input type="text" placeholder="Search staff..." style={{ paddingLeft: '36px', background: 'var(--background)', width: '250px' }} />
                </div>
                <button style={{ background: 'var(--background)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={16} /> Filters
                </button>
            </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1000px' }}>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Role & Access</th>
                        <th>Department</th>
                        <th>Workload</th>
                        <th>Efficiency</th>
                        <th>Status</th>
                        <th style={{ width: '80px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {team.map(member => (
                        <tr key={member.id} className="row-hover">
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '14px' }}>{member.name}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={14} color={getRoleColor(member.role)} />
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: getRoleColor(member.role) }}>{member.role}</span>
                                </div>
                            </td>
                            <td>
                                <span style={{ fontSize: '13px' }}>{member.department}</span>
                            </td>
                            <td>
                                <div style={{ width: '100%', maxWidth: '120px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                                        <span>{member.tasks_active} Tasks</span>
                                        <span>{Math.round((member.tasks_active / 50) * 100)}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'var(--background)', borderRadius: '3px' }}>
                                        <div style={{ width: `${(member.tasks_active / 50) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <TrendingUp size={14} color="var(--success)" />
                                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{member.efficiency}</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: member.status === 'Online' ? 'var(--success)' : member.status === 'In Meeting' ? 'var(--warning)' : 'var(--text-secondary)' }}></div>
                                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{member.status}</span>
                                </div>
                            </td>
                            <td>
                                <button style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '8px' }}><MoreVertical size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Team;
