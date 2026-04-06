import React, { useState, useEffect } from "react";
import assignMachineWithOperator from "../../api/allApi/assignMachine.js";
import { toast } from "react-toastify";
import { translations } from "./translation.js";

const AddAssignmentModal = ({
  show,
  onClose,
  onSubmitSuccess,
  initialData,
}) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  // 1. FORM STATE
  const [formData, setFormData] = useState({
    time: "9 AM - 10 AM",
    shift: "",
    frameLength: "",
    numberOfBox: "",
    boxWeight: "",
    frameWeight: "",
    description: "",
    wasteage: "",
    machineId: "",
    machineNumber: "",
    mainItemId: "",
    itemName: "",
  });

  const [selfie, setSelfie] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  // CURRENT UNIQUE KEY STORE KARNE KE LIYE
  const [currentKey, setCurrentKey] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const timeSlots = [
    "9 AM - 10 AM",
    "10 AM - 11 AM",
    "11 AM - 12 PM",
    "12 PM - 1 PM",
    "1 PM - 2 PM",
    "2 PM - 3 PM",
    "3 PM - 4 PM",
    "4 PM - 5 PM",
    "5 PM - 6 PM",
    "6 PM - 7 PM",
    "7 PM - 8 PM",
    "8 PM - 9 PM",
    "9 PM - 10 PM",
  ];

  // Helper Function: Unique ID generate karne ke liye
  const generateUniqueKey = (data) => {
    // Priority 1: Data from Props (initialData)
    let mName = data?.machineNumber;
    let iName = data?.itemName;

    // Priority 2: Data from LocalStorage (Fallback)
    if (!mName || mName === "N/A")
      mName = localStorage.getItem("currentMachineNo");
    if (!iName || iName === "N/A")
      iName = localStorage.getItem("currentItemNo");

    // Dono ko jod kar unique key banao. Example: "Machine-1_MDF-Frames"
    // Agar Machine Name same bhi hai par Item alag hai, to ye alag key banegi.
    return `${mName}_${iName}`.trim();
  };

  useEffect(() => {
    setFileName(translations[lang]?.noFileChosen || "No file chosen");
  }, [lang]);
  // 2. USE EFFECT - Load Data & Calculate Booked Slots
  useEffect(() => {
    if (!show) return;

    // Reset UI
    setSelfie(null);
    setPreview("");

    // --- FORM DATA SETTING (Previous Logic) ---
    const storedItemNo = localStorage.getItem("currentItemNo") || "";
    const storedMachineNo = localStorage.getItem("currentMachineNo") || "";
    const storedItemId = localStorage.getItem("currentItemId") || "";
    const storedMachineId = localStorage.getItem("currentMachineId") || "";

    const finalItemName =
      initialData?.itemName && initialData.itemName !== "N/A"
        ? initialData.itemName
        : storedItemNo;

    const finalMachineNumber =
      initialData?.machineNumber && initialData.machineNumber !== "N/A"
        ? initialData.machineNumber
        : storedMachineNo;

    const finalMachineId =
      initialData?.machineId || initialData?.machine?._id || storedMachineId;
    const finalItemId =
      initialData?.mainItemId ||
      initialData?.itemId ||
      initialData?._id ||
      storedItemId;

    setFormData({
      time: "9 AM - 10 AM",
      shift: initialData?.shift || "",
      frameLength: "",
      // FIX: Yahan No. of Sticks map ho jayega
      numberOfBox: initialData?.noOfSticks || "",
      boxWeight: "",
      frameWeight: "",
      description: initialData?.description || "",
      machineId: finalMachineId,
      machineNumber: finalMachineNumber,
      mainItemId: finalItemId,
      itemName: finalItemName,
    });
    setIsSubmitting(false);

    // --- DATE & UNIQUE BOOKING LOGIC ---
    const today = new Date().toDateString();
    const lastBookingDate = localStorage.getItem("lastBookingDate");

    const key = generateUniqueKey(initialData);
    setCurrentKey(key);

    console.log("Current Unique Key:", key);

    let allBookings = JSON.parse(
      localStorage.getItem("machineBookings") || "{}",
    );

    if (lastBookingDate !== today) {
      // Date badal gayi -> Sab clear karo
      localStorage.setItem("lastBookingDate", today);
      localStorage.setItem("machineBookings", JSON.stringify({}));
      setBookedSlots([]);
    } else {
      const slotsForThisMachine = allBookings[key] || [];
      setBookedSlots(slotsForThisMachine);
    }
  }, [show, initialData]);

  // Handle Text Inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Selfie
  const handleSelfieChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      setSelfie(file); // ✅ IMPORTANT (ye missing tha)
      setFileName(file.name);

      // preview ke liye (optional but useful)
      setPreview(URL.createObjectURL(file));
    } else {
      setSelfie(null);
      setFileName(translations[lang]?.noFile || "No file chosen");
      setPreview("");
    }
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeId = localStorage.getItem("_id");
    const machineName =
      formData.machineNumber || localStorage.getItem("currentMachineNo");
    const itemName = formData.itemName || localStorage.getItem("currentItemNo");

    if (!employeeId) return toast.error("Employee ID not found");
    if (!selfie) return toast.warning("Please take a selfie to save the form!");

    // Double Check: Kya ye slot current KEY ke liye booked hai?
    if (bookedSlots.includes(formData.time)) {
      toast.error("This time slot is already booked for this Item/Machine!");
      return;
    }

    setIsSubmitting(true);

    try {
      const frameArray = formData.frameLength
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n) && n > 0);

      const data = new FormData();
      data.append("selfie", selfie);
      data.append("time", JSON.stringify([formData.time]));
      data.append("shift", formData.shift);
      data.append("frameLength", JSON.stringify(frameArray));
      data.append("numberOfBox", Number(formData.numberOfBox));
      data.append("boxWeight", Number(formData.boxWeight));
      data.append("frameWeight", Number(formData.frameWeight));
      data.append("description", formData.description || "");
      data.append("employeeId", employeeId);
      data.append("machineName", machineName);
      data.append("itemName", itemName);

      const response = await assignMachineWithOperator(data);

      if (response.success) {
        toast.success(
          translations[lang]?.addWorkerTask + " " + translations[lang]?.save,
        );

        // --- SAVE TO LOCAL STORAGE (UNIQUE KEY BASED) ---
        const allBookings = JSON.parse(
          localStorage.getItem("machineBookings") || "{}",
        );

        // Current Key (Machine+Item) ka array nikalo
        const currentSlots = allBookings[currentKey] || [];

        // Naya time add karo
        currentSlots.push(formData.time);

        // Wapas object me dalo
        allBookings[currentKey] = currentSlots;

        // Save karo
        localStorage.setItem("machineBookings", JSON.stringify(allBookings));
        setBookedSlots(currentSlots);
        // ------------------------------------------------

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
          <h5>{translations[lang]?.addWorkerTask}</h5>

          {/* Debugging: Dikha sakte hain ki kaunse ID ke liye book ho raha hai */}
          {/* <small className="text-muted">Booking ID: {currentKey}</small> */}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>{translations[lang]?.item}</label>
              <input
                type="text"
                className="form-control"
                value={formData.itemName}
                readOnly
              />
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.machine}</label>
              <input
                type="text"
                className="form-control"
                value={formData.machineNumber}
                readOnly
              />
            </div>

            {/* Time Slot */}
            <div className="mb-2">
              <label>{translations[lang]?.timeSlot}</label>
              <select
                id="time"
                className="form-select"
                value={formData.time}
                onChange={handleChange}
              >
                {timeSlots.map((t) => {
                  const isDisabled = bookedSlots.includes(t);
                  return (
                    <option
                      key={t}
                      value={t}
                      disabled={isDisabled}
                      style={isDisabled ? { color: "#ccc" } : {}}
                    >
                      {t} {isDisabled ? "(Booked)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.shift}</label>
              <input
                type="text"
                id="shift"
                className="form-control"
                value={formData.shift}
                readOnly
              />
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.frameLength}</label>
              <input
                type="text"
                id="frameLength"
                className="form-control"
                value={formData.frameLength}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.noOfSticks}</label>
              <input
                type="text"
                id="numberOfBox"
                className="form-control"
                value={formData.numberOfBox}
                readOnly
              />
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.boxWeight}</label>
              <input
                type="number"
                id="boxWeight"
                className="form-control"
                value={formData.boxWeight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.frameWeight}</label>
              <input
                type="number"
                id="frameWeight"
                className="form-control"
                value={formData.frameWeight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.description}</label>
              <textarea
                id="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-2">
              <label>{translations[lang]?.totalWasteage}</label>
              <input
                type="Text"
                id="wasteage"
                className="form-control"
                placeholder={translations[lang]?.enterTotalWasteage}
                value={formData.wasteage || ""}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 border p-2 rounded bg-light">
              <label className="form-label fw-bold text-danger">
                {translations[lang]?.takeSelfie}
              </label>
              <div>
                {/* Hidden actual input */}
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  id="fileUpload"
                  onChange={handleSelfieChange}
                  style={{ display: "none" }}
                />

                {/* Custom UI */}
                <label
                  htmlFor="fileUpload"
                  className="px-4 py-2 bg-indigo-600 text-black  rounded-lg cursor-pointer hover:bg-indigo-700 transition duration-200"
                >
                  {translations[lang]?.chooseFile}
                </label>

                <span style={{ marginLeft: "10px" }}>{fileName}</span>
              </div>
              {preview && (
                <div className="mt-2 text-center">
                  <img
                    src={preview}
                    alt="Prev"
                    className="img-thumbnail"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : translations[lang]?.save}
            </button>
          </form>

          <button
            className="btn btn-outline-secondary mt-2 w-100"
            onClick={onClose}
          >
            {translations[lang]?.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
