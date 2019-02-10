var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    devtool: 'eval',
    entry: './src/index',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: './bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new UglifyJsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            include: path.join(__dirname, 'src')
        },
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },
        {
            test: /\.svg|\.jpg|\.png$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {}
                }
            ]
        }]
    }
};