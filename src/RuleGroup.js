import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import RuleRow from './RuleRow';
import { v4 as uuid } from 'uuid';

const RuleGroup = ({ group, onChange }) => {
  const children = Array.isArray(group.children) ? group.children : [];

  const updateChild = (index, updatedChild) => {
    const newChildren = [...children];
    newChildren[index] = updatedChild;
    onChange({ ...group, children: newChildren });
  };

  const deleteChild = (index) => {
    const newChildren = children.filter((_, i) => i !== index);
    onChange({ ...group, children: newChildren });
  };

  const insertNewRuleAfter = (index) => {
    const newRule = {
      id: uuid(),
      type: 'rule',
      field: '',
      operator: '',
      value: '',
      logic: 'AND',
    };

    const newChildren = [...children];
    if (index === -1) {
      newChildren.unshift(newRule);
    } else {
      newChildren.splice(index + 1, 0, newRule);
    }

    onChange({ ...group, children: newChildren });
  };

  return (
    <div className="rule-group">
      <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {children.map((child, index) => (
          <SortableItem key={child.id} id={child.id}>
            <RuleRow
              rule={child}
              onChange={(updated) => updateChild(index, updated)}
              onDelete={() => deleteChild(index)}
              onAddAfter={() => insertNewRuleAfter(index)}
              showLogic={index < children.length - 1}
            />
          </SortableItem>
        ))}
      </SortableContext>

      {children.length === 0 && (
        <div style={{ textAlign: 'center', padding: '12px' }}>
          <button
            onClick={() => insertNewRuleAfter(-1)}
            title="Add Rule"
            style={{
              fontSize: '20px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            ➕ Add Rule
          </button>
        </div>
      )}
    </div>
  );
};

export default RuleGroup;