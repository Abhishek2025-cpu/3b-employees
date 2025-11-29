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
  faUserPlus, // Manage Work
  faCogs, // Manage Application
  faBullhorn, // Send Alert
  faFileAlt, // Send Report
  faSearch,
  faClipboardList, // Assigned Task
  faHourglassHalf, // Ongoing Task
  faCheckCircle, // Completed Task
  faChartBar // Reports
} from '@fortawesome/free-solid-svg-icons';

// Placeholder images (Replace with your actual imports)
const adminLogo = "./assets/3b.png";
const userProfilePlaceholder = "./assets/user-profile.jpg";

// --- STYLES (Based on your snippet) ---
const baseStyles = {
  dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Roboto', sans-serif", overflowX: 'hidden' },
  
  // Sidebar
  sidebar: { width: '280px', backgroundColor: '#452983', color: 'white', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 1000, transition: 'transform 0.3s ease-in-out', left: 0, top: 0 },
  sidebarHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', position: 'relative', paddingTop: '10px' },
  sidebarProfileImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid white' },
  sidebarUserName: { fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '5px' },
  sidebarUserRole: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' },
  closeButton: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' },
  sidebarNav: { flexGrow: 1 },
  sidebarNavItem: { display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px 20px', marginBottom: '15px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: 'white', textDecoration: 'none' },
  sidebarNavIcon: { marginRight: '20px', fontSize: '1.5rem', color: '#a991d8' },
  sidebarNavText: { fontSize: '1.1rem', fontWeight: '500' },
  
  // Main Content
  mainContent: { flexGrow: 1, padding: '20px', width: '100%', boxSizing: 'border-box', transition: 'margin-left 0.3s ease-in-out' },
  
  // Header
  header: { backgroundColor: 'white', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
  headerLeft: { display: 'flex', alignItems: 'center', flexGrow: 1 },
  menuButton: { background: 'none', border: 'none', color: '#452983', fontSize: '1.8rem', cursor: 'pointer', marginRight: '20px' },
  desktopHeaderTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#452983', marginRight: '20px', whiteSpace: 'nowrap' },
  searchWrapper: { position: 'relative', flexGrow: 1, maxWidth: '400px', display: 'flex', alignItems: 'center' },
  searchInput: { width: '100%', padding: '10px 15px 10px 40px', border: '1px solid #ddd', borderRadius: '25px', fontSize: '1rem', outline: 'none' },
  searchIcon: { position: 'absolute', left: '15px', color: '#aaa' },
  headerRight: { display: 'flex', alignItems: 'center', marginLeft: 'auto' },
  headerNotification: { fontSize: '1.8rem', color: '#7853C2', cursor: 'pointer', position: 'relative', marginRight: '20px' },
  notificationBadge: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#dc3545', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  headerProfile: { display: 'flex', alignItems: 'center' },
  headerProfileImage: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' },
  headerUserName: { fontSize: '1.1rem', fontWeight: '500', color: '#333' },

  // Cards
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '30px' }, // Modified to auto-fit for better responsiveness
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  cardIcon: { fontSize: '3.5rem', marginBottom: '15px', color: '#7853C2' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '10px' },
  cardCount: { fontSize: '2.5rem', fontWeight: 'bold', color: '#452983' },

  // Graph Container Styles (New)
  graphsSection: { marginTop: '30px' },
  graphGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px', marginBottom: '30px' },
  graphCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '400px' },
  graphTitle: { fontSize: '1.2rem', marginBottom: '15px', color: '#333', borderLeft: '4px solid #452983', paddingLeft: '10px', fontWeight: 'bold' },

  // Logout
  logoutButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: "25px", marginTop: 'auto', transition: 'background-color 0.2s' },
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date Filters
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // --- RESIZE HANDLER ---
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

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://threebapi-1067354145699.asia-south1.run.app/api/orders/get-orders');
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // --- DATA PROCESSING ---
  const processedData = useMemo(() => {
    if (!orders.length) return { statusData: [], salesData: [], productData: [], returnData: [], totalRevenue: 0, pendingCount: 0, completedCount: 0 };

    const filtered = orders.filter(order => {
      const d = order.createdAt.split('T')[0];
      return d >= startDate && d <= endDate;
    });

    const statusCounts = {};
    const productCounts = {};
    const salesTimeline = {};
    let revenue = 0;
    let pending = 0;
    let completed = 0;
    let returnEligibleCount = 0;
    let nonReturnCount = 0;

    filtered.forEach(order => {
      // Counts for cards
      const status = order.currentStatus || "Pending";
      if (status === 'Delivered' || status === 'Confirmed') completed++;
      else pending++;

      revenue += (order.totalAmount || 0);

      // Graph Data
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      const date = order.createdAt.split('T')[0];
      salesTimeline[date] = (salesTimeline[date] || 0) + (order.totalAmount || 0);

      // Returns
      if (order.returnEligible) returnEligibleCount++;
      else nonReturnCount++;

      // Products
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

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

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
            <button style={baseStyles.closeButton} onClick={() => setIsSidebarOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <img src={adminLogo} alt="Logo" style={{ width: '50px', marginBottom: '10px' }} />
          <img src={userProfilePlaceholder} alt="Admin" style={baseStyles.sidebarProfileImage} />
          <div style={baseStyles.sidebarUserName}>Administrator</div>
          <div style={baseStyles.sidebarUserRole}>System Manager</div>
        </div>

        <div style={baseStyles.sidebarNav}>
          <div style={baseStyles.sidebarNavItem} onClick={() => navigate('/admin/inventory-scanner')}>
            <FontAwesomeIcon icon={faUserPlus} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Stock I/O</span>
          </div>
          <div style={baseStyles.sidebarNavItem} onClick={() => navigate('/admin/manage-app')}>
            <FontAwesomeIcon icon={faCogs} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Manage Application</span>
          </div>
          <div style={baseStyles.sidebarNavItem} onClick={() => navigate('/admin/alerts')}>
            <FontAwesomeIcon icon={faBullhorn} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Send Alert</span>
          </div>
          <div style={baseStyles.sidebarNavItem} onClick={() => navigate('/admin/reports')}>
            <FontAwesomeIcon icon={faFileAlt} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Send Report</span>
          </div>
        </div>

        <button style={baseStyles.logoutButton} onClick={() => { localStorage.clear(); navigate('/login'); }}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
          Logout
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={mainContentStyle}>
        
        {/* HEADER */}
        <div style={baseStyles.header}>
          <div style={baseStyles.headerLeft}>
            <button style={baseStyles.menuButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            {!isMobile && <h2 style={baseStyles.desktopHeaderTitle}>Dashboard</h2>}
            <div style={baseStyles.searchWrapper}>
              <FontAwesomeIcon icon={faSearch} style={baseStyles.searchIcon} />
              <input type="text" placeholder="Search orders..." style={baseStyles.searchInput} />
            </div>
          </div>
          <div style={baseStyles.headerRight}>
            <div style={baseStyles.headerNotification}>
              <FontAwesomeIcon icon={faBell} />
              <span style={baseStyles.notificationBadge}>3</span>
            </div>
            {!isMobile && (
              <div style={baseStyles.headerProfile}>
                <img src={userProfilePlaceholder} alt="Profile" style={baseStyles.headerProfileImage} />
                <span style={baseStyles.headerUserName}>Admin User</span>
              </div>
            )}
          </div>
        </div>

        {/* DATE FILTER CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>

        {/* TOP STAT CARDS */}
        <div style={baseStyles.cardsGrid}>
          <div style={baseStyles.card}>
            <FontAwesomeIcon icon={faClipboardList} style={baseStyles.cardIcon} />
            <div style={baseStyles.cardTitle}>Total Orders</div>
            <div style={baseStyles.cardCount}>{loading ? '...' : processedData.totalCount}</div>
          </div>
          <div style={baseStyles.card}>
            <FontAwesomeIcon icon={faHourglassHalf} style={baseStyles.cardIcon} />
            <div style={baseStyles.cardTitle}>Pending Orders</div>
            <div style={baseStyles.cardCount}>{loading ? '...' : processedData.pendingCount}</div>
          </div>
          <div style={baseStyles.card}>
            <FontAwesomeIcon icon={faCheckCircle} style={baseStyles.cardIcon} />
            <div style={baseStyles.cardTitle}>Completed/Delivered</div>
            <div style={baseStyles.cardCount}>{loading ? '...' : processedData.completedCount}</div>
          </div>
          <div style={baseStyles.card}>
            <FontAwesomeIcon icon={faChartBar} style={baseStyles.cardIcon} />
            <div style={baseStyles.cardTitle}>Total Revenue</div>
            <div style={{...baseStyles.cardCount, fontSize: '1.8rem'}}>{loading ? '...' : formatCurrency(processedData.totalRevenue)}</div>
          </div>
        </div>

        {/* ANALYTICS GRAPHS */}
        {!loading && (
          <div style={baseStyles.graphsSection}>
            <h3 style={{ fontSize: '1.5rem', color: '#452983', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Sales Analytics</h3>
            
            <div style={baseStyles.graphGrid}>
              
              {/* Sales Trend */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Revenue Trend</div>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={processedData.salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#452983" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#452983" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="sales" stroke="#452983" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Order Status</div>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={processedData.statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                      {processedData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Top Selling Products</div>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={processedData.productData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" radius={[0, 10, 10, 0]}>
                      {processedData.productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Returns */}
              <div style={baseStyles.graphCard}>
                <div style={baseStyles.graphTitle}>Return Eligibility</div>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={processedData.returnData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                      <Cell fill="#ff8042" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;