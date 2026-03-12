import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faSearch,
  faStar,
  faCheck,
  faPenSquare,
  faGlobe, // Added for language
} from "@fortawesome/free-solid-svg-icons";

import userProfilePlaceholder from "./assets/user-profile.jpg";

const baseStyles = {
  dashboardContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#452983",
    color: "white",
    padding: "30px 15px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    zIndex: 1000,
    transition: "transform 0.3s ease",
  },
  sidebarHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "25px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  sidebarProfileImage: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "white",
    padding: "2px",
    marginBottom: "15px",
  },
  sidebarUserName: {
    fontSize: "1.1rem",
    fontWeight: "700",
    marginBottom: "4px",
  },
  sidebarUserRole: {
    fontSize: "0.8rem",
    opacity: 0.8,
  },
  sidebarNav: {
    flexGrow: 1,
    marginTop: "10px",
  },
  sidebarNavItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
    color: "rgba(255,255,255,0.8)",
  },
  sidebarNavIcon: {
    marginRight: "15px",
    width: "20px",
    fontSize: "1.1rem",
  },
  sidebarNavText: {
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  mainContent: {
    flexGrow: 1,
    padding: "30px",
    width: "100%",
    boxSizing: "border-box",
    transition: "margin-left 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "10px 25px",
    borderRadius: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    marginBottom: "30px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  headerTitle: {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "#452983",
    margin: 0,
  },
  searchBarContainer: {
    position: "relative",
    marginLeft: "100px",
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px 10px 40px",
    width: "300px",
    fontSize: "0.9rem",
    outline: "none",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  notificationBtn: {
    position: "relative",
    fontSize: "1.4rem",
    color: "#452983",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#d93025",
    color: "white",
    fontSize: "0.65rem",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    border: "2px solid white",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userBadgeImg: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
  },
  userBadgeName: {
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#333",
  },
  welcomeSection: {
    marginBottom: "35px",
  },
  welcomeTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "5px",
  },
  welcomeSubtitle: {
    color: "#666",
    fontSize: "1rem",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "35px 20px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
    border: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "0.3s",
  },
  cardIcon: {
    fontSize: "2.8rem",
    color: "#452983",
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "1rem",
    color: "#555",
    fontWeight: "600",
    marginBottom: "10px",
  },
  cardCount: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#452983",
    margin: 0,
  },
  logoutBtnContainer: {
    marginTop: "auto",
    padding: "10px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
  },
  logoutBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  notificationDropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    width: "300px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    zIndex: 1100,
    overflow: "hidden",
    border: "1px solid #eee",
    animation: "fadeIn 0.2s ease-out",
  },
  notificationHeader: {
    backgroundColor: "#452983",
    color: "white",
    padding: "12px 15px",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  notificationItem: {
    display: "flex",
    alignItems: "flex-start",
    padding: "15px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
  },
  notificationIconBox: {
    backgroundColor: "#452983",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    color: "white",
    flexShrink: 0,
  },
  notificationTitle: {
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "#333",
    margin: "0 0 3px 0",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: "1.3",
  },
  markAsRead: {
    padding: "10px 15px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    borderTop: "1px solid #f0f0f0",
  },

  // NEW: SETTINGS MODAL STYLES
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(3px)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    maxWidth: "520px",
    maxHeight: "80vh",
    overflowY: "auto",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    position: "relative",
    animation: "fadeIn 0.3s ease-out",
  },
  modalTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#452983",
    marginBottom: "20px",
    textAlign: "center",
  },
  languageList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "10px",
  },
  languageBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #eee",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#444",
  },
};

