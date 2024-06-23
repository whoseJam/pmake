const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin(); 
const path = require("path");

module.exports = function(pptFilePath) {
    // pptFilePath: ./work/xxx/ppt.html
    const mode = global["d"] ? "development" : "production";
    const pptFilePathAbsolute = global["projectRoot"] + pptFilePath.slice(1);
    return {
        mode: mode,
        entry: `${global["projectRoot"]}/asset/pptMain.js`,
        watch: true,
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/asset/pptIndex.html`,
            })
        ],
        module: {
            rules: [
                {   test: /\.tsx?$/,
                    use: ["ts-loader"]
                },
                {   test: /.html$/,
                    use: ["html-loader"]
                },
                {   test: /\.(s[ac]ss|css)$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        }
    }
}