import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { buildExpression } from './ruleUtils';

import RuleRow from './RuleRow';
import BlockSection from './BlockSection';
import { findNodeById, removeNodeById, insertNodeAtPath, findParentGroupId } from './treeUtils';
import { v4 as uuid } from 'uuid';

const RuleBuilder = () => {
  const [blocks, setBlocks] = useState({
    includeGroups: [
      {
        id: 'include-1',
        type: 'group',
        logic: 'AND',
        children: [],
      },
    ],
    excludeGroups: [
      {
        id: 'exclude-1',
        type: 'group',
        logic: 'AND',
        children: [],
      },
    ],
  });

  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const allGroups = [...blocks.includeGroups, ...blocks.excludeGroups];
    const draggedItem = allGroups
      .map((g) => findNodeById(g, active.id))
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
    let newIncludeGroups = blocks.includeGroups.map(g => removeNodeById(g, active.id));
    let newExcludeGroups = blocks.excludeGroups.map(g => removeNodeById(g, active.id));
  
    const allGroups = [...newIncludeGroups, ...newExcludeGroups];
  
    // Find drop target group (if over a rule, find its parent)
    let dropGroupId = null;
    for (let group of allGroups) {
      const target = findNodeById(group, over.id);
      if (target?.type === 'group') {
        dropGroupId = target.id;
        break;
      } else if (target?.type === 'rule') {
        // find its parent group
        dropGroupId = findParentGroupId(group, over.id);
        break;
      }
    }
  
    if (!dropGroupId) {
      setActiveItem(null);
      return;
    }
  
    newIncludeGroups = newIncludeGroups.map(g =>
      insertNodeAtPath(g, dropGroupId, dragged)
    );
    newExcludeGroups = newExcludeGroups.map(g =>
      insertNodeAtPath(g, dropGroupId, dragged)
    );
  
    setBlocks({
      includeGroups: newIncludeGroups,
      excludeGroups: newExcludeGroups,
    });
  
    setActiveItem(null);
  };

  const addGroup = (section) => {
    const id = `${section}-${uuid()}`;
    const newGroup = {
      id,
      type: 'group',
      logic: 'AND',
      children: [],
    };
    setBlocks((prev) => ({
      ...prev,
      [`${section}Groups`]: [...prev[`${section}Groups`], newGroup],
    }));
  };

  const updateGroup = (id, section, updatedGroup) => {
    const listKey = `${section}Groups`;
    setBlocks((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((g) => (g.id === id ? updatedGroup : g)),
    }));
  };

  const removeGroup = (id, section) => {
    const listKey = `${section}Groups`;
    setBlocks((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((g) => g.id !== id),
    }));
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
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          
            <h3>Includes</h3>
            {blocks.includeGroups.map((group, i) => (
              <BlockSection
                key={group.id}
                title={`Includes ${i + 1}`}
                color="blue"
                group={group}
                onChange={(g) => updateGroup(group.id, 'include', g)}
                onDelete={() => removeGroup(group.id, 'include')}
                onAdd = {() => addGroup('include')}
              />
            ))}

          

          
            <h3>Excludes</h3>
            {blocks.excludeGroups.map((group, i) => (
              <BlockSection
                key={group.id}
                title={`Excludes ${i + 1}`}
                color="red"
                group={group}
                onChange={(g) => updateGroup(group.id, 'exclude', g)}
                onDelete={() => removeGroup(group.id, 'exclude')}
                onAdd = {() => addGroup('exclude')}

              />
            ))}
          </div>
        

        <DragOverlay>
          {activeItem?.type === 'rule' && <RuleRow rule={activeItem} readOnly />}
          {activeItem?.type === 'group' && <div className="rule-group ghost">Group</div>}
        </DragOverlay>
        <div style={{ marginTop: '40px' }}>
          <div style={{width: '90%',maxWidth: '720px'}}>
  <h4>Final Rule Expression:</h4>
  <div className="rule-expression-preview">
    <pre>
      {[
        ...blocks.includeGroups.map(buildExpression).filter(Boolean).map(e => `(INCLUDE: ${e})`),
        ...blocks.excludeGroups.map(buildExpression).filter(Boolean).map(e => `(EXCLUDE: ${e})`)
      ].join('\nAND\n') || 'No rules defined'}
    </pre>
  </div>
  </div>
</div>
      </DndContext>
    </>
  );
};

export default RuleBuilder;