const gulp = require("gulp");
const webpack = require("webpack-stream");

module.exports = function task(targetFilePath) {
    const config = configuration();
    return gulp.src("./Reveal/plugin/SDAnimation.js").pipe(webpack(config)).pipe(gulp.dest(targetFilePath));
};

function configuration() {
    return {
        mode: global["d"] ? "development" : "production",
        watch: global["w"] ? true : false,
        output: {
            filename: "SDAnimation.js",
            library: "SDAnimation",
            libraryTarget: "umd",
            globalObject: "this",
            libraryExport: "default",
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
