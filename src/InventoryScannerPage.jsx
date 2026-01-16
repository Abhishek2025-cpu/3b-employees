import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";
import toast, { Toaster } from "react-hot-toast";

const InventoryScannerPage = () => {
  // --- States ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Selection Mode: 'client' or 'company'
  const [mode, setMode] = useState("client"); 
  const [company, setCompany] = useState("3B Profiles");
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0); 
  const [qty, setQty] = useState("");
  const [direction, setDirection] = useState("Stock OUT");

  // --- Scan Functionality ---
  const handleScan = async (scanned) => {
    if (loading) return;
    setLoading(true);
    try {
      let id = scanned;
      if (scanned.includes("/")) {
        const parts = scanned.split("/");
        id = parts[parts.length - 1];
      }

      const response = await fetch(
        `https://threebapi-1067354145699.asia-south1.run.app/api/products/scan/${id}`
      );
      const data = await response.json();

      if (data.success && data.product) {
        setProduct(data.product);
        
        // Form setup
        if (data.product.orders && data.product.orders.length > 0) {
          setSelectedOrderIndex(0);
          setQty(data.product.orders[0].quantity.toString());
          setMode("client");
        } else {
          setQty("0");
          setMode("company");
        }
        
        toast.success("Product Loaded Successfully");
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching product data");
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (index) => {
    setSelectedOrderIndex(index);
    const orderQty = product.orders[index].quantity;
    setQty(orderQty.toString());
  };

  const handleMove = async () => {
    if (!product) return toast.error("Please scan a product first");
    if (!qty) return toast.error("Please enter quantity");

    setLoading(true);
    try {
      // Get role from local storage
      const userRole = localStorage.getItem("role") || "Staff";

      // Helper function to extract ID safely
      const mapImageId = (img) => {
        const id = img._id || img.id;
        return id ? { _id: id } : null;
      };

      const payload = {
        productName: product.name,
        productQty: product.quantity, 
        mrpPerBox: product.mrpPerBox,
        // Mapping images safely - filtering out nulls
        productImages: (product.images || []).map(mapImageId).filter(Boolean),
        colorImages: product.colorImageMap ? 
                     Object.values(product.colorImageMap).map(mapImageId).filter(Boolean) : [],
        filledBy: userRole,
        toCompany: mode === "company" ? company : null,
        toClient: mode === "client" ? product.orders[selectedOrderIndex]?.customerName : null,
        qtyByClient: Number(qty),
        direction: direction === "Stock OUT" ? "Out" : "In"
      };

      console.log("Sending Payload:", payload); // Debugging ke liye

      const response = await fetch("https://threebapi-1067354145699.asia-south1.run.app/api/products/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Movement Saved!");
        setQty("");
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const styles = {
    container: { backgroundColor: "#f4f7fa", minHeight: "100vh", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Segoe UI', sans-serif" },
    card: { backgroundColor: "#fff", borderRadius: "18px", border: "1px solid #e0e6ed", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", width: "100%", maxWidth: "450px", padding: "20px", marginBottom: "20px", position: "relative", boxSizing: "border-box" },
    badge: { position: "absolute", top: "15px", right: "15px", backgroundColor: "#389e52", color: "white", padding: "6px 14px", borderRadius: "10px", fontSize: "14px", fontWeight: "bold" },
    title: { color: "#635acc", fontSize: "22px", fontWeight: "bold", margin: "0 0 10px 0", paddingRight: "80px" },
    divider: { height: "1px", backgroundColor: "#eee", margin: "5px 0 15px 0" },
    infoGrid: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" },
    details: { fontSize: "14px", color: "#444", lineHeight: "1.8", flex: 1 },
    colorImgContainer: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" },
    roundImg: { width: "38px", height: "38px", borderRadius: "50%", border: "2px solid #fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", objectFit: "cover" },
    productMainImg: { width: "100px", height: "100px", borderRadius: "12px", objectFit: "cover", border: "1px solid #ddd" },
    formGroup: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "12px", gap: "10px" },
    label: { flex: "0.4", fontSize: "14px", color: "#555", fontWeight: "500" },
    input: { flex: "1", padding: "10px", borderRadius: "8px", border: "1px solid #dce0e6", fontSize: "14px", outline: "none" },
    btn: { width: "100%", padding: "15px", backgroundColor: "#635acc", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
    scannerPlaceholder: { border: "2px dashed #ccc", borderRadius: "15px", padding: "10px", backgroundColor: "#fff", minHeight: "250px", width: "100%", maxWidth: "450px" },
    radioContainer: { display: 'flex', gap: '15px', marginBottom: '15px', justifyContent: 'center' },
    radioLabel: { fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <Toaster />

      {/* 1. Item Card */}
      {product ? (
        <div style={styles.card}>
          <div style={styles.badge}>Box: {product.quantity}</div>
          <h2 style={styles.title}>{product.name}</h2>
          <div style={styles.divider}></div>
          <div style={styles.infoGrid}>
            <div style={styles.details}>
              <div><b>Description:</b> {product.description}</div>
              <div><b>MRP Per Box:</b> ₹{product.mrpPerBox}</div>
              <div><b>Total Pcs:</b> {product.totalPiecesPerBox}</div>
              <div style={{marginTop: '10px'}}>
                <b>Colors:</b>
                <div style={styles.colorImgContainer}>
                  {product.colorImageMap && Object.values(product.colorImageMap).map((img, index) => (
                    <img key={index} src={img.url} alt="color" style={styles.roundImg} />
                  ))}
                </div>
              </div>
            </div>
            <img src={product.images?.[0]?.url} alt="Main" style={styles.productMainImg} />
          </div>
        </div>
      ) : (
        <div style={styles.card}><p style={{ textAlign: "center", color: "#999" }}>Scan QR code to see details</p></div>
      )}

      {/* 2. Record Movement Card */}
      <div style={styles.card}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>Record Movement</h3>
        <div style={styles.divider}></div>

        {/* Exclusive Selection */}
        <div style={styles.radioContainer}>
           <label style={styles.radioLabel}>
             <input type="radio" checked={mode === 'company'} onChange={() => setMode('company')} /> To Company
           </label>
           <label style={styles.radioLabel}>
             <input type="radio" checked={mode === 'client'} onChange={() => setMode('client')} /> To Client
           </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>To Company:</label>
          <select 
            style={{...styles.input, backgroundColor: mode !== 'company' ? '#f5f5f5' : '#fff'}} 
            value={company} 
            onChange={(e) => setCompany(e.target.value)}
            disabled={mode !== 'company'}
          >
            <option value="3B Profiles">3B Profiles</option>
            <option value="BI Profiles">BI Profiles</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>To Client:</label>
          <select
            style={{...styles.input, backgroundColor: mode !== 'client' ? '#f5f5f5' : '#fff'}}
            value={selectedOrderIndex}
            onChange={(e) => handleClientChange(e.target.value)}
            disabled={!product || mode !== 'client'}
          >
            {product?.orders?.length > 0 ? (
              product.orders.map((order, idx) => <option key={idx} value={idx}>{order.customerName}</option>)
            ) : (
              <option>No Customers Found</option>
            )}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Direction:</label>
          <select style={styles.input} value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="Stock OUT">Stock OUT</option>
            <option value="Stock IN">Stock IN</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity:</label>
          <input type="number" style={styles.input} value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>

        <button style={{...styles.btn, opacity: !product ? 0.6 : 1}} onClick={handleMove} disabled={!product || loading}>
          {loading ? "Saving..." : "Confirm Movement"}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "450px", textAlign: "center" }}>
        <div style={styles.scannerPlaceholder}><QrCodeScanner onScanResult={handleScan} /></div>
      </div>
    </div>
  );
};

export default InventoryScannerPage;

/*import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";
import toast, { Toaster } from "react-hot-toast";

const InventoryScannerPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scannedBoxSerial, setScannedBoxSerial] = useState(null);

  // Movement form states
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [boxes, setBoxes] = useState("");

  const handleScan = async (scanned) => {
    if (loading) return;
    setLoading(true);

    try {
      // Logic to extract ID or Item Number from QR
      // If your QR contains the ID directly:
      let id = scanned;

      // If your QR contains a URL like .../inventory/691ae8df...
      if (scanned.includes("/inventory/")) {
        id = scanned.split("/inventory/")[1];
      }

      const response = await fetch(
        `https://threebapi-1067354145699.asia-south1.run.app/api/items/${id}`
      );

      const item = await response.json();
      console.log("SCAN RESPONSE:", item);

      if (!item || !item._id) {
        toast.error("Product not found");
        return;
      }

      setProduct(item);

      // Attempt to identify which specific box was scanned based on the QR string
      const matchedBox = item.boxes?.find((b) =>
        scanned.includes(b.boxSerialNo)
      );
      if (matchedBox) {
        setScannedBoxSerial(matchedBox.boxSerialNo);
        setBoxes("1"); // Default move to 1 box if specific box scanned
        setQty(item.noOfSticks.toString()); // Default to full box qty
      }

      toast.success("Item Loaded: " + item.itemNo);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching item details");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async () => {
    if (!company || !type || !qty || !boxes) {
      alert("Please fill all fields");
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
            qty,
            numberOfBoxes: boxes,
            type,
            boxSerial: scannedBoxSerial, // Sending specific serial if known
          }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        alert("Movement Recorded Successfully");
        // Reset form but keep product visible
        setQty("");
        setBoxes("");
        setCompany("");
        setType("");
      } else {
        alert(json.message || "Failed to record movement");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending movement data");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: "500px", margin: "0 auto" }}>
      <Toaster />
      <h2 style={{ textAlign: "center", color: "#333" }}>Inventory Scanner</h2>

      <div
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          border: "2px solid #ddd",
        }}
      >
        <QrCodeScanner onScanResult={handleScan} />
      </div>

      {loading && <p style={{ textAlign: "center" }}>Searching database...</p>}

      {product && (
        <div
          style={{
            marginTop: 25,
            padding: 20,
            borderRadius: 12,
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, color: "#4A90E2" }}>{product.itemNo}</h3>
            {scannedBoxSerial && (
              <span
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                Box #{scannedBoxSerial}
              </span>
            )}
          </div>
          <hr style={{ margin: "12px 0", border: "0.5px solid #eee" }} />

          <p>
            <b>Length:</b> {product.length}
          </p>
          <p>
            <b>Qty/Box:</b> {product.noOfSticks} sticks
          </p>
          <p>
            <b>Total Boxes:</b> {product.boxes?.length || 0}
          </p>
          <p>
            <b>Operator:</b> {product.operators?.[0]?.name || "N/A"}
          </p>

          <img
            src={product.productImageUrl}
            alt="Product"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        </div>
      )}

      {product && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 12,
            backgroundColor: "#f0f4ff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Record Movement</h3>

          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: "bold", fontSize: "14px" }}>
              To Company:
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginTop: 5,
              }}
            >
              <option value="">Select Company</option>
              <option value="3B">3B Profiles</option>
              <option value="BI">BI Profiles</option>
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: "bold", fontSize: "14px" }}>
              Direction:
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginTop: 5,
              }}
            >
              <option value="">Select Type</option>
              <option value="IN">Stock IN</option>
              <option value="OUT">Stock OUT</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                Total Sticks:
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  marginTop: 5,
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", fontSize: "14px" }}>
                Total Boxes:
              </label>
              <input
                type="number"
                value={boxes}
                onChange={(e) => setBoxes(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  marginTop: 5,
                }}
              />
            </div>
          </div>

          <button
            onClick={handleMove}
            style={{
              width: "100%",
              padding: 14,
              backgroundColor: "#6f42c1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 20,
              boxShadow: "0 4px 6px rgba(111, 66, 193, 0.3)",
            }}
          >
            Confirm Movement
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryScannerPage;*/
