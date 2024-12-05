import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const EN = sd.enter();
const L = 100;
const l1 = new sd.Line(svg).source(100, 100).target(700, 100);
const l2 = new sd.Line(svg).source(100, 140).target(700, 140);
const rs = new sd.Rect(svg).width(300).color(C.blue).x(200).y(100);
const rt = new sd.Rect(svg).width(300).color(C.blue).cx(400 - 20).y(180);

sd.init(() => {

})

sd.main(async () => {
    await sd.pause();
    rs.startAnimate().childAs("rct", new sd.Rect(svg).color(C.red).onEnter(EN.appear()), R.aside("rc", 0)).endAnimate();
    rt.startAnimate().childAs("rct", new sd.Rect(svg).color(C.orange).onEnter(EN.appear()), R.aside("rc", 0)).endAnimate();
    sd.Pointer(svg, "j+1", "t", 3, 20, 3).startAnimate().moveTo(rt.child("rct")).endAnimate();

    await sd.pause();
    const a1 = new sd.Line(svg);
    a1.source(rt.pos("x", "cy"));
    a1.target(V.add(rt.pos("x", "cy"), [L, 0]));
    a1.startAnimate().pointStoT().endAnimate().arrow();
    const a2 = new sd.Line(svg);
    a2.source(V.add(rt.pos("mx", "cy"), [-L, 0]));
    a2.target(rt.pos("mx", "cy"));
    a2.startAnimate().pointStoT().endAnimate().arrow();
})