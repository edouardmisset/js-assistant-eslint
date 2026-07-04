export const preferEarlyReturn = {
  meta: {
    type: /** @type {const} */ ("suggestion"),
    docs: {
      description: "Introduce early return / continue to reduce nesting",
      recommended: false,
    },
    fixable: "code",
    hasSuggestions: true,
    messages: {
      preferEarlyReturn: "Use an early return to reduce nesting.",
      preferEarlyContinue: "Use an early continue to reduce nesting.",
      suggestEarlyReturn: "Refactor to early return.",
      suggestEarlyContinue: "Refactor to early continue.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    function isLastStatement(node) {
      const {parent} = node;
      if (parent.type !== "BlockStatement") return false;
      const {body} = parent;
      return body[body.length - 1] === node;
    }

    function getEnclosingContext(node) {
      let current = node.parent;
      while (current) {
        if (current.type === "BlockStatement") {
          const parentType = current.parent.type;
          if (
            [
              "FunctionDeclaration",
              "FunctionExpression",
              "ArrowFunctionExpression",
            ].includes(parentType)
          ) {
            return { type: "function", node: current };
          }
          if (
            [
              "ForStatement",
              "ForInStatement",
              "ForOfStatement",
              "WhileStatement",
              "DoWhileStatement",
            ].includes(parentType)
          ) {
            return { type: "loop", node: current };
          }
        }
        current = current.parent;
      }
      return null;
    }

    function invertConditionText(testNode) {
      const text = sourceCode.getText(testNode);
      if (testNode.type === "UnaryExpression" && testNode.operator === "!") {
        return sourceCode.getText(testNode.argument);
      }
      if (testNode.type === "BinaryExpression") {
        const operators = {
          "===": "!==",
          "!==": "===",
          "==": "!=",
          "!=": "==",
          ">": "<=",
          "<": ">=",
          ">=": "<",
          "<=": ">",
        };
        if (operators[testNode.operator]) {
          return `${sourceCode.getText(testNode.left)} ${operators[testNode.operator]} ${sourceCode.getText(testNode.right)}`;
        }
      }
      return `!(${text})`;
    }

    return {
      IfStatement(node) {
        // Must not have an else branch
        if (node.alternate) return;

        // Must be the last statement in its block
        if (!isLastStatement(node)) return;

        // The consequent must be a block with multiple statements,
        // or something worth un-nesting. Let's say at least 1 statement.
        if (
          node.consequent.type !== "BlockStatement" ||
          node.consequent.body.length === 0
        ) {
          return;
        }

        const enclosing = getEnclosingContext(node);
        if (!enclosing) return;

        // Ensure the immediate parent block is the enclosing context block
        if (node.parent !== enclosing.node) return;

        const isLoop = enclosing.type === "loop";
        const messageId = isLoop ? "preferEarlyContinue" : "preferEarlyReturn";
        const suggestId = isLoop
          ? "suggestEarlyContinue"
          : "suggestEarlyReturn";

        context.report({
          node,
          messageId,
          suggest: [
            {
              messageId: suggestId,
              fix(fixer) {
                const invertedCond = invertConditionText(node.test);
                const action = isLoop ? "continue;" : "return;";

                // Get the inner body text
                const innerBody = node.consequent.body;
                const innerText = innerBody
                  .map((n) => sourceCode.getText(n))
                  .join("\n");

                // Construct the new node text
                const newText = `if (${invertedCond}) {\n  ${action}\n}\n${innerText}`;

                return fixer.replaceText(node, newText);
              },
            },
          ],
        });
      },
    };
  },
};
