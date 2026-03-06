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

  const [roleEmployeeData, setRoleEmployeeData] = useState([]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
  }, []);

  useEffect(() => {
    const finalRole = role === "Other" ? otherRole : role;

    if (finalRole) {
      const fetchRoleData = async () => {
        try {
          const roleParam = finalRole.toLowerCase();
          const response = await fetch(
            `https://threebapi-1067354145699.asia-south1.run.app/api/staff/get-role-base-employee-data?selectedRole=${roleParam}`,
          );
          const data = await response.json();
          setRoleEmployeeData(data);
        } catch (error) {
          console.error("Error fetching role based data:", error);
        }
      };
      fetchRoleData();
    }
  }, [role, otherRole]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      return showToast("Please enter a valid 10-digit phone number.", "error");
    }
    if (password.trim() === "") {
      return showToast("Password is required.", "error");
    }
    if (!role) {
      return showToast("Please select a role.", "error");
    }
    if (role === "Other" && !otherRole) {
      return showToast("Please select the other role.", "error");
    }

    setIsLoading(true);

    const payload = {
      mobile: mobile,
      password: password,
      role: role,
    };

    if (role === "Other") {
      payload.otherRoles = otherRole.toLowerCase();
    }

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

      if (result.success === false || (!response.ok && !result.token)) {
        setIsLoading(false);
        return showToast(result.message || "Login failed.", "error");
      }

      const employeeData = result.employee || result.data || result;
      const userName = employeeData?.name || "User";
      const token = result.token || employeeData?.token;

      let userRole = "User";
      if (Array.isArray(employeeData?.role) && employeeData.role.length > 0) {
        userRole = employeeData.role[0];
      } else if (employeeData?.role && typeof employeeData.role === "string") {
        userRole = employeeData.role;
      }

      if (String(userRole).toLowerCase().trim() === "other") {
        userRole = employeeData?.otherRoles || otherRole;
      }

      // Safe Extraction: leading/trailing spaces hateye aur safely string me convert kiye
      const finalSafeRole = String(userRole || "User").trim();

      const profilePic =
        typeof employeeData?.profilePic === "string"
          ? employeeData.profilePic
          : employeeData?.profilePic?.url || "";

      localStorage.setItem("_id", employeeData?._id || "");
      localStorage.setItem("name", userName);
      localStorage.setItem("role", finalSafeRole);
      localStorage.setItem("token", token || "");
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("eid", employeeData?.eid || "");

      showToast("Login successful!", "success");

      setTimeout(() => {
        setIsLoading(false);

        // Routing fix: Sab roles ko lowercase aur trim karke check kar rahe hain taaki capital letter aur spaces ki wajah se navigation naa fase.
        const routingRole = finalSafeRole.toLowerCase();
        console.log("Navigating for precise role:", routingRole);

        switch (routingRole) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "manager":
            navigate("/manager-dashboard");
            break;
          case "operator":
            navigate("/operator-dashboard");
            break;
          case "mixture":
            navigate("/mixture-db");
            break;
          case "helper":
            navigate("/helper");
            break;
          case "driver":
            navigate("/driver-dashboard");
            break;
          case "chef":
            navigate("/Chefdash");
            break;
          case "electrician":
            navigate("/electrician-dashboard");
            break;
          default:
            console.warn("Unknown role ->", routingRole);
            showToast("Role not matched for dashboard routing.", "error");
            // Agar unknown role hai tabhi wahi page pe rukega.
            navigate("/");
            break;
        }
      }, 800);
    } catch (error) {
      showToast("Error during login. Check console.", "error");
      console.error("Login Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.topImgContainer}>
        <img src={vectorNew} alt="Decoration" style={styles.topImg} />
      </div>

      <div style={styles.loginContainer}>
        <img src={adminLogo} alt="Company Logo" style={styles.logo} />
        <h1 style={styles.h1}>3B Profiles</h1>

        <form onSubmit={handleLogin}>
          <div style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faPhone} style={styles.iconLeft} />
            <input
              type="tel"
              placeholder="Enter Phone Number"
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
              placeholder="Enter Password"
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
              <option value="">Select Role (Login as)</option>
              <option value="Helper">Helper</option>
              <option value="Operator">Operator</option>
              <option value="Mixture">Mixture</option>
              <option value="Other">Other</option>
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
                <option value="Electrician">Electrician</option>
                <option value="Chef">Chef</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.loginButton,
              ...(isLoading ? styles.loginButtonDisabled : {}),
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
              ...(toast.type === "success"
                ? styles.toastSuccess
                : styles.toastError),
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
