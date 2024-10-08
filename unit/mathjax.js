import * as sd from "@/sd";

const svg = sd.svg();

const math = new sd.Mathjax(svg, "0").x(100).y(100).fontSize(40);

main();

async function main() {
    for (let i = 1; i <= 9; i++) {
        await sd.pause();
        math.startAnimate().replaceMath(String(i)).endAnimate();
    }
    // await sd.pause();
    // math.startAnimate().dx(100).dy(100).endAnimate();
    // await sd.pause();
    // math.startAnimate().height(40).endAnimate();
    // await sd.pause();
}