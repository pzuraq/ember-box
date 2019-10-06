/* eslint-env node */
'use strict';

/*
  ```hbs
  {{box this.bar}}
  ```

  becomes

  ```hbs
  {{box this "bar"}}
  ```
*/

module.exports = class SetTransform {
  transform(ast) {
    let b = this.syntax.builders;

    let params = [];
    function addParams(items) {
      if (items.length) {
        params = params.concat(items);
      }
    }
    function removeParams(items) {
      if (items.length) {
        params = params.slice(0,-items.length)
      }
    }

    function transformNode(node) {
      if (node.path.original === 'box') {
        if (!node.params[0] || node.params[0].type !== 'PathExpression') {
          throw new Error(
            'the (box) helper requires a path to be passed in as its first parameter, received: ' +
              node.params[0]
          );
        }
        
        if (node.params[0].data === true) {
          throw new Error(
            'the (box) helper requires an local path to be passed in as its first parameter, received: ' +
              `${node.params[0].original}`
          );
        }
        
        if (node.params[0].this === true && node.params[0].parts.length === 0) {
          throw new Error(
            'the (box) helper requires an local path to be passed in as its first parameter, received: this'
          );
        }

        if (node.params.length > 2) {
          throw new Error(
            'the (box) helper can only recieve 2 arguments at most, recieved: ' +
              node.params.length
          );
        }

        if (node.params.length === 1) {
          let path = node.params.shift();

          let splitPoint = path.original.lastIndexOf('.');

          let key = path.original.substr(splitPoint + 1);

          if (splitPoint === -1 && params.includes(key)) {
            throw new Error(`the (box) helper dom't support simple block value as first argument, recived: ${key}, supported: {{box ${key}.value}}`);
          }
          
          let target =
            splitPoint === -1 ? 'this' : path.original.substr(0, splitPoint);

          node.params.unshift(b.path(target), b.string(key));
        }
      }
    }

    this.syntax.traverse(ast, {
      Block: {
        enter(node) { addParams(node.blockParams) },
        exit(node) { removeParams(node.blockParams) }
      },
      SubExpression: transformNode,
      MustacheStatement: transformNode,
    });

    return ast;
  }
};
