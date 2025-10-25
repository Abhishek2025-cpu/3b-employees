import React, { useState, useEffect } from 'react';
import { Toast } from 'bootstrap'; // Assuming Bootstrap JS is available globally or imported

const AddAssignmentModal = () => {
  const [formData, setFormData] = useState({
    modelNumber: '',
    machineNumber: '',
    date: '',
    time: '9 - 10 A.M',
    frameLength: '',
    numberOfBox: '',
    boxWeight: '',
    frameWeight: '',
    description: '',
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSuccess, setToastSuccess] = useState(true);

  // Effect to pre-fill form data from URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormData(prevData => ({
      ...prevData,
      machineNumber: params.get('machine') || '',
      modelNumber: params.get('model') || '',
      date: params.get('date') || '',
    }));
  }, []);

  // Function to show Bootstrap toast
  const showToast = (message, isSuccess = true) => {
    setToastMessage(message);
    setToastSuccess(isSuccess);
    const toastEl = document.getElementById('operatorFormToast');
    const bsToast = new Toast(toastEl, { delay: 3000 });
    bsToast.show();
  };

  // Input change handler
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

  // Validate frame length (same logic as in your HTML)
  const validateFrameLength = (str) => {
    const parts = str.split(',').map(s => s.trim());
    return parts.length >= 4 && parts.every(num => /^\d{3}$/.test(num));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { frameLength, numberOfBox, boxWeight, frameWeight } = formData;

    if (!validateFrameLength(frameLength)) {
      showToast("Frame length must include at least four 3-digit numbers.", false);
      return;
    }

    const payload = {
      time: formData.time,
      frameLength: frameLength.split(",").map(s => s.trim()),
      numberOfBox: parseInt(numberOfBox),
      boxWeight: parseInt(boxWeight),
      frameWeight: parseInt(frameWeight),
      description: formData.description.trim() || "NA",
      machineNumber: formData.machineNumber,
      modelNumber: formData.modelNumber,
      date: formData.date,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("https://b2b-1ccx.onrender.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        showToast("✅ Entry submitted successfully!");
        setTimeout(() => {
          window.location.href = "operator_machine.html"; // Redirect
        }, 1500);
      } else {
        showToast(`❌ Error: ${result.message}`, false);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("❌ Submission failed. Try again later.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container shadow-sm">
      <button className="back-btn p-0 border-0" onClick={() => window.history.back()} style={{ outline: 'none', background: 'none', fontSize: '24px', fontWeight: 'bold' }}>
        <i className="bi bi-arrow-left p-3 text-dark"></i>
      </button>

      <h4 className="text-center mb-4">📋 Operator Form</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label className="form-label"><i className="bi bi-cpu"></i> Model No</label>
            <input type="text" className="form-control form-control-sm" id="modelNumber" value={formData.modelNumber} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label"><i className="bi bi-hdd-network"></i> Machine No</label>
            <input type="text" className="form-control form-control-sm" id="machineNumber" value={formData.machineNumber} readOnly />
          </div>
          <div className="col-md-4">
            <label className="form-label"><i className="bi bi-calendar3"></i> Date</label>
            <input type="text" className="form-control form-control-sm" id="date" value={formData.date} readOnly />
          </div>
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

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="confirmCheck" checked={confirmChecked} onChange={handleChange} />
          <label className="form-check-label" htmlFor="confirmCheck">
            I confirm that the details entered are correct.
          </label>
        </div>

        <button type="submit" className="btn btn-dark w-100 submit-btn" disabled={!confirmChecked || isSubmitting}>
          <span id="submitText" className={isSubmitting ? 'd-none' : ''}><i className="bi bi-save"></i> Save</span>
          <span id="submitLoader" className={`spinner-border spinner-border-sm ${isSubmitting ? '' : 'd-none'}`}></span>
        </button>
      </form>

      {/* Toast */}
      <div className="toast-container">
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