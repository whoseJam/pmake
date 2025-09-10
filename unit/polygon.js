import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const poly = new sd.Polygon(svg, [
        [200, 50],
        [100, 200],
        [300, 200],
    ]);
    await sd.pause();
    poly.startAnimate()
        .points([
            [100, 50],
            [100, 200],
            [300, 200],
            [300, 50],
        ])
        .endAnimate();
}
