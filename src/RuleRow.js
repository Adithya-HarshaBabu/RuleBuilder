import React, { useState, useRef, useEffect } from 'react';
import RuleConfigModal from './RuleConfigModal';

const RuleRow = ({ rule, onChange, onDelete, readOnly, showLogic = true, onAddAfter}) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);



const [showConfigModal, setShowConfigModal] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    if (!readOnly && onChange) {
      onChange({ ...rule, [field]: value });
    }
  };

  return (
    <div className="rule-row" style={{ position: 'relative' }}>
      <select value={rule.field} onChange={(e) => handleChange('field', e.target.value)} disabled={readOnly}>
        <option value="">Select field</option>
        <option value="channel">channel</option>
        <option value="contract_type">contract type</option>
        <option value="#_of_lines"># of lines</option>
        <option value="tenure">tenure</option>
      </select>

      <select value={rule.operator} onChange={(e) => handleChange('operator', e.target.value)} disabled={readOnly}>
        <option value="=">=</option>
        <option value="<">&lt;</option>
        <option value=">">&gt;</option>
        <option value="in">in</option>
      </select>

      <input
        type="text"
        value={rule.value}
        onChange={(e) => handleChange('value', e.target.value)}
        disabled={readOnly}
      />

{!readOnly && (
  <>
    <select value={rule.logic || 'AND'} onChange={(e) => handleChange('logic', e.target.value)}>
      <option value="AND">AND</option>
      <option value="OR">OR</option>
    </select>

    <button
  onClick={onAddAfter}
  title="Add Rule After"
  style={{
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    paddingLeft: '4px'
  }}
>
  ➕
</button>

    <button onClick={onDelete} style={{ border: 'none', background: 'transparent' }}>
      🗑️
    </button>

    <button className="popup-trigger" onClick={() => setShowConfigModal(true)}>⋯</button>
   <RuleConfigModal 
    open={showConfigModal}
    onClose={() => setShowConfigModal(false)}
    rule={rule}
    />
  </>
)}
    </div>
  );
};

export default RuleRow;