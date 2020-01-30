const path = require('path');

module.exports = {
    mode: 'production',
    entry: [
        path.join(__dirname, '/src/js/index.js'),
        path.join(__dirname, '/src/js/card-slots.js')
    ],
    output: {
        filename: 'index.js',
        path: path.join(__dirname, '/docs')
    }
};