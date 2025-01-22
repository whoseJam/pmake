const gulp = require("gulp");

const SDTask = require("./build/SDTask");
const animation = require("./build/animation");
const pptTask = require("./build/pptTask");
const MyRevealTask = require("./build/MyRevealTask");
const SDIFrameTask = require("./build/SDIFrameTask");
const releaseTask = require("./build/releaseTask");
const parser = require("./build/parser");

const colors = require("colors-console");

let defaultConfig = undefined;
try {
    defaultConfig = require("./myconfig.json");
} catch (e) {
    console.log(colors("red", "[error]未找到 myconfig.json 文件，请确保 ./pmake 目录下存在 myconfig.json 文件"));
    console.log(colors("cyan", "myconfig.json") + " 需要配置如下：");
    console.log(colors("cyan", "defaultAnimationTargetFilePath") + "：动画默认输出路径（例如 C:/Users/xxx/Desktop/output）");
    console.log(colors("cyan", "defaultPPTTargetFilePath") + "：ppt默认输出路径（例如 C:/Users/xxx/Desktop/output/animation）");
    process.exit(1);
}

const defaultAnimationTargetFilePath = defaultConfig["defaultAnimationTargetFilePath"];
const defaultPPTTargetFilePath = defaultConfig["defaultPPTTargetFilePath"];
const defaultReleaseFilePath = defaultConfig["defaultReleaseFilePath"];

global["projectRoot"] = __dirname.replaceAll("\\", "/");

parser.parseInput();

gulp.task("SD", () => {
    return SDTask(defaultPPTTargetFilePath);
});

gulp.task("MyReveal", () => {
    return MyRevealTask(defaultPPTTargetFilePath);
});

gulp.task("animation", () => {
    return animation(global["i"], defaultAnimationTargetFilePath);
});

gulp.task("sd-iframe", () => {
    return SDIFrameTask(defaultPPTTargetFilePath);
});

gulp.task("release", done => {
    if (!defaultReleaseFilePath) {
        console.log(colors("red", "[error]未找到 defaultReleaseFilePath 配置，请在 myconfig.json 中添加该配置项"));
        console.log(colors("cyan", "defaultReleaseFilePath") + "：发布包输出路径（例如 C:/Users/xxx/Desktop/release）");
        process.exit(1);
    }
    return releaseTask(defaultReleaseFilePath, done);
});

gulp.task("ppt", done => {
    const inputPath = global["i"];
    const outputPath = global["o"] ? global["o"] : defaultPPTTargetFilePath;
    gulp.task("ppt-inner", function (done) {
        pptTask(inputPath, outputPath);
        done();
    });
    if (global["l"]) {
        const result = gulp[global["w"] ? "parallel" : "series"]("ppt-inner", "SD", "MyReveal")();
        done();
        return result;
    }
    return gulp.task("ppt-inner")(done);
});

gulp.task("serve", done => {
    const exec = require("child_process").exec;
    exec(`cd ${defaultPPTTargetFilePath} && live-server`, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        } else {
            console.log("success");
        }
        done();
    });
});
