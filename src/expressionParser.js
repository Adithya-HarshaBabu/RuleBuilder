import { v4 as uuid } from 'uuid';

export const parseExpressionToBlocks = (expression) => {
  try {
    if (!expression || typeof expression !== 'string') return null;

    const trimmedExpr = expression.trim();
    const blockStrings = splitTopLevelByAND(trimmedExpr);

    const blocks = blockStrings.map((blockStr) => {
      const isExclude = blockStr.startsWith('!(') && blockStr.endsWith(')');
      const inner = isExclude
        ? blockStr.slice(2, -1).trim() // remove !(
        : blockStr.startsWith('(') && blockStr.endsWith(')')
        ? blockStr.slice(1, -1).trim()
        : blockStr;

      const ruleTokens = splitTopLevelByLogic(inner);
      const children = [];

      for (let i = 0; i < ruleTokens.length; i += 2) {
        const ruleStr = ruleTokens[i].trim();
        if (!ruleStr) continue;

        const [field, operator, ...rest] = ruleStr.split(/\s+/);
        const value = rest.join(' ');
        const logic = i + 1 < ruleTokens.length ? ruleTokens[i + 1] : null;

        children.push({
          id: uuid(),
          type: 'rule',
          field,
          operator,
          value,
          logic: logic || 'AND'
        });
      }

      return {
        id: uuid(),
        mode: isExclude ? 'exclude' : 'include',
        collapsed: false,
        groups: [
          {
            id: uuid(),
            type: 'group',
            children
          }
        ]
      };
    });

    return blocks;
  } catch (err) {
    console.error('Parser Error:', err);
    return null;
  }
};

// Splits top-level blocks by AND — only where it's not nested
function splitTopLevelByAND(input) {
  const parts = [];
  let depth = 0;
  let current = '';

  const tokens = input.split(/\s+/);
  for (const token of tokens) {
    if (token.includes('(')) depth += (token.match(/\(/g) || []).length;
    if (token.includes(')')) depth -= (token.match(/\)/g) || []).length;

    if (token === 'AND' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += (current ? ' ' : '') + token;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

// Splits a string by AND/OR logic at top level (not nested)
function splitTopLevelByLogic(input) {
  const result = [];
  let buffer = '';
  let depth = 0;
  const tokens = input.split(/\s+/);

  for (const token of tokens) {
    if (token.includes('(')) depth += (token.match(/\(/g) || []).length;
    if (token.includes(')')) depth -= (token.match(/\)/g) || []).length;

    if ((token === 'AND' || token === 'OR') && depth === 0) {
      result.push(buffer.trim());
      result.push(token);
      buffer = '';
    } else {
      buffer += (buffer ? ' ' : '') + token;
    }
  }

  if (buffer.trim()) result.push(buffer.trim());
  return result;
}