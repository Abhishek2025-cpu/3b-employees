import React, { useState, useEffect, useRef } from 'react';

const AddAssignmentModal = ({ show, onClose, initialData, onSubmitSuccess }) => {
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
    // New field for image URL (if storing URL in DB)
    selfieUrl: '',
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSuccess, setToastSuccess] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // To hold the File object
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // To hold the URL for preview

  const fileInputRef = useRef(null); // Ref to trigger file input click

  // Effect to populate form data when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        modelNumber: initialData.modelNumber || '',
        machineNumber: initialData.machineNumber || '',
        date: initialData.date || new Date().toISOString().slice(0, 10),
        time: initialData.time || '9 - 10 A.M',
        frameLength: initialData.frameLength || '',
        numberOfBox: initialData.numberOfBox || '',
        boxWeight: initialData.boxWeight || '',
        frameWeight: initialData.frameWeight || '',
        description: initialData.description || '',
        selfieUrl: initialData.selfieUrl || '', // Populate existing selfie URL
      });
      // Set image preview if an initial selfieUrl exists
      if (initialData.selfieUrl) {
        setImagePreviewUrl(initialData.selfieUrl);
      }
    } else {
      // Reset form for new assignment
      setFormData({
        modelNumber: '',
        machineNumber: '',
        date: new Date().toISOString().slice(0, 10), // Default to current date for new
        time: '9 - 10 A.M',
        frameLength: '',
        numberOfBox: '',
        boxWeight: '',
        frameWeight: '',
        description: '',
        selfieUrl: '',
      });
      setImagePreviewUrl(''); // Clear preview for new assignment
      setSelectedImage(null); // Clear selected file
    }
    setConfirmChecked(false); // Always uncheck on modal open/data change
  }, [initialData, show]);

  // Function to show Bootstrap toast (simplified, ensure Bootstrap Toast JS is loaded)
  const showToast = (message, isSuccess = true) => {
    setToastMessage(message);
    setToastSuccess(isSuccess);
    const toastEl = document.getElementById('operatorFormToast');
    if (toastEl) {
      const bsToast = new window.bootstrap.Toast(toastEl, { delay: 3000 });
      bsToast.show();
    }
  };

  // Input change handler for form fields
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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a URL for preview
    } else {
      setSelectedImage(null);
      setImagePreviewUrl('');
    }
  };

  // Trigger file input click (to open camera/gallery)
  const handleSelfieButtonClick = () => {
    fileInputRef.current.click();
  };

  // Validate frame length
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

    setIsSubmitting(true);

    // --- IMPORTANT: Handling file uploads requires FormData ---
    // If you need to upload an image along with other data,
    // you must use FormData and not JSON.
    const uploadFormData = new FormData();

    uploadFormData.append('time', formData.time);
    uploadFormData.append('frameLength', frameLength.split(",").map(s => s.trim()).join(',')); // Send as comma-separated string
    uploadFormData.append('numberOfBox', parseInt(numberOfBox));
    uploadFormData.append('boxWeight', parseInt(boxWeight));
    uploadFormData.append('frameWeight', parseInt(frameWeight));
    uploadFormData.append('description', formData.description.trim() || "NA");
    uploadFormData.append('machineNumber', formData.machineNumber);
    uploadFormData.append('modelNumber', formData.modelNumber);
    uploadFormData.append('date', formData.date);

    // Append the image file if selected
    if (selectedImage) {
      uploadFormData.append('selfie', selectedImage); // 'selfie' should be the field name your backend expects for the file
    } else if (formData.selfieUrl && !selectedImage) {
      // If there's an existing selfieUrl but no new image selected,
      // send the existing URL so the backend knows to keep it or update if needed.
      uploadFormData.append('selfieUrl', formData.selfieUrl);
    }


    if (initialData && initialData._id) {
      uploadFormData.append('_id', initialData._id); // Include _id for updates
    }


    try {
      const url = initialData && initialData._id
        ? "https://b2b-1ccx.onrender.com/update-assignment" // Assuming an update endpoint
        : "https://b2b-1ccx.onrender.com/submit"; // Your original submit endpoint

      const method = initialData && initialData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        // IMPORTANT: Do NOT set Content-Type header when sending FormData
        // The browser sets it automatically with the correct boundary.
        // headers: { "Content-Type": "application/json" }, // REMOVE THIS LINE
        body: uploadFormData // Send FormData directly
      });

      const result = await res.json();

      if (res.ok) {
        showToast(`✅ Entry ${initialData ? 'updated' : 'submitted'} successfully!`);
        if (onSubmitSuccess) {
          onSubmitSuccess(); // Notify parent to re-fetch assignments
        }
      } else {
        showToast(`❌ Error: ${result.message || 'Something went wrong'}`, false);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("❌ Submission failed. Try again later.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render nothing if not shown
  if (!show) {
    return null;
  }

  return (
    // Bootstrap Modal structure
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
                  <label className="form-label"><i className="bi bi-cpu"></i> Model No</label>
                  <input type="text" className="form-control form-control-sm" id="modelNumber" value={formData.modelNumber} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-hdd-network"></i> Machine No</label>
                  <input type="text" className="form-control form-control-sm" id="machineNumber" value={formData.machineNumber} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label"><i className="bi bi-calendar3"></i> Date</label>
                  <input type="date" className="form-control form-control-sm" id="date" value={formData.date} onChange={handleChange} />
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

              {/* --- Selfie Upload Section --- */}
              <div className="mb-3">
                <label className="form-label"><i className="bi bi-camera"></i> Selfie Upload</label>
                <input
                  type="file"
                  ref={fileInputRef} // Assign ref to the hidden input
                  className="form-control"
                  accept="image/*"
                  capture="user" // Suggests front camera on mobile
                  onChange={handleImageChange}
                  style={{ display: 'none' }} // Hide the actual input
                />
                <button
                  type="button"
                  className="btn btn-outline-primary w-100 mb-2"
                  onClick={handleSelfieButtonClick}
                >
                  <i className="bi bi-camera-fill me-2"></i> Take Photo or Choose from Gallery
                </button>

                {/* Image Preview */}
                {(imagePreviewUrl || formData.selfieUrl) && (
                  <div className="mt-3 text-center">
                    <p className="mb-2">Image Preview:</p>
                    <img
                      src={imagePreviewUrl || formData.selfieUrl} // Use new preview first, then existing URL
                      alt="Selfie Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                      className="img-thumbnail"
                    />
                    {imagePreviewUrl && ( // Only show clear button if a new image is selected
                       <button
                         type="button"
                         className="btn btn-sm btn-outline-danger mt-2"
                         onClick={() => {
                           setSelectedImage(null);
                           setImagePreviewUrl('');
                           if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
                         }}
                       >
                         Clear Image
                       </button>
                    )}
                  </div>
                )}
              </div>
              {/* --- End Selfie Upload Section --- */}


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

      {/* Toast - positioned at a fixed spot */}
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