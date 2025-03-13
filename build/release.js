const gulp = require("gulp");
const path = require("path");
const through = require("through2");

const URLS_TO_BE_PROCESSED = [
    // urls to be processed
    "./build/**/*",
    "./dist/**/*",
    "./Reveal/**/*",
    "./example/**/*",
    ".prettierrc",
    "gulpfile.js",
    "jsconfig.json",
    "package.json",
    "README.md",
];

const BLACK_LIST_FOR_SD = new Set([
    // black list for SD
    "Animate\\Action.js",
    "Animate\\ActionList.js",
    "Animate\\Animate.js",
    "Animate\\Context.js",
    "Animate\\Interp.js",
    "Animate\\Window.js",
    "Interact\\Init.js",
    "sd.js",
]);

function convertImportPaths(content, filePath, targetPath) {
    const importRegex = /from\s+['"](@[^'"]+)['"]/g;
    const requireRegex = /require\s*\(\s*['"](@[^'"]+)['"]\s*\)/g;
    const getRelativePath = importPath => {
        const purePath = importPath.substring(1);
        const currentDir = path.dirname(filePath);
        const targetPath = path.join("SD", purePath);
        let relativePath = path.relative(currentDir, targetPath).replace(/\\/g, "/");
        return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
    };
    content = content.replace(importRegex, (match, importPath) => {
        return 'from "' + getRelativePath(importPath) + '"';
    });
    content = content.replace(requireRegex, (match, importPath) => {
        return 'require("' + getRelativePath(importPath) + '")';
    });
    return content;
}

function releaseTask(targetPath, done) {
    gulp.src(["SD/**/*.ts", "SD/**/*.js"], { base: "." })
        .pipe(
            through.obj(function (file, enc, done) {
                if (file.isNull()) return done(null, file);
                const relativePath = path.relative("SD", file.path);
                if (BLACK_LIST_FOR_SD.has(relativePath)) return done(null, null);
                if (file.isBuffer()) {
                    const content = file.contents.toString();
                    const newContent = convertImportPaths(content, file.path, targetPath);
                    file.contents = Buffer.from(newContent);
                }
                done(null, file);
            })
        )
        .pipe(gulp.dest(targetPath));

    for (const url of URLS_TO_BE_PROCESSED) {
        gulp.src([url], { base: "." }).pipe(gulp.dest(targetPath));
    }
    done();
}

module.exports = releaseTask;
