const {resolve} = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");

module.exports = {
  // mode: "development",
  mode: "production",

  // 入口文件
  entry: "./unit/array.js",
  output: {
    path:  "C:/Users/27670/Desktop/output",
    filename: "array.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./template.html",
        inject: "body",
        inlineSource: ".(js)$",
        minify: false,
        filename: "array.html"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
    ]
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser")
    }
  }
}
