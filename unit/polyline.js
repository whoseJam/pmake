import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const poly = new sd.PolylineSVG(svg, [
        [100, 100],
        [150, 200],
        [200, 100],
    ]);
    await sd.pause();
    poly.startAnimate().dx(100).endAnimate();
}
