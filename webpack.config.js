const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: [
            path.join(__dirname, '/src/js/index.js'),
            path.join(__dirname, '/src/js/card-slots.js'),
        ],
        'service-worker': path.join(__dirname, '/src/service-worker.js'),
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /service-worker\.js$/,
                loader: 'string-replace-loader',
                options: {
                    search: '<APP_VERSION>',
                    replace: Date.now().toString(),
                },
            },
        ],
    },
};