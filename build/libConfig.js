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
            // new JavaScriptObfuscator({
            //     stringArray: true,
            //     rotateUnicodeArray: true,
            //     // debugProtection: true,
            //     deadCodeInjection: true,
            //     deadCodeInjectionThreshold: 1,
            //     controlFlowFlattening: true,
            //     selfDefending: true,
            // })
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
            extensions: [".tsx", ".ts", ".js"]
        },
        externals: {
            "dagre": "dagre",
        }
    };
}