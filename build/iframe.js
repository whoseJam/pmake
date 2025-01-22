const gulp = require("gulp");
const webpack = require("webpack-stream");

module.exports = function SDIFrameTask(targetFilePath) {
    const webpackConfiguration = SDIFrameConfiguration();
    return gulp.src("./IFrame/IFrame.js").pipe(webpack(webpackConfiguration)).pipe(gulp.dest(targetFilePath));
};

function SDIFrameConfiguration() {
    return {
        mode: global["d"] ? "development" : "production",
        watch: global["w"] ? true : false,
        output: {
            filename: "iframe.js",
            library: "iframe",
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this",
        },
        module: {
            rules: [
                {
                    test: /.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-react", "@babel/preset-env"],
                        },
                    },
                },
            ],
        },
        performance: {
            hints: false,
        },
        cache: true,
    };
}
