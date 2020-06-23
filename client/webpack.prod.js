const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: ['./src/index.tsx'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '~': path.resolve(__dirname, 'src/'),
        },
    },
    output: {
        path: `${__dirname}/prod`,
        publicPath: '/',
        filename: 'app.min.js',
    },
    optimization: {
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
        }),
        new webpack.DefinePlugin({
            __DEV__: true,
        }),
    ],
};
