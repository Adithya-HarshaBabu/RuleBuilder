import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import RuleRow from './RuleRow';
import BlockSection from './BlockSection';
import { findNodeById, removeNodeById, insertNodeAtPath, findParentGroupId } from './treeUtils';
import { buildExpression } from './ruleUtils';
import { v4 as uuid } from 'uuid';

const RuleBuilder = () => {
  const [ruleBlocks, setRuleBlocks] = useState([
    {
      id: uuid(),
      mode: 'include',
      collapsed: false,
      groups: [
        {
          id: uuid(),
          type: 'group',
          children: [],
          logic: 'AND'
        }
      ]
    }
  ]);

  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedItem = ruleBlocks
      .flatMap(b => b.groups)
      .map(g => findNodeById(g, active.id))
      .find(Boolean);
    setActiveItem(draggedItem);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveItem(null);
      return;
    }

    const dragged = activeItem;
    const updatedBlocks = ruleBlocks.map(b => ({
      ...b,
      groups: b.groups.map(g => removeNodeById(g, active.id))
    }));

    let dropGroupId = null;
    for (let block of updatedBlocks) {
      for (let group of block.groups) {
        const target = findNodeById(group, over.id);
        if (target?.type === 'group') {
          dropGroupId = target.id;
          break;
        } else if (target?.type === 'rule') {
          dropGroupId = findParentGroupId(group, over.id);
          break;
        }
      }
    }

    const finalBlocks = updatedBlocks.map(b => ({
      ...b,
      groups: b.groups.map(g =>
        g.id === dropGroupId ? insertNodeAtPath(g, dropGroupId, dragged) : g
      )
    }));

    setRuleBlocks(finalBlocks);
    setActiveItem(null);
  };

  const updateBlockGroups = (blockId, updater) => {
    setRuleBlocks(prev =>
      prev.map(b => {
        if (b.id !== blockId) return b;
        return { ...b, groups: updater(b.groups) };
      })
    );
  };

  const updateBlockMode = (blockId, newMode) => {
    setRuleBlocks(prev =>
      prev.map(b => b.id === blockId ? { ...b, mode: newMode } : b)
    );
  };

  const removeBlock = (blockId) => {
    setRuleBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const toggleCollapse = (blockId) => {
    setRuleBlocks(prev =>
      prev.map(b => b.id === blockId ? { ...b, collapsed: !b.collapsed } : b)
    );
  };

  const addBlock = (afterIndex = null) => {
    const newBlock = {
      id: uuid(),
      mode: 'include',
      collapsed: false,
      groups: [
        {
          id: uuid(),
          type: 'group',
          children: [],
          logic: 'AND'
        }
      ]
    };

    setRuleBlocks(prev => {
      const updated = [...prev];
      if (afterIndex === null || afterIndex >= updated.length) {
        updated.push(newBlock);
      } else {
        updated.splice(afterIndex + 1, 0, newBlock);
      }
      return updated;
    });
  };

  const getFormattedExpression = () => {
    const blockExpressions = ruleBlocks.map((block) => {
      const groupExpressions = block.groups
        .map((group, i) => {
          const expr = buildExpression(group);
          if (!expr) return null;
          const logic = group.logic && i < block.groups.length - 1 ? ` ${group.logic} ` : '';
          return expr + logic;
        })
        .filter(Boolean)
        .join('');

      if (!groupExpressions) return '';
      const wrapped = `(${groupExpressions})`;

      return block.mode === 'exclude' ? `!${wrapped}`: wrapped;
    }).filter(Boolean);

    return blockExpressions.join(' AND ') || 'No rules defined';
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveItem(null)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '95%', maxWidth: '1100px' }}>
            {ruleBlocks.map((block, i) => (
              <BlockSection
                key={block.id}
                title={`${block.mode === 'include' ? 'Includes' : 'Excludes'} ${i + 1}`}
                color={block.mode === 'include' ? 'blue' : 'red'}
                groups={block.groups}
                collapsed={block.collapsed}
                onToggleCollapse={() => toggleCollapse(block.id)}
                onGroupChange={(groupIndex, newGroup) => {
                  updateBlockGroups(block.id, (groups) => {
                    const updated = [...groups];
                    updated[groupIndex] = newGroup;
                    return updated;
                  });
                }}
                onLogicChange={(groupIndex, logic) => {
                  updateBlockGroups(block.id, (groups) => {
                    const updated = [...groups];
                    updated[groupIndex].logic = logic;
                    return updated;
                  });
                }}
                onAddGroup={() => {
                  updateBlockGroups(block.id, (groups) => [
                    ...groups,
                    { id: uuid(), type: 'group', children: [], logic: 'AND' }
                  ]);
                }}
                onDeleteGroup={(groupIndex) => {
                  updateBlockGroups(block.id, (groups) =>
                    groups.filter((_, i) => i !== groupIndex)
                  );
                }}
                onDelete={() => removeBlock(block.id)}
                onModeChange={(mode) => updateBlockMode(block.id, mode)}
                onAddBlock={() => addBlock(i)}
              />
            ))}
          </div>

          {/* Final read-only expression */}
          <div style={{ width: '95%', maxWidth: '1100px', marginTop: '32px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Rule Expression</div>
            <div style={{
              background: '#f9f9f9',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              color: '#333',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              textAlign: 'left'
            }}>
              {getFormattedExpression()}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeItem?.type === 'rule' && <RuleRow rule={activeItem} readOnly />}
          {activeItem?.type === 'group' && <div className="rule-group ghost">Group</div>}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default RuleBuilder;