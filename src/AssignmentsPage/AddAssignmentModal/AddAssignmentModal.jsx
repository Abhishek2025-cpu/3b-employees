import React, { useState, useEffect } from "react";
import assignMachineWithOperator from "../../api/allApi/assignMachine.js";
import { toast } from "react-toastify";

const WorkerFormModal = ({ show, onClose, onSubmitSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    time: "9-10",
    shift: "",
    frameLength: "",
    numberOfBox: "",
    boxWeight: "",
    frameWeight: "",
    description: "",
    machineId: "",
    machineNumber: "",
    mainItemId: "",
    itemName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  if (!show) return;

  // Get values from localStorage
  const storedItemNo = localStorage.getItem("currentItemNo") || "";
  const storedMachineNo = localStorage.getItem("currentMachineNo") || "";
  const storedItemId = localStorage.getItem("currentItemId") || "";
  const storedMachineId = localStorage.getItem("currentMachineId") || "";

  // Machine number from initialData
  const machineNumberFromInitial =
    initialData?.machineNumber && initialData?.machineNumber !== "N/A"
      ? initialData.machineNumber
      : initialData?.machine?.name && initialData?.machine?.name !== "N/A"
      ? initialData.machine.name
      : "";

  // Item name from initialData
  const itemNameFromInitial =
    initialData?.itemNo ||
    initialData?.product?.name?.trim() ||
    "";

  // Machine _id from initialData
  const machineIdFromInitial =
    initialData?.machineId && initialData.machineId !== "N/A"
      ? initialData.machineId
      : initialData?.machine?._id && initialData.machine._id !== "N/A"
      ? initialData.machine._id
      : "";

  // Item _id from initialData
  const itemIdFromInitial =
    initialData?.mainItemId || initialData?.itemId || initialData?._id || "";

  // Update form data
  setFormData({
    time: "9-10",
    shift: initialData?.shift || "",
    frameLength: "",
    numberOfBox: "",
    boxWeight: "",
    frameWeight: "",
    description: initialData?.description || "",

    // MACHINE
    machineId: machineIdFromInitial || storedMachineId || "",
    machineNumber: machineNumberFromInitial || storedMachineNo || "",

    // ITEM
    mainItemId: itemIdFromInitial || storedItemId || "",
    itemName: itemNameFromInitial || storedItemNo || "",
  });

  // Store machine and item _id in localStorage for global access
  if (itemIdFromInitial) localStorage.setItem("currentItemId", itemIdFromInitial);
  if (machineIdFromInitial) localStorage.setItem("currentMachineId", machineIdFromInitial);

  setIsSubmitting(false);
}, [show, initialData]);




  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const employeeId = localStorage.getItem("_id");
  const machineName = localStorage.getItem("currentMachineNo");   // "9"
  const itemName = localStorage.getItem("currentItemNo");         // "Shining Gold"

  if (!employeeId) {
    toast.error("Employee ID not found in localStorage");
    return;
  }

  if (!machineName || !itemName) {
    toast.error("Machine number and Item name are required");
    return;
  }

  setIsSubmitting(true);

  try {
    const frameArray = formData.frameLength
      .split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (frameArray.length === 0) {
      toast.warning("Please provide valid frame lengths.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      time: [formData.time],
      shift: formData.shift,
      frameLength: frameArray,
      numberOfBox: Number(formData.numberOfBox),
      boxWeight: Number(formData.boxWeight),
      frameWeight: Number(formData.frameWeight),
      description: formData.description || "",
      employeeId,

      // ⬇️ **Now sending machine number + item name as strings**
      machineName: machineName,
      itemName: itemName,
    };

    console.log("🚀 Payload being sent:", payload);

    const response = await assignMachineWithOperator(payload);

    if (response.success) {
      toast.success("Worker task added successfully!");
      onSubmitSuccess?.();
      onClose();
    } else {
      toast.error(response.message || "Failed to add worker");
    }
  } catch (err) {
    console.error("Error adding worker:", err);
    toast.error("Error adding worker");
  } finally {
    setIsSubmitting(false);
  }
};



  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <h5>Add Worker Task</h5>

          <form onSubmit={handleSubmit}>

            {/* Item Name */}
            <div className="mb-2">
              <label>Item</label>
              <input
                type="text"
                className="form-control"
                value={formData.itemName}
                readOnly
              />
            </div>

            {/* Machine Name */}
            <div className="mb-2">
              <label>Machine</label>
              <input
                type="text"
                className="form-control"
                value={formData.machineNumber}
                readOnly
              />
            </div>

            {/* Time Slot */}
            <div className="mb-2">
              <label>Time Slot</label>
              <select
                id="time"
                className="form-select"
                value={formData.time}
                onChange={handleChange}
              >
                {[
                  "9-10","10-11","11-12","12-1","1-2","2-3",
                  "3-4","4-5","5-6","6-7","7-8","8-9",
                ].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Shift */}
            <div className="mb-2">
              <label>Shift</label>
              <select
                id="shift"
                className="form-select"
                value={formData.shift}
                onChange={handleChange}
                required
              >
                <option value="">Select Shift</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </div>

            {/* Frame Length */}
            <div className="mb-2">
              <label>Frame Length (comma-separated)</label>
              <input
                type="text"
                id="frameLength"
                className="form-control"
                placeholder="e.g. 452,453,454"
                value={formData.frameLength}
                onChange={handleChange}
                required
              />
            </div>

            {/* Number of Box */}
            <div className="mb-2">
              <label>Number of Box</label>
              <input
                type="number"
                id="numberOfBox"
                className="form-control"
                value={formData.numberOfBox}
                onChange={handleChange}
                required
              />
            </div>

            {/* Box Weight */}
            <div className="mb-2">
              <label>Box Weight</label>
              <input
                type="number"
                id="boxWeight"
                className="form-control"
                value={formData.boxWeight}
                onChange={handleChange}
                required
              />
            </div>

            {/* Frame Weight */}
            <div className="mb-2">
              <label>Frame Weight</label>
              <input
                type="number"
                id="frameWeight"
                className="form-control"
                value={formData.frameWeight}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-2">
              <label>Description (Optional)</label>
              <textarea
                id="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-dark w-100" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </form>

          <button className="btn btn-outline-secondary mt-2 w-100" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerFormModal;
