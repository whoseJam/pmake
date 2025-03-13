const gulp = require("gulp");

const sd = require("./build/sd");
const animation = require("./build/animation");
const ppt = require("./build/ppt");
const reveal = require("./build/reveal");
const revealPlugin = require("./build/revealPlugin");
const iframe = require("./build/iframe");
const release = require("./build/release");
const themeTask = require("./build/theme");
const parser = require("./build/parser");
const rag = require("./build/rag");

global["projectRoot"] = __dirname.replaceAll("\\", "/");

parser.parseInput();

gulp.task("sd", () => {
    global["sd"] = true;
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return sd(pptOutputPath);
});

gulp.task("reveal", () => {
    global["reveal"] = true;
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return reveal(pptOutputPath);
});

gulp.task("revealPlugin", () => {
    const pluginOutputPath = global["o"];
    return revealPlugin(pluginOutputPath);
});

gulp.task("theme", async () => {
    global["theme"] = true;
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return await themeTask(pptOutputPath);
});

gulp.task("animation", () => {
    const animationOutputPath = global["o"] || parser.parseConfig("animationOutputPath");
    return animation(global["i"], animationOutputPath);
});

gulp.task("iframe", () => {
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    return iframe(pptOutputPath);
});

gulp.task("release", done => {
    const releaseOutputPath = global["o"] || parser.parseConfig("releaseOutputPath");
    release(releaseOutputPath, done);
});

gulp.task("ppt", done => {
    const pptOutputPath = global["o"] || parser.parseConfig("pptOutputPath");
    ppt(global["i"], pptOutputPath);
    done();
});

gulp.task("serve", done => {
    const exec = require("child_process").exec;
    const pptOutputPath = parser.parseConfig("pptOutputPath");
    exec(`cd ${pptOutputPath} && live-server`, function (error, stdout, stderr) {
        if (error) console.log(error);
        else console.log("success");
        done();
    });
});

gulp.task("rag", done => {
    const ragOutputPath = global["o"] || parser.parseConfig("ragOutputPath");
    rag(ragOutputPath);
    done();
});
