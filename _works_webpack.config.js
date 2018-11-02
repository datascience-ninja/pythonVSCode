// Default configuration for webpacking react scripts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FixDefaultImportPlugin = require('webpack-fix-default-import-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: ['babel-polyfill', path.join(__dirname, 'out/datascience-ui/history-react/index.js')],
    // entry: ['babel-polyfill'],
    mode: 'development', // Maybe change this to production? Do we care if users see errors?
    devtool: 'eval',
    node: {
        fs: 'empty'
    },
    output: {
        path: path.join(__dirname, 'out'),
        filename: 'datascience-ui/history-react/index_bundle.js',
        publicPath: './'
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: 'src/datascience-ui/history-react/index.html', filename: 'datascience-ui/history-react/index.html' }),
        new FixDefaultImportPlugin(),
        new CopyWebpackPlugin([
            { from: './**/*.png', to: '.' },
            { from: './**/*.svg', to: '.' },
            { from: './**/*.css', to: '.' },
            { from: './**/*theme*.json', to: '.' }
        ], { context: 'src' }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader?',
                options: {
                    module: 'es6',
                    tsconfig: './browser/tsconfig.json',
                    configFileName: './browser/tsconfig.json'
                }
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
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['prismjs']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
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
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.(js|jsx|mjs|css)$/, /\.html$/, /\.json$/],
                loader: require.resolve('url-loader'),
                // options: {
                //   name: 'static/media/[name].[hash:8].[ext]',
                // },
            }
        ]
    }
};
