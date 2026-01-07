import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBell,
  faSignOutAlt,
  faTimes,
  faUserPlus,
  faCogs,
  faBullhorn,
  faFileAlt,
  faSearch,
  faClipboardList,
  faHourglassHalf,
  faCheckCircle,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';

const adminLogo = "src/assets/3b.png";
const userProfilePlaceholder = "src/assets/user-profile.jpg";

// --- ENHANCED STYLES ---
const theme = {
  primary: '#452983',
  primaryLight: '#7853C2',
  secondary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: '#f8fafc',
  cardBg: '#ffffff',
  textMain: '#1e293b',
  textMuted: '#64748b',
  sidebarGrad: 'linear-gradient(180deg, #452983 0%, #2d1b56 100%)',
  glass: 'rgba(255, 255, 255, 0.1)'
};

const baseStyles = {
  dashboardContainer: { 
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: theme.background, 
    fontFamily: "'Inter', 'Roboto', sans-serif", 
    overflowX: 'hidden' 
  },
  
  // Sidebar
  sidebar: { 
    width: '280px', 
    background: theme.sidebarGrad, 
    color: 'white', 
    padding: '24px 16px', 
    display: 'flex', 
    flexDirection: 'column', 
    position: 'fixed', 
    height: '100%', 
    zIndex: 1000, 
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
    left: 0, 
    top: 0,
    boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
  },
  sidebarHeader: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginBottom: '32px', 
    paddingBottom: '24px', 
    borderBottom: `1px solid ${theme.glass}`, 
    position: 'relative' 
  },
  sidebarProfileImage: { 
    width: '70px', 
    height: '70px', 
    borderRadius: '20px', 
    objectFit: 'cover', 
    marginBottom: '12px', 
    border: '2px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  },
  sidebarUserName: { fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.5px' },
  sidebarUserRole: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' },
  
  sidebarNavItem: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '14px 18px', 
    marginBottom: '8px', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    transition: 'all 0.3s', 
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    border: '1px solid transparent'
  },
  sidebarNavIcon: { width: '24px', marginRight: '16px', fontSize: '1.2rem', opacity: 0.9 },
  sidebarNavText: { fontSize: '0.95rem', fontWeight: '500' },

  // Content Area
  mainContent: { flexGrow: 1, padding: '24px', width: '100%', boxSizing: 'border-box', transition: 'margin-left 0.4s ease' },
  
  header: { 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    backdropFilter: 'blur(10px)',
    padding: '0 24px', 
    borderRadius: '16px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
    marginBottom: '24px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: '70px',
    sticky: 'top'
  },
  searchInput: { 
    width: '100%', 
    padding: '12px 15px 12px 45px', 
    border: '1px solid #e2e8f0', 
    borderRadius: '12px', 
    fontSize: '0.9rem', 
    outline: 'none',
    backgroundColor: '#f1f5f9',
    transition: 'all 0.3s'
  },

  // Cards
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' },
  card: { 
    backgroundColor: theme.cardBg, 
    borderRadius: '16px', 
    padding: '24px', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', 
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.3s ease, boxShadow 0.3s ease'
  },
  cardIconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  cardValue: { fontSize: '1.8rem', fontWeight: '800', color: theme.textMain, margin: '4px 0' },
  cardLabel: { fontSize: '0.85rem', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' },

  // Graphs
  graphCard: { 
    backgroundColor: 'white', 
    padding: '24px', 
    borderRadius: '20px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.02)', 
    height: '420px',
    border: '1px solid #f1f5f9'
  },
  graphTitle: { 
    fontSize: '1.1rem', 
    marginBottom: '20px', 
    color: theme.textMain, 
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  logoutButton: { 
    backgroundColor: 'rgba(239, 68, 68, 0.15)', 
    color: '#ff8a8a', 
    border: '1px solid rgba(239, 68, 68, 0.2)', 
    padding: '12px', 
    borderRadius: '12px', 
    fontSize: '1rem', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: "10px", 
    marginTop: 'auto', 
    fontWeight: '600',
    transition: 'all 0.3s' 
  },

  dateInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    color: theme.textMain,
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  }
};

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- LOGIC (KEEP UNTOUCHED) ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://threebapi-1067354145699.asia-south1.run.app/api/orders/get-orders');
        const data = await response.json();
        if (data.success) { setOrders(data.orders); }
      } catch (error) { console.error("Error fetching orders:", error);
      } finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const processedData = useMemo(() => {
    if (!orders.length) return { statusData: [], salesData: [], productData: [], returnData: [], totalRevenue: 0, pendingCount: 0, completedCount: 0, totalCount: 0 };
    const filtered = orders.filter(order => {
      const d = order.createdAt.split('T')[0];
      return d >= startDate && d <= endDate;
    });
    const statusCounts = {};
    const productCounts = {};
    const salesTimeline = {};
    let revenue = 0, pending = 0, completed = 0, returnEligibleCount = 0, nonReturnCount = 0;

    filtered.forEach(order => {
      const status = order.currentStatus || "Pending";
      if (status === 'Delivered' || status === 'Confirmed') completed++; else pending++;
      revenue += (order.totalAmount || 0);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      const date = order.createdAt.split('T')[0];
      salesTimeline[date] = (salesTimeline[date] || 0) + (order.totalAmount || 0);
      if (order.returnEligible) returnEligibleCount++; else nonReturnCount++;
      if (order.products) {
        order.products.forEach(p => {
          const name = p.productName || "Unknown";
          productCounts[name] = (productCounts[name] || 0) + (p.quantity || 1);
        });
      }
    });

    return {
      statusData: Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] })),
      salesData: Object.keys(salesTimeline).sort().map(d => ({ date: d, sales: salesTimeline[d] })),
      productData: Object.keys(productCounts).map(k => ({ name: k, count: productCounts[k] })).sort((a,b) => b.count - a.count).slice(0,5),
      returnData: [ { name: 'Eligible', value: returnEligibleCount }, { name: 'Non-Eligible', value: nonReturnCount } ],
      totalRevenue: revenue,
      pendingCount: pending,
      completedCount: completed,
      totalCount: filtered.length
    };
  }, [orders, startDate, endDate]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // --- DYNAMIC STYLES ---
  const sidebarStyle = {
    ...baseStyles.sidebar,
    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  const mainContentStyle = {
    ...baseStyles.mainContent,
    marginLeft: (!isMobile && isSidebarOpen) ? '280px' : '0',
  };

  return (
    <div style={baseStyles.dashboardContainer}>
      
      {/* --- SIDEBAR --- */}
      <div style={sidebarStyle}>
        <div style={baseStyles.sidebarHeader}>
          {isMobile && (
            <button style={{...baseStyles.closeButton, position: 'absolute', right: 0, top: 0, background: 'none', border: 'none', color: 'white', fontSize: '1.2rem'}} onClick={() => setIsSidebarOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <img src={adminLogo} alt="Logo" style={{ width: '45px', marginBottom: '15px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
          <img src={userProfilePlaceholder} alt="Admin" style={baseStyles.sidebarProfileImage} />
          <div style={baseStyles.sidebarUserName}>Administrator</div>
          <div style={baseStyles.sidebarUserRole}>System Manager</div>
        </div>

        <div style={{ flexGrow: 1 }}>
          {[
            { icon: faUserPlus, text: 'Stock I/O', path: '/admin/inventory-scanner' },
            { icon: faCogs, text: 'Manage App', path: '/admin/manage-app' },
            { icon: faBullhorn, text: 'Send Alert', path: '/admin/alerts' },
            { icon: faFileAlt, text: 'Send Report', path: '/admin/reports' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={baseStyles.sidebarNavItem} 
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              <FontAwesomeIcon icon={item.icon} style={baseStyles.sidebarNavIcon} />
              <span style={baseStyles.sidebarNavText}>{item.text}</span>
            </div>
          ))}
        </div>

        <button 
          style={baseStyles.logoutButton} 
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
        >
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
          Logout
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={mainContentStyle}>
        
        {/* HEADER */}
        <div style={baseStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <button style={{ background: 'none', border: 'none', color: theme.primary, fontSize: '1.4rem', cursor: 'pointer', marginRight: '20px' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            {!isMobile && <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: theme.textMain, marginRight: '30px' }}>Dashboard</h2>}
            <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
              <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search orders..." style={baseStyles.searchInput} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', color: theme.textMuted, fontSize: '1.3rem' }}>
              <FontAwesomeIcon icon={faBell} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: theme.danger, color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', border: '2px solid white' }}>3</span>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                <img src={userProfilePlaceholder} alt="Profile" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: theme.textMain }}>Admin User</span>
              </div>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <h3 style={{ margin: 0, color: theme.textMain, fontSize: '1.1rem', fontWeight: '700' }}>Overview Statistics</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={baseStyles.dateInput} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={baseStyles.dateInput} />
            </div>
        </div>

        {/* STAT CARDS */}
        <div style={baseStyles.cardsGrid}>
          {[
            { label: 'Total Orders', val: processedData.totalCount, icon: faClipboardList, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
            { label: 'Pending', val: processedData.pendingCount, icon: faHourglassHalf, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            { label: 'Completed', val: processedData.completedCount, icon: faCheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            { label: 'Revenue', val: formatCurrency(processedData.totalRevenue), icon: faChartBar, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
          ].map((card, i) => (
            <div key={i} style={baseStyles.card} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.03)'; }}>
              <div style={{...baseStyles.cardIconContainer, backgroundColor: card.bg, color: card.color}}>
                <FontAwesomeIcon icon={card.icon} />
              </div>
              <div>
                <div style={baseStyles.cardLabel}>{card.label}</div>
                <div style={baseStyles.cardValue}>{loading ? '...' : card.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ANALYTICS */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' }}>
              
              {/* Revenue Trend */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Revenue Performance</div>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={processedData.salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="sales" stroke={theme.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Order Status Mix</div>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={processedData.statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                      {processedData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} cornerRadius={4} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Best Sellers</div>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={processedData.productData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} width={100} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                      {processedData.productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Returns */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Customer Satisfaction (Returns)</div>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={processedData.returnData} cx="50%" cy="50%" outerRadius={90} innerRadius={60} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                      <Cell fill={theme.danger} />
                      <Cell fill={theme.success} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;