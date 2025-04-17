import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import RuleRow from './RuleRow';
import { v4 as uuid } from 'uuid';

const RuleGroup = ({ group, onChange }) => {
  const children = Array.isArray(group.children) ? group.children : [];
  const collapsed = group.collapsed || false;

  const updateChild = (index, updatedChild) => {
    const newChildren = [...children];
    newChildren[index] = updatedChild;
    onChange({ ...group, children: newChildren });
  };

  const deleteChild = (index) => {
    const newChildren = children.filter((_, i) => i !== index);
    onChange({ ...group, children: newChildren });
  };

  const duplicateRule = (index) => {
    const ruleToCopy = children[index];
    const newRule = {
      ...ruleToCopy,
      id: uuid(),
    }
    const newChildren = [...children];
    newChildren.splice(index + 1, 0, newRule);
    onChange({...group, children: newChildren});
  }

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

const toggleCollapse = () => {
  onChange({ ...group, collapsed: !collapsed});
}

  return (
    <div className="rule-group"
    style={{
      border: '1px solid #ccc',
      borderRadius: 6,
      padding: 10,
      marginBottom: 8,
      background: '#fafafa',
      //boxShadow: '1px 0px 8px -2px rgb(40 60 108 / 35%)'

    }}
    > 
      <div
      onClick={() => onChange({...group, collapsed: !collapsed})}
     style ={{
      cursor: 'pointer',
      fontWeight: 'bold',
      display:'flex',
      alignItems: 'center',
      marginBottom: collapsed? 0 : 8,
     }}
    >
      <span style={{ marginRight: 6}}>{collapsed? '▶️' : '▼'}</span>
      Group
      </div>
      { collapsed && children.length> 0 && (
        <div style = {{
          background: '#eee',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '13px',
          color:'#444',
          fontFamily: 'monospace',
          display:'flex',
          flexWrap: 'wrap',
          gap:'4px'
        }}>
          {children.map((r,i) => {
          const isLast = i === children.length - 1;
          const logicColor = r.logic === 'OR' ? '#d13b3b' : '#2d7d46';
          return(
            <React.Fragment key={r.id}>
              <span>{`${r.field} ${r.operator} ${r.value} `}</span>
              {!isLast && (
                <span style={{
                  color: logicColor,
                  fontWeight: 600,
                }}>
                  {r.logic}
                </span>
              )}
            </React.Fragment>
          )
            


        })}
          </div>

      )


      }
      {!collapsed && (
        <>
      <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {children.map((child, index) => (
          <SortableItem key={child.id} id={child.id}>
            <RuleRow
              rule={child}
              onChange={(updated) => updateChild(index, updated)}
              onDelete={() => deleteChild(index)}
              onAddAfter={() => insertNewRuleAfter(index)}
              showLogic={index < children.length - 1}
              onCopy={() => duplicateRule(index)}
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
      </>
      )}
    </div>
  );
};

export default RuleGroup;
