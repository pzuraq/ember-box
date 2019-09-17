/* eslint-env node */
'use strict';

/*
  ```hbs
  {{box this.bar}}
  ```

  becomes

  ```hbs
  {{box context=this path="bar"}}
  ```
*/

module.exports = class SetPlaceholderTransform {
  transform(ast) {
    let b = this.syntax.builders;

    function transformNode(node) {
      if (node.path.original === 'box') {
        let path = node.params[0];

        if (!node.params[0] || node.params[0].type !== 'PathExpression') {
          throw new Error(
            'the (box) helper requires a path to be passed in as its first parameter, received: ' +
              path.original
          );
        }

        let splitPoint = path.original.lastIndexOf('.');

        if (splitPoint !== -1) {
          let key = path.original.substr(splitPoint + 1);

          let target =
            splitPoint === -1 ? 'this' : path.original.substr(0, splitPoint);

          node.hash.pairs.push(
            b.pair('context', b.path(target)),
            b.pair('path', b.string(key))
          );
        }
      }
    }

    this.syntax.traverse(ast, {
      SubExpression: transformNode,
      MustacheStatement: transformNode,
    });

    return ast;
  }
};
