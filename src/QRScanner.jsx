import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrCodeScanner = ({ onScanResult }) => {
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    button: {
      padding: '12px 25px',
      backgroundColor: '#6f42c1',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
    },
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerContainer: {
      width: '350px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      position: 'relative',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    },
    closeBtn: {
      marginTop: '15px',
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '100%'
    },
    title: {
      textAlign: 'center',
      marginBottom: '10px',
      color: '#333',
      fontSize: '18px',
      fontWeight: 'bold'
    }
  };

  useEffect(() => {
    let scanner = null;

    if (isOpen) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        false
      );

      const onScanSuccess = (decodedText) => {
        // Vibrate phone (if supported)
        if (navigator.vibrate) navigator.vibrate(200);

        scanner.clear().then(() => {
          setIsOpen(false);
          if (onScanResult) {
            onScanResult(decodedText);
          }
        }).catch(err => console.error(err));
      };

      scanner.render(onScanSuccess, () => {});
    }

    return () => {
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [isOpen, onScanResult]);

  return (
    <>
      {/* Center button on screen */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '20px'
      }}>
        <button style={styles.button} onClick={() => setIsOpen(true)}>
          Scan QR
        </button>
      </div>

      {/* Scanner Modal */}
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.scannerContainer}>
            <div style={styles.title}>Scan QR Code</div>

            <div id="reader"></div>

            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              Close Camera
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QrCodeScanner;
