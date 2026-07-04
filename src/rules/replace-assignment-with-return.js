export const replaceAssignmentWithReturn = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Replace assignment with return when the variable is immediately returned",
      recommended: false,
    },
    fixable: "code",
    hasSuggestions: true,
    messages: {
      replaceAssignment:
        "Variable is returned immediately after assignment. Replace assignment with return.",
      suggestReplace: "Convert assignment to return.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    function isAssignmentTo(node, varName) {
      if (
        node.type !== "ExpressionStatement" ||
        node.expression.type !== "AssignmentExpression"
      ) {
        return null;
      }

      const assign = node.expression;
      if (
        assign.operator !== "=" ||
        assign.left.type !== "Identifier" ||
        assign.left.name !== varName
      ) {
        return;
      }
      return assign.right;
    }

    function checkIfStatement(node, varName) {
      // Very basic check: an if statement with consequent and alternate.
      // We look for a single expression statement in both.
      if (!node.alternate) return null;

      function getInnerAssignment(branch) {
        if (branch.type !== "BlockStatement") {
          return isAssignmentTo(branch, varName) ? branch : null;
        }
        if (branch.body.length === 1) {
          return isAssignmentTo(branch.body[0], varName)
            ? branch.body[0]
            : null;
        }
        return null;
      }

      const consAssign = getInnerAssignment(node.consequent);
      const altAssign = getInnerAssignment(node.alternate);

      return consAssign && altAssign ? [consAssign, altAssign] : null;
    }

    return {
      ReturnStatement(node) {
        if (!node.argument || node.argument.type !== "Identifier") return;
        const varName = node.argument.name;

        const {parent} = node;
        if (parent.type !== "BlockStatement") return;

        const {body} = parent;
        const index = body.indexOf(node);
        if (index === 0) return;

        const prevStatement = body[index - 1];

        // Case 1: Simple assignment
        const simpleAssignRight = isAssignmentTo(prevStatement, varName);
        if (simpleAssignRight) {
          context.report({
            node: prevStatement,
            messageId: "replaceAssignment",
            suggest: [
              {
                messageId: "suggestReplace",
                fix(fixer) {
                  const rightText = sourceCode.getText(simpleAssignRight);
                  return [
                    fixer.replaceText(prevStatement, `return ${rightText};`),
                    fixer.remove(node),
                  ];
                },
              },
            ],
          });
          return;
        }

        // Case 2: If/else assignment
        if (prevStatement.type !== "IfStatement") return;

        const assignments = checkIfStatement(prevStatement, varName);
        if (!assignments) return;

        context.report({
          node: prevStatement,
          messageId: "replaceAssignment",
          suggest: [
            {
              messageId: "suggestReplace",
              fix(fixer) {
                const fixes = [];
                assignments.forEach((assignNode) => {
                  const rightNode = assignNode.expression.right;
                  fixes.push(
                    fixer.replaceText(
                      assignNode,
                      `return ${sourceCode.getText(rightNode)};`,
                    ),
                  );
                });
                fixes.push(fixer.remove(node));
                return fixes;
              },
            },
          ],
        });
      },
    };
  },
};
