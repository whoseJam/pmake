const gulp = require("gulp");
const webpack = require("webpack-stream");
const fs = require("fs");
const path = require("path");
const getWebpackAniConfig = require("./build/aniConfig");
const getWebpackPPTConfig = require("./build/pptConfig");

const defaultAnimationTargetFilePath = "C:/Users/27670/Desktop/output/animation";
const defaultPPTTargetFilePath = "C:/Users/27670/Desktop/output";

global["projectRoot"] = __dirname.replaceAll("\\", "/");

function parseInput() {
    const length = process.argv.length;
    for (let i = 3; i < length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith("-")) {
            const key = arg.slice(1);
            if (i + 1 < length && !process.argv[i + 1].startsWith("-")) {
                const value = process.argv[i + 1];
                global[key] = value;
                i++;
            } else global[key] = true;
        }
    }
}

function prepareAnimationTask() {
    const sourceFilePath = global["i"];
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
        .pipe(webpack(getWebpackAniConfig(sourceFilePath, animationName)))
        .pipe(gulp.dest(targetFilePath));
}

function copyFile(srcPath, destPath) {
    return gulp.src(srcPath)
        .pipe(gulp.dest(destPath));
}

function copyImage(srcPath, destPath) {
    return gulp.src(srcPath, { encoding: false })
        .pipe(gulp.dest(destPath));
}

function transferPPTTask(pptFilePath, targetFilePath) {
    return gulp.src(pptFilePath)
        .pipe(gulp.dest(targetFilePath));
}

function pptTask(pptFilePath, targetFilePath) {
    return gulp.src(pptFilePath)
        .pipe(webpack(getWebpackPPTConfig(pptFilePath)))
        .pipe(gulp.dest(targetFilePath));
}

gulp.task("animation", () => {
    parseInput();
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
    parseInput();
    const sourceFileFolder = global["i"];
    const pptFilePath = `${sourceFileFolder}/ppt.html`;
    const JSFileFolder = `${sourceFileFolder}/animation`; ifNotExistThenCreateFolder(JSFileFolder);
    const IMGFileFolder = `${sourceFileFolder}/image`;    ifNotExistThenCreateFolder(IMGFileFolder);
    const MDFileFolder = `${sourceFileFolder}/markdown`;  ifNotExistThenCreateFolder(MDFileFolder);
    const HTMLFileFolder = `${sourceFileFolder}/html`;    ifNotExistThenCreateFolder(HTMLFileFolder);
    const STDFileFolder = `${sourceFileFolder}/std`;      ifNotExistThenCreateFolder(STDFileFolder);
    const pptTargetFilePath = global["o"] ? global["o"] : defaultPPTTargetFilePath;

    makeTransferTask(IMGFileFolder , pptTargetFilePath, "image", copyImage);
    makeTransferTask(MDFileFolder  , pptTargetFilePath, "markdown");
    makeTransferTask(HTMLFileFolder, pptTargetFilePath, "html");
    makeTransferTask(STDFileFolder , pptTargetFilePath, "std");
    
    gulp.task("transfer-ppt", (done) => {   // 迁移ppt
        return transferPPTTask(pptFilePath, pptTargetFilePath);
    });
    gulp.task("ppt-task", (done) => {
        return pptTask(pptFilePath, pptTargetFilePath);
    })
    gulp.watch(pptFilePath, gulp.task("transfer-ppt"));

    let project = gulp.parallel(
        gulp.task("ppt-task"),
        gulp.task("transfer-ppt"),
        gulp.task("transfer-image"),
        gulp.task("transfer-markdown"),
        gulp.task("transfer-html"),
        gulp.task("transfer-std")
    );

    cleanFilesInFolder(`${pptTargetFilePath}/animation`);
    
    const animationList = fs.readdirSync(JSFileFolder);
    animationList.forEach(animation => {    // 迁移动画
        const sourceFilePath = `${JSFileFolder}/${animation}`;
        const targetFilePath = `${pptTargetFilePath}/animation`;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        })
        gulp.task(animation)();
    });
        
    const JSwatchPattern = `${sourceFileFolder}/animation/*.js`;
    const JSwatcher = gulp.watch(JSwatchPattern);
    JSwatcher.on("add", function(path, stats) {
        console.log(`File ${path} is added`, stats);
        const animation = pathToFile(path);
        const sourceFilePath = `${sourceFileFolder}/animation/${animation}`;
        const targetFilePath = `${pptTargetFilePath}/animation`;
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return animationTask(sourceFilePath, targetFilePath, animationName);
        });
        gulp.task(animation)();
    });
    
    const IMGwatchPattern = `${IMGFileFolder}/**`;
    const MDwatchPattern = `${MDFileFolder}/**.md`;
    const HTMLwatchPattern = `${HTMLFileFolder}/**.html`;
    const STDwatchPattern = `${STDFileFolder}/**.cpp`;
    watchFiles(IMGwatchPattern , IMGFileFolder , `${pptTargetFilePath}/image`, copyImage);
    watchFiles(MDwatchPattern  , MDFileFolder  , `${pptTargetFilePath}/markdown`);
    watchFiles(HTMLwatchPattern, HTMLFileFolder, `${pptTargetFilePath}/html`);
    watchFiles(STDwatchPattern , STDFileFolder , `${pptTargetFilePath}/std`);
    project();
})

/**
 * @param inputPath 指向项目资源文件，例如 ./work/Tarjan/std
 * @param outputPath 指向输出文件根目录，例如 ./output
 * @param {"std"|"markdown"|"image"|"html"} resourceType 
 */
function makeTransferTask(inputPath, outputPath, resourceType, copy = copyFile) {
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
    })
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

function pathToFile(path) {
    path = path.replaceAll("\\", "/");
    return path.split("/").slice(-1)[0];
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