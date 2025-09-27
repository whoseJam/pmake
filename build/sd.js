const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const utils = require("./utils");
const webpack = require("webpack-stream");
const TerserPlugin = require("terser-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

function extractReversedNames() {
    const filePath = path.join(__dirname, "../SD/sd.js");
    try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const regex = /\{([^}]+)\}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(fileContent)) !== null) {
            const contents = match[1].split(",");
            contents.forEach(content => {
                content = content.trim();
                if (content === "CONTINUE_STAGE") return;
                if (/^[A-Z]/.test(content)) matches.push(content);
            });
        }
        console.log("reversedNames:", matches);
        return matches;
    } catch (error) {
        console.error("读取文件时出错:", error);
        return [];
    }
}

/**
 * Compile sd.js to the target folder.
 * @param {string} targetFolder The folder to hold the output.
 * @returns {NodeJS.ReadWriteStream}
 */
module.exports = function (targetFolder) {
    const config = getConfiguration();
    return (
        gulp
            // 调整入口以支持TypeScript文件
            .src(["./SD/sd.js"])
            .pipe(webpack(config))
            .pipe(gulp.dest(targetFolder))
    );
};

function getConfiguration() {
    const plugins = [];
    if (!global["d"]) {
        const obfuscator = new JavaScriptObfuscator({
            identifierNamesGenerator: "mangled",
            splitStrings: true,
            rotateStringArray: true,
            shuffleStringArray: true,
            stringArray: true,
            simplify: true,
            reservedNames: extractReversedNames(),
        });
        plugins.push(obfuscator);
    }
    const mode = global["d"] ? "development" : "production";
    const watch = global["w"] ? true : false;
    return {
        mode,
        watch,
        plugins,
        output: {
            filename: "sd.js",
            library: "sd",
            libraryTarget: "umd",
            umdNamedDefine: true,
            globalObject: "this",
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                allowJs: true, // 允许处理JS文件
                                jsx: "react", // 支持JSX语法
                                esModuleInterop: true, // 兼容ES模块
                                allowSyntheticDefaultImports: true,
                                target: "ES5", // 目标输出ES版本
                                module: "ESNext", // 模块系统
                                moduleResolution: "Node", // 模块解析方式
                                resolveJsonModule: true, // 允许导入JSON
                                sourceMap: mode === "development", // 开发环境生成sourcemap
                                strict: false, // 关闭严格模式检查
                                skipLibCheck: true, // 跳过库文件检查
                                allowDeclareFields: true, // 允许声明字段
                            },
                            transpileOnly: global["d"], // 开发环境关闭类型检查提高速度
                            experimentalFileCaching: true, // 启用缓存提升性能
                        },
                    },
                },
                { test: /\.css$/, use: ["style-loader", "css-loader"] },
            ],
        },
        performance: {
            hints: false,
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true,
                    },
                }),
            ],
        },
        cache: true,
        resolve: {
            alias: {
                "@": path.resolve(global["projectRoot"], "SD"),
            },
            extensions: [".tsx", ".ts", ".jsx", ".js"], // 包含所有需要解析的扩展名
        },
        externals: {
            dagre: "dagre",
        },
    };
}
