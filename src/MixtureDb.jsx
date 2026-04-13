import React, { useEffect, useState } from "react";
import { translations } from "../src/AssignmentsPage/translations";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
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
  faCheckCircle,
  faChartBar,
  faRightLeft,
  // Import faRightLeft for Transfer Tasks
} from "@fortawesome/free-solid-svg-icons";
import adminLogo from "./assets/3b.png"; // Assuming you have this logo
import userProfilePlaceholder from "./assets/user-profile.jpg"; // Placeholder for user profile image (add this to src/assets)

// Define base styles for all elements
const baseStyles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Roboto', sans-serif",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#452983",
    color: "white",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    position: "fixed", // Default fixed for mobile drawer behavior
    height: "100vh",
top: 0,
left: 0,
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
    transform: "translateX(-100%)", // Hidden by default (mobile)
    overflowY: "auto",
    overflowX: "hidden",
  },
  sidebarHeader: {
    // For mobile sidebar profile
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    position: "relative",
    paddingTop: "10px",
  },
  sidebarProfileImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "3px solid white",
  },
  sidebarUserName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "white",
    marginBottom: "5px",
  },
  sidebarUserRole: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.7)",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  sidebarNav: {
    flexGrow: 1, // Allows nav items to push logout to bottom
  },
  sidebarNavItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "15px 20px",
    marginBottom: "15px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.2s",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  sidebarNavItemHover: {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "translateY(-2px)",
  },
  sidebarNavIcon: {
    marginRight: "20px",
    fontSize: "1.5rem",
    color: "#a991d8",
  },
  sidebarNavText: {
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  mainContent: {
    flexGrow: 1,
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    marginLeft: "0", // Mobile default
    transition: "margin-left 0.3s ease-in-out",
  },
  header: {
    backgroundColor: "white",
    padding: "15px 25px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    background: "none",
    border: "none",
    color: "#452983",
    fontSize: "1.8rem",
    cursor: "pointer",
    marginRight: "20px",
  },
  desktopHeaderTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#452983",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  headerNotification: {
    fontSize: "1.8rem",
    color: "#7853C2",
    cursor: "pointer",
    position: "relative",
    marginRight: "20px",
  },
  notificationBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#dc3545",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "0.75rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  headerProfile: {
    display: "flex",
    alignItems: "center",
  },
  headerProfileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  headerUserName: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#333",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer", // Add cursor pointer for clickable cards
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
  },
  cardIcon: {
    fontSize: "3.5rem",
    marginBottom: "15px",
    color: "#7853C2", // Default color, can be overridden per card
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  },
  cardCount: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#452983",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "25px",
    transition: "background-color 0.2s",
  },
  logoutButtonHover: {
    backgroundColor: "#c82333",
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
  transform: translateX(0) !important;
  position: fixed !important;   /* ✅ CHANGE */
  height: 100vh !important;     /* ✅ ADD */
  top: 0;
  left: 0;
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
  margin-left: 280px !important; /* ✅ ADD */
}

    /* Header elements on Desktop */
    .menu-button {
      display: none !important; /* Hide mobile menu button on desktop */
    }
    .desktop-header-title {
        display: block !important; /* Show desktop title */
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
    .header .desktop-header-title {
      display: none !important; /* Hide desktop title on mobile */
    }
    .header .menu-button {
        display: block !important; /* Show mobile menu button */
    }
    .header .header-notification {
        margin-left: auto !important; /* Push notification to right when title is hidden */
    }
    .header .header-profile {
      display: none !important; /* Hide desktop profile on mobile */
    }
    .sidebar-header {
        display: flex !important; /* Show mobile profile in sidebar */
    }
    .sidebar .logout-button {
        margin-top: 30px !important; /* Ensure separation from nav items */
    }
  }
