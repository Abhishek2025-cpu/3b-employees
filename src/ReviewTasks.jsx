import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewTasks.css";

// Simple SVG Icons to avoid external dependency issues
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ cursor: "pointer", color: "#007bff" }}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const ReviewTasks = () => {
  const [helpers, setHelpers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedHelper, setSelectedHelper] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // local map of edited rows: { [taskId]: { ...editedFields } }
  const [editedRows, setEditedRows] = useState({});

  // Fetch helpers
  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const res = await axios.get(
          "https://threebapi-1067354145699.asia-south1.run.app/api/staff/get-employees"
        );
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const helpersOnly = list.filter((emp) =>
          emp.role?.toLowerCase().includes("helper")
        );
        setHelpers(helpersOnly);
      } catch (err) {
        console.error("Error fetching helpers:", err);
      }
    };
    fetchHelpers();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://threebapi-1067354145699.asia-south1.run.app/api/items/get-Allitems"
        );
        const list = res?.data?.data || res?.data || [];
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Fetch tasks
const fetchTasks = async () => {
  if (!selectedHelper) {
    alert("Please select a helper");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.get(
      `https://threebapi-1067354145699.asia-south1.run.app/api/workers/employee-task/${selectedHelper}`
    );

    let data = res.data?.data || [];
    console.log("RAW DATA:", data);

    // 🔥 FIX: convert selectedProduct ID → product name
    const selectedProductObj = products.find(p => p._id === selectedProduct);
    const selectedProductName = selectedProductObj?.itemName?.toLowerCase()?.trim();

    // Product filter
    if (selectedProductName) {
      data = data.filter(
        (task) =>
          task.item?.toLowerCase().trim() === selectedProductName
      );
    }

    // Date filter (timezone safe)
    if (selectedDate) {
      data = data.filter((task) => {
        const d = new Date(task.createdAt).toLocaleDateString("en-CA");
        return d === selectedDate;
      });
    }

    // Initialize editedRows
    const initialEdited = {};
    data.forEach((t) => {
      initialEdited[t._id] = {
        numberOfBox: t.numberOfBox ?? "",
        boxWeight: String(t.boxWeight ?? "").replace(/kg$/i, "").trim(),
        frameWeight: String(t.frameWeight ?? "").replace(/kg$/i, "").trim(),
        frameLength: Array.isArray(t.frameLength)
          ? t.frameLength.join(", ")
          : t.frameLength || "",
        description: t.description ?? "",
      };
    });

    setTasks(data);
    setEditedRows(initialEdited);

  } catch (err) {
    console.error("Error fetching tasks:", err);
    setTasks([]);
    setEditedRows({});
  } finally {
    setLoading(false);
  }
};


  // Toggle inline edit
