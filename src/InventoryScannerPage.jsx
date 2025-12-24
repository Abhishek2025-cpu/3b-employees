import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";
import toast, { Toaster } from 'react-hot-toast';

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
      const matchedBox = item.boxes?.find(b => scanned.includes(b.boxSerialNo));
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
            boxSerial: scannedBoxSerial // Sending specific serial if known
          })
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
      <h2 style={{ textAlign: 'center', color: '#333' }}>Inventory Scanner</h2>

      <div style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid #ddd' }}>
        <QrCodeScanner onScanResult={handleScan} />
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Searching database...</p>}

      {/* PRODUCT DETAILS CARD */}
      {product && (
        <div
          style={{
            marginTop: 25,
            padding: 20,
            borderRadius: 12,
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #eee"
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ margin: 0, color: '#4A90E2' }}>{product.itemNo}</h3>
             {scannedBoxSerial && (
                <span style={{ backgroundColor: '#28a745', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  Box #{scannedBoxSerial}
                </span>
             )}
          </div>
          <hr style={{ margin: '12px 0', border: '0.5px solid #eee' }} />

          <p><b>Length:</b> {product.length}</p>
          <p><b>Qty/Box:</b> {product.noOfSticks} sticks</p>
          <p><b>Total Boxes:</b> {product.boxes?.length || 0}</p>
          <p><b>Operator:</b> {product.operators?.[0]?.name || 'N/A'}</p>

          <img
            src={product.productImageUrl}
            alt="Product"
            style={{ width: "100%", height: '180px', objectFit: 'cover', borderRadius: 10, marginTop: 10 }}
          />
        </div>
      )}

      {/* MOVEMENT FORM CARD */}
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
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>To Company:</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 5 }}
            >
              <option value="">Select Company</option>
              <option value="3B">3B Profiles</option>
              <option value="BI">BI Profiles</option>
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Direction:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 5 }}
            >
              <option value="">Select Type</option>
              <option value="IN">Stock IN</option>
              <option value="OUT">Stock OUT</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Total Sticks:</label>
                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 5 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Total Boxes:</label>
                <input
                    type="number"
                    value={boxes}
                    onChange={(e) => setBoxes(e.target.value)}
                    style={{ width: "100%", padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 5 }}
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
              boxShadow: '0 4px 6px rgba(111, 66, 193, 0.3)'
            }}
          >
            Confirm Movement
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryScannerPage;
