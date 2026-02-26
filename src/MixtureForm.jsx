import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const formStyles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: "'Roboto', sans-serif" },
  formCard: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', maxWidth: '800px', margin: '30px auto' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' },
  backButton: { background: 'none', border: 'none', color: '#452983', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' },
  title: { fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 },
  readOnlyFieldGroup: { marginBottom: '25px', padding: '15px 20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' },
  readOnlyLabel: { fontSize: '0.9rem', color: '#777', marginBottom: '5px', display: 'block' },
  readOnlyValue: { fontSize: '1.1rem', fontWeight: '500', color: '#333' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '0.95rem' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' },
  select: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', backgroundColor: 'white', appearance: 'none' },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' },
  saveButton: { backgroundColor: '#6f42c1', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s' },
  cancelButton: { backgroundColor: '#F44336', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s' },
  errorMessage: { color: '#dc3545', marginTop: '10px', textAlign: 'center' }
};

const MixtureForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
  "itemName": "Test Item",
  "machineNo": "3",
  "date": "2025-11-17",
  "shift": "Day",
  "mixtureId": "686e6c62e503b3b8b4c46644",
  "time": "9:00-10:00",
  "backDana": 0,
  "smoke": 0,
  "grayHips": 0,
  "eps": 0,
  "h1": 0,
  "blackGula": 0,
  "whiteGula": 0,
  "whiteGulaGrades": 0,
  "yellowForm": 0,
  "whiteFormOptional": 0,
  "zink": 0,
  "oil": 0,
});

  const [productName, setProductName] = useState('');
  const [mixtureName, setMixtureName] = useState('');
  const [machineDetails, setMachineDetails] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial form data
    const initialForm = JSON.parse(localStorage.getItem("initialMixtureForm"));
    if (initialForm) {
      setProductName(initialForm.productName || 'N/A');
      setMixtureName(initialForm.mixtureName || 'N/A');
      setMachineDetails(initialForm.machineNo || 'N/A');

      // Ensure mixtureId is saved
      if (!localStorage.getItem("mixtureId")) {
        localStorage.setItem("mixtureId", initialForm.mixtureId || localStorage.getItem("id"));
      }

      setFormData(prev => ({
        ...prev,
        date: initialForm.date || prev.date,
        shift: initialForm.shift || prev.shift,
        time: initialForm.time || prev.time
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemName = localStorage.getItem("currentItemNo");
      const itemId = localStorage.getItem("currentItemId");
      const machineNo = localStorage.getItem("currentMachineNo");
      const mixtureNameLS = localStorage.getItem("name");
      
      // ERROR FIX HERE: Agar mixtureId "null" string hai, toh use '_id' se replace karo
      let mixtureId = localStorage.getItem("mixtureId");
      if (!mixtureId || mixtureId === "null") {
        mixtureId = localStorage.getItem("_id"); // localStorage mein '_id' key hai aapke screenshot mein
      }

      if (!itemName || !machineNo || !mixtureId) {
        alert("Missing required info (Item, Machine, or ID). Please check login/selection.");
        setLoading(false);
        return;
      }

      const payload = {
        itemName,
        itemId,
        machineNo,
        mixtureId, // Ab yahan valid ID jayegi
        mixtureName: mixtureNameLS,
        date: formData.date,
        shift: formData.shift,
        time: formData.time,
        backDana: formData.backDana,
        smoke: formData.smoke,
        grayHips: formData.grayHips,
        eps: formData.eps,
        h1: formData.h1,
        yellowForm: formData.yellowForm,
        whiteFormOptional: formData.whiteFormOptional,
        zink: formData.zink,
        oil: formData.oil
      };

      console.log("Submitting Payload:", payload);

      const response = await fetch("https://threebapi-1067354145699.asia-south1.run.app/api/mixture-tables/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        alert("Mixture added successfully!");
        navigate('/assignments'); // Success ke baad wapas bhej do
      } else {
        // Agar abhi bhi error aaye toh server ka error message dikhao
        alert(result.error || result.message || "Failed to submit form");
      }

    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/assignments');
    window.location.reload();
  };

  return (
    <div style={formStyles.container}>
      <div style={formStyles.formCard}>
        <div style={formStyles.header}>
          <button style={formStyles.backButton} onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} /></button>
          <h2 style={formStyles.title}>Mixture Entry Form</h2>
        </div>

        <div style={formStyles.readOnlyFieldGroup}>
          <label style={formStyles.readOnlyLabel}>Product Name:</label>
          <span style={formStyles.readOnlyValue}>{productName}</span>
        </div>
        <div style={formStyles.readOnlyFieldGroup}>
          <label style={formStyles.readOnlyLabel}>Mixture Name:</label>
          <span style={formStyles.readOnlyValue}>{mixtureName}</span>
        </div>
        <div style={formStyles.readOnlyFieldGroup}>
          <label style={formStyles.readOnlyLabel}>Machine:</label>
          <span style={formStyles.readOnlyValue}>{machineDetails}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formStyles.formGrid}>
            {/* Date */}
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} style={formStyles.input} required />
            </div>

            {/* Shift */}
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Shift:</label>
              <select name="shift" value={formData.shift} onChange={handleChange} style={formStyles.select}>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>

            {/* Time */}
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Time Slot:</label>
              <input type="text" name="time" value={formData.time} onChange={handleChange} style={formStyles.input} required />
            </div>

            {/* Form Inputs */}
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>BackDana (kg):</label>
              <input type="number" name="backDana" value={formData.backDana} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Smoke (kg):</label>
              <input type="number" name="smoke" value={formData.smoke} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Gray HIPS (kg):</label>
              <input type="number" name="grayHips" value={formData.grayHips} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>EPS (kg):</label>
              <input type="number" name="eps" value={formData.eps} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>H1 (kg):</label>
              <input type="number" name="h1" value={formData.h1} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Yellow Form (gms):</label>
              <input type="number" name="yellowForm" value={formData.yellowForm} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>White Form Optional (gms):</label>
              <input type="number" name="whiteFormOptional" value={formData.whiteFormOptional} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Zink (gms):</label>
              <input type="number" name="zink" value={formData.zink} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>Oil (gms):</label>
              <input type="number" name="oil" value={formData.oil} onChange={handleChange} style={formStyles.input} min="0" step="0.1" required />
            </div>
          </div>

          {error && <p style={formStyles.errorMessage}>{error}</p>}

          <div style={formStyles.buttonGroup}>
            <button type="button" onClick={handleBack} style={formStyles.cancelButton}><FontAwesomeIcon icon={faTimes} /> Cancel</button>
            <button type="submit" style={formStyles.saveButton} disabled={loading}><FontAwesomeIcon icon={faSave} /> {loading ? 'Saving...' : 'Save Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MixtureForm;
