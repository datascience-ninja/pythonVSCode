const path = require('path');
const nodeExternals = require('webpack-node-externals');
const configFileName = 'tsconfig.extension.json';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
    mode: 'none',
    // mode: 'production'
    target: 'node',
    entry: {
        extension: './src/client/extension.ts',
        debugAdapter: './src/client/debugger/debugAdapter/main.ts',
    },
    // devtool: 'source-map',
    devtool: 'none',
    node: {
        __dirname: false
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                }]
            },
            // {
            //     test: /\.ts$/,
            //     use: {
            //         loader: "awesome-typescript-loader",
            //         options: {
            //             configFileName,
            //             reportFiles: [
            //                 'src/datascience-ui/**/*.{ts,tsx}'
            //             ]
            //         },
            //     }
            // },
            // {
            //     test: /\.json$/,
            //     type: 'javascript/auto',
            //     include: /node_modules.*remark.*/,
            //     use: [
            //         {
            //             loader: path.resolve('./build/datascience/jsonloader.js'),
            //             options: {}
            //         }
            //     ]
            // }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        // new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly

        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'node-static',
        //     filename: 'node-static.js',
        //     minChunks(module, count) {
        //         var context = module.context;
        //         return context && context.indexOf('node_modules') >= 0;
        //     },
        // }),
    ],
    // optimization: {
    //     // runtimeChunk: 'single',
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendors",
    //                 chunks: "all"
    //             }
    //         }
    //     }
    //     // splitChunks: {
    //     //   chunks: 'all',
    //     //   maxInitialRequests: Infinity,
    //     //   minSize: 0,
    //     //   cacheGroups: {
    //     //     vendor: {
    //     //       test: /[\\/]node_modules[\\/]/,
    //     //       name(module) {
    //     //         // get the name. E.g. node_modules/packageName/not/this/part.js
    //     //         // or node_modules/packageName
    //     //         const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

    //     //         // npm package names are URL-safe, but some servers don't like @ symbols
    //     //         return `npm.${packageName.replace('@', '')}`;
    //     //       }
    //     //     }
    //     //   }
    //     // }
    // },
    // externals: [nodeExternals(), 'vscode'],
    // externals: 'commonjs vscode',
    // externals: [nodeExternals(), 'vscode'],
    externals: {
        vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({ configFile: configFileName })],
    },
    output: {
        // filename: 'index.js',c
        filename: '[name].js',
        path: path.resolve(__dirname, 'out', 'client'),
        libraryTarget: "commonjs"
    }
};
