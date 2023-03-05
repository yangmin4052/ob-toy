const babel = require('@babel/core');
const ob = require('../babel-plugins/babel-plugin-ob.js');

async function obWebpackLoader(sourceCode, p) {
  const context = this;
  const options = context.getOptions() || {};
  const { code } = await babel.transformAsync(sourceCode, {
    sourceMaps: true,
    plugins: [[ob, options]]
  });

  return code;
}

module.exports = obWebpackLoader;
