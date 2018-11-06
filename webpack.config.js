const merge = require('webpack-merge');
const datascience = require('./webpack.datascience-ui.config.js');
const extension = require('./webpack.extension.config.js');

module.exports = [
    merge(datascience, {
        devtool: '"eval"'
    }), 
    extension
];
