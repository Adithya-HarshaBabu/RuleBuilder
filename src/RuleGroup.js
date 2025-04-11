import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import RuleRow from './RuleRow';
import SortableItem from './SortableItem';
import RuleGroup from './RuleGroup';
import { v4 as uuid } from 'uuid';

const RuleGroupComponent = ({ group, onChange, onDelete }) => {
  const handleAddRule = () => {
    const newRule = {
      id: uuid(),
      type: 'rule',
      field: '',
      operator: '',
      value: '',
      logic: 'AND',
    };
    onChange({ ...group, children: [...group.children, newRule] });
  };

  const handleAddGroup = () => {
    const newGroup = {
      id: uuid(),
      type: 'group',
      children: [],
    };
    onChange({ ...group, children: [...group.children, newGroup] });
  };

  const updateChild = (index, updatedChild) => {
    const newChildren = [...group.children];
    newChildren[index] = updatedChild;
    onChange({ ...group, children: newChildren });
  };

  const deleteChild = (index) => {
    const newChildren = group.children.filter((_, i) => i !== index);
    onChange({ ...group, children: newChildren });
  };

  return (
    <div className="rule-group">
      {onDelete && <div style={{ textAlign: 'right' }}><button onClick={onDelete}>🗑️</button></div>}

      <SortableContext
        items={group.children.map(child => child.id)}
        strategy={verticalListSortingStrategy}
      >
        {group.children.map((child, index) => (
          <SortableItem key={child.id} id={child.id}>
            {child.type === 'rule' ? (
              <RuleRow
                rule={child}
                onChange={(updated) => updateChild(index, updated)}
                onDelete={() => deleteChild(index)}
                showLogic={index !== 0}
              />
            ) : (
              <RuleGroup
                group={child}
                onChange={(updated) => updateChild(index, updated)}
                onDelete={() => deleteChild(index)}
              />
            )}
          </SortableItem>
        ))}
      </SortableContext>

      <div className="group-actions">
        <button onClick={handleAddRule}>+ Add Rule</button>
        <button onClick={handleAddGroup}>+ Add Group</button>
      </div>
    </div>
  );
};

export default RuleGroupComponent;