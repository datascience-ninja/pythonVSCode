const merge = require('webpack-merge');
const common = require('./webpack.datascience-ui.config.js');

module.exports = [merge(common, {
    devtool: 'eval'
})];
