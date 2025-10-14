// src/App.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faKey, faCopyright, faShieldHalved } from '@fortawesome/free-solid-svg-icons'; // Added faShieldHalved for OTP icon

import adminLogo from './assets/3b.png';
import vectorNew from './assets/Vectornew.png';

const styles = {
  body: { margin: 0, padding: 0, fontFamily: "'Roboto', sans-serif", background: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', overflow: 'hidden' },
  loginContainer: { background: '#f5f5f5', borderRadius: '20px', padding: '35px 25px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '350px', boxSizing: 'border-box', textAlign: 'center', zIndex: 1 },

  logo: {
    width: '120px',
    height: '120px',
    marginBottom: '15px',
    borderRadius: '50%',
    objectFit: 'cover',
     display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  },

  h1: { fontSize: '1.5rem', color: '#452983', fontFamily: "'Poppins', sans-serif", fontWeight:"600", margin: '0 0 20px 0' },
  inputWrapper: { position: 'relative', marginBottom: '15px', width: '100%' },
  input: { width: '100%', padding: '10px 40px', border: '1px solid #7853C2', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem' },
  iconLeft: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: '#7853C2' },
  iconRight: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '12px', color: '#7853C2', cursor: 'pointer' },
  loginButton: { width: '100%', padding: '12px', backgroundColor: '#7853C2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '10px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background-color 0.3s' },
  loginButtonDisabled: { backgroundColor: '#a991d8', cursor: 'not-allowed' },
  spinner: { display: 'inline-block', width: '1rem', height: '1rem', verticalAlign: 'text-bottom', border: '.2em solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spinner-border .75s linear infinite', marginLeft: '10px' },
  forgotPasswordLink: { marginTop: '15px', color: '#6f42c1', textDecoration: 'none', display: 'inline-block' },
  toastContainer: { position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 },
  toast: { minWidth: '250px', padding: '15px', borderRadius: '8px', color: 'white', fontSize: '1rem', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', animation: 'fade-in-out 4s ease-in-out' },
  toastSuccess: { backgroundColor: '#28a745' }, // Green
  toastError: { backgroundColor: '#dc3545' },   // Red
  topImgContainer: { position: 'absolute', top: '0px', right: '0px', zIndex: 0 },
  topImg: { width: '220px' },
  footer: { position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#7853C2', color: 'white', textAlign: 'center', padding: '10px 0', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.2)' },
};

const keyframes = `
  @keyframes spinner-border { to { transform: rotate(360deg); } }
  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(20px); }
    10%, 90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(20px); }
  }`;

function LoginPage() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState(''); // Changed 'number' to 'mobile' to match API
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      return showToast('Please enter a valid 10-digit phone number.', 'error');
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://threebtest.onrender.com/api/staff/employee/login/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const result = await response.json();

      if (result.status) {
        showToast(result.message, 'success');
        setSessionId(result.sessionId);
        setEmployeeId(result.employeeId);
        setShowOtpInput(true); // Show OTP input field
      } else {
        showToast(result.message || 'Failed to send OTP.', 'error');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      return showToast('Please enter the OTP.', 'error');
    }
    if (!/^\d{6}$/.test(otp)) { // Assuming OTP is 6 digits
        return showToast('Please enter a valid 6-digit OTP.', 'error');
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://threebtest.onrender.com/api/staff/employee/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otp, mobile }),
      });
      const result = await response.json();

      if (result.status) {
        showToast(result.message, 'success');

        const userRole = result.employee?.role;
        const userName = result.employee?.name || 'Employee';
        const authToken = result.sessionId; // Using sessionId as a placeholder for authToken for now

        localStorage.setItem('userName', userName);
        localStorage.setItem('userRole', userRole || 'guest');
        localStorage.setItem('authToken', authToken);

        setTimeout(() => {
          // Redirect based on role
          switch (userRole) {
            case 'Admin':
              navigate('/admin-dashboard'); // Example route for Admin
              break;
            case 'Manager':
              navigate('/manager-dashboard'); // Example route for Manager
              break;
            case 'Operator':
              navigate('/operator-dashboard'); // Example route for Operator
              break;
            default:
              navigate('/'); // Default or guest dashboard
              break;
          }
        }, 800);

      } else {
        showToast(result.message || 'OTP verification failed.', 'error');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toastStyle = {
    ...styles.toast,
    ...(toast.type === 'success' ? styles.toastSuccess : {}),
    ...(toast.type === 'error' ? styles.toastError : {}),
  };

  return (
    <div style={styles.body}>
      <div style={styles.topImgContainer}><img src={vectorNew} alt="Decoration" style={styles.topImg} /></div>
      <div style={styles.loginContainer}>
        <img src={adminLogo} alt="Company Logo" style={styles.logo} />
        <h1 style={styles.h1}>3B Profiles</h1>
        <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
          <div style={styles.inputWrapper}>
            <FontAwesomeIcon icon={faPhone} style={styles.iconLeft} />
            <input
              type="tel"
              placeholder="Enter your Phone number"
              style={styles.input}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength="10"
              disabled={isLoading || showOtpInput} // Disable phone input after OTP is sent
            />
          </div>

          {showOtpInput && (
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faShieldHalved} style={styles.iconLeft} />
              <input
                type="text" // OTP can be text or number depending on requirements
                placeholder="Enter OTP"
                style={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6" // Assuming 6-digit OTP
                disabled={isLoading}
              />
            </div>
          )}

          <button
            type="submit"
            style={{ ...styles.loginButton, ...(isLoading ? styles.loginButtonDisabled : {}) }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {showOtpInput ? 'Verifying OTP...' : 'Sending OTP...'}
                <div style={styles.spinner}></div>
              </>
            ) : (
              showOtpInput ? 'Verify OTP' : 'Send OTP'
            )}
          </button>
        </form>
 
      </div>

      {toast.show && (<div style={styles.toastContainer}><div style={toastStyle}>{toast.message}</div></div>)}

      <div style={styles.footer}><FontAwesomeIcon icon={faCopyright} style={{ marginRight: '5px' }}/>All Rights Reserved By 3B Profiles</div>
    </div>
  );
}

export default LoginPage;