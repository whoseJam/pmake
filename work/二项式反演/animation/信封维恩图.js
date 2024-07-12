import * as sd from "@/sd";
import { draw } from "../../common/维恩图";

const svg = sd.svg();

main();

async function main() {
    const m = draw(svg, ["L_1", "L_2", "L_3"], (items) => {
        return new sd.Mathjax(svg, `送对${items}`);
    }, "一封也没有送对");
    m.childOne().forEach(child => child.height(18));
    m.childTwo().forEach(child => child.height(12));
    m.childThree().forEach(child => child.height(8));
    await sd.pause();
}
