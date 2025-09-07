import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const poly = new sd.Polyline(svg, [
        [100, 100],
        [150, 200],
        [200, 100],
    ]);
    await sd.pause();
    poly.startAnimate().dx(100).endAnimate();
    await sd.pause();
    poly.startAnimate().scale(0.5).endAnimate();
}
