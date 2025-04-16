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
        <button onClick={onAddBlock} title="Add Block" style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>➕</button>
        <button onClick={onDelete} title="Delete Block" style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>🗑️</button>
      </div>

      <div style={{
        background: isInclude ? '#e6f0ff' : '#ffe6e6',
        borderLeft: `4px solid ${isInclude ? '#3399ff' : '#ff4d4d'}`,
        padding: '12px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        flex: 1,
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          minWidth: '70px',
          background: '#f0f4ff',
          padding: '8px',
          borderRadius: '6px',
        }}>
          <div onClick={onToggleCollapse} title="Collapse block" style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            transform: collapsed ? 'rotate(-90deg)' : 'none',
            transition: 'transform 0.2s',
          }}>▶</div>
          <div style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontWeight: 'bold',
            fontSize: '14px',
            color: isInclude ? '#3399ff' : '#ff4d4d',
          }}>{isInclude ? 'Include' : 'Exclude'}</div>
          <div onClick={() => onModeChange(isInclude ? 'exclude' : 'include')} style={{
            width: 34,
            height: 20,
            borderRadius: 12,
            backgroundColor: isInclude ? '#3399ff' : '#ff4d4d',
            cursor: 'pointer',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 3,
              left: isInclude ? 17 : 3,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#fff',
              transition: 'left 0.2s',
            }} />
          </div>
          {/* aligned operator dropdowns */}
          {groups.map((group, i) => (
            i > 0 ? (
              <select
                key={`logic-${i}`}
                value={group.logic || 'AND'}
                onChange={(e) => onLogicChange(i, e.target.value)}
                style={{
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  width: '60px',
                }}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            ) : <div key={`empty-${i}`} style={{ height: '30px' }} />
          ))}
        </div>

        {collapsed ? (
          <div style={{
            flex: 1,
            fontSize: '12px',
            fontFamily: 'monospace',
            background: '#f5f5f5',
            borderRadius: '6px',
            padding: '6px 10px',
            maxWidth: '100%',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {groups
              .filter((g) => (g.children || g.rules)?.length > 0)
              .map((g) => `(${renderGroupExpression(g)})`)
              .join(' AND ')}
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            {groups.map((group, i) => (
              <div key={group.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '16px',
                gap: '8px',
              }}>
                <div style={{ flex: 1 }}>
                  <RuleGroup group={group} onChange={(updated) => onGroupChange(i, updated)} />
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: group.collapsed ? 'row' : 'column',
                  alignItems: 'center',
                  gap: '6px',
                  paddingTop: group.collapsed ? '2px' : '4px',
                }}>
                  <button onClick={() => onAddGroup(i)} title="Add Group" style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}>➕</button>

                  {groups.length > 1 && (
                    <button onClick={() => onDeleteGroup(i)} title="Delete Group" style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}>🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockSection;