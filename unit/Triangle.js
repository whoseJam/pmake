import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const tri = new sd.Triangle(svg);
    await sd.pause();
    tri.startAnimate().x(100).y(100).width(100).endAnimate();
}
