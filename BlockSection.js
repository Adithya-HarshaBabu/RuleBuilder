
import React from 'react';
import RuleGroup from './RuleGroup';

const BlockSection = ({
  title,
  color,
  groups,
  onGroupChange,
  onAddGroup,
  onDeleteGroup,
  onDelete,
  onModeChange,
  onAddBlock,
  onLogicChange,
  collapsed,
  onToggleCollapse,
}) => {
  const isInclude = color === 'blue';

  const renderGroupExpression = (node) => {
    const children = node.children || node.rules;
    if (!children || children.length === 0) return '';
    const parts = children.map((child) => {
      if (child.children || child.rules) {
        return `(${renderGroupExpression(child)})`;
      } else if (child.field) {
        return `${child.field} ${child.operator} ${child.value}`;
      }
      return '';
    }).filter(Boolean);
    return parts.join(` ${node.logic || 'AND'} `);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
          paddingTop: '8px',
          marginRight: '8px',
        }}
      >
        <button onClick={onAddBlock} title="Add Block" style={{ background: 'transparent', border: 'none', fontSize: '14px', cursor: 'pointer' }}>➕</button>
        <button onClick={onDelete} title="Delete Block" style={{ background: 'transparent', border: 'none', fontSize: '15px', cursor: 'pointer' }}>🗑️</button>
        <label style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 'bold', color: isInclude ? '#3399ff' : '#ff4d4d', marginTop: '12px' }}>{title}</label>
        <label className="switch" style={{ marginTop: '6px' }}>
          <input type="checkbox" checked={isInclude} onChange={onModeChange} />
          <span className="slider round"></span>
        </label>
      </div>

      <div style={{
        width: '100%',
        background: isInclude ? '#e6f0ff' : '#ffe6e6',
        borderLeft: `4px solid ${isInclude ? '#3399ff' : '#ff4d4d'}`,
        padding: '12px',
        borderRadius: '6px'
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div onClick={onToggleCollapse} title="Collapse block" style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: '10px',
          }}>
            {collapsed ? '▶' : '▼'}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {title}
          </div>
        </div>

        {!collapsed && (
          <>
            {groups.map((group, groupIndex) => (
              <div key={group.id || groupIndex} style={{ marginBottom: '10px' }}>
                <RuleGroup
                  group={group}
                  onChange={(updatedGroup) => onGroupChange(groupIndex, updatedGroup)}
                  onAddRule={() => onAddGroup(groupIndex, true)}
                  onAddGroup={() => onAddGroup(groupIndex, false)}
                  onDelete={() => onDeleteGroup(groupIndex)}
                  onLogicChange={(logic) => onLogicChange(groupIndex, logic)}
                  showLogic={groupIndex > 0}
                  isInclude={isInclude}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BlockSection;
