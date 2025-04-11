import React, { useState } from 'react';
import RuleGroup from './RuleGroup';
// import RuleExpressionPreview from './RuleExpressionPreview';

const BlockSection = ({ title, color, group, onChange, onDelete, onAdd }) => {
  const [collapsed, setCollapsed] = useState(false);
  const bgColor = color === 'blue' ? '#e8f1ff' : '#ffe8e8';
  const borderColor = color === 'blue' ? '#007bff' : '#ff4d4f';

  return (
    <div
      style={{
        background: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '6px',
        width:'90%',
        maxWidth:'720px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <div
          style={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '►' : '▼'} {title}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onAdd}>➕</button>
            <button onClick={onDelete}>🗑️</button>
      </div>
      </div>

      {!collapsed && (
        <>
          <RuleGroup group={group} onChange={onChange} />
          {/* <RuleExpressionPreview rootGroup={group} /> */}
        </>
      )}
    </div>
  );
};

export default BlockSection;