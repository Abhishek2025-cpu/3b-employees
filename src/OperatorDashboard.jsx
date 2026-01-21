import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

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
  faRightLeft
} from '@fortawesome/free-solid-svg-icons';
import userProfilePlaceholder from './assets/user-profile.jpg'; 

const baseStyles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fd',
    fontFamily: "'Poppins', sans-serif",
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#452983',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    padding: '20px 15px',
    overflowY: 'auto',
  },
  sidebarHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  sidebarProfileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    border: '3px solid rgba(255,255,255,0.2)',
  },
  sidebarUserName: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  sidebarUserRole: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
  },
  sidebarNav: {
    flexGrow: 1,
  },
  sidebarNavItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    marginBottom: '8px',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.8)',
    transition: 'all 0.2s',
  },
  mainContent: {
    flexGrow: 1,
    padding: '25px',
    transition: 'margin-left 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '70px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '300px',
    width: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px 10px 40px',
    border: '1px solid #f0f0f0',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    outline: 'none',
    fontSize: '0.9rem',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    border: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cardIcon: {
    fontSize: '2.5rem',
    color: '#452983',
    marginBottom: '10px',
  },
  cardCount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#452983',
    margin: '5px 0 0 0',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }
};

const responsiveCss = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  @media (min-width: 1025px) {
    .sidebar { transform: translateX(0) !important; }
    .main-content { margin-left: 260px !important; }
    .mobile-only { display: none !important; }
    .cards-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .sidebar { transform: translateX(0) !important; }
    .main-content { margin-left: 260px !important; padding: 20px !important; }
    .mobile-only { display: none !important; }
    .cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 15px !important; }
    .header { flex-wrap: wrap !important; }
    .search-wrapper { order: 3; width: 100% !important; max-width: 100% !important; margin-top: 10px !important; }
  }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); width: 280px !important; }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0 !important; padding: 15px !important; }
    .desktop-only { display: none !important; }
    .cards-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
    .header { padding: 12px 15px !important; min-height: auto !important; }
    .dashboard-card { padding: 18px !important; }
    .card-icon { font-size: 2rem !important; }
    .card-count { font-size: 1.6rem !important; }
    .greeting-title { font-size: 1.4rem !important; }
    .greeting-subtitle { font-size: 0.85rem !important; }
  }

  @media (max-width: 480px) {
    .cards-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
    .main-content { padding: 12px !important; }
    .dashboard-card { padding: 20px !important; }
    .card-icon { font-size: 2.2rem !important; }
    .card-count { font-size: 1.8rem !important; }
  }

  .nav-item:hover { background: rgba(255,255,255,0.15); color: white; }
  .dashboard-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
  
  .overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.4); z-index: 999; display: none;
  }
  .overlay.show { display: block; }

  @media (hover: none) {
    .dashboard-card:hover { transform: none; }
  }
