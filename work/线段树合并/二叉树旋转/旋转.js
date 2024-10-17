import * as sd from "@/sd";

const svg = sd.svg();
const rt = new sd.Vertex(svg, "rt");
const lc = new sd.Box(svg, "lc").width(50).height(100);
const rc = new sd.Box(svg, "rc").width(50).height(100);
const l1 = new sd.Line(svg).source([0, 0]).target([300, 0]);
const l2 = new sd.Line(svg).source([0, 0]).target([300, 0]);
const brt = new sd.Box(svg, "rt").width(40);
const blc = new sd.Box(svg, "lc").width(110);
const brc = new sd.Box(svg, "rc").width(110);

lc.mx(rt.cx() - 20).y(rt.my() + 50);
rc.x(rt.cx() + 20).y(rt.my() + 50);
const childGap = rc.cx() - lc.cx();

sd.init(() => {
    sd.Link(rt, lc, sd.Line, "cx", "cy", "cx", "y").arrow();
    sd.Link(rt, rc, sd.Line, "cx", "cy", "cx", "y").arrow();
    l1.x(rc.mx() + 100).y(100);
    l2.x(rc.mx() + 100).y(140);
    brt.x(l1.x() + 20).y(100);
    blc.x(brt.mx()).y(100);
    brc.x(blc.mx()).y(100);
})

let flag = 0;
rt.onClick(() => {
    sd.inter(async () => {
        if (flag === 0) {
            lc.startAnimate().dx(childGap).endAnimate();
            rc.startAnimate().dx(-childGap).endAnimate();
            blc.startAnimate().dx(brc.width()).endAnimate();
            brc.startAnimate().dx(-blc.width()).endAnimate();
        } else {
            lc.startAnimate().dx(-childGap).endAnimate();
            rc.startAnimate().dx(childGap).endAnimate();
            blc.startAnimate().dx(-brc.width()).endAnimate();
            brc.startAnimate().dx(blc.width()).endAnimate();
        }
        flag ^= 1;
    })
})

sd.main(async () => {

})
