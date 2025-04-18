import React from 'react';
import RuleGroup from './RuleGroup';
import './styles.css';

const BlockSection = ({
  block,
  onAddGroup,
  onAddRule,
  onDelete,
  onToggleInclude,
  onUpdateGroup,
  onDeleteGroup,
  onChangeGroupOperator,
  onCopyRule,
  onDeleteRule,
  onUpdateRule,
  onCopyGroup,
  onToggleBlockCollapse
}) => {
  return (
    <div className={`block-section ${block.include ? 'include-block' : 'exclude-block'}`}>
      <div className="block-header">
        <div className="block-controls">
          <button onClick={() => onAddGroup(block.id)} className="icon-button">➕</button>
          <button onClick={() => onDelete(block.id)} className="icon-button">🗑️</button>

          <div className="toggle-wrapper">
            <label className="toggle-label">{block.include ? 'Include' : 'Exclude'}</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={block.include}
                onChange={() => onToggleInclude(block.id)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="block-title" onClick={() => onToggleBlockCollapse(block.id)}>
          <span>{block.include ? 'Include' : 'Exclude'}</span>
        </div>
      </div>

      {!block.collapsed && (
        <div className="groups-wrapper">
          {block.groups.map((group, index) => (
            <div className="group-with-operator" key={group.id}>
              {index > 0 && (
                <div className="group-operator">
                  <select
                    value={group.operator || 'AND'}
                    onChange={(e) =>
                      onChangeGroupOperator(block.id, group.id, e.target.value)
                    }
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}
              <RuleGroup
                group={group}
                onAddRule={(rule) => onAddRule(block.id, group.id, rule)}
                onDeleteGroup={() => onDeleteGroup(block.id, group.id)}
                onUpdateRule={(ruleId, changes) =>
                  onUpdateRule(block.id, group.id, ruleId, changes)
                }
                onDeleteRule={(ruleId) => onDeleteRule(block.id, group.id, ruleId)}
                onCopyRule={(rule) => onCopyRule(block.id, group.id, rule)}
                onCopyGroup={() => onCopyGroup(block.id, group)}
                blockId={block.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockSection;
