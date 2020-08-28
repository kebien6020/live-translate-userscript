/* eslint-env node */
const path = require('path');
const WebpackUserscript = require('webpack-userscript');
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
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
        new WebpackUserscript({
            headers: {
                name: 'Live Translate Userscript' + dev ? ' Dev' : '',
                version: dev ? '[version]-build.[buildTime]' : '[version]',
                author: 'u/BakuhatsuK',
                description: 'Get streaming translation comments easily.'
                           + 'Based on extension made by u/konokalahola',
                namespace: 'youtube.com',
                include: 'https://*.youtube.com/*',
                'run-at': 'document-start',
                require: [
                    'https://unpkg.com/react@16/umd/react.development.js',
                    'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
                ],
            },
            proxyScript: {
                enable: true,
                filename: 'proxy.user.js',
            },
        }),
    ],
};
