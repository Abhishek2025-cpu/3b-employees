import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck, faCheckCircle, faTimesCircle, faWallet, faClock,
  faPhone, faDirections, faBox, faUser, faMapMarkerAlt,
  faSignOutAlt, faArrowLeft, faCamera, faSignature, faChevronRight,
  faBars, faTimes, faHome, faPaperPlane, faListUl, faHourglassHalf
} from "@fortawesome/free-solid-svg-icons";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("home"); 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userName = localStorage.getItem("name") || "Dummy Driver";

  const stats = [
    { label: "TODAY DELIVERIES", value: "0", icon: faCheckCircle, color: "#7853C2" },
    { label: "DELIVERED", value: "0", icon: faPaperPlane, color: "#7853C2" },
    { label: "FAILED/RETURNED", value: "0", icon: faListUl, color: "#7853C2" },
    { label: "PENDING", value: "0", icon: faHourglassHalf, color: "#7853C2" },
  ];

  const orders = [
    { id: "ORD-9921", customer: "Rahul Sharma", phone: "+91 9876543210", address: "H-12, Sector 63, Noida, UP", pickup: "3B Warehouse, Okhla Phase III", payment: "COD", amount: "₹1250", slot: "10:00 AM - 02:00 PM", instructions: "Call before reaching, gate is locked." },
    { id: "ORD-9925", customer: "Amit Verma", phone: "+91 9988776655", address: "Flat 402, Apex Royal, Indirapuram", pickup: "3B Warehouse, Okhla Phase III", payment: "Prepaid", amount: "₹0 (Paid)", slot: "02:00 PM - 06:00 PM", instructions: "Leave at security desk if not available." }
  ];

  const styles = {
    container: { display: "flex", fontFamily: "'Poppins', sans-serif", backgroundColor: "#f4f7fe", minHeight: "100vh", overflowX: "hidden" },
    sidebar: {
      width: "280px", background: "linear-gradient(180deg, #452983 0%, #2d1b56 100%)", color: "white", padding: "24px 16px",
      display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 1001,
      transition: "transform 0.3s ease", left: 0, top: 0, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
      boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
    },
    mainContent: {
      flexGrow: 1, width: "100%", marginLeft: !isMobile && isSidebarOpen ? "280px" : "0",
      transition: "margin-left 0.3s ease", minHeight: "100vh", paddingBottom: "100px", boxSizing: "border-box"
    },
    header: { background: "linear-gradient(135deg, #7853C2 0%, #452983 100%)", color: "white", padding: "25px 20px", borderRadius: isMobile ? "0 0 25px 25px" : "0", marginBottom: "20px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px", padding: "0 20px", marginBottom: "25px" },
    statCard: { background: "white", padding: "20px 10px", borderRadius: "20px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
    orderCard: { background: "white", margin: "0 20px 15px 20px", borderRadius: "18px", padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", cursor: "pointer" },
    // YE RHA FIX: Badge function add kar diya
    badge: (type) => ({
        padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold',
        backgroundColor: type === 'COD' ? '#fff3cd' : '#d4edda', color: type === 'COD' ? '#856404' : '#155724'
    }),
    bottomActions: {
      position: "fixed", bottom: 0, right: 0, width: (!isMobile && isSidebarOpen) ? "calc(100% - 280px)" : "100%",
      background: "white", padding: "15px 20px", display: "flex", gap: "12px", boxShadow: "0 -5px 20px rgba(0,0,0,0.08)", zIndex: 100, boxSizing: "border-box"
    },
    actionBtn: { flex: 1, padding: "14px", borderRadius: "12px", border: "none", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }
  };

  const HomeView = () => (
    <>
      <div style={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "10px", borderRadius: "10px", display: isMobile ? "block" : "none" }}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>🌟 Hello, {userName}</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: "0.85rem" }}>Here's what's happening today.</p>
            </div>
          </div>
          <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.2rem" }} />
        </div>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <FontAwesomeIcon icon={s.icon} style={{ color: s.color, fontSize: "1.8rem", marginBottom: "5px" }} />
            <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "600" }}>{s.label}</span>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#333" }}>{s.value}</span>
          </div>
        ))}
      </div>

      <h3 style={{ margin: "0 20px 15px", fontSize: "1.1rem" }}>Assigned Tasks</h3>
      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard} onClick={() => { setSelectedOrder(order); setView("details"); }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", color: "#452983" }}>{order.id}</span>
            <span style={styles.badge(order.payment)}>{order.payment}</span>
          </div>
          <h4 style={{ margin: "0 0 5px 0" }}>{order.customer}</h4>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}><FontAwesomeIcon icon={faMapMarkerAlt} /> {order.address}</p>
        </div>
      ))}
    </>
  );

  const DetailsView = () => (
    <div style={{ padding: "20px" }}>
      <button onClick={() => setView('home')} style={{ border: 'none', background: 'none', marginBottom: '20px', fontSize: '1.1rem', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#452983' }}>{selectedOrder.customer}</h3>
        <p style={{ color: '#666' }}>{selectedOrder.address}</p>
        <hr style={{ border: '0.1px solid #eee', margin: '15px 0' }} />
        <p><strong>Pickup:</strong> {selectedOrder.pickup}</p>
        <p><strong>Payment:</strong> {selectedOrder.amount}</p>
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button style={{ ...styles.actionBtn, background: "#f0ebff", color: "#452983" }} onClick={() => window.location.href=`tel:${selectedOrder.phone}`}><FontAwesomeIcon icon={faPhone} /> Call</button>
        <button style={{ ...styles.actionBtn, background: "#f0ebff", color: "#452983" }} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedOrder.address}`)}><FontAwesomeIcon icon={faDirections} /> Navigate</button>
      </div>
      <div style={styles.bottomActions}>
        <button style={{ ...styles.actionBtn, background: "#dc3545", color: "white" }} onClick={() => setView("fail")}>Failed</button>
        <button style={{ ...styles.actionBtn, background: "#452983", color: "white" }} onClick={() => setView("confirm")}>Delivered</button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          {isMobile && <FontAwesomeIcon icon={faTimes} onClick={() => setIsSidebarOpen(false)} style={{ float: "right" }} />}
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" style={{ width: "60px", borderRadius: "50%", marginBottom: "10px" }} />
          <h4 style={{ margin: 0 }}>{userName}</h4>
        </div>
        <div style={{ flexGrow: 1 }}>
          <div onClick={() => {setView('home'); if(isMobile) setIsSidebarOpen(false);}} style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} /> Dashboard
          </div>
        </div>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '10px', borderRadius: '10px' }}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        {view === "home" && <HomeView />}
        {view === "details" && <DetailsView />}
        {view === "confirm" && (
            <div style={{padding: '20px', textAlign: 'center'}}>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => setView('details')} style={{float: 'left'}} />
                <h2>Confirm Delivery</h2>
                <div style={{background: 'white', padding: '30px', borderRadius: '20px', marginTop: '50px'}}>
                    <p>Enter Customer OTP</p>
                    <input type="text" maxLength="4" style={{width: '150px', padding: '15px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '10px', border: '1px solid #ccc'}} />
                    <button onClick={() => {alert("Success"); setView('home')}} style={{...styles.actionBtn, background: '#452983', color: 'white', width: '100%', marginTop: '20px'}}>Submit</button>
                </div>
            </div>
        )}
        {view === "fail" && (
            <div style={{padding: '20px'}}>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => setView('details')} />
                <h2>Mark Failed</h2>
                <select style={{width: '100%', padding: '15px', borderRadius: '10px', marginTop: '20px'}}>
                    <option>Customer Not Available</option>
                    <option>Refused Delivery</option>
                </select>
                <button onClick={() => setView('home')} style={{...styles.actionBtn, background: '#dc3545', color: 'white', width: '100%', marginTop: '20px'}}>Confirm Failure</button>
            </div>
        )}
      </div>

      {isMobile && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000 }}></div>
      )}
    </div>
  );
};

export default DriverDashboard;