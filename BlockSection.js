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
        <button onClick={onAddBlock} title="Add Block" style={{ background: 'transparent', border: 'none', fontSize: '14px', cursor: 'pointer', width:'max-content'  }}>➕ Add Block</button>
        <button onClick={onDelete} title="Delete Block" style={{ background: 'transparent', border: 'none', fontSize: '15px', cursor: 'pointer' }}>🗑️</button>
      </div>

      <div style={{ width: '100%',
        background: isInclude ? '#e6f0ff' : '#ffe6e6',
        borderLeft: `4px solid ${isInclude ? '#3399ff' : '#ff4d4d'}`,
        padding: '12px',
        borderRadius: '6px',
        width: '100%',
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div onClick={onToggleCollapse} title="Collapse block" style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
            marginRight: '10px',
          }}>{collapsed? '▶️' : '▼'}</div>
          <span style={{
            fontWeight: 'bold',
            color: isInclude ? '#3399ff' : '#ff4d4d',
            marginRight: '10px',
          }}>{isInclude ? 'Include' : 'Exclude'}</span>
          <div onClick={() => onModeChange(isInclude ? 'exclude' : 'include')} style={{
            width: 34,
            height: 20,
            borderRadius: 12,
            backgroundColor: isInclude ? '#3399ff' : '#ff4d4d',
            cursor: 'pointer',
            position: 'relative',
          }}>
            <div style={{ width: '100%',
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
        </div>

        {collapsed ? (
          <div style={{ width: '100%',
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
          <div>
            {groups.map((group, i) => (
              <div key={group.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '0px',
              }}>
                {i > 0 ? (
                  <select
                    value={group.logic || 'AND'}
                    onChange={(e) => onLogicChange(i, e.target.value)}
                    style={{
                      fontSize: '12px',
                      /*padding: '4px 8px',*/
                      height: '32px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginRight: '10px',
                      marginTop: '4px',
                    }}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>) : (<div style={{ width: '58px' /*, marginRight: '10px'*/ }}></div>)
                }
                <div style={{ width: '100%', flex: 1 }}>
                  <RuleGroup group={group} onChange={(updated) => onGroupChange(i, updated)} />
                </div>

                <div style={{ width: '100%',
                  width:'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  paddingTop: group.collapsed ? '2px' : '4px',
                  marginLeft: '8px',
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
