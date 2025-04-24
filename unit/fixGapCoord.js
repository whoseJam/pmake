import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const coord = new sd.FixGapCoord(svg).x(100).y(100);
    await sd.pause();
    coord.startAnimate().gap("x", 40).endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("y").ticks(5);
    coord.endAnimate();
}
