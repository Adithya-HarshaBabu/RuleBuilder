export const buildExpression = (group) => {
  if (!group || !Array.isArray(group.children)) return '';

  const expression = group.children
    .map((child, i) => {
      if (child.type === 'rule') {
        const expr = `${child.field} ${child.operator} ${child.value}`;
        const logic = child.logic && i < group.children.length - 1 ? ` ${child.logic} ` : '';
        return expr + logic;
      } else if (child.type === 'group') {
        return `(${buildExpression(child)})`;
      }
      return '';
    })
    .join('');

  return `(${expression})`; // every group wrapped in brackets
};