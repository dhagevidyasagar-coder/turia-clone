import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── mock data matching your backend schema ─────────────────────────── */
const revenueData = [
  { month: "Oct", billed: 182000, collected: 148000, tasks: 112 },
  { month: "Nov", billed: 215000, collected: 190000, tasks: 134 },
  { month: "Dec", billed: 198000, collected: 172000, tasks: 98 },
  { month: "Jan", billed: 243000, collected: 218000, tasks: 156 },
  { month: "Feb", billed: 289000, collected: 251000, tasks: 189 },
  { month: "Mar", billed: 312000, collected: 287000, tasks: 221 },
  { month: "Apr", billed: 278000, collected: 241000, tasks: 203 },
];

const complianceData = [
  { name: "GST", filed: 88, pending: 12, overdue: 4 },
  { name: "TDS", filed: 72, pending: 18, overdue: 7 },
  { name: "Income Tax", filed: 64, pending: 24, overdue: 3 },
  { name: "MCA / ROC", filed: 91, pending: 6, overdue: 2 },
  { name: "Payroll", filed: 96, pending: 4, overdue: 0 },
];

const taskStatus = [
  { name: "Completed", value: 89, color: "#10b981" },
  { name: "In Progress", value: 34, color: "#2C7FFF" },
  { name: "To Do", value: 51, color: "#f59e0b" },
  { name: "Critical", value: 8, color: "#ef4444" },
];

const deadlines = [
  { title: "GSTR-3B Monthly", client: "Reliance Industries", due: "20 Apr", hoursLeft: 8, category: "GST", assignee: "MS" },
  { title: "Income Tax Scrutiny", client: "TCS Ltd", due: "25 Apr", hoursLeft: 36, category: "IT", assignee: "VD" },
  { title: "TDS Payment Deposit", client: "Reliance Industries", due: "7 May", hoursLeft: 120, category: "TDS", assignee: "VD" },
  { title: "ROC Event Filing", client: "California Burrito", due: "12 May", hoursLeft: 192, category: "MCA", assignee: "SJ" },
  { title: "PF Return Filing", client: "Reliance Industries", due: "15 May", hoursLeft: 216, category: "Payroll", assignee: "MS" },
];

const dscAlerts = [
  { name: "Vidyasagar Dhage", expires: "15 May 2024", provider: "eMudhra", daysLeft: 12, status: "expiring" },
  { name: "Mehul Sharma", expires: "25 Apr 2024", provider: "Sify", daysLeft: -2, status: "expired" },
  { name: "Reliance Industries", expires: "20 Oct 2025", provider: "Vsign", daysLeft: 548, status: "active" },
  { name: "Tata Projects", expires: "10 Jan 2026", provider: "Pantagon", daysLeft: 630, status: "active" },
];

const topClients = [
  { name: "Reliance Industries", score: 98, revenue: "₹15.0L", tasks: 12, category: "Platinum" },
  { name: "Infosys Ltd", score: 96, revenue: "₹11.2L", tasks: 9, category: "Platinum" },
  { name: "TCS Ltd", score: 94, revenue: "₹25.0L", tasks: 15, category: "Gold" },
  { name: "California Burrito", score: 89, revenue: "₹7.5L", tasks: 6, category: "Gold" },
  { name: "Zomato Operations", score: 82, revenue: "₹4.5L", tasks: 8, category: "Silver" },
];

const activity = [
  { action: "GSTR-1 filed", client: "Reliance Ind.", time: "2h ago", type: "success", actor: "VD" },
  { action: "Scrutiny notice logged", client: "TCS Ltd", time: "4h ago", type: "warning", actor: "SJ" },
  { action: "Invoice ₹1.5L sent", client: "Reliance Ind.", time: "5h ago", type: "info", actor: "MS" },
  { action: "DSC expiry alert", client: "Mehul Sharma", time: "6h ago", type: "danger", actor: "SYS" },
  { action: "PF challan ready", client: "Zomato Ops", time: "Yesterday", type: "info", actor: "RK" },
  { action: "ROC form MGT-7 due", client: "Zomato Ops", time: "Yesterday", type: "warning", actor: "RK" },
];

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmt = (n: number) => n >= 100000
  ? `₹${(n / 100000).toFixed(1)}L`
  : `₹${(n / 1000).toFixed(0)}K`;