const handleToggleEdit = (taskId) => {
  setEditedRows((prev) => {
    // If we are NOT currently editing this row, initialize the data
    if (!prev[taskId]) {
      const t = tasks.find((x) => x._id === taskId);
      
      return {
        ...prev,
        [taskId]: {
          numberOfBox: t?.numberOfBox ?? "",
          boxWeight: String(t?.boxWeight ?? "").replace(/kg$/i, "").trim(),
          frameWeight: String(t?.frameWeight ?? "").replace(/kg$/i, "").trim(),
          
          // UPDATED SECTION:
          // Keep it as an array. If it's a single string, wrap it in an array.
          // If it's empty, return an empty array or an array with one empty string.
          frameLength: Array.isArray(t?.frameLength) 
            ? [...t.frameLength] // Create a copy of the existing array
            : (t?.frameLength ? [t.frameLength] : [""]), // Wrap single value or default to empty field
            
          description: t?.description ?? "",
          __editing: true,
        },
      };
    }
    
    // If we are already editing, just toggle the boolean
    return { 
      ...prev, 
      [taskId]: { 
        ...prev[taskId], 
        __editing: !prev[taskId].__editing 
      } 
    };
  });
};

  const handleRowChange = (taskId, field, value) => {
    setEditedRows((prev) => ({ ...prev, [taskId]: { ...prev[taskId], [field]: value } }));
  };

  // Save single row
  const handleSaveRow = async (taskId) => {
    const edited = editedRows[taskId];
    if (!edited) return;

    // Convert comma separated string back to array for frameLength
    const frameLengthArray = edited.frameLength
      .toString()
      .split(",")
      .map(str => str.trim())
      .filter(Boolean); // remove empty strings

    const payload = {
      numberOfBox: edited.numberOfBox,
      boxWeight: isNaN(Number(edited.boxWeight)) ? edited.boxWeight : `${edited.boxWeight}kg`,
      frameWeight: isNaN(Number(edited.frameWeight)) ? edited.frameWeight : `${edited.frameWeight}kg`,
      frameLength: frameLengthArray, 
      description: edited.description,
    };

    try {
      await axios.put(
        `https://threebapi-1067354145699.asia-south1.run.app/api/workers/update-task/${taskId}`,
        payload
      );

      // Reflect changes in UI
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...payload } : t)));
      setEditedRows((prev) => ({ ...prev, [taskId]: { ...prev[taskId], __editing: false } }));
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancelEdit = (taskId) => {
    setEditedRows((prev) => ({ ...prev, [taskId]: { ...prev[taskId], __editing: false } }));
  };

  const handleSubmitAll = async () => {
    if (tasks.length === 0) {
      alert("No tasks to submit.");
      return;
    }

    const payloadTasks = tasks.map((t) => {
      const edited = editedRows[t._id] || {};
      
      // Logic to handle unsaved edits during submit-all if needed, 
      // currently taking values from edit state if present, else original
      let fLength = t.frameLength;
      if(edited.frameLength) {
         fLength = edited.frameLength.toString().split(",").map(s=>s.trim()).filter(Boolean);
      }

      return {
        _id: t._id,
        numberOfBox: edited.numberOfBox ?? t.numberOfBox,
        boxWeight: edited.boxWeight ? (isNaN(Number(edited.boxWeight)) ? edited.boxWeight : `${edited.boxWeight}kg`) : t.boxWeight,
        frameWeight: edited.frameWeight ? (isNaN(Number(edited.frameWeight)) ? edited.frameWeight : `${edited.frameWeight}kg`) : t.frameWeight,
        frameLength: fLength,
        description: edited.description ?? t.description,
        employee: t.employee?._id,
        item: t.item?._id,
      };
    });

    const confirmMsg = `Submit ${payloadTasks.length} tasks for ${selectedDate || "selected date / all dates"}?`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://threebapi-1067354145699.asia-south1.run.app/api/workers/submit-tasks",
        {
          helperId: selectedHelper,
          date: selectedDate || null,
          tasks: payloadTasks,
        }
      );
      alert(res.data?.message || "Tasks submitted successfully");
      fetchTasks();
    } catch (err) {
      console.error("Error submitting tasks:", err);
      alert("Failed to submit tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-task-page container">
      <h1 className="page-title">Review & Correct Tasks</h1>

      <div className="filters-wrapper">
        <div className="filter">
          <label>Helper</label>
          <select value={selectedHelper} onChange={(e) => setSelectedHelper(e.target.value)}>
            <option value="">-- Select Helper --</option>
            {helpers.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Product</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">-- All Products --</option>
            {filteredProducts.map((p) => (
              <option key={p._id} value={p._id}>
                {p.itemNo || p.productDetails?.name || p.product?.name || p._id}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Date</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        <div className="filter actions">
          <button className="btn primary" onClick={fetchTasks} disabled={!selectedHelper}>
            Fetch Tasks
          </button>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loader">Loading…</div>
        ) : (
          <>
            <div className="table-header">
              <div className="summary">
                <span>Helper: <strong>{helpers.find(h => h._id === selectedHelper)?.name || "—"}</strong></span>
                <span>Product: <strong>{products.find(p => p._id === selectedProduct)?.itemNo || "All"}</strong></span>
                <span>Date: <strong>{selectedDate || "All"}</strong></span>
              </div>

              <div className="submit-all">
                {/* Changed class to 'btn primary' to match Fetch button */}
                <button className="btn primary" onClick={handleSubmitAll} disabled={tasks.length === 0}>
                  Submit All Tasks
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="rt-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Time</th>
                    {/* <th>Description</th> */}
                    <th>Frame Lengths</th>
                    <th>No. of Boxes</th>
                    <th>Box Weight</th>
                    <th>Frame Weight</th>
                    <th>Description</th>
                    {/* Header renamed from Action to Correction */}
                    <th>Correction</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="9" className="empty">No tasks found</td>
                    </tr>
                  )}

                  {tasks.map((task, idx) => {
                    const edit = editedRows[task._id] || {};
                    const isEditing = Boolean(edit.__editing);

                    return (
                      <tr key={task._id}>
                        <td>{idx + 1}</td>

                        <td>
                          <div className="time-badges">
                            {task.time?.map((t, i) => (
                              <span key={i} className="badge time">{t}</span>
                            ))}
                          </div>
                        </td>

                     

                        <td>
                          {isEditing ? (
                            /* Inline edit for Frame Lengths */
                            <input
                                className="small-input"
                                value={edit.frameLength}
                                placeholder="e.g. 12, 14"
                                onChange={(e) => handleRowChange(task._id, "frameLength", e.target.value)}
                            />
                          ) : (
                            <div className="frame-badges">
                                {task.frameLength?.map((f, i) => (
                                <span key={i} className="badge frame">{f}</span>
                                ))}
                            </div>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="small-input"
                              value={edit.numberOfBox}
                              onChange={(e) => handleRowChange(task._id, "numberOfBox", e.target.value)}
                            />
                          ) : (
                            task.numberOfBox
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="small-input"
                              value={edit.boxWeight}
                              onChange={(e) => handleRowChange(task._id, "boxWeight", e.target.value)}
                            />
                          ) : (
                            task.boxWeight
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="small-input"
                              value={edit.frameWeight}
                              onChange={(e) => handleRowChange(task._id, "frameWeight", e.target.value)}
                            />
                          ) : (
                            task.frameWeight
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <textarea
                              className="desc-input"
                              value={edit.description}
                              onChange={(e) => handleRowChange(task._id, "description", e.target.value)}
                            />
                          ) : (
                            task.description || "—"
                          )}
                        </td>

                        <td>
                          {!isEditing ? (
                            /* Replaced text button with Edit Icon */
                            <div onClick={() => handleToggleEdit(task._id)} title="Correct Task">
                              <EditIcon />
                            </div>
                          ) : (
                            <div className="row-actions">
                              <button className="btn small primary" onClick={() => handleSaveRow(task._id)}>
                                Save
                              </button>
                              <button className="btn small outline" onClick={() => handleCancelEdit(task._id)}>
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewTasks;