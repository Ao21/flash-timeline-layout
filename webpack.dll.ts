import 'core-js/es6';
import 'core-js/es7/reflect';
import 'ts-helpers';
// needed to create context for resolveNgRoute

/**
 * @author: @AngularClass
 */
const {
  ContextReplacementPlugin,
  HotModuleReplacementPlugin,
  DefinePlugin,
  ProgressPlugin,
  DllPlugin,

  optimize: {
    CommonsChunkPlugin,
    DedupePlugin
  }

} = require('webpack');
const {ForkCheckerPlugin} = require('awesome-typescript-loader');
const AssetsPlugin = require('assets-webpack-plugin');

const path = require('path');

function root(__path = '.') {
  return path.join(__dirname, __path);
}

import { polyfills, vendors } from './src/dll';

// type definition for WebpackConfig is defined in webpack.d.ts
function webpackConfig(options: EnvOptions = {}): WebpackConfig {
  return {
    devtool: '#source-map',
    entry: {
      polyfills: polyfills(options),
      vendors: vendors(options)
    },

    output: {
      path: root('dist/dll'),
      filename: '[name].[hash].js',
      sourceMapFilename: '[name].[hash].map',
      library: "__[name]"
    },

    module: {
      loaders: [
        {
          test: require.resolve('snapsvg'),
          loader: 'imports-loader?this=>window,fix=>module.exports=0'
        },
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          exclude: [root('src/app')],
          include: [root('./src')]
        },
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
            replace: 'var sourceMappingUrl = "";',
            flags: 'g'
          }
        },
        {
          test: /\.json$/,
          loader: 'string-replace-loader',
          query: {
            search: '}(.*[\\n\\r]\\s*)}(.*[\\n\\r]\\s*)}"activeExports": \\[\\]',
            replace: '',
            flags: 'g'
          }
        }
      ]

    },

    plugins: [
      new AssetsPlugin({
        path: root('dist/dll'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new DllPlugin({
        name: '__[name]',
        path: root('dist/dll/[name]-manifest.json'),
      }),

      new ProgressPlugin({}),

      // https://github.com/webpack/webpack/issues/2764
      // new DedupePlugin(),

    ],
    node: {
      global: true,
      process: true,
      Buffer: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false,
      clearTimeout: true,
      setTimeout: true
    }
  };
}


// Export
module.exports = webpackConfig;