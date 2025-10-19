import React, { useMemo, useState } from "react";

const ALL_OPTIONS = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

export default function SegmentModal({ onClose }) {
  const [segmentName, setSegmentName] = useState("");
  const [mainSelect, setMainSelect] = useState("");
  const [schemaList, setSchemaList] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Filter dropdown options that are not yet selected
  const mainOptions = useMemo(() => {
    return ALL_OPTIONS.filter(opt => !schemaList.includes(opt.value));
  }, [schemaList]);

  const labelFor = (value) => {
    const found = ALL_OPTIONS.find(o => o.value === value);
    return found ? found.label : "";
  };

  function handleAddSchema(e) {
    e.preventDefault();
    if (!mainSelect) return;
    setSchemaList(prev => [...prev, mainSelect]);
    setMainSelect("");
    setStatusMessage(null);
  }

  function handleChangeSchema(index, newValue) {
    setSchemaList(prev => {
      const next = [...prev];
      next[index] = newValue;
      return next;
    });
    setStatusMessage(null);
  }

  function handleRemoveSchema(index) {
    setSchemaList(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!segmentName.trim()) {
      setStatusMessage({ type: "error", text: "Please enter a segment name." });
      return;
    }
    if (schemaList.length === 0) {
      setStatusMessage({ type: "error", text: "Please add at least one schema." });
      return;
    }

    const schemaArray = schemaList.map(v => ({ [v]: labelFor(v) }));
    const payload = {
      segment_name: segmentName,
      schema: schemaArray
    };

    const WEBHOOK_URL = "http://localhost:5000/send-segment";

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload, null, 2)
      });

      if (res.ok || res.status === 200 || res.status === 201) {
        console.log("Sent payload:", payload);
        setShowSuccessPopup(true);
      } else {
        setStatusMessage({ type: "error", text: `Server responded with status ${res.status}` });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: `Failed to send: ${err.message}` });
    }
  }

  function optionsForIndex(index) {
    const used = schemaList.filter((_, i) => i !== index);
    return ALL_OPTIONS.filter(o => !used.includes(o.value));
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Save segment</h2>
          <button type="button" className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <label>
            Segment name
            <input
              value={segmentName}
              onChange={e => setSegmentName(e.target.value)}
              placeholder="e.g. last_10_days_blog_visits"
            />
          </label>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Add schema to segment</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                value={mainSelect}
                onChange={e => setMainSelect(e.target.value)}
                aria-label="Add schema to segment"
                style={{ width: "395px" }}
              >
                <option value="">-- select --</option>
                {mainOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button type="button" onClick={handleAddSchema} className="add-link">
                + Add
              </button>
            </div>
          </div>

          <div className="blue-box" style={{ marginTop: 16 }}>
            {schemaList.length === 0 && <p style={{ color: "#7c88de" }}>No schemas added yet</p>}
            {schemaList.map((val, idx) => (
              <div key={idx} className="schema-row">
                <select
                  value={val}
                  onChange={e => handleChangeSchema(idx, e.target.value)}
                >
                  <option value="">-- select --</option>
                  {optionsForIndex(idx).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button type="button" className="remove-btn" onClick={() => handleRemoveSchema(idx)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {statusMessage && statusMessage.type === "error" && (
            <div className="status error">
              {statusMessage.text}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={handleSave} className="primary-btn">Save the segment</button>
          <button type="button" onClick={onClose} className="secondary-btn">Cancel</button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <h3>Success</h3>
            <p>Your segment has been saved successfully.</p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessPopup(false);
                // Clear form after confirmation
                setSegmentName("");
                setSchemaList([]);
                setMainSelect("");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
