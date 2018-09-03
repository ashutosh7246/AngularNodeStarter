const webpack = require('webpack');

module.exports = {
    entry: './dist/index.html',
    output: {
        path: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            use: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, ]
    },
};