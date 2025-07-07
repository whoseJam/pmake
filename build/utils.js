const fs = require("fs");
const path = require("path");
const colors = require("colors-console");

module.exports = {
    copyFile(src, dest) {
        const name = path.basename(src);
        fs.copyFileSync(src, `${dest}/${name}`);
    },
    copyFonts(src, dest) {
        const fonts = ["Consolas.ttf", "Arial.ttf", "Times New Roman.ttf"];
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fonts.forEach(font => {
            if (fs.existsSync(`${dest}/${font}`)) return;
            fs.copyFileSync(`${src}/${font}`, `${dest}/${font}`);
        });
    },
    validateJSFile(src) {
        if (!fs.existsSync(src)) {
            console.log(colors("red", `[Error] File ${src} not found. Please check if the input path is correct.`));
            process.exit();
        }
        if (!src.toLowerCase().endsWith(".js")) {
            console.log(colors("red", `[Error] Invalid file type. The file must be a JavaScript (.js) file.`));
            process.exit();
        }
        try {
            fs.accessSync(src, fs.constants.R_OK);
        } catch (err) {
            console.log(colors("red", `[Error] Cannot read the file. Check file permissions.`));
            process.exit();
        }
    },
};
