import React, { useEffect, useRef } from 'react';

const RuleConfigModal = ({ open, onClose, rule }) => {
  const modalRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div ref={modalRef} style={styles.modal}>
        <h3>Rule Configuration</h3>

        <div style={styles.field}>
          <label>Response Name:</label>
          <input type="text" defaultValue={rule?.responseName || ''} />
        </div>

        <div style={styles.field}>
          <label>PDP:</label>
          <select>
            <option value="">Select</option>
            <option>PDP Option 1</option>
            <option>PDP Option 2</option>
          </select>
        </div>

        <div style={styles.field}>
          <label>Centile:</label>
          <select>
            <option value="">Select</option>
            <option>Low</option>
            <option>High</option>
          </select>
        </div>

        <div style={styles.field}>
          <label>BT:</label>
          <input type="text" />
        </div>

        <div style={styles.field}>
          <label>Range:</label>
          <input type="number" placeholder="Min" style={{ width: 60 }} />
          &nbsp;to&nbsp;
          <input type="number" placeholder="Max" style={{ width: 60 }} />
        </div>

        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, bottom: 0, right: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '320px',
    boxShadow: '0 0 12px rgba(0,0,0,0.2)'
  },
  field: {
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column'
  },
  closeButton: {
    marginTop: '12px',
    padding: '6px 12px'
  }
};

export default RuleConfigModal;