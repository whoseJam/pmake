import * as sd from "@/SD";
import { draw } from "../../common/维恩图";

const svg = sd.svg();

main();

async function main() {
    const m = draw(svg, ["B_1", "B_2", "B_3"], (items) => {
        return new sd.Mathjax(svg, `${items}不放`);
    }, "都放苹果");
    m.childOne().forEach(child => child.height(18));
    m.childTwo().forEach(child => child.height(12));
    m.childThree().forEach(child => child.height(8));
    await sd.pause();
}