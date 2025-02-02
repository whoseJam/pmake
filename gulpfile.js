const gulp = require("gulp");
const aniTask = require("./build/aniTask");
const pptTask = require("./build/pptTask");

const SDTask = require("./build/SDTask");
const MyRevealTask = require("./build/MyRevealTask");
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

const defaultAnimationTargetFilePath = defaultConfig["animationOutputPath"];
const defaultPPTTargetFilePath = defaultConfig["pptOutputPath"];

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

gulp.task("SD", () => {
    parseInput();
    return SDTask(defaultPPTTargetFilePath);
});

gulp.task("MyReveal", () => {
    parseInput();
    return MyRevealTask(defaultPPTTargetFilePath);
});

gulp.task("ani", () => {
    parseInput();
    return aniTask(global["i"], defaultAnimationTargetFilePath);
});

gulp.task("animation", gulp.parallel("SD", "ani"));

gulp.task("ppt", done => {
    parseInput();
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
