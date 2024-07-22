const gulp              = require("gulp");
const path              = require("path");
const webpack           = require("webpack-stream");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function animationTask(sourceFilePath, targetFilePath) {
    const animationName = String(sourceFilePath).split("/").slice(-1)[0].split(".")[0];
    const webpackConfiguration = animationConfiguration(animationName);
    return gulp.src(sourceFilePath)
               .pipe(webpack(webpackConfiguration))
               .pipe(gulp.dest(targetFilePath));
}

function animationConfiguration(animationName) {
    const mode = global["d"] ? "development" : "production";
    return {
        mode: mode,
        output: {
            filename: `${animationName}.js`
        },
        watch: true,
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/aniIndex.html`,
                inject: "body",
                inlineSource: ".(js)$",
                minify: false,
                filename: `${animationName}.html`
            })
        ],
        module: {
            rules: [
                {   test: /.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env'],
                        },
                    },
                },
                {   test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },
        performance: {
            hints: false
        },
        cache: true,
        resolve: {
            alias: {
                "@": path.resolve(global["projectRoot"], "SD")
            },
        },
        externals: {
            "dagre": "dagre",
            "@/sd": "sd"
        }
    };
}