const gulp              = require("gulp");
const webpack           = require("webpack-stream");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { library } = require("webpack");

module.exports = function MyRevealTask(targetFileFolder) {
    const webpackConfiguration = MyRevealConfiguration();
    return gulp.src("./build/pptMain.js")
               .pipe(webpack(webpackConfiguration))
               .pipe(gulp.dest(targetFileFolder));
}

function MyRevealConfiguration() {
    const mode = global["d"] ? "development" : "production";
    const watch = global["w"] ? true : false;
    return {
        mode: mode,
        entry: `${global["projectRoot"]}/build/pptMain.js`,
        output: {
            filename: "myreveal.js",
            library: "myreveal",
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this"
        },
        watch: watch,
        plugins: [],
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