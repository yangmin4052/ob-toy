const babel = require('@babel/core');
const { Compiler, Compilation, sources } = require('webpack');
const transferSourceMap = require('multi-stage-sourcemap').transfer;
const ob = require('../babel-plugins/babel-plugin-ob.js');

class ObWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    const pluginName = this.constructor.name;
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'WebpackOb',
          stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING
        },
        (assets) => {
          let identifiersPrefixCounter = 0;
          const sourcemapOutput = {};

          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((fileName) => {
              const asset = compilation.assets[fileName];

              const { inputSource, inputSourceMap } =
                this.extractSourceAndSourceMap(asset);
              const { obfuscatedSource, obfuscationSourceMap } = this.obfuscate(
                inputSource,
                fileName,
                identifiersPrefixCounter
              );

              if (this.options.sourceMap && inputSourceMap) {
                sourcemapOutput[fileName] = obfuscationSourceMap;

                const transferredSourceMap = transferSourceMap({
                  fromSourceMap: obfuscationSourceMap,
                  toSourceMap: inputSourceMap
                });
                const finalSourcemap = JSON.parse(transferredSourceMap);
                finalSourcemap['sourcesContent'] =
                  inputSourceMap['sourcesContent'];
                assets[fileName] = new sources.SourceMapSource(
                  obfuscatedSource,
                  fileName,
                  finalSourcemap
                );
              } else {
                assets[fileName] = new sources.RawSource(
                  obfuscatedSource,
                  false
                );
              }
              identifiersPrefixCounter++;
            });
          });
        }
      );
    });
  }

  extractSourceAndSourceMap(asset) {
    if (asset.sourceAndMap) {
      const { source, map } = asset.sourceAndMap();
      return { inputSource: source, inputSourceMap: map };
    } else {
      return {
        inputSource: asset.source(),
        inputSourceMap: asset.map()
      };
    }
  }

  obfuscate(sourceCode, fileName) {
    const { code, map } = babel.transformSync(sourceCode, {
      sourceMaps: true,
      filename: fileName,
      plugins: [
        [
          ob,
          {
            fileName
          }
        ]
      ]
    });

    return {
      obfuscatedSource: code,
      obfuscationSourceMap: map
    };
  }
}

module.exports = ObWebpackPlugin;
