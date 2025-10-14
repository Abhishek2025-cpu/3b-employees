// src/OperatorDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import {
  faBars,
  faBell, // Notification icon
  faUserCircle, // Default profile icon for header
  faSignOutAlt,
  faTimes,
  faUserPlus, // Sidebar: Manage Work
  faCogs, // Sidebar: Manage Application
  faBullhorn, // Sidebar: Send Alert
  faFileAlt, // Sidebar: Send Report
  faSearch, // Re-adding search for desktop header
  faClipboardList, // Card: Assigned Task
  faHourglassHalf, // Card: Ongoing Task
  faCheckCircle, // Card: Completed Task
  faChartBar, // Card: Reports
  faRightLeft
} from '@fortawesome/free-solid-svg-icons';
import adminLogo from './assets/3b.png'; // Assuming you have this logo
import userProfilePlaceholder from './assets/user-profile.jpg'; // Placeholder for user profile image (add this to src/assets)

// Define base styles for all elements
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
    position: 'fixed', // Default fixed for mobile drawer behavior
    height: '100%',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(-100%)', // Hidden by default (mobile)
  },
  sidebarHeader: { // For mobile sidebar profile
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
    flexGrow: 1, // Allows nav items to push logout to bottom
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
    marginLeft: '0', // Mobile default
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
    flexGrow: 1, // Allows search bar to take space
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
    marginRight: '20px',
  },
  searchWrapper: {
    position: 'relative',
    flexGrow: 1,
    maxWidth: '400px', // Limit search bar width
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px 10px 40px', // Left padding for icon
    border: '1px solid #ddd',
    borderRadius: '25px',
    fontSize: '1rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto', // Push to right
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
    marginBottom:"25px",
   // Pushes to the bottom of the flex container
    transition: 'background-color 0.2s',
  },
  logoutButtonHover: {
    backgroundColor: '#c82333',
  },
};

// Define CSS with media queries to be injected
const responsiveCss = `
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Prevent horizontal scroll when sidebar is open */
  }

  /* Sidebar specific classes */
  .sidebar-open {
    transform: translateX(0) !important;
  }

  /* Main content classes for desktop */
  .main-content-shifted {
    margin-left: 280px !important; /* Adjusted for wider sidebar */
  }

  /* Hide scrollbar when sidebar is open on mobile */
  .dashboard-container.sidebar-open-mobile {
    overflow: hidden;
  }

  /* Media Queries for Responsiveness */
  @media (min-width: 768px) {
    /* Sidebar on Desktop */
    .sidebar {
      transform: translateX(0) !important; /* Always visible on desktop */
      position: relative !important; /* Change from fixed to relative */
      box-shadow: none !important; /* Remove shadow when relative */
    }
    .sidebar-header {
        display: none !important; /* Hide mobile profile in sidebar on desktop */
    }
    .sidebar .close-button {
      display: none !important; /* Hide close button on desktop */
    }
    .sidebar .logout-button {
        margin-top: auto !important; /* Ensure it stays at the bottom */
    }

    /* Main Content on Desktop */
    .main-content {
      margin-left: 0 !important; /* Adjust margin for sidebar when it's relative */
    }

    /* Header elements on Desktop */
    .menu-button {
      display: none !important; /* Hide mobile menu button on desktop */
    }
    .desktop-header-title {
        display: block !important; /* Show desktop title */
    }
    .search-wrapper {
        display: block !important; /* Show search bar */
    }
    .header-profile {
        display: flex !important; /* Show desktop profile */
    }
  }

  @media (max-width: 767px) {
    /* Mobile specific overrides */
    .sidebar {
        box-shadow: 2px 0 5px rgba(0,0,0,0.1) !important; /* Re-add shadow for mobile drawer */
    }
    .main-content-shifted {
      margin-left: 0 !important; /* No margin shift on mobile */
    }
    .header .desktop-header-title,
    .header .search-wrapper,
    .header .header-profile {
      display: none !important; /* Hide desktop elements on mobile */
    }
    .header .menu-button {
        display: block !important; /* Show mobile menu button */
    }
    .header .header-notification {
        margin-left: auto !important; /* Push notification to right */
    }
    .sidebar-header {
        display: flex !important; /* Show mobile profile in sidebar */
    }
    .sidebar .logout-button {
        margin-top: 30px !important; /* Ensure separation from nav items */
    }
  }
`;

function OperatorDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Operator');
  const [userRole, setUserRole] = useState('Role');
  const [userProfilePic, setUserProfilePic] = useState(userProfilePlaceholder);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [notificationCount, setNotificationCount] = useState(3);

  // --- THESE LINES MUST BE PRESENT AND UNCOMMENTED ---
  const [assignedTasks, setAssignedTasks] = useState(12);
  const [ongoingTasks, setOngoingTasks] = useState(5);
  const [completedTasks, setCompletedTasks] = useState(87);
  const [TransferTasks, setTransferTasks] = useState(4);
  const [reportsGenerated, setReportsGenerated] = useState(15);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = responsiveCss;
    document.head.appendChild(styleTag);

    const handleResize = () => {
      const mobileView = window.innerWidth <= 767;
      setIsMobile(mobileView);
      if (!mobileView && isSidebarOpen) {
        setIsSidebarOpen(false); // Close sidebar if resizing from mobile to desktop
      }
    };
    window.addEventListener('resize', handleResize);

    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserName) setUserName(storedUserName);
    if (storedUserRole) setUserRole(storedUserRole);
    // Fetch actual profile image if available
    // const storedProfilePic = localStorage.getItem('userProfilePic');
    // if (storedProfilePic) setUserProfilePic(storedProfilePic);

    return () => {
      document.head.removeChild(styleTag);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]); // Added isSidebarOpen to dependencies

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Conditionally apply class names
  const sidebarClasses = `sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`;
  const mainContentClasses = `main-content ${!isMobile ? 'main-content-shifted' : ''}`;
  const dashboardContainerClasses = `dashboard-container ${isMobile && isSidebarOpen ? 'sidebar-open-mobile' : ''}`;


  return (
    <div style={baseStyles.dashboardContainer} className={dashboardContainerClasses}>
      {/* Sidebar */}
      <div style={baseStyles.sidebar} className={sidebarClasses}>
        {/* Profile info in sidebar header (mobile only) */}
        {isMobile && (
          <div style={baseStyles.sidebarHeader}>
            <button onClick={toggleSidebar} style={baseStyles.closeButton} className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img src={userProfilePic} alt="Profile" style={baseStyles.sidebarProfileImage} />
            <span style={baseStyles.sidebarUserName}>{userName}</span>
            <span style={baseStyles.sidebarUserRole}>{userRole}</span>
          </div>
        )}

        <nav style={baseStyles.sidebarNav}>
          {/* Main navigation items for the sidebar */}
          <div style={{ ...baseStyles.sidebarNavItem, ...baseStyles.sidebarNavItemHover }}>
            <FontAwesomeIcon icon={faUserPlus} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Manage Work</span>
          </div>
          <div style={{ ...baseStyles.sidebarNavItem, ...baseStyles.sidebarNavItemHover }}>
            <FontAwesomeIcon icon={faCogs} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Manage Application</span>
          </div>
          <div style={{ ...baseStyles.sidebarNavItem, ...baseStyles.sidebarNavItemHover }}>
            <FontAwesomeIcon icon={faBullhorn} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Send Alert</span>
          </div>
          <div style={{ ...baseStyles.sidebarNavItem, ...baseStyles.sidebarNavItemHover }}>
            <FontAwesomeIcon icon={faFileAlt} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Send Report</span>
          </div>
        </nav>

        {/* Logout button always at the bottom of the sidebar */}
        <button onClick={handleLogout} style={{...baseStyles.logoutButton, ...baseStyles.logoutButtonHover}} className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} style={baseStyles.sidebarNavIcon} />
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={baseStyles.mainContent} className={mainContentClasses}>
        {/* Header */}
        <div style={baseStyles.header}>
          <div style={baseStyles.headerLeft}>
            {isMobile ? ( // Mobile: Menu button
              <button onClick={toggleSidebar} style={baseStyles.menuButton} className="menu-button">
                <FontAwesomeIcon icon={faBars} />
              </button>
            ) : ( // Desktop: Dashboard Title + Optional Search Bar
              <>
                <h1 style={baseStyles.desktopHeaderTitle} className="desktop-header-title">Operator Dashboard</h1>
                <div style={baseStyles.searchWrapper} className="search-wrapper">
                  <FontAwesomeIcon icon={faSearch} style={baseStyles.searchIcon} />
                  <input type="text" placeholder="Search for something" style={baseStyles.searchInput} />
                </div>
              </>
            )}
          </div>

          <div style={baseStyles.headerRight}>
            <div style={baseStyles.headerNotification} className="header-notification">
              <FontAwesomeIcon icon={faBell} />
              {notificationCount > 0 && (
                <span style={baseStyles.notificationBadge}>{notificationCount}</span>
              )}
            </div>
            {!isMobile && ( // Desktop: Profile image and name
              <div style={baseStyles.headerProfile} className="header-profile">
                <img src={userProfilePic} alt="Profile" style={baseStyles.headerProfileImage} />
                <span style={baseStyles.headerUserName}>Hello, {userName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Cards Grid - These stay in the main content */}
        <div style={baseStyles.cardsGrid}>
          <div style={{...baseStyles.card, ...baseStyles.cardHover}}>
            <FontAwesomeIcon icon={faClipboardList} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Assigned Task</h3>
            <p style={baseStyles.cardCount}>{assignedTasks}</p>
          </div>

          <div style={{...baseStyles.card, ...baseStyles.cardHover}}>
            <FontAwesomeIcon icon={faHourglassHalf} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Ongoing Task</h3>
            <p style={baseStyles.cardCount}>{ongoingTasks}</p>
          </div>

          <div style={{...baseStyles.card, ...baseStyles.cardHover}}>
            <FontAwesomeIcon icon={faCheckCircle} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Completed Task</h3>
            <p style={baseStyles.cardCount}>{completedTasks}</p>
          </div>

           <div style={{...baseStyles.card, ...baseStyles.cardHover}}>
            <FontAwesomeIcon icon={faRightLeft} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Transfer Tasks</h3>
            <p style={baseStyles.cardCount}>{TransferTasks}</p>
          </div>

          <div style={{...baseStyles.card, ...baseStyles.cardHover}}>
            <FontAwesomeIcon icon={faChartBar} style={baseStyles.cardIcon} />
            <h3 style={baseStyles.cardTitle}>Reports</h3>
            <p style={baseStyles.cardCount}>{reportsGenerated}</p>
          </div>
        </div>

        {/* Additional main content goes here */}
      </div>
    </div>
  );
}

export default OperatorDashboard;