import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const axis = new sd.FixGapAxis(svg);
    await sd.pause();
    axis.startAnimate().ticks(5).endAnimate();
}
