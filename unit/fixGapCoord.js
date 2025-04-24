import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestTicks);

async function TestTicks() {
    const coord = new sd.FixGapCoord(svg).withTickLabel("x", false);
    console.log(coord.axis("x").pos("x", "y"), coord.axis("x").source());
    await sd.pause();
    coord.startAnimate().gap("x", 40).endAnimate();
    await sd.pause();
    coord.startAnimate().ticks("y", 7).endAnimate();
}

async function TestBasic() {
    const coord = new sd.FixGapCoord(svg).x(100).y(100);
    await sd.pause();
    coord.startAnimate().gap("x", 40).endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("y").ticks(5);
    coord.endAnimate();
}
