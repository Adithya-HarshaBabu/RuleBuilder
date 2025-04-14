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

  return (
    <div
      style={{
        background: isInclude ? '#e6f0ff' : '#ffe6e6',
        borderLeft: `4px solid ${isInclude ? '#3399ff' : '#ff4d4d'}`,
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '6px',
      }}
    >
      {/* Title row with expand/collapse toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <div
          onClick={onToggleCollapse}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          <span style={{ marginRight: '6px' }}>{collapsed ? '▶️' : '▼'}</span>
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Toggle switch */}
          <div
            onClick={() => onModeChange(isInclude ? 'exclude' : 'include')}
            style={{
              width: 60,
              height: 28,
              borderRadius: 14,
              backgroundColor: isInclude ? '#3399ff' : '#ff4d4d',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.3s',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: isInclude ? 32 : 4,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </div>
          <span
            style={{
              fontWeight: 'bold',
              color: isInclude ? '#3399ff' : '#ff4d4d',
              minWidth: 60,
            }}
          >
            {isInclude ? 'Include' : 'Exclude'}
          </span>

          <button
            onClick={onAddBlock}
            title="Add Block"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ➕
          </button>

          <button onClick={onDelete}>🗑️</button>
        </div>
      </div>

      {/* Only show content if expanded */}
      {!collapsed && (
        <>
          {groups.map((group, i) => (
            <div key={group.id} style={{ marginBottom: '12px', position: 'relative' }}>
              <RuleGroup
                group={group}
                onChange={(updated) => onGroupChange(i, updated)}
              />

              {groups.length > 1 && (
                <button
                  onClick={() => onDeleteGroup(i)}
                  title="Delete Group"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              )}

              {/* Logic dropdown between groups */}
              {i < groups.length - 1 && (
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <select
                    value={group.logic || 'AND'}
                    onChange={(e) => onLogicChange(i, e.target.value)}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}
            </div>
          ))}

          <div style={{ textAlign: 'right' }}>
            <button
              onClick={onAddGroup}
              style={{
                fontSize: '16px',
                background: 'transparent',
                border: '1px dashed #ccc',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ➕ Add Group
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BlockSection;