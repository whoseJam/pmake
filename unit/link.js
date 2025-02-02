import * as sd from "@/sd";

const svg = sd.svg();

sd.init(() => {});

sd.main(TestTreeBug);

async function TestTreeBug() {
    const t1 = new sd.Tree(svg).x(100).y(100).root(1);
    const t2 = new sd.Tree(svg).x(200).y(100).root(1);
    sd.Link(t1.element(1), t2.element(1)).doubleArrow();
    await sd.pause();
    t2.startAnimate().link(1, 2).endAnimate();
}

async function TestPropertyChangeAfterLink() {
    const v1 = new sd.Vertex(svg).center(100, 100);
    const v2 = new sd.Vertex(svg).center(200, 100);
    const l = sd.Link(v1, v2, sd.Curve);
    await sd.pause();
    l.startAnimate().bending(-0.5).endAnimate();
}

async function TestBasic() {
    const arr = new sd.Array(svg).resize(10).cx(600).cy(300);
    await sd.pause();
    sd.Link(arr.element(1), arr.element(5), sd.Curve);
    await sd.pause();
    sd.Link(arr.element(3), arr.element(8), sd.CircleCurve);

    await sd.pause();
    const bx1 = new sd.Box(svg).x(100).y(100);
    const bx2 = new sd.Box(svg).x(300).y(400);
    const line0 = sd.Link(bx1, bx2, sd.Curve);
    await sd.pause();
    bx1.startAnimate().dx(100).endAnimate();
    bx2.startAnimate().dx(-200).endAnimate();
    await sd.pause();
    line0.startAnimate().sourceElement(arr.element(5)).endAnimate();

    await sd.pause();
    const v1 = new sd.Vertex(svg).x(700).y(100);
    const v2 = new sd.Vertex(svg).x(800).y(100);
    const line1 = sd.Link(v1, v2, sd.Curve);
    await sd.pause();
    line1.startAnimate().bending(-0.5).endAnimate();
}
