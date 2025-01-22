const gulp = require("gulp");
const webpack = require("webpack-stream");

module.exports = function(targetFilePath) {
    const webpackConfiguration = RevealConfiguration();
    return gulp.src("./Reveal/MyReveal.js")
               .pipe(webpack(webpackConfiguration))
               .pipe(gulp.dest(targetFilePath));
}

function RevealConfiguration() {
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