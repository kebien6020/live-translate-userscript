/* eslint-env node */
const path = require('path');
const WebpackUserscript = require('webpack-userscript');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: dev ? 'development' : 'production',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'live-translate.user.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /^node_modules/,
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackUserscript({
            headers: {
                name: 'Live Translate' + (dev ? ' Dev' : ''),
                version: dev ? '[version]-build.[buildTime]' : '[version]',
                author: 'u/BakuhatsuK',
                description: 'Get streaming translation comments easily. '
                           + 'Based on extension made by u/konokalahola',
                namespace: 'youtube.com',
                include: 'https://*.youtube.com/*',
                'run-at': 'document-start',
                supportURL: 'https://github.com/kebien6020/live-translate-userscript',
                downloadURL: 'https://github.com/kebien6020/live-translate-userscript/raw/master/dist/live-translate.user.js',
                updateURL: 'https://github.com/kebien6020/live-translate-userscript/raw/master/dist/live-translate.user.js',
            },
            proxyScript: {
                enable: () => dev,
                filename: 'proxy.user.js',
            },
        }),
    ],
};
