import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestBasic);

async function TestBasic() {
    const t = new sd.ValueTree(svg).cx(600).y(50).layerHeight(120);
    t.root(1, new sd.Array(svg).push(1).push(2).push(3));
    await sd.pause();
    t.startAnimate().freeze().newNode(2, new sd.Grid(svg).n(3).m(3)).newLink(1, 2).unfreeze().endAnimate();
    await sd.pause();
    t.startAnimate().freeze().newNode(3, new sd.Mathjax(svg, `A^2+B^2=C^2`)).newLink(1, 3).unfreeze().endAnimate();
}
