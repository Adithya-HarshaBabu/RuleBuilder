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
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      {/* Left side vertical block controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginRight: '16px',
          gap: '8px',
          minWidth: '60px',
        }}
      >
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontWeight: 'bold',
            fontSize: '14px',
            color: isInclude ? '#3399ff' : '#ff4d4d',
          }}
        >
          {isInclude ? 'Include' : 'Exclude'}
        </div>

        {/* Toggle */}
        <div
          onClick={() => onModeChange(isInclude ? 'exclude' : 'include')}
          style={{
            width: 34,
            height: 20,
            borderRadius: 12,
            backgroundColor: isInclude ? '#3399ff' : '#ff4d4d',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 3,
              left: isInclude ? 17 : 3,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#fff',
              transition: 'left 0.2s',
            }}
          />
        </div>

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

        <button
          onClick={onDelete}
          title="Delete Block"
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          🗑️
        </button>
      </div>

      {/* Main content area (block groups) */}
      <div style={{ flex: 1 }}>
        {groups.map((group, i) => (
          <div
            key={group.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '16px',
              gap: '8px',
            }}
          >
            {/* Group Content */}
            <div style={{ flex: 1 }}>
              <RuleGroup
                group={group}
                onChange={(updated) => onGroupChange(i, updated)}
              />
            </div>

            {/* Operator + Group Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: group.collapsed ? 'row' : 'column',
                alignItems: 'center',
                gap: '6px',
                paddingTop: group.collapsed ? '2px' : '4px',
              }}
            >
              {/* Only show logic dropdown between groups */}
              {groups.length > 1 && i < groups.length - 1 && (
                <select
                  value={group.logic || 'AND'}
                  onChange={(e) => onLogicChange(i, e.target.value)}
                  style={{
                    fontSize: '12px',
                    padding: '4px',
                    width: '60px',
                  }}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}

              <button
                onClick={() => onAddGroup(i)}
                title="Add Group"
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ➕
              </button>

              {groups.length > 1 && (
                <button
                  onClick={() => onDeleteGroup(i)}
                  title="Delete Group"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockSection;