import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  faClipboardList,
  faHourglassHalf,
  faRightLeft,
  faCopyright
} from '@fortawesome/free-solid-svg-icons';

import userProfilePlaceholder from './assets/user-profile.jpg'; // Ensure this exists or use a URL

// --- STYLES CONFIGURATION ---
const baseStyles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "'Roboto', sans-serif",
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#452983',
    color: 'white',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100%',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(-100%)',
  },
  sidebarHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    position: 'relative',
    paddingTop: '10px',
  },
  sidebarProfileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    border: '3px solid white',
  },
  sidebarUserName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '5px',
  },
  sidebarUserRole: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  sidebarNav: {
    flexGrow: 1,
  },
  sidebarNavItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '15px 20px',
    marginBottom: '15px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  sidebarNavItemHover: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-2px)',
  },
  sidebarNavIcon: {
    marginRight: '20px',
    fontSize: '1.5rem',
    color: '#a991d8',
  },
  sidebarNavText: {
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
    marginLeft: '0',
    transition: 'margin-left 0.3s ease-in-out',
  },
  header: {
    backgroundColor: 'white',
    padding: '15px 25px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: '#452983',
    fontSize: '1.8rem',
    cursor: 'pointer',
    marginRight: '20px',
  },
  desktopHeaderTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#452983',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  headerNotification: {
    fontSize: '1.8rem',
    color: '#7853C2',
    cursor: 'pointer',
    position: 'relative',
    marginRight: '20px',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  headerProfile: {
    display: 'flex',
    alignItems: 'center',
  },
  headerProfileImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '10px',
    border: '1px solid #ddd'
  },
  headerUserName: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#333',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
  },
  cardIcon: {
    fontSize: '3.5rem',
    marginBottom: '15px',
    color: '#7853C2',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  cardCount: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#452983',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: "25px",
    transition: 'background-color 0.2s',
  },
  welcomeSection: {
    marginBottom: '25px',
    padding: '0 5px',
  },
  welcomeText: {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(to right, #452983, #7853C2, #FF6B6B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px',
    margin: 0,
  },
  welcomeSubText: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '5px',
    fontWeight: '500',
  },
};

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(5px)',
    zIndex: 9999,
  },
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '30px 40px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    minWidth: '300px',
    maxWidth: '90%',
    border: '1px solid rgba(255,255,255,0.5)',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '10px',
    display: 'block',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(45deg, #452983, #FF6B6B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '10px 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    fontWeight: '500',
  }
};

const responsiveCss = `
  body { margin: 0; padding: 0; overflow-x: hidden; }
  .sidebar-open { transform: translateX(0) !important; }
  .main-content-shifted { margin-left: 280px !important; }
  .dashboard-container.sidebar-open-mobile { overflow: hidden; }

  @media (min-width: 768px) {
    .sidebar {
      transform: translateX(0) !important;
      position: relative !important;
      box-shadow: none !important;
    }
    .sidebar-header { display: none !important; }
    .sidebar .close-button { display: none !important; }
    .main-content { margin-left: 0 !important; }
    .menu-button { display: none !important; }
    .desktop-header-title { display: block !important; }
    .header-profile { display: flex !important; }
  }

  @media (max-width: 767px) {
    .sidebar { box-shadow: 2px 0 5px rgba(0,0,0,0.1) !important; }
    .main-content-shifted { margin-left: 0 !important; }
    .header .desktop-header-title { display: none !important; }
    .header .menu-button { display: block !important; }
    .header .header-notification { margin-left: auto !important; }
    .header .header-profile { display: none !important; }
    .sidebar-header { display: flex !important; }
  }
  
  @keyframes slideInFade {
    0% { opacity: 0; transform: translate(-50%, -60%); }
    100% { opacity: 1; transform: translate(-50%, -50%); }
  }
  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  .welcome-popup { animation: slideInFade 0.8s ease-out forwards; }
  .welcome-popup.hiding { animation: fadeOut 0.8s ease-in forwards; }
`;

