#!/usr/bin/env node

const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const parser = require("./parser");
const colors = require("colors-console");
const webpack = require("webpack-stream");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function animationTask(sourceFilePath, targetFilePath) {
    const animationName = String(sourceFilePath).split("/").slice(-1)[0].split(".")[0];
    const webpackConfiguration = animationConfiguration(animationName);

    if (!fs.existsSync(sourceFilePath)) {
        console.log(colors("red", `[error] 文件 ${sourceFilePath} 未找到，请检查输入路径是否正确`));
        if (!sourceFilePath.endsWith(".js")) {
            console.log(colors("red", "你可能遗忘了.js后缀？"));
        }
        process.exit(1);
    }

    return gulp.src(sourceFilePath).pipe(webpack(webpackConfiguration)).pipe(gulp.dest(targetFilePath));
}

function animationConfiguration(animationName) {
    const mode = global["d"] ? "development" : "production";
    const suffix = global["l"] ? "Local" : "Remote";
    return {
        mode: mode,
        output: {
            filename: `${animationName}.js`,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/aniIndex${suffix}.html`,
                inject: "body",
                inlineSource: ".(js)$",
                minify: false,
                filename: `${animationName}.html`,
                scriptLoading: "blocking",
            }),
        ],
        watch: global["w"] ? true : false,
        module: {
            rules: [
                {
                    test: /.js$/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
            ],
        },
        performance: {
            hints: false,
        },
        cache: true,
        resolve: {
            alias: {
                "@": path.resolve(global["projectRoot"], "SD"),
            },
        },
        externals: {
            "@/sd": "sd",
            "slidew": "sd",
        },
    };
}

if (require.main === module) {
    let defaultConfig;
    try {
        defaultConfig = require("../myconfig.json");
    } catch (e) {
        console.log(colors("red", "[error]未找到 myconfig.json 文件，请确保项目根目录下存在 myconfig.json 文件"));
        process.exit(1);
    }
    global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    sourceFilePath = global["i"];
    targetFilePath = defaultConfig["defaultAnimationTargetFilePath"];
    if (!sourceFilePath) {
        console.log(colors("red", "[error]请提供源文件路径"));
        console.log(colors("cyan", "用法: node aniTask.js <源文件路径> [目标路径]"));
        process.exit(1);
    }
    animationTask(sourceFilePath, targetFilePath);
}

module.exports = animationTask;
