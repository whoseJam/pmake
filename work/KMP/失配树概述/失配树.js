import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const EN = sd.enter();
const str = " abbabaabbabb";
const n = str.length - 1;
const arr = new sd.Array(svg);
const gap = 5;
const location = [
    {},
    { loc: "tc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "rc", gap: gap },
    { loc: "rc", gap: gap },
    { loc: "rc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "tc", gap: gap },
    { loc: "rc", gap: gap }
]
const nxt = sd.make1d(20);

sd.init(() => {
    for (let i = 0; i <= n; i++) arr.push(str[i]);
    for (let i = 0; i <= n; i++) {
        arr.element(i).childAs(new sd.Text(svg, i).fontSize(12), R.aside("bc", 3));
    }
    prepare();
    arr.x(100).cy(300);
})

sd.main(async () => {
    await sd.pause();
    const links = [];
    for (let i = 1; i <= n; i++) {
        const link = new sd.Curve(svg).target(arr.element(i).pos("cx", "y")).source(arr.element(nxt[i]).pos("cx", "y")).bending(-0.5).startAnimate().pointTtoS().endAnimate().revArrow();
        links.push({
            link: link,
            fa: nxt[i],
            u: i
        });
    }

    await sd.pause();
    const tree = new sd.HorizontalValueTree(svg).layerWidth(150).height(600).x(arr.x()).cy(arr.cy());
    tree.freeze();
    tree.startAnimate(2000);
    for (let i = 0; i <= n; i++) {
        tree.newNodeFromExistElement(i, arr.element(i));
        if (i > 0) {
            const link = links[i - 1];
            link.link.startAnimate().bending(0).endAnimate();
            tree.newLinkFromExistElement(link.fa, link.u, link.link);
        }
    }
    tree.unfreeze();
    tree.endAnimate();
    await sd.pause();
    for (let i = 0; i <= n; i++) {
         if (i >= 1) {
            let flag = 0;
            const substr = str.slice(1, i + 1);
            const element = arr.element(i);
            element.startAnimate().childAs(new sd.Text(svg, substr).onEnter(EN.appear()), R.aside(location[i].loc, location[i].gap)).endAnimate();
        }
    }
})

function prepare() {
    nxt[1] = 0; let cur = 0;
    for (let i = 2; i <= n; i++) {
        while (cur && str[cur + 1] !== str[i])
            cur = nxt[cur];
        if (str[cur + 1] === str[i]) nxt[i] = ++cur;
    }
}