`;

// Helper function to dynamically inject CSS
const injectCss = (css) => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};

const MixtureDb = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Manage Work"); // State for active navigation item

  // States for card counts (example values)
  const [assignedTasks, setAssignedTasks] = useState(12);
  const [ongoingTasks, setOngoingTasks] = useState(7);
  // const [completedTasks, setCompletedTasks] = useState(45); // Not used in display for now
  const [TransferTasks, setTransferTasks] = useState(5); // New state for Transfer Tasks
  const [reportsGenerated, setReportsGenerated] = useState(4);
  const [showLangModal, setShowLangModal] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
    { code: "pa", name: "Punjabi" },
    { code: "gu", name: "Gujarati" },
    { code: "bn", name: "Bengali" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "or", name: "Odia" },
    { code: "ur", name: "Urdu" },
    { code: "ne", name: "Nepali" },
  ];

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("_id");
    if (!storedEmployeeId) return;

    // ✅ Assigned Tasks Count API
    fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/items/items/employee/${storedEmployeeId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Assigned Tasks API Response:", data);

        const items = Array.isArray(data?.data) ? data.data : [];
        setAssignedTasks(items.length);
      })
      .catch((err) => console.error("Error fetching assigned tasks:", err));

    // ✅ Ongoing Tasks Count API (Mixture)
    fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/mixture-tables/mixture/${storedEmployeeId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Ongoing Tasks API Response:", data);

        const mixture = Array.isArray(data?.data) ? data.data : [];
        setOngoingTasks(mixture.length);
      })
      .catch((err) => console.error("Error fetching ongoing tasks:", err));

    // ✅ Transfer Tasks (unchanged)
    fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/mixture-tables/transfer/all`,
    )
      .then((res) => res.json())
      .then((transferData) => {
        const transferTasks = Array.isArray(transferData?.data)
          ? transferData.data
          : transferData;
        setTransferTasks(transferTasks.length || 0);
      })
      .catch((err) => console.error("Error fetching transfer tasks:", err));
  }, []);

  useEffect(() => {
    injectCss(responsiveCss); // Inject responsive CSS on component mount

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Sidebar is always open on desktop
      } else {
        setIsSidebarOpen(false); // Sidebar is closed by default on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount to set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all items from local storage
    console.log("Logging out and clearing local storage...");
    navigate("/login"); // Redirect to login page
  };

  // Click handlers for the new static cards
  const handleAssignedTaskClick = () => {
    console.log("Assigned Task card clicked!");

    navigate("/assignments");
  };

  const handleOngoingTaskClick = () => {
    console.log("Ongoing Task card clicked!");
    // Example: navigate to an ongoing tasks page
    navigate("/material-entries/:mixtureId");
  };

  const handleTransferTaskClick = () => {
    console.log("Transfer Tasks card clicked!");
    // Example: navigate to a transfer tasks page
    navigate("/mixture-task-details");
  };

  // Navigation items remain the same for the sidebar
  const navItems = [
  { key: "manageWork", label: "Manage Work", icon: faUserPlus },
//  { key: "manageApplication", label: "Manage Application", icon: faCogs },//
  { key: "sendAlert", label: "Send Alert", icon: faBullhorn },
//  { key: "sendReport", label: "Send Report", icon: faFileAlt },//
  //{ key: "swap", label: "Swap", icon: faRightLeft },//
  { key: "settings", label: "Settings", icon: faGlobe },
];

  return (
    <div
      style={baseStyles.dashboardContainer}
      className={
        isSidebarOpen && window.innerWidth < 768 ? "sidebar-open-mobile" : ""
      }
    >
      {/* Sidebar */}
      <aside
        style={{
          ...baseStyles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        className="sidebar"
      >
        <div style={baseStyles.sidebarHeader} className="sidebar-header">
          <img
            src={userProfilePlaceholder}
            alt="User Profile"
            style={baseStyles.sidebarProfileImage}
          />
          <span style={baseStyles.sidebarUserName}>John Doe</span>
          <span style={baseStyles.sidebarUserRole}>Administrator</span>
          <button
            style={baseStyles.closeButton}
            onClick={() => setIsSidebarOpen(false)}
            className="close-button"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <img
          src={adminLogo}
          alt="MixtureDB Logo"
          style={{
            width: "120px",
            margin: "0 auto 30px auto",
            borderRadius: "50%",
          }}
        />

        <nav style={baseStyles.sidebarNav}>
          {navItems.map((item) => (
            <div
              key={item.name}
              style={{
                ...baseStyles.sidebarNavItem,
                ...(activeNavItem === item.name
                  ? baseStyles.sidebarNavItemHover
                  : {}),
              }}
              onMouseEnter={(e) => {
                if (activeNavItem !== item.name) {
                  e.currentTarget.style.backgroundColor =
                    baseStyles.sidebarNavItemHover.backgroundColor;
                  e.currentTarget.style.transform =
                    baseStyles.sidebarNavItemHover.transform;
                }
              }}
              onMouseLeave={(e) => {
                if (activeNavItem !== item.name) {
                  e.currentTarget.style.backgroundColor =
                    baseStyles.sidebarNavItem.backgroundColor;
                  e.currentTarget.style.transform = "none";
                }
              }}
              onClick={() => {
                setActiveNavItem(item.name);

                if (item.key === "settings") {
  setShowLangModal(true);
}
              }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                style={baseStyles.sidebarNavIcon}
              />
              <span style={baseStyles.sidebarNavText}>
{translations[lang]?.[item.key] || item.label}
</span>
            </div>
          ))}
        </nav>

        <button
          style={baseStyles.logoutButton}
          onClick={handleLogout}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              baseStyles.logoutButtonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              baseStyles.logoutButton.backgroundColor)
          }
          className="logout-button"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            style={{ marginRight: "10px" }}
          />
          {translations[lang]?.logout}
        </button>
      </aside>

      {/* LANGUAGE POPUP */}
      {showLangModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "520px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "25px",
              borderRadius: "20px",
              position: "relative",
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setShowLangModal(false)}
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                cursor: "pointer",
              }}
            />

            <h3 style={{ textAlign: "center", color: "#452983" }}>
              <FontAwesomeIcon icon={faGlobe} /> Select Language
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              {languages.map((l) => (
                <div
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    localStorage.setItem("lang", l.code);
                    setShowLangModal(false);
                  }}
                  style={{
                    padding: "10px",
                    fontSize: "0.9rem",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "center",
                    background: lang === l.code ? "#452983" : "white",
                    color: lang === l.code ? "white" : "#333",
                    fontWeight: "500",
                  }}
                >
                  {l.name} {lang === l.code && "✓"}
                </div>
              ))}{" "}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        style={baseStyles.mainContent}
        className={`main-content ${isSidebarOpen && window.innerWidth >= 768 ? "main-content-shifted" : ""}`}
      >
        {/* Header */}
        <header style={baseStyles.header}>
          <div style={baseStyles.headerLeft}>
            <button
              style={baseStyles.menuButton}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-button"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h1 style={baseStyles.desktopHeaderTitle}>
  {translations[lang]?.dashboard}
