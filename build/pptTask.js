const fs                = require("fs");
const gulp              = require("gulp");
const path              = require("path");
const webpack           = require("webpack-stream");
const aniTask           = require("./aniTask");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function PPTTask(sourceFileFolder, targetFileFolder) {
    const pptFilePath = `${sourceFileFolder}/ppt.html`;
    const aniFileFolder = `${sourceFileFolder}/animation`;
    const imgFileFolder = `${sourceFileFolder}/image`;
    const mkdFileFolder = `${sourceFileFolder}/markdown`;
    const htmFileFolder = `${sourceFileFolder}/html`;
    const stdFileFolder = `${sourceFileFolder}/std`;
    ifNotExistThenCreateFolder(aniFileFolder);
    ifNotExistThenCreateFolder(imgFileFolder);
    ifNotExistThenCreateFolder(mkdFileFolder);
    ifNotExistThenCreateFolder(htmFileFolder);
    ifNotExistThenCreateFolder(stdFileFolder);

    registerTransferTask(imgFileFolder, targetFileFolder, "image", copyImage);
    registerTransferTask(mkdFileFolder, targetFileFolder, "markdown");
    registerTransferTask(htmFileFolder, targetFileFolder, "html");
    registerTransferTask(stdFileFolder, targetFileFolder, "std");
    gulp.task("transfer-ppt", (done) => {
        return gulp.src(pptFilePath)
                   .pipe(gulp.dest(targetFileFolder));
    });
    gulp.task("ppt-task", (done) => {
        return gulp.src(pptFilePath)
                   .pipe(webpack(PPTConfiguration(pptFilePath)))
                   .pipe(gulp.dest(targetFileFolder));
    });
    gulp.watch(pptFilePath, gulp.task("transfer-ppt"));

    const project = gulp.parallel(
        gulp.task("ppt-task"),
        gulp.task("transfer-ppt"),
        gulp.task("transfer-std"),
        gulp.task("transfer-html"),
        gulp.task("transfer-image"),
        gulp.task("transfer-markdown"),
        gulp.task("lib")
    );

    cleanFilesInFolder(`${targetFileFolder}/animation`);
    const animationList = fs.readdirSync(aniFileFolder);
    animationList.forEach(animation => {    // 迁移动画
        const sourceFilePath = `${aniFileFolder}/${animation}`;
        const targetFilePath = `${targetFileFolder}/animation`;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return aniTask(sourceFilePath, targetFilePath, animationName);
        })
        gulp.task(animation)();
    });
    const JSwatchPattern = `${sourceFileFolder}/animation/*.js`;
    const JSwatcher = gulp.watch(JSwatchPattern);
    JSwatcher.on("add", function(path, stats) {
        console.log(`File ${path} is added`, stats);
        const animation = pathToFile(path);
        const sourceFilePath = `${sourceFileFolder}/animation/${animation}`;
        const targetFilePath = `${targetFileFolder}/animation`;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return aniTask(sourceFilePath, targetFilePath, animationName);
        });
        gulp.task(animation)();
    });

    watchFiles(`${imgFileFolder}/**`     , imgFileFolder, `${targetFileFolder}/image`, copyImage);
    watchFiles(`${mkdFileFolder}/**.md`  , mkdFileFolder, `${targetFileFolder}/markdown`);
    watchFiles(`${htmFileFolder}/**.html`, htmFileFolder, `${targetFileFolder}/html`);
    watchFiles(`${stdFileFolder}/**.cpp` , stdFileFolder, `${targetFileFolder}/std`);
    project();
}

function pathToFile(path) {
    path = path.replaceAll("\\", "/");
    return path.split("/").slice(-1)[0];
}

function copyFile(srcPath, destPath) {
    return gulp.src(srcPath)
               .pipe(gulp.dest(destPath));
}

function copyImage(srcPath, destPath) {
    return gulp.src(srcPath, { encoding: false })
               .pipe(gulp.dest(destPath));
}

function cleanFile(path) {
    const stats = fs.statSync(path);
    if (stats.isFile()) fs.unlinkSync(path);
}

function cleanFilesInFolder(directoryPath) {
    ifNotExistThenCreateFolder(directoryPath);
    const files = fs.readdirSync(directoryPath);
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) fs.unlinkSync(filePath);
    });
}

function ifNotExistThenCreateFolder(folderPath) {
    if (fs.existsSync(folderPath)) return;
    fs.mkdirSync(folderPath);
}

function watchFiles(pattern, inputPath, outputPath, copy = copyFile) {
    const watcher = gulp.watch(pattern);
    watcher.on("change", function(path, stats) {
        const file = pathToFile(path);
        const task = gulp.task(file);
        if (task) task();
    });
    watcher.on("add", function(path, stats) {
        const file = pathToFile(path);
        const sourceFilePath = `${inputPath}/${file}`;
        const targetFilePath = `${outputPath}`;
        gulp.task(file, () => copy(sourceFilePath, targetFilePath));
        gulp.task(file)();
    });
    watcher.on("unlink", function(path, stats) {
        const file = pathToFile(path);
        const targetFilePath = `${outputPath}/${file}`;
        cleanFile(targetFilePath);
    });
}

/**
 * @param inputPath 指向项目资源文件，例如 ./work/Tarjan/std
 * @param outputPath 指向输出文件根目录，例如 ./output
 * @param {"std"|"markdown"|"image"|"html"} resourceType 
 */
function registerTransferTask(inputPath, outputPath, resourceType, copy = copyFile) {
    gulp.task(`transfer-${resourceType}`, (done) => {
        const targetFilePath = `${outputPath}/${resourceType}`;
        ifNotExistThenCreateFolder(targetFilePath);
        cleanFilesInFolder(targetFilePath);
        const fileList = fs.readdirSync(inputPath);
        fileList.forEach(file => {
            const sourceFilePath = `${inputPath}/${file}`;
            gulp.task(file, () => copy(sourceFilePath, targetFilePath));
            gulp.task(file)();
        })
        done();
    });
}

function PPTConfiguration(pptFilePath) {
    // pptFilePath: ./work/xxx/ppt.html
    const mode = global["d"] ? "development" : "production";
    const pptFilePathAbsolute = global["projectRoot"] + pptFilePath.slice(1);
    return {
        mode: mode,
        entry: `${global["projectRoot"]}/build/pptMain.js`,
        watch: true,
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/pptIndex.html`,
            })
        ],
        module: {
            rules: [
                {   test: /\.tsx?$/,
                    use: ["ts-loader"]
                },
                {   test: /.html$/,
                    use: ["html-loader"]
                },
                {   test: /\.(s[ac]ss|css)$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        }
    }
}