const Helper = () => {
  const navigate = useNavigate();
  
  // User Data States
  const [userName, setUserName] = useState('Helper');
  const [userRole, setUserRole] = useState('Staff');
  const [userProfilePic, setUserProfilePic] = useState(userProfilePlaceholder);
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  // Task States
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [TransferTasks, setTransferTasks] = useState(0);

  // 1. Load User Data & Setup Styles
  useEffect(() => {
    // Inject CSS
    const styleTag = document.createElement("style");
    styleTag.innerHTML = responsiveCss;
    document.head.appendChild(styleTag);

    // Retrieve from LocalStorage
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    const storedPic = localStorage.getItem('profilePic');

    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
    if (storedPic && storedPic !== "undefined" && storedPic !== "null") {
      setUserProfilePic(storedPic);
    }

    // Welcome logic
    const hasSeenPopup = sessionStorage.getItem('welcome_shown');
    if (!hasSeenPopup) {
      setShowWelcome(true);
      sessionStorage.setItem('welcome_shown', 'true');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.head.removeChild(styleTag);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Fetch Task Data
  useEffect(() => {
    const employeeId = localStorage.getItem('_id');
    if (!employeeId) return;

    // Assigned Tasks
    fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/items/items/employee/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setAssignedTasks(Array.isArray(data?.data) ? data.data.length : 0))
      .catch((err) => console.error("Assigned Error:", err));

    // Ongoing Tasks
    fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/workers/employee-task/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setOngoingTasks(Array.isArray(data?.data) ? data.data.length : 0))
      .catch((err) => console.error("Ongoing Error:", err));

    // Transfer Tasks
    fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/task-transfers/transfers`)
      .then((res) => res.json())
      .then((data) => setTransferTasks(Array.isArray(data?.data) ? data.data.length : 0))
      .catch((err) => console.error("Transfer Error:", err));
  }, []);

  // 3. Welcome Popup Auto-hide
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => setShowWelcome(false), 800);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: "🌅" };
    if (hour < 17) return { text: "Good Afternoon", icon: "☀️" };
    return { text: "Good Evening", icon: "🌙" };
  };
  const greeting = getGreeting();

  // Navigation handlers
  const handleAssignedTaskClick = () => navigate('/assignments');
  const handleOngoingTaskClick = () => navigate('/viewtask');
  const handleTransferTaskClick = () => navigate('/transfertask');

  return (
    <div style={baseStyles.dashboardContainer} className={`dashboard-container ${isMobile && isSidebarOpen ? 'sidebar-open-mobile' : ''}`}>
      
      {/* Welcome Popup Overlay */}
      {showWelcome && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.container} className={`welcome-popup ${isHiding ? 'hiding' : ''}`}>
            <span style={popupStyles.icon}>{greeting.icon}</span>
            <h2 style={popupStyles.title}>{greeting.text}, {userName}!</h2>
            <p style={popupStyles.subtitle}>Welcome back to your dashboard.</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={baseStyles.sidebar} className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div style={baseStyles.sidebarHeader}>
          {isMobile && (
            <button onClick={toggleSidebar} style={baseStyles.closeButton}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <img src={userProfilePic} alt="Profile" style={baseStyles.sidebarProfileImage} />
          <span style={baseStyles.sidebarUserName}>{userName}</span>
          <span style={baseStyles.sidebarUserRole}>{userRole}</span>
        </div>

        <nav style={baseStyles.sidebarNav}>
          <div style={baseStyles.sidebarNavItem}>
            <FontAwesomeIcon icon={faUserPlus} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Manage Work</span>
          </div>
          <div style={baseStyles.sidebarNavItem}>
            <FontAwesomeIcon icon={faCogs} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Manage App</span>
          </div>
          <div style={baseStyles.sidebarNavItem}>
            <FontAwesomeIcon icon={faBullhorn} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Send Alert</span>
          </div>
          <div style={baseStyles.sidebarNavItem}>
            <FontAwesomeIcon icon={faFileAlt} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Reports</span>
          </div>
        </nav>

        <button onClick={handleLogout} style={baseStyles.logoutButton}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{marginRight: '10px'}} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={baseStyles.mainContent} className={`main-content ${!isMobile ? 'main-content-shifted' : ''}`}>
        
        {/* Header */}
        <div style={baseStyles.header}>
          <div style={baseStyles.headerLeft}>
            {isMobile ? (
              <button onClick={toggleSidebar} style={baseStyles.menuButton}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            ) : (
              <h1 style={baseStyles.desktopHeaderTitle}>Helper Dashboard</h1>
            )}
          </div>

          <div style={baseStyles.headerRight}>
            <div style={baseStyles.headerNotification}>
              <FontAwesomeIcon icon={faBell} />
              {notificationCount > 0 && <span style={baseStyles.notificationBadge}>{notificationCount}</span>}
            </div>
            {!isMobile && (
              <div style={baseStyles.headerProfile}>
                <img src={userProfilePic} alt="Profile" style={baseStyles.headerProfileImage} />
                <span style={baseStyles.headerUserName}>Hello, {userName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Text */}
        <div style={baseStyles.welcomeSection}>
          <h2 style={baseStyles.welcomeText}>
            {greeting.icon} {greeting.text}, {userName}!
          </h2>
          <p style={baseStyles.welcomeSubText}>Hope you have a productive day ahead.</p>
        </div>

        {/* Cards Grid */}
        <div style={baseStyles.cardsGrid}>
          <div style={{ ...baseStyles.card, ...baseStyles.cardHover }} onClick={handleAssignedTaskClick}>
            <FontAwesomeIcon icon={faClipboardList} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Assigned Task</h3>
            <p style={baseStyles.cardCount}>{assignedTasks}</p>
          </div>

          <div style={{ ...baseStyles.card, ...baseStyles.cardHover }} onClick={handleOngoingTaskClick}>
            <FontAwesomeIcon icon={faHourglassHalf} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Ongoing Task</h3>
            <p style={baseStyles.cardCount}>{ongoingTasks}</p>
          </div>

          <div style={{ ...baseStyles.card, ...baseStyles.cardHover }} onClick={handleTransferTaskClick}>
            <FontAwesomeIcon icon={faRightLeft} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Transfer Tasks</h3>
            <p style={baseStyles.cardCount}>{TransferTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Helper;