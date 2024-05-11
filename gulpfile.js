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

function ifNotExistThenCreateFolder(folderPath) {
    if (fs.existsSync(folderPath)) return;
    fs.mkdirSync(folderPath);
}

gulp.task("ppt", (done) => {
    const sourceFileFolder = process.argv[4];
    const pptFilePath = `${sourceFileFolder}/ppt.html`;
    const JSFileFolder = `${sourceFileFolder}/animation`; ifNotExistThenCreateFolder(JSFileFolder);
    const IMGFileFolder = `${sourceFileFolder}/image`;    ifNotExistThenCreateFolder(IMGFileFolder);
    const MDFileFolder = `${sourceFileFolder}/markdown`;  ifNotExistThenCreateFolder(MDFileFolder);

    const animationList = fs.readdirSync(JSFileFolder);
    const imageList = fs.readdirSync(IMGFileFolder);
    const mdList  = fs.readdirSync(MDFileFolder);

    animationList.forEach(animation => {    // 迁移动画
        const sourceFilePath = `${JSFileFolder}/${animation}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/animation`;
        const animationName = animation.split(".")[0];
        console.log(`animation file locate at ${sourceFilePath} and its name is ${animationName}`)
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        })
    });
    imageList.forEach(image => {    // 迁移图片
        const sourceFilePath = `${IMGFileFolder}/${image}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/image`;
        gulp.src(sourceFilePath, { encoding: false })
            .pipe(gulp.dest(targetFilePath));
    });
    mdList.forEach(md => {  // 迁移markdown
        const sourceFilePath = `${MDFileFolder}/${md}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/markdown`;
        gulp.src(sourceFilePath)
            .pipe(gulp.dest(targetFilePath));
    })
    gulp.task("ppt-html", (done) => {   // 迁移ppt
        return pptTask(pptFilePath, defaultPPTTargetFilePath);
    })
    
    let project;
    if (animationList.length > 0) {
        const tasks = gulp.parallel.apply(gulp, animationList);
        project = gulp.parallel(tasks, gulp.task("ppt-html"));
    } else project = gulp.parallel(gulp.task("ppt-html"));
    project();

    const JSwatchPattern = `${sourceFileFolder}/animation/*.js`;
    const JSwatcher = gulp.watch(JSwatchPattern);
    JSwatcher.on("add", function(path, stats) {
        console.log(`File ${path} is added`, stats);
        const animation = path.split("\\").slice(-1)[0];
        const sourceFilePath = `${sourceFileFolder}/animation/${animation}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/animation`;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        });
        gulp.task(animation)();
    });
    
    // 监控图片修改
    const IMGwatchPattern = `${IMGFileFolder}/**`;
    gulp.watch(IMGwatchPattern, function(path, stats) {
        const image = path.split("\\").slice(-1)[0];
        const sourceFilePath = `${IMGFileFolder}/${image}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/image`;
        gulp.src(sourceFilePath)
            .pipe(gulp.dest(targetFilePath));
    });

    // 监控markdown修改
    const MDwatchPattern = `${MDFileFolder}/**`;
    gulp.watch(MDwatchPattern, function(path, stats) {
        console.log("path = ", path);
        const md = path.split("\\").slice(-1)[0];
        const sourceFilePath = `${MDFileFolder}/${md}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/markdown`;
        gulp.src(sourceFilePath)
            .pipe(gulp.dest(targetFilePath));
    })
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
        watch: true,
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