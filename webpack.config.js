var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/app',
    entry: './scripts/init.js',
    output: {
        path: __dirname + '/app',
        filename: 'datawhore.bundle.js'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components']
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: [/node_modules/, /bower_components/], loader: 'babel', query: {compact: false}},
            {test: /\.html$/, exclude: [/node_modules/, /bower_components/], loader: 'html', query: {compact: false}},
            {test: /\.css$/, exclude: [/node_modules/, /bower_components/], loader: 'style!css'},
            // {test: /\.less/, exclude: [/node_modules/, /bower_components/], loader: 'style!css!less'},
            // {
            //     test: /\.(jpe?g|png|gif|svg)$/i,
            //     loaders: [
            //         'file?hash=sha512&digest=hex&name=./assets/img/[hash].[ext]',
            //         'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            //     ]
            // }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new webpack.OldWatchingPlugin()
    ],
    devtool: 'eval-source-map'
};
