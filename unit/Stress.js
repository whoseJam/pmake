import * as sd from "@/sd";

const svg = sd.svg();
const latex = sd.Stress(new sd.Math(svg, "A^2+B^2=C^2").cx(600).cy(300));
const label = sd.Label(latex, "label", "tc");

sd.init(() => {
    console.log(label);
});

sd.main(async () => {
    await sd.pause();
    latex.startAnimate(1000).stress(2).endAnimate();
});
