import React, { useState } from "react";
import QrCodeScanner from "./QRScanner"; // Assuming this component exists in your project

const InventoryScannerPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Movement form states
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [boxes, setBoxes] = useState("");

  const handleScan = async (scanned) => {
    if (!scanned) return;
    setLoading(true);

    try {
      // 1. Extract ID if the scan is a URL
      let id = scanned;
      if (scanned.includes("/inventory/")) {
        // Example: https://.../inventory/692e8056...
        const parts = scanned.split("/inventory/");
        id = parts[1].split("/")[0]; // Handle trailing slashes if any
      } else if (scanned.includes("inventory_qrcodes")) {
         // Fallback if scanning the raw text from the QR example provided
         // logic to extract ID if needed, otherwise assume raw ID
      }

      console.log("🔍 Fetching ID:", id);

      const response = await fetch(
        `https://threebapi-1067354145699.asia-south1.run.app/api/products/${id}`
      );

      const json = await response.json();
      console.log("✅ API Response:", json);

      // 2. Extract Data based on your JSON structure
      // The response is { data: { ...productDetails } }
      if (json.data) {
        setProduct(json.data);
        // Pre-fill form with current product stats if desired
        // setCompany(json.data.company); 
      } else {
        alert("Product data not found in response");
      }

    } catch (err) {
      console.error("Scanning Error:", err);
      alert("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async () => {
    if (!product) return;
    if (!company || !type || !qty || !boxes) {
      alert("Please fill all fields (Company, Type, Qty, Boxes)");
      return;
    }

    try {
      const response = await fetch(
        `https://threebapi-1067354145699.asia-south1.run.app/api/inventory/move/${product._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toCompany: company,
            qty: Number(qty), // Ensure numbers are sent as numbers
            numberOfBoxes: Number(boxes),
            type // "in" or "out" (matching your API expectations usually lowercase or as required)
          })
        }
      );

      const json = await response.json();

      if (response.ok) {
        alert("✅ Movement Recorded Successfully");
        
        // Update local product state to reflect changes immediately
        setProduct((prev) => ({
          ...prev,
          company: company, // Assuming move updates current company
          qty: type.toLowerCase() === 'in' ? prev.qty + Number(qty) : prev.qty - Number(qty), // Simple frontend calc
          numberOfBoxes: type.toLowerCase() === 'in' ? prev.numberOfBoxes + Number(boxes) : prev.numberOfBoxes - Number(boxes)
        }));

        // Reset form
        setQty("");
        setBoxes("");
        setCompany("");
        setType("");
      } else {
        alert("❌ " + (json.message || "Failed to record movement"));
      }
    } catch (err) {
      console.error(err);
      alert("Error sending movement data");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📦 Inventory Scanner</h2>

      {/* SCANNER SECTION */}
      <div style={{ border: "2px dashed #ccc", borderRadius: "10px", padding: "10px", marginBottom: "20px" }}>
         <QrCodeScanner onScanResult={handleScan} />
         {loading && <p style={{textAlign: "center"}}>Loading product data...</p>}
      </div>

      {/* PRODUCT DETAILS CARD */}
      {product && (
        <div style={cardStyle}>
          <div style={headerStyle}>
            <h3 style={{ margin: 0 }}>{product.productName}</h3>
            <span style={badgeStyle(product.status)}>{product.status?.toUpperCase() || "ACTIVE"}</span>
          </div>

          <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
            {/* Image */}
            <div style={{ flex: "0 0 100px" }}>
              <img
                src={product.productImage}
                alt={product.productName}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              />
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
              <p style={rowStyle}><strong>Current Loc:</strong> {product.company}</p>
              <p style={rowStyle}><strong>Total Qty:</strong> {product.qty}</p>
              <p style={rowStyle}><strong>Total Boxes:</strong> {product.numberOfBoxes}</p>
              <p style={{ ...rowStyle, fontSize: "12px", color: "#888" }}>
                ID: {product._id.substring(0, 10)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ACTION / MOVEMENT CARD */}
      {product && (
        <div style={{ ...cardStyle, backgroundColor: "#eef2ff", borderColor: "#c7d2fe" }}>
          <h3 style={{ marginTop: 0, color: "#4338ca" }}>Move Inventory</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            
            {/* Company */}
            <div>
              <label style={labelStyle}>To Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select...</option>
                <option value="3B">3B</option>
                <option value="BI">BI</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Action Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select...</option>
                <option value="in">IN (Add)</option>
                <option value="out">OUT (Remove)</option>
              </select>
            </div>

            {/* Qty */}
            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>

            {/* Boxes */}
            <div>
              <label style={labelStyle}>No. of Boxes</label>
              <input
                type="number"
                value={boxes}
                onChange={(e) => setBoxes(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
          </div>

          <button
            onClick={handleMove}
            style={buttonStyle}
          >
            Submit Movement
          </button>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: "20px",
  border: "1px solid #eee"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #f0f0f0",
  paddingBottom: "10px"
};

const rowStyle = {
  margin: "5px 0",
  fontSize: "14px",
  color: "#333"
};

const badgeStyle = (status) => ({
  backgroundColor: status === "active" ? "#d1fae5" : "#fee2e2",
  color: status === "active" ? "#065f46" : "#991b1b",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase"
});

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  marginBottom: "5px",
  color: "#555"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "14px"
};

const buttonStyle = {
  width: "100%",
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "background 0.2s"
};

export default InventoryScannerPage;