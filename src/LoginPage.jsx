import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faKey,
  faCopyright,
  faEye,
  faEyeSlash,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

import adminLogo from "./assets/3b.png";
import vectorNew from "./assets/Vectornew.png";

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "'Roboto', sans-serif",
    background: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    overflow: "hidden",
  },
  loginContainer: {
    background: "#f5f5f5",
    borderRadius: "20px",
    padding: "35px 25px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "350px",
    boxSizing: "border-box",
    textAlign: "center",
    zIndex: 1,
  },
  logo: {
    width: "120px",
    height: "120px",
    marginBottom: "15px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  h1: {
    fontSize: "1.5rem",
    color: "#452983",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "600",
    margin: "0 0 20px 0",
  },
  inputWrapper: { position: "relative", marginBottom: "15px", width: "100%" },
  input: {
    width: "100%",
    padding: "10px 40px",
    border: "1px solid #7853C2",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "1rem",
    outline: "none",
  },
  iconLeft: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "12px",
    color: "#7853C2",
  },
  loginButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#7853C2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonDisabled: { backgroundColor: "#a991d8", cursor: "not-allowed" },
  toastContainer: {
    position: "fixed",
    bottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
  },
  toast: {
    minWidth: "250px",
    padding: "15px",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    animation: "fade-in-out 4s ease-in-out",
  },
  toastSuccess: { backgroundColor: "#28a745" },
  toastError: { backgroundColor: "#dc3545" },
  topImgContainer: {
    position: "absolute",
    top: "0px",
    right: "0px",
    zIndex: 0,
  },
  topImg: { width: "220px" },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#7853C2",
    color: "white",
    textAlign: "center",
    padding: "10px 0",
    fontSize: "0.9rem",
    fontWeight: "bold",
    boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.2)",
  },
};

const keyframes = `
  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(20px); }
    10%, 90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(20px); }
  }`;

function LoginPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [mainRoles, setMainRoles] = useState([
    "Helper",
    "Operator",
    "Mixture",
    "Other",
  ]);
  const [dynamicOtherRoles, setDynamicOtherRoles] = useState([
    "Electrician",
    "Chef",
    "Admin",
  ]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
  }, []);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await fetch(
          "https://threebapi-1067354145699.asia-south1.run.app/api/staff/roles/all",
        );
        const result = await response.json();
        if (result.success && result.data) {
          const main = [];
          let others = [];
          result.data.forEach((item) => {
            if (typeof item === "string")
              main.push(item.charAt(0).toUpperCase() + item.slice(1));
            else if (typeof item === "object" && item.Other)
              others = item.Other;
          });
          if (!main.includes("Other")) main.push("Other");
          const uniqueOthers = [];
          const lowerCaseSet = new Set();
          [...others, "Admin"].forEach((r) => {
            if (typeof r === "string") {
              const lower = r.trim().toLowerCase();
              if (!lowerCaseSet.has(lower)) {
                lowerCaseSet.add(lower);
                uniqueOthers.push(
                  r.trim().charAt(0).toUpperCase() + r.trim().slice(1),
                );
              }
            }
          });
          setMainRoles(main);
          setDynamicOtherRoles(uniqueOthers);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchAllRoles();
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile))
      return showToast("Enter a valid 10-digit number.", "error");
    if (!password.trim()) return showToast("Password is required.", "error");
    if (!role) return showToast("Please select a role.", "error");
    if (role === "Other" && !otherRole)
      return showToast("Please select other role.", "error");

    setIsLoading(true);

    const payload = {
      mobile,
      password,
      role,
      ...(role === "Other" && { otherRoles: otherRole.toLowerCase() }),
    };

    try {
      const response = await fetch(
        "https://threebapi-1067354145699.asia-south1.run.app/api/staff/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();

      if (!result.token) {
        throw new Error(result.message || "Login failed.");
      }

      const employeeData = result.employee || result.data || result;

      // Determine the correct role string
      let userRole = role === "Other" ? otherRole : role;

      // Fallback if backend sends something different
      if (!userRole) {
        userRole =
          (Array.isArray(employeeData.role)
            ? employeeData.role[0]
            : employeeData.role) || "User";
      }

      // Store Data
      localStorage.setItem("_id", employeeData._id || "");
      localStorage.setItem("name", employeeData.name || "User");
      localStorage.setItem("role", userRole); // Store raw role (e.g., "Admin")
      localStorage.setItem("token", result.token);
      localStorage.setItem(
        "profilePic",
        typeof employeeData.profilePic === "string"
          ? employeeData.profilePic
          : employeeData.profilePic?.url || "",
      );
      localStorage.setItem("eid", employeeData.eid || "");

      showToast("Login successful!", "success");

      // --- NAVIGATION LOGIC ---
      const routingRole = userRole.toLowerCase().trim();

      // Define exact paths for your roles
      const routeExceptions = {
        mixture: "/mixture-db",
        helper: "/helper",
        chef: "/Chefdash",
        admin: "/admin-dashboard", // Added Admin support
        operator: "/operator-dashboard", // Added common cases
        electrician: "/electrician-dashboard",
      };

      // Calculate path: check exceptions first, otherwise use default pattern
      const targetPath =
        routeExceptions[routingRole] ||
        `/${routingRole.replace(/\s+/g, "-")}-dashboard`;

      console.log("Navigating to:", targetPath); // Debugging check

      // Navigate immediately
      setIsLoading(false);
      navigate(targetPath);
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.topImgContainer}>
        <img src={vectorNew} alt="Decoration" style={styles.topImg} />
      </div>
      <div style={styles.loginContainer}>
        <img src={adminLogo} alt="Logo" style={styles.logo} />
        <h1 style={styles.h1}>3B Profiles</h1>
        <form onSubmit={handleLogin}>
          <div style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faPhone} style={styles.iconLeft} />
            <input
              type="tel"
              placeholder="Phone Number"
              style={styles.input}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength="10"
            />
          </div>
          <div style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faKey} style={styles.iconLeft} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#7853C2",
              }}
            />
          </div>
          <div style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faUserTie} style={styles.iconLeft} />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setOtherRole("");
              }}
              style={styles.input}
            >
              <option value="">Select Role</option>
              {mainRoles.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {role === "Other" && (
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faUserTie} style={styles.iconLeft} />
              <select
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                style={styles.input}
              >
                <option value="">Select Other Role</option>
                {dynamicOtherRoles.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            style={{
              ...styles.loginButton,
              ...(isLoading && styles.loginButtonDisabled),
            }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      {toast.show && (
        <div style={styles.toastContainer}>
          <div
            style={{
              ...styles.toast,
              backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
            }}
          >
            {toast.message}
          </div>
        </div>
      )}
      <div style={styles.footer}>
        <FontAwesomeIcon icon={faCopyright} /> All Rights Reserved By 3B
        Profiles
      </div>
    </div>
  );
}

export default LoginPage;
