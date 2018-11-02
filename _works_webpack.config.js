const HtmlWebpackPlugin = require('html-webpack-plugin');
const FixDefaultImportPlugin = require('webpack-fix-default-import-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const configFileName = 'tsconfig.datascience-ui.json';

module.exports = {
    entry: ['babel-polyfill', './src/datascience-ui/history-react/index.tsx'],
    output: {
        path: path.join(__dirname, 'out'),
        filename: 'datascience-ui/history-react/index_bundle.js',
        publicPath: './'
    },

    mode: 'development', // Maybe change this to production? Do we care if users see errors?
    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",
    // devtool: "inline-source-map",
    // devtool: 'eval',
    devtool: 'eval-source-map',
    node: {
        fs: 'empty'
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/datascience-ui/history-react/index.html', filename: 'datascience-ui/history-react/index.html' }),
        new FixDefaultImportPlugin(),
        new CopyWebpackPlugin([
            { from: './**/*.png', to: '.' },
            { from: './**/*.svg', to: '.' },
            { from: './**/*.css', to: '.' },
            { from: './**/*theme*.json', to: '.' }
        ], { context: 'src' }),
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                use: {
                    loader: "awesome-typescript-loader",
                    options: {
                        configFileName,
                        reportFiles: [
                            'src/datascience-ui/**/*.{ts,tsx}'
                        ]
                    },
                }
            },
            // // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // },
            // {
            //     enforce: 'pre',
            //     test: /\.tsx?$/,
            //     use: "source-map-loader"
            // },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.js$/,
                include: /node_modules.*remark.*default.*js/,
                use: [
                    {
                        loader: path.resolve('./build/datascience/remarkLoader.js'),
                        options: {}
                    }
                ]
            },
            {
                test: /\.json$/,
                type: 'javascript/auto',
                include: /node_modules.*remark.*/,
                use: [
                    {
                        loader: path.resolve('./build/datascience/jsonloader.js'),
                        options: {}
                    }
                ]
            }
        ]
    }
};
