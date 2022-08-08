const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {

    const conf = {
        mode: 'production',
        devServer: {
            open: true,
            static: {
                directory: path.join(__dirname, '/')
            },
            port: 5000,
            host: 'localhost',
        },

        entry: {
            'index': [`./src/index.js`],
        },

        output: {
            path: path.join(__dirname, '/lib'),
            filename: '[name].js',
            library: 'DSWImporter',
            libraryExport: 'default',
            libraryTarget: 'umd',
            globalObject: 'this',
        },

        optimization: {
            minimizer: [new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                }
            })],
        },

        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                }]
            }]
        },
    };

    return conf;
};
