import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const coord = new sd.Coord(svg).viewX(-5).viewWidth(15).viewY(-5).viewHeight(15).width(600).height(300).cx(500).y(70);
const linksArr = new sd.Array(svg).y(coord.my() + 20);
const nodesArr = new sd.Array(svg).y(linksArr.my() + 20);
const line = new sd.Line(svg);
const convex = [];
let K = 0;
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

const slider = new sd.Slider(svg).min(-25).max(25).value(0).onChange((value) => {
    K = value * 0.2;
    sd.inter(async () => {
        line.startAnimate();
        UpdateLine(K);
        line.endAnimate();
    })
});

sd.init(() => {
    BuildConvex();
    UpdateLine(0);
})

sd.main(async () => {
    sd.Label(slider, "k");
    slider.width(200).mx(coord.mx()).my(coord.my());
})

function Slope(a, b) {
    return (data[a].y - data[b].y) / (data[a].x - data[b].x);
}

let lastTarget = undefined;
function UpdateLine(k) {
    line.source(coord.x(), coord.my()).target(coord.mx(), coord.my() - coord.width() * SlopeCoordToGlobal(k));
    
    let target = 0;
    if (k <= Slope(convex[0], convex[1])) target = 0;
    if (k >= Slope(convex[convex.length - 1], convex[convex.length - 2])) target = convex.length - 1;
    for (let i = 1; i < convex.length - 1; i++) {
        const K1 = Slope(convex[i], convex[i - 1]);
        const K2 = Slope(convex[i], convex[i + 1]);
        if (i === 4) {
            console.log("k=", k, "K1=", K1, "K2=", K2, data[convex[i-1]], data[convex[i]], data[convex[i+1]])
        }
        if (K1 <= k && K2 >= k) {
            target = i;
        }
    }

    nodesArr.startAnimate();
    if (typeof(lastTarget) === "number") nodesArr.color(lastTarget, C.white);
    nodesArr.color(target, C.green);
    nodesArr.endAnimate();

    const id = convex[target];
    const rate = (coord.at(data[id].x, data[id].y)[0] - coord.x()) / coord.width();
    const lineH = line.at(rate)[1];
    const nodeH = (coord.at(data[id].x, data[id].y)[1]);
    line.startAnimate().dy(nodeH - lineH).endAnimate();

    lastTarget = target;
}

function BuildConvex() {
    convex.push(0);
    for (let i = 1; i < data.length; i++) {
        while (convex.length >= 2) {
            const K1 = Slope(i, convex[convex.length - 1]);
            const K2 = Slope(convex[convex.length - 1], convex[convex.length - 2]);
            if (K2 <= K1) break;
            else convex.pop();
        }
        convex.push(i);
    }
    for (let i = 0; i < convex.length; i++) {
        nodesArr.push(`D${convex[i]+1}`);
        CreateNode(convex[i]);
        if (i > 0) {
            const K = Slope(i - 1, i);
            const L = CreateLink(convex[i-1], convex[i]);
            linksArr.push(new sd.Line(svg).source(L.source()).target(L.target()).stroke(C.red));
        }
    }
    linksArr.cx(coord.cx());
    nodesArr.cx(coord.cx());
}

function CreateLink(a, b) {
    const L = new sd.Line(svg).stroke(C.red);
    L.source(data[a].circle.center());
    L.target(data[b].circle.center());
    return L;
}

function CreateNode(x) {
    const item = data[x];
    item.circle = new sd.Circle(coord).r(2).color(C.black).center(coord.at(item.x, item.y)).strokeWidth(0).childAs(
        new sd.Mathjax(coord, `(v_{${x+1}},f_{${x+1}})`).fontSize(20),
        R.Aside("tc", 2)
    );
}

function SlopeCoordToGlobal(k) {
    const a = coord.height() / coord.width();
    const b = coord.viewHeight() / coord.viewHeight();
    return k * a / b;
}