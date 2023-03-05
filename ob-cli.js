const path = require('path');
const fse = require('fs-extra');
const babel = require('@babel/core');
const ob = require('./babel-plugins/babel-plugin-ob.js');

void (async () => {
  const filePath = path.resolve(__dirname, './src/a.js');
  const sourceCode = await fse.readFile(filePath);
  const { code, map } = await babel.transformAsync(sourceCode, {
    sourceMaps: true,
    plugins: [[ob, {}]]
  });
  await fse.ensureDir('./dist-babel-cjs/');
  fse.writeFile('./dist-babel-cjs/a.js', code);
  fse.writeFile('./dist-babel-cjs/a.js.map', JSON.stringify(map, null, 2));
})();
