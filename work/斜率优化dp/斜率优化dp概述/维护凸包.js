import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const coord = new sd.Coord(svg).viewX(-5).viewWidth(15).viewY(-5).viewHeight(15).width(600).height(300).cx(500).y(70);
const linksArr = new sd.Array(svg).x(coord.x() + 20).y(coord.my() + 20);
const nodesArr = new sd.Array(svg).x(coord.x()).y(linksArr.my() + 20);
const convex = [];
const data = [
    { x: -3, y: 6 },
    { x: -2, y: 1 },
    { x: -1.5, y: -1 },
    { x: 1, y: 2 },
    { x: 1.5, y: 5 },
    { x: 2, y: 8 },
    { x: 3, y: 0.5 },
    { x: 4, y: 2.5 },
    { x: 5, y: 6.5 }
]

sd.init(() => {
})

sd.main(async () => {
    await sd.pause();
    CreateNode(0);
    convex.push(0);
    nodesArr.startAnimate().push("D1").endAnimate();

    for (let i = 1; i < data.length; i++) {
        await sd.pause();
        CreateNode(i);

        let finalLink = undefined;
        while (convex.length >= 2) {
            const K1 = Slope(i, convex[convex.length - 1]);
            const L1 = CreateLink(convex[convex.length - 1], i);

            const K2 = Slope(convex[convex.length - 1], convex[convex.length - 2]);
            const L2 = data[convex[convex.length - 1]].line;
            if (K2 <= K1) {
                finalLink = L1;
                break;
            } else {
                await sd.pause();
                L1.startAnimate().fadeStoT().endAnimate();
                L2.startAnimate().fadeTtoS().endAnimate();
                linksArr.startAnimate().pop().endAnimate();
                nodesArr.startAnimate().pop().endAnimate();
                convex.pop();
            }
        }
        if (!finalLink) {
            await sd.pause();
            finalLink = CreateLink(i - 1, i);
        }

        await sd.pause();
        data[i].line = finalLink;
        const cloneLink = new sd.Line(svg).source(finalLink.source()).target(finalLink.target()).stroke(finalLink.stroke());
        linksArr.startAnimate();
        linksArr.pushFromExistValue(cloneLink);
        linksArr.endAnimate();
        nodesArr.startAnimate();
        nodesArr.push(`D${i+1}`);
        nodesArr.endAnimate();
        
        convex.push(i);
    }
})

function Slope(a, b) {
    return (data[a].y - data[b].y) / (data[a].x - data[b].x);
}

function CreateLink(a, b) {
    const L = new sd.Line(svg).stroke(C.red);
    L.source(data[a].circle.center());
    L.target(data[b].circle.center());
    L.startAnimate().pointStoT().endAnimate();
    return L;
}

function CreateNode(x) {
    const item = data[x];
    item.circle = new sd.Circle(coord).r(2).color(C.black).center(coord.at(item.x, item.y)).strokeWidth(0).childAs(
        new sd.Mathjax(coord, `(x_{${x+1}},y_{${x+1}})`).fontSize(20),
        R.aside("tc", 2)
    ).opacity(0).startAnimate().opacity(1).endAnimate();
}
