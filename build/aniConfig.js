const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = function(sourceFilePath, animationName) {
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
                {   test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: "ts-loader"
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
            extensions: [".tsx", ".ts", ".js"]
        },
        externals: ["dagre"]
    };
}