</h1>
          </div>

          <div style={baseStyles.headerRight}>
            <div
              style={baseStyles.headerNotification}
              className="header-notification"
            >
              <FontAwesomeIcon icon={faBell} />
              <span style={baseStyles.notificationBadge}>0</span>
            </div>
            <div style={baseStyles.headerProfile} className="header-profile">
              <img
                src={userProfilePlaceholder}
                alt="Profile"
                style={baseStyles.headerProfileImage}
              />
              {/* <span style={baseStyles.headerUserName}>John Doe</span> */}
            </div>
          </div>
        </header>

        {/* Dashboard Cards Grid - These stay in the main content */}
        <div style={baseStyles.cardsGrid}>
          <div
            style={baseStyles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = baseStyles.cardHover.transform;
              e.currentTarget.style.boxShadow = baseStyles.cardHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = baseStyles.card.boxShadow;
            }}
            onClick={handleAssignedTaskClick}
          >
            <FontAwesomeIcon
              icon={faClipboardList}
              style={{ ...baseStyles.cardIcon, color: "#7853C2" }}
            />
            <h3 style={baseStyles.cardTitle}>{translations[lang]?.assigned}</h3>
            <p style={baseStyles.cardCount}>{assignedTasks}</p>
          </div>

          <div
            style={baseStyles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = baseStyles.cardHover.transform;
              e.currentTarget.style.boxShadow = baseStyles.cardHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = baseStyles.card.boxShadow;
            }}
            onClick={handleOngoingTaskClick}
          >
            <FontAwesomeIcon
              icon={faHourglassHalf}
              style={{ ...baseStyles.cardIcon, color: "#FFC107" }}
            />
            <h3 style={baseStyles.cardTitle}>{translations[lang]?.ongoing}</h3>
            <p style={baseStyles.cardCount}>{ongoingTasks}</p>
          </div>

          {/* Commented out as requested */}
          {/* <div style={baseStyles.card} onMouseEnter={(e) => { e.currentTarget.style.transform = baseStyles.cardHover.transform; e.currentTarget.style.boxShadow = baseStyles.cardHover.boxShadow; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = baseStyles.card.boxShadow; }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ ...baseStyles.cardIcon, color: '#28A745' }} />
            <h3 style={baseStyles.cardTitle}>Completed Task</h3>
            <p style={baseStyles.cardCount}>{completedTasks}</p>
          </div> */}

          <div
            style={baseStyles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = baseStyles.cardHover.transform;
              e.currentTarget.style.boxShadow = baseStyles.cardHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = baseStyles.card.boxShadow;
            }}
            onClick={handleTransferTaskClick}
          >
            <FontAwesomeIcon
              icon={faRightLeft}
              style={{ ...baseStyles.cardIcon, color: "#17A2B8" }}
            />{" "}
            {/* Using a suitable color for new card */}
            <h3 style={baseStyles.cardTitle}>
{translations[lang]?.transfer}
</h3>
            <p style={baseStyles.cardCount}>{TransferTasks}</p>
          </div>
        </div>

        {/* Example of additional dashboard content (e.g., charts, recent activities) */}
      </main>
    </div>
  );
};

export default MixtureDb;
