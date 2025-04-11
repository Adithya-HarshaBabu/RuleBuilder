import React from 'react';
import { buildExpression } from './ruleUtils';

const RuleExpressionPreview = ({ rootGroup }) => {
  const expression = buildExpression(rootGroup);

  return (
    <div className="rule-expression-preview">
      <label>Rule Expression:</label>
      <pre>{expression || 'No rules defined'}</pre>
    </div>
  );
};

export default RuleExpressionPreview;