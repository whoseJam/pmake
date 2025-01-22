const gulp = require("gulp");
const through = require("through2");
const path = require("path");

function convertImportPaths(content, filePath, targetPath) {
    const importRegex = /from\s+['"](@[^'"]+)['"]/g;
    const requireRegex = /require\s*\(\s*['"](@[^'"]+)['"]\s*\)/g;
    const getRelativePath = (importPath) => {
        const purePath = importPath.substring(1);
        const currentDir = path.dirname(filePath);
        const targetPath = path.join("SD", purePath);
        let relativePath = path.relative(currentDir, targetPath).replace(/\\/g, "/");
        return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
    };
    content = content.replace(importRegex, (match, importPath) => {
        return "from \"" + getRelativePath(importPath) + "\"";
    });
    content = content.replace(requireRegex, (match, importPath) => {
        return "require(\"" + getRelativePath(importPath) + "\")";
    });
    return content;
}

function releaseTask(targetPath, done) {
    const processSD = () => {
        return gulp.src(["SD/**/*.ts"], { base: "SD" })
            .pipe(through.obj(function(file, enc, done) {
                if (file.isNull()) {
                    return done(null, file);
                }
                if (file.isBuffer() && path.extname(file.path) === ".ts") {
                    const content = file.contents.toString();
                    const newContent = convertImportPaths(content, file.path, targetPath);
                    file.contents = Buffer.from(newContent);
                }
                done(null, file);
            }))
            .pipe(gulp.dest(targetPath));
    };

    const processBuild = () => {
        return gulp.src(["./build/**/*"], { base: "." })
            .pipe(gulp.dest(targetPath));
    };

    const processPackage = () => {
        return gulp.src(["package.json"], { base: "." })
            .pipe(gulp.dest(targetPath));
    };

    done();
    return gulp.series(processSD, processBuild, processPackage)();
}

module.exports = releaseTask;
