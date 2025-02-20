import * as sd from "@/sd";

const svg = sd.svg();
const coord = new sd.Coord(svg).viewBox(-2.5, -2.5, 5, 5);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    coord.startAnimate().x(100).y(100).endAnimate();
    await sd.pause();
    coord.startAnimate()
    const func1 = coord.draw(x => x * x)
    coord.endAnimate();
    coord.startAnimate();
    const func2 = coord.draw(x => -x * x);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate().viewX(-5).endAnimate();
    await sd.pause();
    coord.startAnimate().width(300).height(300).endAnimate();
});