const urgencyColor = (h: number) => h < 24 ? "#ef4444" : h < 72 ? "#f59e0b" : "#10b981";
const urgencyBg    = (h: number) => h < 24 ? "rgba(239,68,68,.08)" : h < 72 ? "rgba(245,158,11,.08)" : "rgba(16,185,129,.08)";
const urgencyLabel = (h: number) => h < 0 ? "OVERDUE" : h < 24 ? `${h}h left` : `${Math.round(h/24)}d left`;

const catColor: Record<string, string> = {
  GST: "#2C7FFF", IT: "#8b5cf6", TDS: "#f59e0b",
  MCA: "#10b981", Payroll: "#06b6d4"
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#020617", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 12,
    }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: "#94a3b8" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, margin: "2px 0", fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" && p.value > 1000 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ─── sub-components ──────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, subColor, delta, icon, accent, delay }: any) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "24px 28px",
      border: "1px solid #E4E4E7",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "all .5s ease",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: accent + "12",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: accent + "15", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>{icon}</div>
        <span style={{
          fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 20,
          background: delta >= 0 ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)",
          color: delta >= 0 ? "#10b981" : "#ef4444",
        }}>
          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}%
        </span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 900, color: "#020617", lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, fontWeight: 600, color: subColor || "#64748b" }}>{sub}</p>
    </div>
  );
}

function SectionHeader({ title, action, actionLabel }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#020617", margin: 0 }}>{title}</h2>
      {action && (
        <button onClick={action} style={{
          fontSize: 12, fontWeight: 700, color: "#2C7FFF",
          background: "rgba(44,127,255,.08)", border: "none",
          padding: "6px 14px", borderRadius: 8, cursor: "pointer",
        }}>{actionLabel}</button>
      )}
    </div>
  );
}

