const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.bundle.js'
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    }
};