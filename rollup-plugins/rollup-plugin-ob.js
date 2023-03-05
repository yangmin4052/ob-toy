import { createFilter } from '@rollup/pluginutils';
import babel from '@babel/core';
import babelPluginOb from '../babel-plugins/babel-plugin-ob.mjs';

export default function ob(options = {}) {
  var filter = createFilter(options.include, options.exclude);

  return {
    async transform(sourceCode, id) {
      if (!filter(id)) return;

      const { code, map } = await babel.transformAsync(sourceCode, {
        sourceMaps: true,
        plugins: [[babelPluginOb, {}]]
      });

      return {
        code,
        map
      };
    }
  };
}
