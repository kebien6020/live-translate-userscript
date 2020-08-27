/* eslint-env node */
const path = require('path');

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};
