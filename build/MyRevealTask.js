const gulp    = require("gulp");
const webpack = require("webpack-stream");

module.exports = function MyRevealTask(targetFilePath) {
    const webpackConfiguration = MyRevealConfiguration();
    return gulp.src("./MyReveal/MyReveal.js")
               .pipe(webpack(webpackConfiguration))
               .pipe(gulp.dest(targetFilePath));
}

function MyRevealConfiguration() {
    return {
        mode:  global["d"] ? "development" : "production",
        watch: global["w"] ? true : false,
        output: {
            filename: "myreveal.js",
            library: "MyReveal",
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this"
        },
        plugins: [],
        module: {
            rules: [
                {   test: /.js$/,
                    use: {
                        loader: "babel-loader",
                    }
                },
                {   test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader"
                    ]
                }
            ]
        },
        performance: {
            hints: false
        },
        cache: true
    }
}