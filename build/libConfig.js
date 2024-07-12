const JavaScriptObfuscator = require('webpack-obfuscator');
const path = require("path");

module.exports = function() {
    const mode = global["d"] ? "development" : "production";
    return {
        mode: mode,
        output: {
            filename: 'sd.js',
            library: 'sd',
            libraryTarget: 'umd',
            umdNamedDefine: true,
            globalObject: 'this',
        },
        watch: true,
        plugins: [
            new JavaScriptObfuscator({
                rotateUnicodeArray: true
            })
        ],
        module: {
            rules: [
                {   test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
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
        externals: {
            "dagre": "dagre",
        }
    };
}