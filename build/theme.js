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
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions', 'ie >= 10', 'Firefox >= 45', 'Chrome >= 45', 'Safari >= 10'],
            cascade: true,
            remove: false
        }))
        .pipe(cleanCSS({ compatibility: "ie8", keepSpecialComments: 1 }))
        .pipe(gulp.dest(outputPath));
}

module.exports = themeTask;