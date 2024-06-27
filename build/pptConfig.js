const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

module.exports = function(pptFilePath) {
    // pptFilePath: ./work/xxx/ppt.html
    const mode = global["d"] ? "development" : "production";
    const pptFilePathAbsolute = global["projectRoot"] + pptFilePath.slice(1);
    return {
        mode: mode,
        entry: `${global["projectRoot"]}/build/pptMain.js`,
        watch: true,
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/pptIndex.html`,
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