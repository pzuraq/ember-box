'use strict';

module.exports = {
  name: require('./package').name,

  setupPreprocessorRegistry(type, registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'box-helper',
      plugin: require('./lib/box-transform'),
      baseDir() {
        return __dirname;
      },
    });
  },
};
