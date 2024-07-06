import * as sd from "../@/SD";
import { draw } from "./维恩图";

const svg = sd.svg();

globalThis.testHsj = () => {
    return "hello";
}

main();

async function main() {
    const m = draw(svg, ["I_1", "I_2", "I_3"], (items) => {
        return new sd.Mathjax(svg, `不用${items}`);
    }, "用了所有标号");
    m.childOne().forEach(child => child.height(18));
    m.childTwo().forEach(child => child.height(12));
    m.childThree().forEach(child => child.height(8));
    await sd.pause();
}