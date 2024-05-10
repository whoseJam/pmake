const gulp = require("gulp");
const webpack = require("webpack-stream");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));

const defaultAnimationTargetFilePath = "C:/Users/27670/Desktop/output/animation";
const defaultPPTTargetFilePath = "C:/Users/27670/Desktop/output";

function prepareAnimationTask() {
    if (global.prepareAnimationTaskExecuted) return;
    const sourceFilePath = process.argv[4];
    const targetFilePath = defaultAnimationTargetFilePath;
    const animationName = String(sourceFilePath).split("/").slice(-1)[0].split(".")[0]
    console.log(`the animation name is ${animationName}`);
    console.log(`the input file locate at ${sourceFilePath}`);
    console.log(`the output file locate at ${targetFilePath}`);
    global.sourceFilePath = sourceFilePath;
    global.targetFilePath = targetFilePath;
    global.animationName = animationName;
    global.prepareAnimationTaskExecuted = true;
}

function animationTask(sourceFilePath, targetFilePath, animationName) {
    return gulp.src(sourceFilePath)
        .pipe(webpack(getWebpackAnimationConfig(sourceFilePath, animationName)))
        .pipe(gulp.dest(targetFilePath));
}

function pptTask(pptFilePath, targetFilePath) {
    return gulp.src(pptFilePath)
        .pipe(webpack(getWebpackPPTConfig(pptFilePath)))
        .pipe(gulp.dest(targetFilePath));
}

gulp.task("animation", () => {
    prepareAnimationTask();
    const sourceFilePath = global.sourceFilePath;
    const targetFilePath = global.targetFilePath;
    const animationName = global.animationName;
    return animationTask(sourceFilePath, targetFilePath, animationName);
});

gulp.task("animation-in-ppt", (done) => {
    // return animationTask();
    done();
})

gulp.task("ppt", (done) => {
    const sourceFileFolder = process.argv[4];
    const pptFilePath = `${sourceFileFolder}/ppt.html`;
    console.log(`ppt file locate at ${pptFilePath}`);
    const animationList = fs.readdirSync(sourceFileFolder).filter(
        animation => animation.endsWith(".js")
    );
    console.log(animationList);
    animationList.forEach(animation => {
        const sourceFilePath = `${sourceFileFolder}/${animation}`;
        const targetFilePath = defaultAnimationTargetFilePath;
        const animationName = animation.split(".")[0];
        console.log(`animation file locate at ${sourceFilePath} and its name is ${animationName}`)
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        })
    });
    gulp.task("ppt-html", (done) => {
        return pptTask(pptFilePath, defaultPPTTargetFilePath);
    })
    const tasks = gulp.parallel.apply(gulp, animationList);
    const project = gulp.parallel(tasks, gulp.task("ppt-html"));
    
    project();

    const watchPattern = `${sourceFileFolder}/*.js`;
    const watcher = gulp.watch(watchPattern);
    watcher.on("add", function(path, stats) {
        if (!path.endsWith(".js")) return;
        console.log(`File ${path} is added`, stats);
        const animation = path.split("\\").slice(-1)[0];
        const sourceFilePath = `${sourceFileFolder}/${animation}`;
        const targetFilePath = defaultAnimationTargetFilePath;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        });
    });
    done();
})

// gulp.task("ppt", gulp.parallel(
//     config.animations.map(animation => {
//         console.log("insert animation =", animation);
//         return () => {

//         };
//     })
// ));


const HtmlWebpackPlugin = require("html-webpack-plugin");
function getWebpackAnimationConfig(sourceFilePath, animationName) {
    return {
        mode: "development",
        // mode: "production",
        output: {
            filename: `${animationName}.js`
        },
        watch: true,
        plugins: [
            new HtmlWebpackPlugin({
                template: "./asset/animationIndex.html",
                inject: "body",
                inlineSource: ".(js)$",
                minify: false,
                filename: `${animationName}.html`
            })
        ],
        module: {
            rules: [
                {   test: /\.js$/,
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
        resolve: {
            fallback: {
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify"),
                "path": require.resolve("path-browserify"),
                "os": require.resolve("os-browserify/browser")
            }
        }
    };
}

function getWebpackPPTConfig(pptFilePath) {
    // pptFilePath: ./work/xxx/ppt.html
    const pptFilePathAbsolute = __dirname.replaceAll("\\", "/") + pptFilePath.slice(1)
    return {
        mode: "development",
        entry: "./asset/pptMain.js",
        plugins: [
            new HtmlWebpackPlugin({
                template: "./asset/pptIndex.html",
            }),
        ],
        module: {
            rules: [
                {   test: /.js$/,
                    use: [
                        "babel-loader",
                        {   loader: "./asset/ppt-loader",
                            options: {
                                url: pptFilePathAbsolute
                            }
                        }
                ]
                },
                {   test: /.html$/,
                    use: ["html-loader"]
                },
                {   test: /.css$/,
                    use: ["style-loader", "css-loader"]
                },
            ]
        }
    }
}