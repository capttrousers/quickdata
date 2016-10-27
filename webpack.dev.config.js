// # webpack.dev.config
var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry:    [
        'webpack/hot/dev-server',
        // 'webpack-hot-middleware/client?path=http://localhost:3001',
        'webpack-hot-middleware/client',
        './src/main.js'
    ],
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue',
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    output: {
        path: '/dist/',
        publicPath: '/dist/',
        filename: 'bundle.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          '__DEV__': true,
          'process.env': {
            'NODE_ENV': JSON.stringify('development')
          }
        })
    ],
    devtool: '#eval-source-map'
}
