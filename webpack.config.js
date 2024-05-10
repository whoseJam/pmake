const {resolve} = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = String(process.env.PROCESS_MODE).trim();
// const mode = "singleAnimation";

// ppt应用
if (mode !== "singleAnimation") {

console.log("run ppt application");
module.exports = {
  mode: "development",
  entry: "./asset/pptMain.js",
  output: {
    path: "C:\\Users\\27670\\Desktop\\output",
    scriptType: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./asset/pptIndex.html",
    },
  )],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
}
}

// 单体动画应用
if (mode === "singleAnimation") {
if (!process.env.HTML_FILENAME)
  throw new Error("Invalid HTML filename");
const htmlFileName = String(process.env.HTML_FILENAME).trim();
if (htmlFileName === "")
  throw new Error("Invalid HTML filename");
module.exports = {
  mode: "development",
  // mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
        template: "./asset/singleAnimationIndex.html",
        inject: "body",
        inlineSource: ".(js)$",
        minify: false,
        filename: htmlFileName,
        chunks: ["main"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
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
}