`;

function OperatorDashboard() {
  const navigate = useNavigate();
  
  // Dynamic Data from LocalStorage
  const [userName, setUserName] = useState(localStorage.getItem("name") || 'Operator');
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || 'Operator');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [assignedTasks, setAssignedTasks] = useState(0);
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [transferTasks, setTransferTasks] = useState(0);

  useEffect(() => {
    // LocalStorage se ID nikalna
    const employeeId = localStorage.getItem("_id");
    
    if (employeeId) {
      // 1. Assigned Tasks
      fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/items/items/employee/${employeeId}`)
        .then(res => res.json())
        .then(data => setAssignedTasks(data?.data?.length || 0))
        .catch(err => console.error("Error fetching assigned tasks:", err));
        
      // 2. Ongoing Tasks
      fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/workers/employee-task/${employeeId}`)
        .then(res => res.json())
        .then(data => setOngoingTasks(data?.data?.length || 0))
        .catch(err => console.error("Error fetching ongoing tasks:", err));
    }

    // 3. Transfer Tasks (Ye general API hai, isme employeeId path mein nahi thi aapke code mein)
    fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/task-transfers/transfers`)
      .then(res => res.json())
      .then(data => setTransferTasks(data?.data?.length || 0))
      .catch(err => console.error("Error fetching transfers:", err));
      
  }, []);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = responsiveCss;
    document.head.appendChild(styleTag);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => {
      document.head.removeChild(styleTag);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate('/'); 
  };

  return (
    <div style={baseStyles.dashboardContainer}>
      <div className={`overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <div style={baseStyles.sidebar} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={baseStyles.sidebarHeader}>
          <img src={userProfilePlaceholder} alt="Profile" style={baseStyles.sidebarProfileImage} />
          <span style={baseStyles.sidebarUserName}>{userName}</span>
          <span style={baseStyles.sidebarUserRole}>{userRole}</span>
        </div>

        <nav style={baseStyles.sidebarNav}>
          <div style={baseStyles.sidebarNavItem} className="nav-item">
            <FontAwesomeIcon icon={faUserPlus} style={{marginRight:'10px'}} /> Manage Work
          </div>
          <div style={baseStyles.sidebarNavItem} className="nav-item">
            <FontAwesomeIcon icon={faCogs} style={{marginRight:'10px'}} /> Application
          </div>
          <div style={baseStyles.sidebarNavItem} className="nav-item">
            <FontAwesomeIcon icon={faBullhorn} style={{marginRight:'10px'}} /> Send Alert
          </div>
          <div style={baseStyles.sidebarNavItem} className="nav-item">
            <FontAwesomeIcon icon={faFileAlt} style={{marginRight:'10px'}} /> Reports
          </div>
        </nav>

        <button onClick={handleLogout} style={baseStyles.logoutButton}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>

      <div style={baseStyles.mainContent} className="main-content">
        <header style={baseStyles.header} className="header">
          <div style={{display:'flex', alignItems:'center', flex: '1 1 auto'}}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              style={{border:'none', background:'#f0ecf9', color:'#452983', padding:'10px 12px', borderRadius:'8px', marginRight:'15px', cursor:'pointer', fontSize:'1rem'}} 
              className="mobile-only"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h2 style={{margin:0, color:'#452983', fontWeight:'700', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)'}}>Overview</h2>
          </div>

          <div style={{...baseStyles.searchWrapper, flex: '1 1 auto'}} className="desktop-only search-wrapper">
            <FontAwesomeIcon icon={faSearch} style={{position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#aaa'}} />
            <input type="text" placeholder="Search tasks..." style={baseStyles.searchInput} />
          </div>

          <div style={{display:'flex', alignItems:'center', gap:'15px', flex: '0 0 auto'}}>
            <div style={{position:'relative', cursor:'pointer'}}>
              <FontAwesomeIcon icon={faBell} style={{fontSize:'1.2rem', color:'#452983'}} />
              <span style={{position:'absolute', top:'-8px', right:'-8px', background:'red', color:'white', fontSize:'0.6rem', padding:'2px 5px', borderRadius:'50%', minWidth:'18px', textAlign:'center'}}>3</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}} className="desktop-only">
              <img src={userProfilePlaceholder} style={{width:'35px', height:'35px', borderRadius:'8px', objectFit:'cover'}} alt="user" />
              <span style={{fontWeight:'600', fontSize:'0.9rem', whiteSpace:'nowrap'}}>{userName}</span>
            </div>
          </div>
        </header>

        <div style={{marginBottom:'25px'}}>
          <h1 style={{margin:0, fontSize: 'clamp(1.4rem, 5vw, 1.8rem)'}} className="greeting-title">🌟 Hello, {userName}</h1>
          <p style={{color:'#666', margin:'5px 0', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)'}} className="greeting-subtitle">Here's what's happening today.</p>
        </div>

        <div style={baseStyles.cardsGrid} className="cards-grid">
          <div style={baseStyles.card} className="dashboard-card" onClick={() => navigate('/review-tasks')}>
            <FontAwesomeIcon icon={faClipboardCheck} style={baseStyles.cardIcon} className="card-icon" />
            <div style={{fontWeight:'600', color:'#666', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'}}>Review Tasks</div>
            <p style={baseStyles.cardCount} className="card-count">0</p>
          </div>

          <div style={baseStyles.card} className="dashboard-card" onClick={() => navigate('/submit-tasks')}>
            <FontAwesomeIcon icon={faPaperPlane} style={baseStyles.cardIcon} className="card-icon" />
            <div style={{fontWeight:'600', color:'#666', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'}}>Submit Tasks</div>
            <p style={baseStyles.cardCount} className="card-count">0</p>
          </div>

          <div style={baseStyles.card} className="dashboard-card" onClick={() => navigate('/assignments')}>
            <FontAwesomeIcon icon={faClipboardList} style={baseStyles.cardIcon} className="card-icon" />
            <div style={{fontWeight:'600', color:'#666', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'}}>Assigned Task</div>
            <p style={baseStyles.cardCount} className="card-count">{assignedTasks}</p>
          </div>

          <div style={baseStyles.card} className="dashboard-card" onClick={() => navigate('/viewtask')}>
            <FontAwesomeIcon icon={faHourglassHalf} style={baseStyles.cardIcon} className="card-icon" />
            <div style={{fontWeight:'600', color:'#666', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'}}>Ongoing Task</div>
            <p style={baseStyles.cardCount} className="card-count">{ongoingTasks}</p>
          </div>

          <div style={baseStyles.card} className="dashboard-card" onClick={() => navigate('/transfertask')}>
            <FontAwesomeIcon icon={faRightLeft} style={baseStyles.cardIcon} className="card-icon" />
            <div style={{fontWeight:'600', color:'#666', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'}}>Transfer Tasks</div>
            <p style={baseStyles.cardCount} className="card-count">{transferTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperatorDashboard;