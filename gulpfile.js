const gulp = require("gulp");
const aniTask = require("./build/aniTask");
const libTask = require("./build/libTask");
const pptTask = require("./build/pptTask");

const defaultConfig = require("./myconfig.json");

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