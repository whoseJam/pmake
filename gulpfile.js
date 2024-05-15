const gulp = require("gulp");
const webpack = require("webpack-stream");
const fs = require("fs");

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
    const HTMLFileFolder = `${sourceFileFolder}/html`;    ifNotExistThenCreateFolder(HTMLFileFolder);

    const animationList = fs.readdirSync(JSFileFolder);
    animationList.forEach(animation => {    // 迁移动画
        const sourceFilePath = `${JSFileFolder}/${animation}`;
        const targetFilePath = `${defaultPPTTargetFilePath}/animation`;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        })
    });

    gulp.task("transfer-ppt", (done) => {   // 迁移ppt
        return pptTask(pptFilePath, defaultPPTTargetFilePath);
    });

    gulp.task("transfer-image", (done) => {
        const imageList = fs.readdirSync(IMGFileFolder);
        imageList.forEach(image => {    // 迁移图片
            const sourceFilePath = `${IMGFileFolder}/${image}`;
            const targetFilePath = `${defaultPPTTargetFilePath}/image`;
            gulp.src(sourceFilePath, { encoding: false })
                .pipe(gulp.dest(targetFilePath));
        });
        done();
    });

    gulp.task("transfer-markdown", (done) => {
        const mdList  = fs.readdirSync(MDFileFolder);
        mdList.forEach(md => {  // 迁移markdown
            const sourceFilePath = `${MDFileFolder}/${md}`;
            const targetFilePath = `${defaultPPTTargetFilePath}/markdown`;
            gulp.src(sourceFilePath)
                .pipe(gulp.dest(targetFilePath));
        });
    });

    gulp.task("transfer-html", (done) => {
        const htmlList = fs.readdirSync(HTMLFileFolder);
        htmlList.forEach(html => {  // 迁移html(ppt-section)
            const sourceFilePath = `${HTMLFileFolder}/${html}`;
            const targetFilePath = `${defaultPPTTargetFilePath}/html`;
            gulp.src(sourceFilePath)
                .pipe(gulp.dest(targetFilePath));
        });
        done();
    })
    
    let project = gulp.parallel(
        gulp.task("transfer-ppt"),
        gulp.task("transfer-image"),
        gulp.task("transfer-markdown"),
        gulp.task("transfer-html"));
    if (animationList.length > 0) {
        const tasks = gulp.parallel.apply(gulp, animationList);
        project = gulp.parallel(project, tasks);
    }

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
    gulp.watch(IMGwatchPattern, gulp.task("transfer-image"));

    // 监控markdown修改
    const MDwatchPattern = `${MDFileFolder}/**`;
    gulp.watch(MDwatchPattern, gulp.task("transfer-markdown"))

    const HTMLwatchPattern = `${HTMLFileFolder}/**.html`;
    gulp.watch(HTMLwatchPattern, gulp.task("transfer-html"));
})

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
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
            alias: {
                "@": path.resolve(__dirname, "lib")
            }
        }
    };
}

function getWebpackPPTConfig(pptFilePath) {
    // pptFilePath: ./work/xxx/ppt.html
    const pptFilePathAbsolute = __dirname.replaceAll("\\", "/") + pptFilePath.slice(1)
    return {
        mode: "development",
        // mode: "production",
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