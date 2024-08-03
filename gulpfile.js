const gulp = require("gulp");
const aniTask = require("./build/aniTask");
const libTask = require("./build/libTask");
const pptTask = require("./build/pptTask");
const colors = require("colors-console");

let defaultConfig = undefined;
try {
    defaultConfig = require("./myconfig.json");
} catch(e) {
    console.log(colors("red", "[error]未找到 myconfig.json 文件，请确保 ./pmake 目录下存在 myconfig.json 文件"));
    console.log(colors("cyan", "myconfig.json") + " 需要配置如下：")
    console.log(colors("cyan", "defaultAnimationTargetFilePath") + "：动画默认输出路径（例如 C:/Users/xxx/Desktop/output）");
    console.log(colors("cyan", "defaultPPTTargetFilePath") + "：ppt默认输出路径（例如 C:/Users/xxx/Desktop/output/animation）");
    process.exit(1);
}

const defaultAnimationTargetFilePath = defaultConfig["defaultAnimationTargetFilePath"];
const defaultPPTTargetFilePath = defaultConfig["defaultPPTTargetFilePath"];

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

gulp.task("lib", () => {
    parseInput();
    return libTask(defaultAnimationTargetFilePath);
});

gulp.task("ani", () => {
    parseInput();
    return aniTask(global["i"], defaultAnimationTargetFilePath);
});

gulp.task("animation", gulp.parallel("lib", "ani"));

gulp.task("ppt", () => {
    parseInput();
    return pptTask(global["i"], global["o"] ? global["o"] : defaultPPTTargetFilePath);
})