import * as sd from "@/sd";

const svg = sd.svg();
const t = new sd.HorizontalValueTree(svg).x(100).cy(300).layerWidth(300);

sd.main(async () => {
    t.root(1, new sd.Array(svg).push(1).push(2).push(3));
    await sd.pause();
    t.startAnimate();
    t.newNode(2, new sd.Grid(svg).n(3).m(3));
    t.newLink(1, 2);
    t.endAnimate();
    await sd.pause();
    t.startAnimate();
    t.newNode(3, new sd.Math(svg, `A^2+B^2=C^2`));
    t.newLink(1, 3);
});