/* ─── main dashboard ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const [activeChart, setActiveChart] = useState("revenue");

  return (
    <div style={{
      background: "#F4F4F5", minHeight: "100vh",
      fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
      padding: "36px 48px",
    }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui; }

        .dash-row { display: grid; gap: 24px; margin-bottom: 24px; }
        .kpi-grid { grid-template-columns: repeat(5, 1fr); }
        .main-grid { grid-template-columns: 1.55fr 1fr; }
        .lower-grid { grid-template-columns: 1fr 1fr 1fr; }
        .bottom-grid { grid-template-columns: 1.4fr 1fr; }

        .card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E4E4E7;
          padding: 28px;
        }

        .chart-tab {
          padding: 7px 16px; border-radius: 10px; font-size: 13px;
          font-weight: 700; cursor: pointer; transition: all .2s; border: none;
        }
        .chart-tab.active { background: #020617; color: #fff; }
        .chart-tab.inactive { background: transparent; color: #94A3B8; }
        .chart-tab.inactive:hover { background: #F4F4F5; color: #020617; }

        .deadline-row {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 16px; border-radius: 14px;
          border: 1px solid #E4E4E7; margin-bottom: 10px;
          cursor: pointer; transition: all .2s;
        }
        .deadline-row:hover { border-color: #2C7FFF; transform: translateX(4px); }

        .activity-row {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 12px 0; border-bottom: 1px solid #F4F4F5;
        }
        .activity-row:last-child { border-bottom: none; }

        .client-row {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 0; border-bottom: 1px solid #F4F4F5;
        }
        .client-row:last-child { border-bottom: none; }

        .score-bar-bg { background: #F4F4F5; border-radius: 99px; height: 5px; width: 80px; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideIn .4s ease forwards; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{today}</p>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#020617", letterSpacing: "-.03em" }}>
            Practice Overview
          </h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            background: "rgba(16,185,129,.1)", color: "#059669",
            padding: "8px 18px", borderRadius: 12,
            fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 8
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            All Systems Live
          </div>
          <button style={{
            background: "#020617", color: "#fff", border: "none",
            padding: "10px 22px", borderRadius: 12,
            fontSize: 13, fontWeight: 800, cursor: "pointer",
          }}>
            + New Task
          </button>
        </div>
      </div>

      {/* ── KPI STRIP ──────────────────────────────────────────────────── */}
      <div className="dash-row kpi-grid">
        <KpiCard label="Total Clients" value="5" sub="2 onboarding" subColor="#f59e0b"
          delta={12.5} icon="🏢" accent="#2C7FFF" delay={0} />
        <KpiCard label="Active Tasks" value="182" sub="8 critical" subColor="#ef4444"
          delta={5.2} icon="📋" accent="#f59e0b" delay={80} />
        <KpiCard label="MTD Revenue" value="₹27.8L" sub="Target ₹32L" subColor="#64748b"
          delta={8.4} icon="₹" accent="#10b981" delay={160} />
        <KpiCard label="Filed Today" value="18" sub="94.2% compliance" subColor="#10b981"
          delta={8.0} icon="✅" accent="#10b981" delay={240} />
        <KpiCard label="Pending Dues" value="₹1.95L" sub="14 unpaid invoices" subColor="#ef4444"
          delta={-3.1} icon="⚠️" accent="#ef4444" delay={320} />
      </div>

      {/* ── REVENUE CHART + COMPLIANCE DONUT ───────────────────────────── */}
      <div className="dash-row main-grid">
        {/* Revenue chart */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#020617", marginBottom: 2 }}>Practice Performance</h2>
              <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Oct 2023 – Apr 2024</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["revenue", "tasks"].map(t => (
                <button key={t} className={`chart-tab ${activeChart === t ? "active" : "inactive"}`}
                  onClick={() => setActiveChart(t)}>
                  {t === "revenue" ? "Revenue" : "Task Volume"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 32, marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>Total Billed</p>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#020617" }}>₹17.2L</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>Collected</p>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#10b981" }}>₹15.1L</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>Collection Rate</p>
              <p style={{ fontSize: 26, fontWeight: 900, color: "#2C7FFF" }}>87.8%</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            {activeChart === "revenue" ? (
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C7FFF" stopOpacity={.25} />
                    <stop offset="100%" stopColor="#2C7FFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                  tickFormatter={v => `₹${v/100000}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="billed" name="Billed"
                  stroke="#2C7FFF" strokeWidth={2.5} fill="url(#gBilled)" dot={false} />
                <Area type="monotone" dataKey="collected" name="Collected"
                  stroke="#10b981" strokeWidth={2.5} fill="url(#gCollected)" dot={false} />
              </AreaChart>
            ) : (
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={.25} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8", fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tasks" name="Tasks"
                  stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gTasks)" dot={false} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Task status donut */}
        <div className="card">
          <SectionHeader title="Task Status" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatus} innerRadius={60} outerRadius={84}
                    paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {taskStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center"
              }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: "#020617", lineHeight: 1 }}>182</p>
                <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700 }}>TOTAL</p>
              </div>
            </div>

            <div style={{ width: "100%", marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {taskStatus.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#020617" }}>{s.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 70, height: 4, borderRadius: 99, background: "#F4F4F5", overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%", borderRadius: 99, background: s.color,
                        width: `${(s.value / 182) * 100}%`
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#020617", minWidth: 24, textAlign: "right" }}>{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE + DEADLINES + ACTIVITY ──────────────────────────── */}
      <div className="dash-row lower-grid">

        {/* Compliance by category */}
        <div className="card">
          <SectionHeader title="Compliance by Category" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={complianceData} barSize={8} barGap={3}
              margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="filed" name="Filed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overdue" name="Overdue" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
            {[["Filed", "#10b981"], ["Pending", "#f59e0b"], ["Overdue", "#ef4444"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Deadlines */}
        <div className="card">
          <SectionHeader title="Priority Deadlines" actionLabel="View all" action={() => {}} />
          {deadlines.map((d, i) => (
            <div key={i} className="deadline-row"
              style={{ background: urgencyBg(d.hoursLeft), borderColor: urgencyColor(d.hoursLeft) + "40" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: catColor[d.category] + "15",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900, color: catColor[d.category],
              }}>{d.category}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#020617",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</p>
                <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{d.client}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 900, color: urgencyColor(d.hoursLeft) }}>
                  {urgencyLabel(d.hoursLeft)}
                </p>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", marginLeft: "auto",
                  background: "#F4F4F5", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#64748b", marginTop: 4
                }}>{d.assignee}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <SectionHeader title="Recent Activity" />
          {activity.map((a, i) => {
            const colors = { success: "#10b981", warning: "#f59e0b", info: "#2C7FFF", danger: "#ef4444" };
            const c = colors[a.type as keyof typeof colors];
            return (
              <div key={i} className="activity-row">
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: c + "15", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 10, fontWeight: 900, color: c,
                }}>{a.actor}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#020617",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.action}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{a.client}</p>
                </div>
                <span style={{ fontSize: 10, color: "#CBD5E1", fontWeight: 600, flexShrink: 0 }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CLIENTS + DSC ───────────────────────────────────────────────── */}
      <div className="dash-row bottom-grid">

        {/* Top Clients */}
        <div className="card">
          <SectionHeader title="Top Clients by Compliance" actionLabel="Manage" action={() => {}} />
          {topClients.map((c, i) => (
            <div key={i} className="client-row">
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #020617, #1e293b)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 900, color: "#fff",
              }}>{c.name[0]}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#020617",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                  <div className="score-bar-bg">
                    <div style={{
                      height: "100%", borderRadius: 99, width: `${c.score}%`,
                      background: c.score > 90 ? "#10b981" : c.score > 80 ? "#f59e0b" : "#ef4444",
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{c.score}%</span>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#020617" }}>{c.revenue}</p>
                <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{c.tasks} tasks</p>
              </div>

              <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                background: c.category === "Platinum" ? "rgba(139,92,246,.1)" :
                            c.category === "Gold" ? "rgba(245,158,11,.1)" : "rgba(148,163,184,.1)",
                color: c.category === "Platinum" ? "#7c3aed" :
                       c.category === "Gold" ? "#d97706" : "#64748b",
                marginLeft: 8,
              }}>{c.category}</span>
            </div>
          ))}
        </div>

        {/* DSC Vault */}
        <div className="card">
          <SectionHeader title="DSC Vault" actionLabel="Manage" action={() => {}} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {dscAlerts.map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 14,
                background: d.status === "expired" ? "rgba(239,68,68,.04)" :
                             d.status === "expiring" ? "rgba(245,158,11,.04)" : "#FAFAFA",
                border: "1px solid",
                borderColor: d.status === "expired" ? "rgba(239,68,68,.2)" :
                              d.status === "expiring" ? "rgba(245,158,11,.2)" : "#E4E4E7",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: d.status === "expired" ? "rgba(239,68,68,.1)" :
                               d.status === "expiring" ? "rgba(245,158,11,.1)" : "rgba(16,185,129,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>
                  {d.status === "expired" ? "🔴" : d.status === "expiring" ? "🟡" : "🟢"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#020617",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{d.provider} · {d.expires}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 8,
                  background: d.status === "expired" ? "rgba(239,68,68,.12)" :
                               d.status === "expiring" ? "rgba(245,158,11,.12)" : "rgba(16,185,129,.12)",
                  color: d.status === "expired" ? "#dc2626" :
                          d.status === "expiring" ? "#d97706" : "#059669",
                  whiteSpace: "nowrap",
                }}>
                  {d.status === "expired" ? "EXPIRED" :
                   d.status === "expiring" ? `${d.daysLeft}d left` : "Active"}
                </span>
              </div>
            ))}
          </div>

          {/* DSC summary bar */}
          <div style={{
            marginTop: 20, padding: "16px", borderRadius: 14,
            background: "#F8FAFC", border: "1px solid #E4E4E7"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Vault health</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#020617" }}>2 / 4 need action</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: "#E4E4E7", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "50%", background: "#ef4444", borderRadius: 99 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
