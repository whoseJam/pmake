const {resolve} = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./asset/pptMain.js",
  output: {
    path: "C:\\Users\\27670\\Desktop\\output",
    // filename: "ppt.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./asset/pptIndex.html",
    }),
  ],
  module: {
    rules: [
      { test: /.js$/,
        use: ["babel-loader",
          { loader: "./asset/ppt-loader",
            options: {
              url: __dirname.replaceAll("\\", "/") + "/work/二项式反演/ppt.html"
            }
          }
        ]
      },
      { test: /.html$/,
        use: ["html-loader"]
      },
      { test: /.css$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  }
}
