import * as sd from "@/sd";

const svg = sd.svg();
const coord = new sd.Coord(svg).viewX(-2.5).viewY(-2.5).viewWidth(5).viewHeight(5);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    coord.startAnimate().x(100).y(100).endAnimate();
    await sd.pause();
    coord
        .startAnimate()
        .draw(1, x => x * x)
        .endAnimate();
    await sd.pause();
    coord.startAnimate().viewX(-5).endAnimate();
});
