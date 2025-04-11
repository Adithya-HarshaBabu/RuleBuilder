export const findNodeById = (node, id) => {
  if (node.id === id) return node;
  if (!node.children) return null;
  for (let child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

export const removeNodeById = (node, id) => {
  if (!node.children) return node;
  return {
    ...node,
    children: node.children
      .filter(child => child.id !== id)
      .map(child => removeNodeById(child, id)),
  };
};

export const insertNodeAtPath = (node, targetId, newNode) => {
  if (node.id === targetId && node.type === 'group') {
    return {
      ...node,
      children: [...(node.children || []), newNode],
    };
  }

  if (!Array.isArray(node.children)) return node;

  return {
    ...node,
    children: node.children.map(child =>
      insertNodeAtPath(child, targetId, newNode)
    ),
  };
};

export const findParentGroupId = (node, childId) => {
  if (!node.children) return null;

  for (let child of node.children) {
    if (child.id === childId) return node.id;
    if (child.type === 'group') {
      const result = findParentGroupId(child, childId);
      if (result) return result;
    }
  }

  return null;
};