import fse from 'fs-extra';
import babel from '@babel/core';
import ob from './babel-plugins/babel-plugin-ob.mjs';

void (async () => {
  const filePath = new URL('./src/a.js', import.meta.url);
  const sourceCode = await fse.readFile(filePath);
  const { code, map } = await babel.transformAsync(sourceCode, {
    sourceMaps: true,
    plugins: [[ob, {}]]
  });
  await fse.ensureDir('./dist-babel-esm/');
  fse.writeFile('./dist-babel-esm/a.js', code);
  fse.writeFile('./dist-babel-esm/a.js.map', JSON.stringify(map, null, 2));
})();
