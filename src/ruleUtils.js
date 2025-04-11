export const buildExpression = (node) => {
  if (!node || !node.children || node.children.length === 0) return '';

  const expressions = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    let expr = '';
    if (child.type === 'rule') {
      expr = `${child.field} ${child.operator} ${child.value}`;
    } else if (child.type === 'group') {
      expr = buildExpression(child);
    }

    if (expr) {
      // prepend logic operator for all except the first expression
      if (i > 0) {
        const logic = child.logic || 'AND';
        expressions.push(logic);
      }
      expressions.push(expr);
    }
  }

  return expressions.length > 1 ? `(${expressions.join(' ')})`: expressions[0];
};