const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'none',
    target: 'node',
    entry: './src/client/extension.ts',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [nodeExternals(), 'vscode'],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'out'),
        libraryTarget: "commonjs"
    }
};
