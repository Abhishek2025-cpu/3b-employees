import React, { useState } from "react";
import QrCodeScanner from "./QRScanner"; // Assuming you have this component

const ProductScannerPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Action/Form states (For updating stock/moving)
  const [actionType, setActionType] = useState("IN"); // IN or OUT
  const [actionQty, setActionQty] = useState("");
  const [actionBoxes, setActionBoxes] = useState("");

  // Base API URL
  const API_BASE = "https://threebapi-1067354145699.asia-south1.run.app/api";

  const handleScan = async (scanned) => {
    if (!scanned) return;
    setLoading(true);
    setError("");
    setProduct(null);

    try {
      // 1. Extract ID from QR Code
      // Logic: If it's a URL, grab the last segment. If raw ID, use as is.
      let id = scanned;
      if (scanned.includes("/")) {
        const parts = scanned.split("/");
        // remove potential query params or file extensions if scanning the qrCodeUrl directly
        let lastPart = parts[parts.length - 1]; 
        if (lastPart.includes(".png")) lastPart = lastPart.split(".png")[0];
        if (lastPart.includes("qr-")) lastPart = lastPart.split("qr-")[1];
        id = lastPart;
      }
      
      // Clean whitespace just in case
      id = id.trim();

      console.log("🔍 Fetching Product ID:", id);

      // 2. Fetch Product Details
      const response = await fetch(`${API_BASE}/products/${id}`);
      const json = await response.json();

      console.log("✅ API Response:", json);

      if (json.success && json.product) {
        setProduct(json.product);
      } else {
        setError(json.message || "Product not found");
      }

    } catch (err) {
      console.error("Scanning Error:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!product) return;
    if (!actionQty) return alert("Please enter a quantity");

    try {
      // NOTE: Adjust this endpoint to whatever your backend uses for updating stock
      // Since you only provided the GET endpoint, I am assuming a generic update endpoint here
      const response = await fetch(
        `${API_BASE}/inventory/move/${product._id}`, 
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: actionType,
            qty: Number(actionQty),
            numberOfBoxes: Number(actionBoxes) || 0,
            // Add other fields if your backend requires them (e.g., toCompany)
          })
        }
      );

      const json = await response.json();

      if (response.ok || json.success) {
        alert("✅ Stock Updated Successfully");
        
        // Optimistic UI Update
        const change = Number(actionQty);
        setProduct(prev => ({
          ...prev,
          quantity: actionType === "IN" ? prev.quantity + change : prev.quantity - change
        }));

        setActionQty("");
        setActionBoxes("");
      } else {
        alert("❌ " + (json.message || "Failed to update stock"));
      }
    } catch (err) {
      alert("Error sending update");
    }
  };

  // Helper to get main image
  const mainImage = product?.images?.length > 0 
    ? product.images[0].url 
    : "https://via.placeholder.com/150?text=No+Image";

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>🔍 Product Scanner</h2>

      {/* 1. SCANNER SECTION */}
      <div style={styles.scannerBox}>
         <QrCodeScanner onScanResult={handleScan} />
         {loading && <p style={styles.loadingText}>Fetching product data...</p>}
         {error && <p style={styles.errorText}>{error}</p>}
      </div>

      {/* 2. PRODUCT DETAILS CARD */}
      {product && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.productName}>{product.name}</h3>
            <span style={styles.badge}>{product.dimensions?.[0] || "N/A"}</span>
          </div>

          <div style={styles.productBody}>
            <img src={mainImage} alt={product.name} style={styles.productImage} />
            
            <div style={styles.productInfo}>
              <p style={styles.infoRow}>
                <span style={styles.label}>Description:</span> <br/>
                {product.description}
              </p>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Stock</span>
                  <span style={styles.statValue}>{product.quantity}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Box Qty</span>
                  <span style={styles.statValue}>{product.totalPiecesPerBox}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RECENT ORDERS (New Feature based on JSON) */}
          {product.orders && product.orders.length > 0 && (
            <div style={styles.ordersSection}>
              <h4 style={styles.sectionTitle}>Recent Orders</h4>
              <div style={styles.orderList}>
                {product.orders.map((order, idx) => (
                  <div key={idx} style={styles.orderItem}>
                    <div>
                      <div style={styles.customerName}>{order.customerName}</div>
                      <div style={styles.orderDate}>{new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={styles.orderQty}>{order.qty} pcs</div>
                      <div style={styles.orderStatus(order.orderStatus)}>{order.orderStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. ACTION CARD (Update Inventory) */}
      {product && (
        <div style={{...styles.card, backgroundColor: "#f0fdf4", borderColor: "#86efac"}}>
          <h3 style={{...styles.sectionTitle, color: "#166534"}}>Update Stock</h3>
          
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Action</label>
              <select 
                style={styles.input} 
                value={actionType} 
                onChange={(e) => setActionType(e.target.value)}
              >
                <option value="IN">ADD Stock (+)</option>
                <option value="OUT">REMOVE Stock (-)</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Quantity</label>
              <input 
                type="number" 
                style={styles.input} 
                value={actionQty}
                onChange={(e) => setActionQty(e.target.value)}
                placeholder="0"
              />
            </div>

            <div style={{gridColumn: "span 2"}}>
               <label style={styles.label}>Number of Boxes (Optional)</label>
               <input 
                  type="number" 
                  style={styles.input} 
                  value={actionBoxes}
                  onChange={(e) => setActionBoxes(e.target.value)}
                  placeholder="0"
               />
            </div>
          </div>

          <button style={styles.button} onClick={handleUpdateStock}>
            Confirm Update
          </button>
        </div>
      )}
    </div>
  );
};

// --- INLINE STYLES ---
const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" },
  pageTitle: { textAlign: "center", color: "#333", marginBottom: "20px" },
  
  scannerBox: { border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "10px", marginBottom: "20px", textAlign: "center" },
  loadingText: { color: "#64748b", fontWeight: "500", marginTop: "10px" },
  errorText: { color: "#ef4444", fontWeight: "bold", marginTop: "10px" },

  card: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px", marginBottom: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" },
  productName: { margin: 0, fontSize: "1.25rem", color: "#1e293b" },
  badge: { backgroundColor: "#3b82f6", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "bold" },
  
  productBody: { display: "flex", gap: "15px", marginBottom: "15px" },
  productImage: { width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" },
  productInfo: { flex: 1 },
  infoRow: { margin: "0 0 10px 0", fontSize: "0.9rem", color: "#475569" },
  
  statsGrid: { display: "flex", gap: "10px" },
  statBox: { backgroundColor: "#f8fafc", padding: "8px", borderRadius: "6px", flex: 1, textAlign: "center", border: "1px solid #e2e8f0" },
  statLabel: { display: "block", fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" },
  statValue: { display: "block", fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" },

  // Orders Section
  ordersSection: { marginTop: "15px", borderTop: "1px solid #e2e8f0", paddingTop: "15px" },
  sectionTitle: { margin: "0 0 10px 0", fontSize: "1rem", color: "#334155" },
  orderList: { maxHeight: "150px", overflowY: "auto" },
  orderItem: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" },
  customerName: { fontWeight: "600", fontSize: "0.9rem" },
  orderDate: { fontSize: "0.8rem", color: "#94a3b8" },
  orderQty: { fontWeight: "bold", fontSize: "0.9rem" },
  orderStatus: (status) => ({
    fontSize: "0.75rem",
    color: status === "Pending" ? "#d97706" : "#16a34a",
    fontWeight: "600"
  }),

  // Form
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" },
  label: { display: "block", fontSize: "0.85rem", marginBottom: "4px", fontWeight: "500", color: "#475569" },
  input: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }
};

export default ProductScannerPage;