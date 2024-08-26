const fs                = require("fs");
const gulp              = require("gulp");
const path              = require("path");
const webpack           = require("webpack-stream");
const aniTask           = require("./aniTask");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const colors = require("colors-console");

const eventListener = {};

defineEventListener("cpp", {
    onAdd: copyCPPFile,
    onChange: copyCPPFile,
    onUnlink: cleanCPPFile
})
defineEventListener("html|md|txt", {
    onAdd: copyFile,
    onChange: copyFile,
    onUnlink: cleanFile
});
defineEventListener("png|jpg|jpeg", {
    onAdd: copyImage,
    onChange: copyImage,
    onUnlink: cleanFile
});
defineEventListener("js", {
    onAdd: function(path, destFolderPath) {
        const animation = pathToFile(path);
        const animationName = animation.split(".")[0];
        gulp.task(animation, (done) => {
            return aniTask(path, destFolderPath, animationName);
        });
        gulp.task(animation)();
    },
    onChange: function() {},
    onUnlink: function(path) {
        console.log("unlink path=", path);
    }
});

module.exports = function PPTTask(sourceFileFolder, targetFileFolder, done) {
    const pptFilePath = `${sourceFileFolder}/ppt.html`;

    // if (fs.existsSync(pptFilePath)) {
    //     // console.log(colors("red", `[error] 请检查`));
    // }

    gulp.task("ppt-task", (done) => {
        return gulp.src(pptFilePath)
                   .pipe(webpack(PPTConfiguration(pptFilePath)))
                   .pipe(gulp.dest(targetFileFolder));
    });
    
    const project = gulp.parallel(
        gulp.task("ppt-task"),
        gulp.task("lib")
    );

    global.sourceFileFolder = sourceFileFolder;
    global.targetFileFolder = targetFileFolder;

    cleanAllFiles(targetFileFolder);
    cleanAllEmptyDirectories(targetFileFolder);
    walk(sourceFileFolder, path => {
        const suffix = path.split(".").slice(-1)[0];
        if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
            console.log(`文件 ${path} 的后缀名未定义 onAdd 处理函数`);
            return;
        }
        eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
    });
    done();

    if (global["w"]) {
        const watcher = gulp.watch(`${sourceFileFolder}/**`);
        watcher.on("change", function(path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (!eventListener[suffix] || !eventListener[suffix].onChange) {
                console.log(`文件 ${path} 的后缀名未定义 onChange 处理函数`);
                return;
            }
            eventListener[suffix].onChange(pathToOriginFile(path), pathToTargetFolder(path));
        });
        watcher.on("add", function(path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (!eventListener[suffix] || !eventListener[suffix].onAdd) {
                console.log(`文件 ${path} 的后缀名未定义 onAdd 处理函数`);
                return;
            }
            eventListener[suffix].onAdd(pathToOriginFile(path), pathToTargetFolder(path));
        });
        watcher.on("unlink", function(path) {
            path = path.replaceAll("\\", "/");
            const suffix = path.split(".").slice(-1)[0];
            if (!eventListener[suffix] || !eventListener[suffix].onUnlink) {
                console.log(`文件 ${path} 的后缀名未定义 onUnlink 处理函数`);
            }
            eventListener[suffix].onUnlink(pathToTargetFile(path));
        });
    }

    project();
}

function relativePath(filePath) {
    const A = filePath.split("/");
    const B = sourceFileFolder.split("/");
    let indexA = 0, indexB = 0;
    while (indexA < A.length && A[indexA] === ".") indexA++;
    while (indexB < B.length && B[indexB] === ".") indexB++;
    while (indexA < A.length && indexB < B.length) {
        if (A[indexA] !== B[indexB]) break;
        indexA++;
        indexB++;
    }
    return A.slice(indexA, A.length).join("/");
}

function relativePathWithoutFile(filePath) {
    const path = relativePath(filePath);
    return path.split("/").slice(0, -1).join("/");
}

function pathToOriginFile(path) {
    return `${sourceFileFolder}/${relativePath(path)}`;
}

function pathToTargetFile(path) {
    return `${targetFileFolder}/${relativePath(path)}`;
}

function pathToTargetFolder(path) {
    return `${targetFileFolder}/${relativePathWithoutFile(path)}`;
}

function pathToFile(path) {
    path = path.replaceAll("\\", "/");
    return path.split("/").slice(-1)[0];
}

function copyFile(srcPath, destFolderPath) {
    return gulp.src(srcPath)
               .pipe(gulp.dest(destFolderPath));
}

function copyCPPFile(srcPath, destFolderPath) {
    return copyFile(srcPath, `${targetFileFolder}/std`);
}

function copyImage(srcPath, destFolderPath) {
    return gulp.src(srcPath, { encoding: false })
               .pipe(gulp.dest(destFolderPath));
}

function cleanFile(path) {
    const stats = fs.statSync(path);
    if (stats.isFile()) fs.unlinkSync(path);
}

function cleanCPPFile(path) {
    const fileName = path.split("/").slice(-1)[0];
    cleanFile(`${targetFileFolder}/std/${fileName}`);
}

function cleanAllFiles(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            cleanAllFiles(filePath);
        } else {
            fs.unlinkSync(filePath);
        }
    });
}

function cleanAllEmptyDirectories(path, level = 0) {
    const files = fs.readdirSync(path);
    if (files.length > 0) {
        let tempFile = 0;
        files.forEach(file => {
            tempFile++;
            cleanAllEmptyDirectories(`${path}/${file}`, 1);
        });
        if (tempFile === files.length && level !== 0) {
            fs.rmdirSync(path);
        }
    } else {
        level !==0 && fs.rmdirSync(path);
    }
}

function cleanFilesInFolder(directoryPath) {
    ifNotExistThenCreateFolder(directoryPath);
    const files = fs.readdirSync(directoryPath);
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            fs.unlinkSync(filePath);
        }
    });
}

function ifNotExistThenCreateFolder(folderPath) {
    if (fs.existsSync(folderPath)) return;
    fs.mkdirSync(folderPath);
}

function walk(directoryPath, callback) {
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = `${directoryPath}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            callback(filePath);
        } else if (stats.isDirectory()) {
            walk(filePath, callback);
        }
    })
}

function defineEventListener(suffix, listener) {
    const allSuffix = suffix.split("|");
    allSuffix.forEach(suffix => {
        eventListener[suffix] = listener;
    });
}

function PPTConfiguration(pptFilePath) {
    // pptFilePath: ./work/xxx/ppt.html
    const mode = global["d"] ? "development" : "production";
    const pptFilePathAbsolute = global["projectRoot"] + pptFilePath.slice(1);
    const watch = global["w"] ? true : false;
    return {
        mode: mode,
        entry: `${global["projectRoot"]}/build/pptMain.js`,
        watch: watch,
        plugins: [
            new HtmlWebpackPlugin({
                template: `${global["projectRoot"]}/build/pptIndex.html`,
            })
        ],
        module: {
            rules: [
                {   test: /\.tsx?$/,
                    use: ["ts-loader"]
                },
                {   test: /.html$/,
                    use: ["html-loader"]
                },
                {   test: /\.(s[ac]ss|css)$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        }
    }
}