module.exports = {
  'leading-slash-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce leading slash for internal imports',
        category: 'Possible Errors',
      },
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const importPath = node.source.value;

          // Check if import starts with one of the special directories without a slash
          if (/^(apps|libs|config)\//.test(importPath)) {
            context.report({
              node,
              message: `Imports from ${importPath.split('/')[0]} must start with a leading slash`,
              fix(fixer) {
                return fixer.replaceText(node.source, `'/${importPath}'`);
              },
            });
          }
        },
      };
    },
  },
};