const responsiveCss = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .main-content-shifted { margin-left: 260px !important; }
  @media (max-width: 1024px) {
    .search-container { display: none !important; }
  }
  @media (max-width: 767px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main-content-shifted { margin-left: 0 !important; }
    .header-user-badge { display: none !important; }
  }
  .sidebar-item:hover { background-color: rgba(255,255,255,0.1); }
  .dashboard-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.06) !important; }
  .lang-btn:hover { background-color: #f0ebff !important; border-color: #452983 !important; color: #452983 !important; }
  .lang-btn.active { background-color: #452983 !important; color: white !important; }
`;

const Helper = () => {
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const [userName, setUserName] = useState("Helper");
  const [userRole, setUserRole] = useState("Staff");
  const [userProfilePic, setUserProfilePic] = useState(userProfilePlaceholder);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const [assignedTasks, setAssignedTasks] = useState(0);
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [TransferTasks, setTransferTasks] = useState(0);

  const [apiNotifCount, setApiNotifCount] = useState(0);
  const [apiLatestMsg, setApiLatestMsg] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Language Modal State
  const [showLangModal, setShowLangModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = responsiveCss;
    document.head.appendChild(styleTag);

    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    const storedPic = localStorage.getItem("profilePic");
    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
    if (storedPic && storedPic !== "undefined") setUserProfilePic(storedPic);

    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  useEffect(() => {
    const employeeId = localStorage.getItem("_id");
    if (!employeeId) return;

    fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/items/items/employee/${employeeId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setAssignedTasks(data?.data?.length || 0);
        if (data.notification) {
          setApiNotifCount(data.notification.count || 0);
          setApiLatestMsg(
            data.notification.latestMessage || "No new assignments",
          );
        }
      });

    fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/workers/employee-task/${employeeId}`,
    )
      .then((res) => res.json())
      .then((data) => setOngoingTasks(data?.data?.length || 0));

    fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/task-transfers/transfers`,
    )
      .then((res) => res.json())
      .then((data) => setTransferTasks(data?.data?.length || 0));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const languages = [
    "English",
    "Hindi",
    "Marathi",
    "Punjabi",
    "Gujarati",
    "Bengali",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Odia",
    "Urdu",
    "Nepali",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
  ];

  return (
    <div style={baseStyles.dashboardContainer}>
      {/* LANGUAGE SELECTION MODAL */}
      {showLangModal && (
        <div
          style={baseStyles.modalOverlay}
          onClick={() => setShowLangModal(false)}
        >
          <div
            style={baseStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon
              icon={faTimes}
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                cursor: "pointer",
                color: "#999",
              }}
              onClick={() => setShowLangModal(false)}
            />
            <h3 style={baseStyles.modalTitle}>
              <FontAwesomeIcon icon={faGlobe} style={{ marginRight: "10px" }} />
              Select Language
            </h3>
            <div style={baseStyles.languageList}>
              {languages.map((lang) => (
                <div
                  key={lang}
                  className={`lang-btn ${selectedLang === lang ? "active" : ""}`}
                  style={baseStyles.languageBtn}
                  onClick={() => {
                    setSelectedLang(lang);
                    setTimeout(() => setShowLangModal(false), 300);
                  }}
                >
                  {lang}
                  {selectedLang === lang && <FontAwesomeIcon icon={faCheck} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        style={baseStyles.sidebar}
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      >
        <div style={baseStyles.sidebarHeader}>
          {isMobile && (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setIsSidebarOpen(false)}
              style={{ alignSelf: "flex-end", cursor: "pointer" }}
            />
          )}
          <img
            src={userProfilePic}
            alt="Profile"
            style={baseStyles.sidebarProfileImage}
          />
          <span style={baseStyles.sidebarUserName}>{userName}</span>
          <span style={baseStyles.sidebarUserRole}>{userRole}</span>
        </div>

        <nav style={baseStyles.sidebarNav}>
          <div style={baseStyles.sidebarNavItem} className="sidebar-item">
            <FontAwesomeIcon
              icon={faUserPlus}
              style={baseStyles.sidebarNavIcon}
            />
            <span style={baseStyles.sidebarNavText}>Manage Work</span>
          </div>
          <div style={baseStyles.sidebarNavItem} className="sidebar-item">
            <FontAwesomeIcon icon={faCogs} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Application</span>
          </div>
          <div style={baseStyles.sidebarNavItem} className="sidebar-item">
            <FontAwesomeIcon
              icon={faBullhorn}
              style={baseStyles.sidebarNavIcon}
            />
            <span style={baseStyles.sidebarNavText}>Send Alert</span>
          </div>
          <div style={baseStyles.sidebarNavItem} className="sidebar-item">
            <FontAwesomeIcon
              icon={faFileAlt}
              style={baseStyles.sidebarNavIcon}
            />
            <span style={baseStyles.sidebarNavText}>Reports</span>
          </div>
          {/* UPDATED SETTINGS CLICK */}
          <div
            style={baseStyles.sidebarNavItem}
            className="sidebar-item"
            onClick={() => setShowLangModal(true)}
          >
            <FontAwesomeIcon icon={faGlobe} style={baseStyles.sidebarNavIcon} />
            <span style={baseStyles.sidebarNavText}>Settings</span>
          </div>
        </nav>

        <div style={baseStyles.logoutBtnContainer}>
          <button onClick={handleLogout} style={baseStyles.logoutBtn}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={baseStyles.mainContent}
        className={!isMobile ? "main-content-shifted" : ""}
      >
        <div style={baseStyles.header}>
          <div style={baseStyles.headerLeft}>
            {isMobile && (
              <FontAwesomeIcon
                icon={faBars}
                onClick={() => setIsSidebarOpen(true)}
                style={{ fontSize: "1.5rem", color: "#452983" }}
              />
            )}
            <h1 style={baseStyles.headerTitle}>Overview</h1>
            {!isMobile && (
              <div
                style={baseStyles.searchBarContainer}
                className="search-container"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  style={baseStyles.searchIcon}
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  style={baseStyles.searchInput}
                />
              </div>
            )}
          </div>

          <div style={baseStyles.headerRight} ref={notificationRef}>
            <div
              style={baseStyles.notificationBtn}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FontAwesomeIcon icon={faBell} />
              {apiNotifCount > 0 && (
                <span style={baseStyles.badge}>{apiNotifCount}</span>
              )}
              {showNotifications && (
                <div style={baseStyles.notificationDropdown}>
                  <div style={baseStyles.notificationHeader}>
                    Notifications ({apiNotifCount})
                  </div>
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    <div style={baseStyles.notificationItem}>
                      <div style={baseStyles.notificationIconBox}>
                        <FontAwesomeIcon icon={faPenSquare} />
                      </div>
                      <div>
                        <p style={baseStyles.notificationTitle}>
                          {apiLatestMsg}
                        </p>
                        <span style={{ fontSize: "0.7rem", color: "#888" }}>
                          Recently
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={baseStyles.markAsRead}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(false);
                      setApiNotifCount(0);
                    }}
                  >
                    Mark as Read <FontAwesomeIcon icon={faCheck} />
                  </div>
                </div>
              )}
            </div>

            <div style={baseStyles.userBadge} className="header-user-badge">
              <img
                src={userProfilePic}
                style={baseStyles.userBadgeImg}
                alt="user"
              />
              <span style={baseStyles.userBadgeName}>{userName}</span>
            </div>
          </div>
        </div>

        <div style={baseStyles.welcomeSection}>
          <h2 style={baseStyles.welcomeTitle}>
            <FontAwesomeIcon icon={faStar} style={{ color: "#ffd700" }} />{" "}
            Hello, {userName}
          </h2>
          <p style={baseStyles.welcomeSubtitle}>
            Here's what's happening today.
          </p>
        </div>

        <div style={baseStyles.cardsGrid}>
          <div
            style={baseStyles.card}
            className="dashboard-card"
            onClick={() => navigate("/assignments")}
          >
            <FontAwesomeIcon
              icon={faClipboardList}
              style={baseStyles.cardIcon}
            />
            <h3 style={baseStyles.cardTitle}>Assigned Task</h3>
            <p style={baseStyles.cardCount}>{assignedTasks}</p>
          </div>

          <div
            style={baseStyles.card}
            className="dashboard-card"
            onClick={() => navigate("/viewtask")}
          >
            <FontAwesomeIcon
              icon={faHourglassHalf}
              style={baseStyles.cardIcon}
            />
            <h3 style={baseStyles.cardTitle}>Ongoing Task</h3>
            <p style={baseStyles.cardCount}>{ongoingTasks}</p>
          </div>

          <div
            style={baseStyles.card}
            className="dashboard-card"
            onClick={() => navigate("/transfertask")}
          >
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
