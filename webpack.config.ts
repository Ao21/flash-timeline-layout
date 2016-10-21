const {
    ContextReplacementPlugin,
    HotModuleReplacementPlugin,
    DefinePlugin,
    LoaderOptionsPlugin,
    ProgressPlugin,
    DllReferencePlugin,

    optimize: {
        CommonsChunkPlugin,
        DedupePlugin
    }

} = require('webpack');

const { ConcatSource } = require('webpack-sources');
const { ForkCheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');
const AssetsPlugin = require('assets-webpack-plugin');
const path = require('path');
const fs = require('fs');

function root(__path = '.') {
    return path.join(__dirname, __path);
}

function webpackConfig(options: EnvOptions = {}): WebpackConfig {

    const CONSTANTS = {
        ENV: JSON.stringify(options.ENV),
        HMR: Boolean(options.HMR),
        PORT: 3000,
        HOST: '0.0.0.0',
        HTTPS: false
    };

    const isProd = options.ENV.indexOf('prod') !== -1;

    const DLL = require(root('./src/dll'));
    const polyfills = DLL.polyfills(options);
    const vendors = DLL.vendors(options);

    return {
        cache: true,
        devtool: 'source-map',
        entry: {
            main: [].concat(polyfills, './src/app', vendors)
        },
        output: {
            path: root('dist'),
            filename: '[name].bundle.js',
            sourceMapFilename: '[name].map',
            chunkFilename: '[id].chunk.js'
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    loaders: [
                        'awesome-typescript-loader',
                    ],
                    exclude: [/\.(spec|e2e|d)\.ts$/],
                    include: [root('./src')]
                },
                { test: /\.scss$/, loaders: ['style', 'css', 'sass'], include: [root('./src')] },
                { test: /\.json$/, loader: 'json-loader', include: [root('./src')] },
                { test: /\.html/, loader: 'raw-loader', include: [root('./src')] },
                { test: /\.css$/, loader: 'raw-loader', include: [root('./src')] },
            ]
        },
        plugins: [
            new AssetsPlugin({
                path: root('dist'),
                filename: 'webpack-assets.json',
                prettyPrint: true
            }),
            new DllReferencePlugin({
                context: '.',
                manifest: getManifest('vendors'),
            }),
            new DllReferencePlugin({
                context: '.',
                manifest: getManifest('polyfills'),
            }),

            new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
            new ForkCheckerPlugin(),
            new DefinePlugin(CONSTANTS),
            new ProgressPlugin({}),


        ].concat(CONSTANTS.HMR ? new HotModuleReplacementPlugin() : []),

        resolve: {
            extensions: ['.ts', '.js', '.json'],
            // unsafeCache: true

        },

        devServer: {
            setup: (app) => {
                // express middleware
                app.get('/', (req, res) => {
                    res.sendFile(root('src/index.html'));
                });
                app.get('/dll/*', (req, res) => {
                    var files = req.path.split('/');
                    var chunk = files[files.length - 1].replace('.js', '');
                    if (chunk.split('.').length < 2) {
                        res.sendFile(root('dist/dll/' + getDllAssets(chunk)));
                    } else {
                        res.sendFile(root('dist/dll/' + chunk));
                    }
                });
            },
            compress: true,
            contentBase: './src',
            port: CONSTANTS.PORT,
            hot: CONSTANTS.HMR,
            inline: CONSTANTS.HMR,
            historyApiFallback: true,
            host: CONSTANTS.HOST,
            https: CONSTANTS.HTTPS
        },
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
    }
}

// Export
module.exports = webpackConfig;


// dll helpers
function getManifest(__path) {
    var __fs = fs || require('fs');
    var manifest = tryDll(() => JSON.parse(__fs.readFileSync(root('./dist/dll/' + __path + '-manifest.json'), 'utf8')
        // TODO(gdi2290): workaround until webpack fixes dll generation
        .replace(/}(.*[\n\r]\s*)}(.*[\n\r]\s*)}"activeExports": \[\]/, '')));
    return manifest;
}
function getDllAssets(chunk) {
    var assets = tryDll(() => require(root('./dist/dll/webpack-assets.json')));
    // {"vendors":{"js":"vendors.js"},"polyfills":{"js":"polyfills.js"}}
    return assets[chunk]['js'];
}
function getAssets(chunk) {
    var assets = tryDll(() => require(root('./dist/webpack-assets.json')));
    // {"vendors":{"js":"vendors.js"},"polyfills":{"js":"polyfills.js"}}
    return assets[chunk]['js'];
}
function tryDll(cb) {
    try {
        return cb();
    } catch (e) {
        console.info("Initializing `%s`...", "DLL files");
        var spawn: any = require('cross-spawn');
        spawn.sync("npm", ["run", "dll"], { stdio: "inherit" });
        return cb();
        // throw new Error('Please run `npm run dll` first before building or running the server');
    }
}