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
    devtool: "source-map",
    // devtool: 'eval',
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
        new TsConfigPathsPlugin({ configFileName })
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
                        reportFiles: [
                            'src/datascience-ui/**/*.{ts,tsx}'
                        ]
                    },
                }
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
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
            // // "file" loader makes sure those assets get served by WebpackDevServer.
            // // When you `import` an asset, you get its (virtual) filename.
            // // In production, they would get copied to the `build` folder.
            // // This loader doesn't use a "test" so it will catch all modules
            // // that fall through the other loaders.
            // {
            //     // Exclude `js` files to keep "css" loader working as it injects
            //     // its runtime that would otherwise processed through "file" loader.
            //     // Also exclude `html` and `json` extensions so they get processed
            //     // by webpacks internal loaders.
            //     exclude: [/\.(js|jsx|mjs|css)$/, /\.html$/, /\.json$/],
            //     loader: require.resolve('url-loader'),
            //     // options: {
            //     //   name: 'static/media/[name].[hash:8].[ext]',
            //     // },
            // }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // }
};
