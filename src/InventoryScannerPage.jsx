import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";

const InventoryScannerPage = () => {
  const [product, setProduct] = useState(null);

  const handleScan = async (scannedUrl) => {
    try {
      // Extract ID from scanned URL
      const id = scannedUrl.split("/inventory/")[1];

      if (!id) {
        alert("Invalid QR Code");
        return;
      }

      // Fetch product details
      const response = await fetch(
        `https://threebapi-1067354145699.asia-south1.run.app/api/inventory/single/${id}`
      );

      const json = await response.json();

      if (!json.data) {
        alert("Item not found");
        return;
      }

      setProduct(json.data);

    } catch (error) {
      console.error("Error scanning:", error);
      alert("Error fetching product");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory QR Scanner</h2>

      <QrCodeScanner onScanResult={handleScan} />

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
    </div>
  );
};

export default InventoryScannerPage;
