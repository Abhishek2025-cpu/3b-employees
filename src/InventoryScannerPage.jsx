import React, { useState } from "react";
import QrCodeScanner from "./QRScanner";

const ProductQRScannerPage = () => {
  const [product, setProduct] = useState(null);

  // --- QR SCAN HANDLER ---
  const handleScan = async (scanned) => {
    try {
      let id = scanned;

      // QR Looks like: .../products/69297babd361a0a6eddbddfc
      if (scanned.includes("/products/")) {
        id = scanned.split("/products/")[1];
      }

      if (!id) return alert("Invalid QR Code");

      const response = await fetch(`https://threebapi-1067354145699.asia-south1.run.app/api/products/${id}`);

      const json = await response.json();
      console.log("PRODUCT SCAN:", json);

      if (!json.product) {
        alert("Product not found");
        return;
      }

      setProduct(json.product);

    } catch (err) {
      console.error("SCAN ERROR:", err);
      alert("Error scanning QR");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product QR Scanner</h2>

      <QrCodeScanner onScanResult={handleScan} />

      {/* PRODUCT CARD */}
      {product && (
        <div
          style={{
            marginTop: 25,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#f3f3f3",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "360px",
          }}
        >
          <h3>Product Details</h3>

          <p><b>Name:</b> {product.name}</p>
          <p><b>Description:</b> {product.description}</p>

          <p>
            <b>Dimensions:</b> {product.dimensions?.join(", ")}
          </p>

          <p><b>Quantity:</b> {product.quantity}</p>

          <img
            src={product.images?.[0]?.url}
            alt="Product"
            style={{ width: "100%", borderRadius: 10, marginTop: 10 }}
          />

          <br /><br />

          {/* ORDERS LIST */}
          <h4>Orders</h4>
          {product.orders && product.orders.length > 0 ? (
            product.orders.map((order, index) => (
              <div
                key={index}
                style={{
                  padding: 10,
                  background: "#fff",
                  borderRadius: 6,
                  marginBottom: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p><b>Customer:</b> {order.customerName}</p>
                <p><b>Qty:</b> {order.qty}</p>
                <p><b>Status:</b> {order.orderStatus}</p>
                <p><b>Date:</b> {new Date(order.orderDate).toDateString()}</p>
              </div>
            ))
          ) : (
            <p>No orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductQRScannerPage;
