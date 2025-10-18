import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // For handling file uploads

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "10px",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    width: "100%",
    maxWidth: "420px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#452983",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    minHeight: "80px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "15px",
  },
  button: {
    flex: 1,
    minWidth: "100px",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#452983",
    color: "#fff",
  },
  updateButton: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  operatorToggle: {
    backgroundColor: "#eee",
    border: "1px solid #aaa",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "0.95rem",
  },
  fileInputLabel: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#555",
    textAlign: "left",
  },
  fileInput: {
    display: "none",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "150px",
    objectFit: "contain",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid #eee",
    borderRadius: "5px",
  },
};

export default function AddAssignmentModal({
  show,
  onClose,
  onSave,
  onUpdate,
  form,
  onChange,
  isUpdate = false,
}) {
  const [showOperatorFields, setShowOperatorFields] = useState(false);
  const [localOperator, setLocalOperator] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLocalOperator(form.operatorTable || {});
    // Clear selected image when modal opens for a new assignment or updates
    setSelectedImageFile(null);
  }, [form.operatorTable, show]);

  if (!show) return null;

  const handleOperatorChange = (e) => {
    const { name, value } = e.target;
    setLocalOperator((prev) => ({
      ...prev,
      [name]:
        name === "frameLength"
          ? value
          : name === "numberOfBox"
            ? Number(value)
            : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const CLOUDINARY_UPLOAD_PRESET = "YOUR_CLOUDINARY_UPLOAD_PRESET"; // Replace with your preset
    const CLOUDINARY_CLOUD_NAME = "dvumlrxml"; // Replace with your cloud name
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url; // Returns the secure URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

 const handleSaveOrUpdate = async () => {
  // Handle image upload first (already done)
  let imageUrl = localOperator.image || "";
  if (selectedImageFile) {
    const uploadedUrl = await uploadImageToCloudinary(selectedImageFile);
    if (!uploadedUrl) return alert("Failed to upload image.");
    imageUrl = uploadedUrl;
  }

  const finalData = {
    ...form,
    operatorTable: {
      ...localOperator,
      frameLength:
        typeof localOperator.frameLength === "string" &&
        localOperator.frameLength.includes(",")
          ? localOperator.frameLength.split(",").map(num => Number(num.trim()))
          : localOperator.frameLength,
      image: imageUrl,
    },
  };

  // Call the parent handleSave
  onSave(finalData);
};


  const imagePreviewUrl = selectedImageFile
    ? URL.createObjectURL(selectedImageFile)
    : localOperator.image;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <h2 style={modalStyles.title}>
          {isUpdate ? "Update Assignment" : "Add Assignment"}
        </h2>

        {/* Machine ID & Employee IDs - readonly */}
        <input
          type="text"
          placeholder="Machine Name"
          value={form.machineName || ""}
          readOnly
          style={modalStyles.input}
        />

        <input
          type="text"
          placeholder="Employee Name"
          value={form.employeeName || ""}
          readOnly
          style={modalStyles.input}
        />

        {/* Editable Fields */}
        <input
          type="text"
          name="mainItemId"
          placeholder="Item Name"
          value={form.mainItemId || ""}
          onChange={onChange}
          style={modalStyles.input}
        />
        <select
          name="shift"
          value={form.shift || ""}
          onChange={onChange}
          style={modalStyles.input}
        >
          <option value="">Select Shift</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>

        {/* Toggle Operator Fields */}
        <div
          style={modalStyles.operatorToggle}
          onClick={() => setShowOperatorFields(!showOperatorFields)}
        >
          {showOperatorFields
            ? "Hide Operator Fields ▲"
            : "Show Operator Fields ▼"}
        </div>

        {showOperatorFields && (
          <>
            <select
              name="shift"
              value={localOperator.shift || ""}
              onChange={handleOperatorChange}
              style={modalStyles.input}
            >
              <option value="">Select Operator Shift</option>
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>
            <input
              type="time" // Changed to time input type
              name="time"
              placeholder="Time"
              value={localOperator.time || ""}
              onChange={handleOperatorChange}
              style={modalStyles.input}
            />
            <input
              type="text"
              name="frameLength"
              placeholder="Frame Length (comma separated)"
              value={localOperator.frameLength || ""}
              onChange={handleOperatorChange}
              style={modalStyles.input}
            />
            <input
              type="number"
              name="numberOfBox"
              placeholder="Number of Box"
              value={localOperator.numberOfBox || ""}
              onChange={handleOperatorChange}
              style={modalStyles.input}
            />
            <input
              type="text"
              name="boxWeight"
              placeholder="Box Weight"
              value={localOperator.boxWeight || ""}
              onChange={handleOperatorChange}
              style={modalStyles.input}
            />
            <input
              type="text"
              name="frameWeight"
              placeholder="Frame Weight"
              value={localOperator.frameWeight || ""}
              onChange={handleOperatorChange}
              style={modalStyles.input}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={localOperator.description || ""}
              onChange={handleOperatorChange}
              style={modalStyles.textarea}
            />

            {/* Image Upload Option */}
            <label htmlFor="image-upload" style={modalStyles.fileInputLabel}>
              {selectedImageFile
                ? selectedImageFile.name
                : localOperator.image
                  ? "Change Image"
                  : "Upload Image"}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={modalStyles.fileInput}
            />
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Image Preview"
                style={modalStyles.imagePreview}
              />
            )}
          </>
        )}

        {/* Buttons */}
        <div style={modalStyles.buttonContainer}>
          <button
            style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            style={{ ...modalStyles.button, ...modalStyles.saveButton }}
            onClick={handleSaveOrUpdate}
          >
            {isUpdate ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}