import * as sd from "../../../lib/slide";
import { draw } from "../../common/维恩图";

const svg = sd.svg();

main();

async function main() {
    const m = draw(svg, ["x_1", "x_2", "x_3"], (items) => {
        return new sd.Mathjax(svg, `${items}影响`);
    }, "谁都没有影响到");
    m.childOne().forEach(child => child.height(18));
    m.childTwo().forEach(child => child.height(12));
    m.childThree().forEach(child => child.height(8));
    await sd.pause();
}