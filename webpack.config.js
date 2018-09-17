const path = require('path')

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const projectDir = path.resolve(__dirname)
const appDir = path.join(projectDir, 'app')
const mainAppEntryPoint = path.join(appDir, 'appMain.lsc')
// ISDEV is a global that is injected into the JS.
const ISDEV = process.env.NODE_ENV !== 'production'

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('ISDEV: ', ISDEV)

/*****
* We dont want webpack to include polyfills or mocks for various node stuff, which we set with
* the 'node' key https://webpack.js.org/configuration/node/
*
* We also dont want webpack to transpile the stuff in node_modules folder, so we use the
* webpack-node-externals plugin.
*/

const webpackOptions = {
  entry: mainAppEntryPoint,
  output: {
    filename: 'appMain-compiled.js',
    path: appDir
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },
  mode: process.env.NODE_ENV,
  target: 'node',
  devtool: ISDEV ? 'source-map' : 'none',
  context: projectDir,
  module: {
    rules: [
      {
        test: /\.lsc$/,
        exclude: [
          /(node_modules)/
        ],
        loader: 'babel-loader',
        options: {
          sourceMap: ISDEV
        }
      },
    ]
  },
  resolve: {
    extensions: ['.lsc', '.js']
  },
  externals: [nodeExternals()],
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.DefinePlugin({ISDEV}),
  ]
}

module.exports = webpackOptions
