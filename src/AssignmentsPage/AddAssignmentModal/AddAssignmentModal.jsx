import React, { useState, useEffect, useRef } from 'react';

import { getAssignmentsByEmployee } from "../../api/allApi/getAsignMachine.js";

import assignMachineWithOperator from "../../api/allApi/assignMachine.js";


const AddAssignmentModal = ({ show, onClose, initialData, onSubmitSuccess, employeeId }) => {
  const [formData, setFormData] = useState({
    machineId: '',
    machineName: '',
    employeeId: '',
    employeeName: '',
    mainItemId: '',
    mainItemNo: '',
    date: '',
    time: '9 - 10 A.M',
    mainItemShift: '',
    operatorTableShift: '',
    frameLength: '',
    numberOfBox: '',
    boxWeight: '',
    frameWeight: '',
    description: '',
    selfieUrl: '',
  });

  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSuccess, setToastSuccess] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        if (!employeeId) return;

        const assignments = await getAssignmentsByEmployee(employeeId);

        console.log("Fetched Assignments:", assignments);

        if (assignments.length > 0) {
          const firstAssignment = assignments[0];
          const machine = firstAssignment.machine;
          const employee = firstAssignment.employees[0];
          const mainItem = firstAssignment.mainItem;

          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          const formattedDate = `${yyyy}-${mm}-${dd}`;

          setFormData(prev => ({
            ...prev,
            machineId: machine?._id || '',
            machineName: machine?.name || '',
            employeeId: employee?._id || '',
            employeeName: employee?.name || '',
            mainItemId: mainItem?._id || '',
            mainItemNo: mainItem?.itemNo || '',
            mainItemShift: mainItem?.shift?.toLowerCase() || '',
            date: formattedDate,
          }));
        }
      } catch (error) {
        console.error("Error loading assignment details:", error);
      }
    };

    if (show) {
      fetchAssignmentDetails();
      setFormData({
        machineId: '',
        machineName: '',
        employeeId: '',
        employeeName: '',
        mainItemId: '',
        mainItemNo: '',
        date: '',
        time: '9 - 10 A.M',
        mainItemShift: '',
        operatorTableShift: '',
        frameLength: '',
        numberOfBox: '',
        boxWeight: '',
        frameWeight: '',
        description: '',
        selfieUrl: '',
      });
      setSelectedImage(null);
      setImagePreviewUrl('');
      setConfirmChecked(false);
    }
  }, [show, employeeId]);


  const showToast = (message, isSuccess = true) => {
    setToastMessage(message);
    setToastSuccess(isSuccess);
    const toastEl = document.getElementById('operatorFormToast');
    if (toastEl) {
      const bsToast = new window.bootstrap.Toast(toastEl, { delay: 3000 });
      bsToast.show();
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setConfirmChecked(checked);
    } else {
      setFormData(prevData => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreviewUrl('');
    }
  };

  const handleSelfieButtonClick = () => {
    fileInputRef.current.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!confirmChecked) {
      showToast("Please confirm before submitting.", false);
      return;
    }

    if (!formData.operatorTableShift) {
        showToast("Please select the shift for this assignment.", false);
        return;
    }

    setIsSubmitting(true);

    try {
      console.log("🟢 --- FORM SUBMISSION STARTED ---");
      console.log("🧾 Current Form Data:", formData);
      console.log("🖼️ Selected Image Object:", selectedImage);

      const formDataToSend = new FormData();

      formDataToSend.append("machineId", formData.machineId);
      formDataToSend.append("mainItemId", formData.mainItemId);
      formDataToSend.append("shift", formData.mainItemShift);
      formDataToSend.append("employeeIds", formData.employeeId);


      console.log("⚙️ Required Fields Added");

      const operatorTable = [
        {
          // Removed: date: formData.date, <--- THIS LINE IS REMOVED
          time: formData.time,
          shift: formData.operatorTableShift,
          frameLength: formData.frameLength.split(",").map(num => Number(num.trim())),
          numberOfBox: Number(formData.numberOfBox),
          boxWeight: formData.boxWeight + "kg",
          frameWeight: formData.frameWeight + "kg",
          description: formData.description,
        },
      ];


      console.log("📊 Operator Table Object:", operatorTable);

      formDataToSend.append("operatorTable", JSON.stringify(operatorTable));

      if (selectedImage) {
        formDataToSend.append("operatorImages", selectedImage);
        console.log("📸 Image appended to formData:", selectedImage.name, selectedImage.type, selectedImage.size);
      }

      console.group("📦 FormData Contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      console.groupEnd();

      const response = await assignMachineWithOperator(formDataToSend);

      if (response.success) {
        showToast("✅ Machine assigned successfully!");
        onSubmitSuccess?.();
        onClose();
      } else {
        showToast(response.message || "Failed to assign machine.", false);
      }
    } catch (error) {
      console.error("Error assigning machine:", error);
      showToast("Server error while assigning machine.", false);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!show) {
    return null;
  }

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📋 {initialData ? 'Edit Assignment' : 'Add New Assignment'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-cpu"></i> Machine</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.machineName}
                    readOnly
                  />
                  <input type="hidden" value={formData.machineId} />
                </div>

                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-person-badge"></i> Employee</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.employeeName}
                    readOnly
                  />
                  <input type="hidden" value={formData.employeeId} />
                </div>

                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-box-seam"></i> Item No / Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={formData.mainItemNo}
                    readOnly
                  />
                  <input type="hidden" value={formData.mainItemId} />
                </div>

                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-calendar3"></i> Date</label>
                  <input type="date" className="form-control form-control-sm" id="date" value={formData.date} onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="mainItemShift" className="form-label">
                  <i className="bi bi-briefcase me-2"></i>Main Item Shift (from API)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mainItemShift"
                  value={formData.mainItemShift === 'day' ? '🌞 Day Shift' : formData.mainItemShift === 'night' ? '🌙 Night Shift' : ''}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="time" className="form-label"><i className="bi bi-clock-history me-2"></i>Time</label>
                <select className="form-select" id="time" value={formData.time} onChange={handleChange}>
                  <option value="9 - 10 A.M">9:00 - 10:00 A.M</option>
                  <option value="10 - 11 A.M">10:00 - 11:00 A.M</option>
                  <option value="11 - 12 A.M">11:00 - 12:00 A.M</option>
                  <option value="12 - 1 P.M">12:00 - 1:00 P.M</option>
                  <option value="1 - 2 P.M">1:00 - 2:00 P.M</option>
                  <option value="2 - 3 P.M">2:00 - 3:00 P.M</option>
                  <option value="3 - 4 P.M">3:00 - 4:00 P.M</option>
                  <option value="4 - 5 P.M">4:00 - 5:00 P.M</option>
                  <option value="5 - 6 P.M">5:00 - 6:00 P.M</option>
                  <option value="6 - 7 P.M">6:00 - 7:00 P.M</option>
                  <option value="7 - 8 P.M">7:00 - 8:00 P.M</option>
                  <option value="8 - 9 P.M">8:00 - 9:00 P.M</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="operatorTableShift" className="form-label">
                  <i className="bi bi-brightness-alt-high-fill me-2"></i>Assignment Shift <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="operatorTableShift"
                  value={formData.operatorTableShift}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Shift for this Assignment</option>
                  <option value="day">🌞 Day Shift</option>
                  <option value="night">🌙 Night Shift</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-arrows-expand"></i>Frame Length</label>
                <input type="text" className="form-control" id="frameLength" placeholder="e.g. 455,455,452,454" required value={formData.frameLength} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-stack"></i>Number of Box</label>
                <input type="number" className="form-control" id="numberOfBox" placeholder="e.g. 1" required value={formData.numberOfBox} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-box"></i>Box Weight (Kg)</label>
                <input type="number" className="form-control" id="boxWeight" placeholder="e.g. 50" required value={formData.boxWeight} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-sliders"></i>Frame Weight(g)</label>
                <input type="number" className="form-control" id="frameWeight" placeholder="e.g. 300" required value={formData.frameWeight} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-chat-left-dots"></i>Description</label>
                <textarea className="form-control" id="description" rows="2" placeholder="B/Quality, Power cut, Total waste" value={formData.description} onChange={handleChange}></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-camera"></i> Selfie Upload</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="form-control"
                  accept="image/*"
                  capture="user"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={handleSelfieButtonClick}
                >
                  <i className="bi bi-camera-fill me-2"></i> Take Photo or Choose from Gallery
                </button>

                {(imagePreviewUrl || formData.selfieUrl) && (
                  <div className="mt-3 text-center">
                    <p className="mb-2">Image Preview:</p>
                    <img
                      src={imagePreviewUrl || formData.selfieUrl}
                      alt="Selfie Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                      className="img-thumbnail"
                    />
                    {imagePreviewUrl && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreviewUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="confirmCheck" checked={confirmChecked} onChange={handleChange} />
                <label className="form-check-label" htmlFor="confirmCheck">
                  I confirm that the details entered are correct.
                </label>
              </div>

              <button type="submit" className="btn btn-dark w-100 submit-btn" disabled={!confirmChecked || isSubmitting}>
                <span id="submitText" className={isSubmitting ? 'd-none' : ''}><i className="bi bi-save"></i> {initialData ? 'Update' : 'Save'}</span>
                <span id="submitLoader" className={`spinner-border spinner-border-sm ${isSubmitting ? '' : 'd-none'}`}></span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="operatorFormToast" className={`toast align-items-center text-white border-0 ${toastSuccess ? 'bg-success' : 'bg-danger'}`} role="alert">
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;