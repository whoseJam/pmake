const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const path = require("path");

async function themeTask(outputPath) {
    const autoprefixer = (await import("gulp-autoprefixer")).default;
    const themePath = path.join(__dirname, "../Reveal/css/theme");
    const sourcePath = path.join(themePath, "source/**/*.scss");

    return gulp.src(sourcePath)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(gulp.dest(outputPath));
}

module.exports = themeTask;