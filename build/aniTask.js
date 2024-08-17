const fs                = require("fs");
const gulp              = require("gulp");
const path              = require("path");
const colors            = require("colors-console");
const webpack           = require("webpack-stream");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function animationTask(sourceFilePath, targetFilePath) {
    const animationName = String(sourceFilePath).split("/").slice(-1)[0].split(".")[0];
    const webpackConfiguration = animationConfiguration(animationName);

    if (!fs.existsSync(sourceFilePath)) {
        console.log(colors("red", `[error] 文件 ${sourceFilePath} 未找到，请检查输入路径是否正确`));
        if (!sourceFilePath.endsWith(".js")) {
            console.log(colors("red", "你可能遗忘了.js后缀？"));
        }
        process.exit(1);
    }

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
                filename: `${animationName}.html`,
                scriptLoading: "blocking"
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