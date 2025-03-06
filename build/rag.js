const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const through2 = require("through2");
const colors = require("colors-console");
const parser = require("./parser");

function validateOutputPath(outputPath) {
    if (!outputPath) {
        console.log(colors("red", "[Error] Output path is required."));
        console.log(colors("cyan", "Please specify output path in myconfig.json or use -o parameter."));
        process.exit(1);
    }
    try {
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
            console.log(colors("green", `Created output directory: ${outputPath}`));
        }
        fs.accessSync(outputPath, fs.constants.W_OK);
    } catch (err) {
        console.log(colors("red", `[Error] Cannot write to output directory ${outputPath}`));
        console.log(colors("red", "Please check directory permissions."));
        process.exit(1);
    }
}

function validateSourcePaths(sdPath, examplePath) {
    if (!fs.existsSync(sdPath)) {
        console.log(colors("red", `[Error] SD directory not found: ${sdPath}`));
        console.log(colors("red", "Please check if the project structure is correct."));
        process.exit(1);
    }
    if (!fs.existsSync(examplePath)) {
        console.log(colors("red", `[Error] Example directory not found: ${examplePath}`));
        console.log(colors("red", "Please check if the project structure is correct."));
        process.exit(1);
    }
    const tsFiles = fs.readdirSync(sdPath, { recursive: true })
        .filter(file => file.endsWith(".d.ts"));
    const jsFiles = fs.readdirSync(examplePath, { recursive: true })
        .filter(file => file.endsWith(".js"));
    if (tsFiles.length === 0 && jsFiles.length === 0) {
        console.log(colors("yellow", "[Warning] No .d.ts or .js files found."));
        console.log(colors("yellow", "Task will complete but no files will be processed."));
    }
}

function generateFileName(filePath, fileType, sourceDir) {
    const relativePath = path.relative(sourceDir, filePath);
    const parts = relativePath.split(path.sep);
    const lastPart = parts[parts.length - 1];
    parts[parts.length - 1] = lastPart.slice(0, -fileType.length);
    return parts.join('_') + '.txt';
}

function processFiles(projectRoot, fileType) {
    let fileCount = 0;
    return through2.obj(function(file, enc, done) {
        try {
            const relativePath = path.relative(projectRoot, file.path).replace(/\\/g, '/');
            let content = file.contents.toString();
            if (fileType === '.d.ts') {
                content = content.replace(/@/g, 'SD');
            }
            content = `// File: ${relativePath}\n${content}`;
            file.contents = Buffer.from(content);
            const newName = generateFileName(file.path, fileType, projectRoot);
            file.path = path.join(path.dirname(file.path), newName);
            file.base = path.dirname(file.path);
            fileCount++;
            console.log(colors("green", `Processing: ${relativePath} -> ${newName}`));
            done(null, file);
        } catch (err) {
            console.log(colors("red", `[Error] Failed to process file: ${file.path}`));
            console.log(colors("red", err.message));
            done(err);
        }
    }).on("end", () => {
        if (fileCount > 0) {
            console.log(colors("green", `Processed ${fileCount} ${fileType} files successfully`));
        }
    });
}

function task(outputPath) {
    validateOutputPath(outputPath);
    const projectRoot = global["projectRoot"];
    const sdPath = path.join(projectRoot, "SD");
    const examplePath = path.join(projectRoot, "example");
    validateSourcePaths(sdPath, examplePath);
    
    console.log(colors("cyan", "Starting RAG task..."));
    console.log(colors("cyan", `Processing files from:`));
    console.log(colors("cyan", `- SD directory: ${sdPath}`));
    console.log(colors("cyan", `- Example directory: ${examplePath}`));
    console.log(colors("cyan", `Output directory: ${outputPath}`));

    const processTsFiles = () => {
        return gulp.src(path.join(sdPath, "**/*.d.ts"))
            .pipe(processFiles(projectRoot, ".d.ts"))
            .pipe(gulp.dest(outputPath));
    };

    const processJsFiles = () => {
        return gulp.src(path.join(examplePath, "**/*.js"))
            .pipe(processFiles(projectRoot, ".js"))
            .pipe(gulp.dest(outputPath));
    };

    return gulp.series(processTsFiles, processJsFiles)();
}

if (require.main === module) {
    global["projectRoot"] = path.resolve(__dirname, "..");
    parser.parseInput();
    const outputPath = global["o"] || parser.parseConfig("ragOutputPath");
    task(outputPath);
}

module.exports = task;
