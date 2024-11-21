import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const X = 50;
const Y = 0;
const MX = 100;
const MY = 50;
const n = 3;
const nodes = sd.make1d(10, {});
const rect = new sd.Rect(svg).x(X).width(MX - X).y(Y).height(MY - Y);
const data = I.readIntMatrix(`
65 15
85 35
80 10`, n, 2);

function Distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        nodes[i].x = data[i][1];
        nodes[i].y = data[i][2];
        nodes[i].r = 2;
        nodes[i].expanded = false;
        console.log(nodes[i].x, nodes[i].y);
        nodes[i].circle = new sd.Circle(svg).color(C.GREEN).r(2).center(nodes[i].x, nodes[i].y);
    }
    nodes.forEach((node, i) => {
        if (i < 1 || i > n) return;
        node.circle.onClick(() => {
            if (node.expanded) return;
            sd.inter(() => {
                node.circle.startAnimate();
                node.circle.color(C.ORANGE);
                let r = Infinity;
                r = Math.min(r, node.x - X);
                r = Math.min(r, node.y - Y);
                r = Math.min(r, MX - node.x);
                r = Math.min(r, MY - node.y);
                for (let i = 1; i <= n; i++) {
                    if (!nodes[i].expanded) continue;
                    r = Math.min(r, Math.max(Distance(node, nodes[i]) - nodes[i].r, 0));
                }
                node.r = r;
                node.circle.r(Math.max(r, 2)).center(node.cx, node.cy);
                node.circle.endAnimate();
                node.expanded = true;
            })
        })
    })
})

sd.main(async () => {

})