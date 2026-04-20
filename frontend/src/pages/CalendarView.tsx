import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  User,
  Briefcase,
  ExternalLink,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  client_name?: string;
  status: string;
  user_name?: string;
  description?: string;
}

const CalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState('View All');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/calendar');
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const goToToday = () => setCurrentDate(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getStartDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, currentDate.getMonth());
  const startDay = getStartDayOfMonth(year, currentDate.getMonth());

  const filterOptions = ['View All', 'Tasks', 'Recurring Tasks', 'To Do', 'Notice Hearing', 'Lead Follow up', 'Holidays'];
  const clients = ['Reliance Industries', 'Tata Consultancy Services', 'Vidyasagar Dhage', 'Rahul Sharma', 'California Burrito'];

  const getFilteredEvents = () => {
    if (activeFilter === 'View All') return events;
    return events.filter(e => {
        if (activeFilter === 'Tasks') return e.type === 'Task';
        if (activeFilter === 'Recurring Tasks') return e.type === 'Recurring';
        if (activeFilter === 'To Do') return e.type === 'To Do';
        if (activeFilter === 'Notice Hearing') return e.type === 'Notice';
        if (activeFilter === 'Lead Follow up') return e.type === 'Lead';
        if (activeFilter === 'Holidays') return e.type === 'Holiday';
        return true;
    });
  };

  const getEventColor = (type: string, status: string) => {
    if (type === 'Holiday') return 'var(--success)';
    if (status === 'Completed') return 'var(--success)';
    if (status === 'In Progress') return 'var(--primary)';
    return 'var(--warning)';
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newEvent: CalendarEvent = {
        id: Date.now(),
        title: formData.get('title') as string,
        client_name: formData.get('client_name') as string,
        date: formData.get('date') as string,
        type: formData.get('type') as string,
        status: 'Pending',
        user_name: 'Me',
        description: formData.get('description') as string
    };
    setEvents([...events, newEvent]);
    setShowAddModal(false);
  };

  const renderMonthGrid = () => {
    const totalSlots = 42;
    const days = [];
    const filteredEvents = getFilteredEvents();

    for (let i = 0; i < totalSlots; i++) {
      const dayNum = i - startDay + 1;
      const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
      const isSunday = i % 7 === 0;
      const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayEvents = isCurrentMonth ? filteredEvents.filter(e => e.date === dateStr) : [];

      days.push(
        <div key={i} className="calendar-day" style={{
          minHeight: '130px',
          background: isCurrentMonth ? (isSunday ? 'rgba(239, 68, 68, 0.02)' : 'white') : 'var(--background)',
          border: '1px solid var(--border)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          opacity: isCurrentMonth ? 1 : 0.4,
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? '800' : '600',
            color: isSunday ? 'var(--danger)' : (dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'var(--primary)' : 'var(--text-primary)')
          }}>
            <span style={{ 
                width: '30px', height: '30px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
            }}>
                {isCurrentMonth ? dayNum : ''}
            </span>
            {isSunday && isCurrentMonth && <span style={{ fontSize: '10px', fontWeight: '800', opacity: 0.5 }}>SUN</span>}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
            {dayEvents.slice(0, 3).map((event) => (
              <div 
                key={event.id} 
                style={{ 
                    fontSize: '10px', 
                    padding: '5px 8px', 
                    borderRadius: '6px', 
                    background: getEventColor(event.type, event.status) + '10',
                    borderLeft: `3px solid ${getEventColor(event.type, event.status)}`,
                    color: getEventColor(event.type, event.status),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: '800'
                }}
                title={`${event.title} (${event.client_name || 'No Client'}) - Status: ${event.status}`}
              >
                {event.client_name ? `${event.client_name[0]}: ` : ''}{event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '2px 8px', fontWeight: '700' }}>
                + {dayEvents.length - 3} more items
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ 
            padding: '16px', 
            textAlign: 'center', 
            fontSize: '11px', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            color: 'var(--text-secondary)',
            background: 'var(--background)',
            borderBottom: '1px solid var(--border)'
          }}>
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderListView = () => {
    const sortedEvents = [...getFilteredEvents()].sort((a, b) => a.date.localeCompare(b.date));
    
    return (
      <div className="card" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Actionable Item</th>
              <th style={{ padding: '16px' }}>Client Association</th>
              <th style={{ padding: '16px' }}>Pending Details</th>
              <th style={{ padding: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map(event => (
              <tr key={event.id} className="row-hover">
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary)' }}>{new Date(event.date).getDate()}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: getEventColor(event.type, event.status) + '10',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <CalendarIcon size={18} color={getEventColor(event.type, event.status)} />
                    </div>
                    <div>
                        <p style={{ fontWeight: '700', fontSize: '15px' }}>{event.title}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{event.type}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  {event.client_name ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase size={14} color="var(--primary)" />
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{event.client_name}</span>
                    </div>
                  ) : '-'}
                </td>
                <td style={{ padding: '20px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        {event.status === 'Pending' ? `⚠️ Client data pending for ${event.title}` : '✅ Preparation complete'}
                    </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                    background: getEventColor(event.type, event.status) + '10',
                    color: getEventColor(event.type, event.status),
                    border: `1px solid ${getEventColor(event.type, event.status)}20`
                  }}>
                    {event.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1>Turia Calendar</h1>
          <p style={{ color: 'var(--text-secondary)' }}>A visual unified representation of all firm actionables and deadlines.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="card" style={{ display: 'flex', gap: '6px', padding: '6px', borderRadius: '12px' }}>
            <button 
              onClick={() => setViewMode('month')}
              style={{ padding: '10px 20px', borderRadius: '10px', background: viewMode === 'month' ? 'var(--primary)' : 'transparent', color: viewMode === 'month' ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', border: 'none' }}
            >
              <Grid size={18} /> Month
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{ padding: '10px 20px', borderRadius: '10px', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', border: 'none' }}
            >
              <List size={18} /> List
            </button>
          </div>
          
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 20px', borderRadius: '12px' }}>
            <button onClick={prevMonth} style={{background: 'transparent', color: 'var(--text-secondary)', padding: 0}}><ChevronLeft size={24} /></button>
            <span style={{ fontWeight: '800', minWidth: '140px', textAlign: 'center', fontSize: '16px' }}>{monthName} {year}</span>
            <button onClick={nextMonth} style={{background: 'transparent', color: 'var(--text-secondary)', padding: 0}}><ChevronRight size={24} /></button>
            <button 
              onClick={goToToday}
              style={{ padding: '8px 16px', background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: '800' }}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }} className="hide-scrollbar">
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '800',
                background: activeFilter === option ? 'rgba(37, 99, 235, 0.1)' : 'white',
                color: activeFilter === option ? 'var(--primary)' : 'var(--text-secondary)',
                border: '1px solid ' + (activeFilter === option ? 'var(--primary)' : 'var(--border)'),
                transition: '0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {option}
            </button>
          ))}
        </div>
        
        <button 
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 24px', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
            <Plus size={18} /> New Work Entry
        </button>
      </div>

      {/* Main View */}
      {loading ? (
        <div className="card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{fontWeight: '700', color: 'var(--text-secondary)'}}>Loading Unified Calendar...</p>
        </div>
      ) : viewMode === 'month' ? renderMonthGrid() : renderListView()}

      {/* Add Event Modal */}
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
              className="card" style={{ width: '500px', padding: 0, margin: 'auto' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '800' }}>Schedule New Work</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', padding: 4 }}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddEvent} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Work Title</label>
                    <input name="title" required type="text" placeholder="e.g. Audit Verification" style={{ width: '100%', background: 'var(--background)' }} />
                </div>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Client Association</label>
                    <select name="client_name" required style={{ width: '100%', background: 'var(--background)' }}>
                        <option value="">Select a Client...</option>
                        {clients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Execution Date</label>
                        <input name="date" required type="date" style={{ width: '100%', background: 'var(--background)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Entry Type</label>
                        <select name="type" required style={{ width: '100%', background: 'var(--background)' }}>
                            <option value="Task">Task</option>
                            <option value="Recurring">Recurring Task</option>
                            <option value="Notice">Notice Hearing</option>
                            <option value="To Do">To Do</option>
                            <option value="Lead">Lead Follow up</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>Internal Pending Note</label>
                    <textarea name="description" placeholder="Specify pending documents or actions..." rows={3} style={{ width: '100%', background: 'var(--background)', resize: 'none' }}></textarea>
                </div>

                <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', fontWeight: '700', borderRadius: '12px', marginTop: '12px' }}>
                    Sync to Practice Timeline
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .calendar-day:hover { background: rgba(37, 99, 235, 0.02) !important; cursor: pointer; transition: 0.2s; }
        .row-hover:hover { background: rgba(37, 99, 235, 0.02) !important; cursor: pointer; transition: 0.2s; }
      `}</style>
    </div>
  );
};

export default CalendarView;
