import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";

const InventoryScannerPage = () => {
  const [product, setProduct] = useState(null);

  // Movement form states
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [boxes, setBoxes] = useState("");

const handleScan = async (scanned) => {
  try {
    let id = scanned;

    if (scanned.includes("/inventory/")) {
      id = scanned.split("/inventory/")[1];
    }

    if (!id) return alert("Invalid QR Code");

    const response = await fetch(
      `https://threebapi-1067354145699.asia-south1.run.app/api/inventory/single/${id}`
    );

    const json = await response.json();
    console.log("SCAN RESPONSE:", json);

    const item =
      json.data?.item ||
      json.item ||
      json.data ||
      null;

    if (!item) {
      alert("Item not found in response");
      return;
    }

    setProduct(item);
  } catch (err) {
    console.error(err);
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
            type
          })
        }
      );

      const json = await response.json();

      if (response.ok) {
        alert("Movement Recorded Successfully");
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
    <div style={{ padding: 20 }}>
      <h2>Inventory QR Scanner</h2>

      <QrCodeScanner onScanResult={handleScan} />

      {/* PRODUCT CARD */}
      {product && (
        <div
          style={{
            marginTop: 25,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "340px",
          }}
        >
          <h3>Product Details</h3>

          <p><b>Name:</b> {product.productName}</p>
          <p><b>Company:</b> {product.company}</p>
          <p><b>Qty:</b> {product.qty}</p>
          <p><b>Boxes:</b> {product.numberOfBoxes}</p>

          <img
            src={product.productImage}
            alt="Product"
            style={{ width: "100%", borderRadius: 10, marginTop: 10 }}
          />
        </div>
      )}

      {/* MOVEMENT CARD */}
      {product && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#eef2ff",
            width: "340px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h3>Move Inventory</h3>

          {/* Company Dropdown */}
          <label>To Company:</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              marginTop: 5,
              marginBottom: 10,
            }}
          >
            <option value="">Select</option>
            <option value="3B">3B</option>
            <option value="BI">BI</option>
          </select>

          {/* Type */}
          <label>Type (IN / OUT):</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              marginTop: 5,
              marginBottom: 10,
            }}
          >
            <option value="">Select</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>

          {/* Qty */}
          <label>Qty:</label>
          <input
            type="text"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Enter quantity"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
            }}
          />

          {/* Boxes */}
          <label>Number of Boxes:</label>
          <input
            type="text"
            value={boxes}
            onChange={(e) => setBoxes(e.target.value)}
            placeholder="Enter number of boxes"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              marginBottom: 10,
            }}
          />

          {/* Submit */}
          <button
            onClick={handleMove}
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: "#6f42c1",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Submit Movement
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryScannerPage;
