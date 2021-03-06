var path = require('path');
var webpack = require('webpack');

var config = {
    entry:    [
        // 'webpack/hot/dev-server',
        // 'webpack-hot-middleware/client?path=http://localhost:8080&noInfo=true&reload=true',
        'webpack-hot-middleware/client',
        './client/main.js'
    ],
    output: {
        path: path.resolve(__dirname, '../public'),
        publicPath: '/',
        filename: 'bundle.js',
        libraryTarget: 'commonjs2'
    },
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
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
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue'
      }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          '__DEV__': true,
          'process.env': {
            'NODE_ENV': JSON.stringify('development')
          }
        })
    ],
    devtool: '#eval-source-map'
};

module.exports = config;
