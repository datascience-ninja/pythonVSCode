const path = require('path');
const nodeExternals = require('webpack-node-externals');
const configFileName = 'tsconfig.extension.json';

module.exports = {
    mode: 'none',
    target: 'node',
    entry: './src/client/extension.ts',
    devtool: 'source-map',
    node: {
        __dirname: false
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "awesome-typescript-loader",
                    options: {
                        configFileName,
                        reportFiles: [
                            'src/datascience-ui/**/*.{ts,tsx}'
                        ]
                    },
                }
            }
        ]
    },
    externals: [nodeExternals(), 'vscode'],
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'out', 'client'),
        libraryTarget: "commonjs"
    }
};
