const colors = require("colors-console");

let parsed = false;
let config = undefined;

const hints = {
    "animationOutputPath": colors("cyan", "animationOutputPath") + "：动画默认输出路径（例如 C:/Users/xxx/Desktop/output）",
    "pptOutputPath": colors("cyan", "pptOutputPath") + "：ppt默认输出路径（例如 C:/Users/xxx/Desktop/output/animation）",
}

module.exports = {
    parseInput() {
        if (parsed) return;
        parsed = true;
        const length = process.argv.length;
        for (let i = 0; i < length; i++) {
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
    },
    parseConfig(key) {
        if (config === undefined) {
            try {
                config = require("../myconfig.json");
            } catch (e) {
                fs.writeFileSync("myconfig.json", JSON.stringify({}, null, 4));
            }
        }
        if (!config[key]) {
            console.log(colors("red", `[error]未找到 ${key} 请检查配置`));
            console.log(hints[key]);
            process.exit(1);
        }
        return config[key];
    }
}