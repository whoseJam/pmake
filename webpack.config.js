const {resolve} = require('path')

module.exports = {
  // 设置当前模式为开发
  // mode: 'development',
  mode: "production",

  // 入口文件
  // entry: './index.js',
  // output: {
  //   // 定义输出路径
  //   path:  resolve(__dirname, 'dist')
  // },
  
  module: {
    rules: [
      {
        test: /\.$js/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     // [style-loader](/loaders/style-loader)
      //     { loader: 'style-loader' },
      //     // [css-loader](/loaders/css-loader)
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         modules: true // 开启css模块化
      //       }
      //     }
      //   ]
      // }
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
