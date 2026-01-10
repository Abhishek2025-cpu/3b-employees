import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";
import toast, { Toaster } from "react-hot-toast";

const InventoryScannerPage = () => {
  // Initial state with dummy data (Same as yours)
  const [product, setProduct] = useState({
    itemNo: "ITEM00123",
    length: "6 meters",
    noOfSticks: "50",
    boxes: new Array(8).fill({}),
    productImageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1470&auto=format&fit=crop",
    operators: [{ name: "John" }],
  });

  const [loading, setLoading] = useState(false);
  const [scannedBoxSerial, setScannedBoxSerial] = useState("12");

  const [company, setCompany] = useState("3B Profiles");
  const [type, setType] = useState("Stock OUT");
  const [qty, setQty] = useState("150");
  const [boxes, setBoxes] = useState("3");

  // --- Functionality (NO CHANGES MADE) ---
  const handleScan = async (scanned) => {
    if (loading) return;
    setLoading(true);
    try {
      let id = scanned;
      if (scanned.includes("/inventory/")) {
        id = scanned.split("/inventory/")[1];
      }
      const response = await fetch(
        `https://threebapi-1067354145699.asia-south1.run.app/api/items/${id}`
      );
      const item = await response.json();
      if (!item || !item._id) {
        toast.error("Product not found");
        return;
      }
      setProduct(item);
      const matchedBox = item.boxes?.find((b) =>
        scanned.includes(b.boxSerialNo)
      );
      if (matchedBox) {
        setScannedBoxSerial(matchedBox.boxSerialNo);
        setBoxes("1");
        setQty(item.noOfSticks.toString());
      }
      toast.success("Item Loaded");
    } catch (err) {
      toast.error("Error fetching item");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async () => {
    if (!company || !type || !qty || !boxes) {
      alert("Please fill all fields");
      return;
    }
    alert("Movement Recorded Successfully");
  };

  // --- Updated Responsive Styles ---
  const styles = {
    container: {
      backgroundColor: "#f4f7fa",
      minHeight: "100vh",
      padding: "15px", // Smaller padding for mobile
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: "border-box",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "18px",
      border: "1px solid #e0e6ed",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      width: "100%",
      maxWidth: "450px", // Max width for desktop
      padding: "20px",
      marginBottom: "20px",
      position: "relative",
      boxSizing: "border-box",
    },
    itemNo: {
      color: "#635acc",
      fontSize: "clamp(18px, 5vw, 22px)", // Responsive font size
      fontWeight: "bold",
      margin: "0 0 10px 0",
      width: "70%", // Avoid overlapping with badge
    },
    badge: {
      position: "absolute",
      top: "20px",
      right: "20px",
      backgroundColor: "#389e52",
      color: "white",
      padding: "5px 12px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "bold",
    },
    divider: {
      height: "1px",
      backgroundColor: "#eee",
      margin: "5px 0 15px 0",
    },
    infoGrid: {
      display: "flex",
      flexWrap: "wrap", // Wrap on small screens
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    },
    details: {
      flex: "1 1 200px", // Grow and shrink, base size 200px
      fontSize: "14px",
      color: "#444",
      lineHeight: "2",
    },
    productImg: {
      width: "100px", // Fixed width but small for responsiveness
      height: "100px",
      borderRadius: "12px",
      objectFit: "cover",
      border: "1px solid #ddd",
    },
    sectionTitle: {
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
      margin: "0 0 15px 0",
    },
    formGroup: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: "12px",
      gap: "10px",
    },
    label: {
      flex: "0.4",
      fontSize: "14px",
      color: "#555",
      fontWeight: "500",
    },
    input: {
      flex: "1",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #dce0e6",
      fontSize: "15px",
      outline: "none",
      width: "100%", // Ensures full width in containers
      boxSizing: "border-box",
    },
    halfRow: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
      width: "100%",
    },
    btn: {
      width: "100%",
      padding: "15px",
      backgroundColor: "#635acc",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "20px",
      boxShadow: "0 4px 10px rgba(99, 90, 204, 0.3)",
    },
    scannerSection: {
      width: "100%",
      maxWidth: "450px",
      textAlign: "center",
    },
    scannerPlaceholder: {
      border: "2px dashed #ccc",
      borderRadius: "15px",
      padding: "10px",
      marginTop: "10px",
      backgroundColor: "rgba(255,255,255,0.5)",
      minHeight: "250px", // Space for camera
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.container}>
      <Toaster />

      {/* 1. Item Card (Top) */}
      <div style={styles.card}>
        <h2 style={styles.itemNo}>{product.itemNo}</h2>
        <div style={styles.badge}>Box #{scannedBoxSerial}</div>
        <div style={styles.divider}></div>

        <div style={styles.infoGrid}>
          <div style={styles.details}>
            <div>
              <b>Length:</b> {product.length}
            </div>
            <div>
              <b>Qty/Box:</b> {product.noOfSticks} sticks
            </div>
            <div>
              <b>Total Boxes:</b> {product.boxes?.length}
            </div>
            <div>
              <b>Operator:</b> {product.operators?.[0]?.name}
            </div>
          </div>
          <img
            src={product.productImageUrl}
            alt="Profile"
            style={styles.productImg}
          />
        </div>
      </div>

      {/* 2. Record Movement Card (Middle) */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Record Movement</h3>
        <div style={styles.divider}></div>

        <div style={styles.formGroup}>
          <label style={styles.label}>To Company:</label>
          <select
            style={styles.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="3B Profiles">3B Profiles</option>
            <option value="BI Profiles">BI Profiles</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>To Client:</label>

          <input
            type="text"
            style={styles.input}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter client name"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Direction:</label>
          <select
            style={styles.input}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Stock OUT">Stock OUT</option>
            <option value="Stock IN">Stock IN</option>
          </select>
        </div>

        <div style={styles.halfRow}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "5px",
                color: "#555",
              }}
            >
              Total Sticks:
            </label>
            <input
              type="text"
              style={styles.input}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "5px",
                color: "#555",
              }}
            >
              Total Boxes:
            </label>
            <input
              type="text"
              style={styles.input}
              value={boxes}
              onChange={(e) => setBoxes(e.target.value)}
            />
          </div>
        </div>

        <button style={styles.btn} onClick={handleMove}>
          Confirm Movement
        </button>
      </div>

      {/* 3. Scanner (Bottom) */}
      <div style={styles.scannerSection}>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Point camera at QR code
        </p>
        <div style={styles.scannerPlaceholder}>
          <QrCodeScanner onScanResult={handleScan} />
        </div>
        {loading && (
          <p style={{ marginTop: "10px", color: "#635acc", fontWeight: "600" }}>
            Searching database...
          </p>
        )}
      </div>
    </div>
  );
};

export default InventoryScannerPage;
