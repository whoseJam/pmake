import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [
    { x: 2, y: 1 },
    { x: 7, y: 2 },
    { x: 1, y: 3 },
    { x: 3, y: 3 },
    { x: 0, y: 4 },
    { x: 4, y: 4 },
    { x: 9, y: 4 },
    { x: 7, y: 5 },
    { x: 2, y: 6 },
    { x: 5, y: 6 },
    { x: 8, y: 6 }
];
for (let i = 0; i < data.length; i++)
    data[i].dot = new sd.Circle(svg).r(6).cx(getX(data[i])).cy(getY(data[i])).color(C.black);

main();

async function main() {
    const nodes = [];

    await sd.pause();
    data.sort(function(a, b) { 
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && data[r + 1].y === data[l].y) r++;
        if (l < r) sd.Link(data[l].dot, data[r].dot).startAnimate().pointStoT().endAnimate();
        nodes.push({
            y: data[l].y,
            l: data[l].x,
            r: data[r].x,
            type: "query"
        });
    }

    await sd.pause();
    data.sort(function(a, b) { 
        if (a.x !== b.x) return a.x - b.x;
        return a.y - b.y;
    });
    for (let l = 0, r; l < data.length; l = r + 1) {
        r = l;
        while (r + 1 < data.length && data[r + 1].x === data[l].x) r++;
        if (l < r) sd.Link(data[l].dot, data[r].dot).startAnimate().pointStoT().endAnimate();
        if (l < r) {
            const handle = {};
            nodes.push({
                y: data[l].y,
                x: data[l].x,
                type: "add",
                handle: handle
            });
            nodes.push({
                y: data[r].y,
                x: data[r].x,
                type: "delete",
                handle: handle
            });
        }
    }

    await sd.pause();
    nodes.sort(function(a, b) {
        return a.y - b.y;
    });
    const l = new sd.Line(svg);
    l.source(100, getY(nodes[0]));
    l.target(750, getY(nodes[0]));
    l.opacity(0);
    l.startAnimate().opacity(1).endAnimate();
    for (let i = 1; i < nodes.length; i++) {
        await sd.pause();
        l.startAnimate().y(getY(nodes[i])).endAnimate();
        if (nodes[i].type === "add") {
            const dot = new sd.Circle(svg).r(3).color(C.deepSkyBlue);
            nodes[i].handle.dot = dot;
            l.childAs(`dot_${i}`, dot, function(parent, child) {
                child.cx(getX(nodes[i]));
                child.cy(parent.cy());
            })
            dot.opacity(0).startAnimate().opacity(1).endAnimate();
        } else if (nodes[i].type === "delete") {
            const dot = nodes[i].handle.dot;
            dot.startAnimate().opacity(0).remove();
        }
    }
}

function getX(pos) {
    let x = 200 + pos.x * 50;
    return x;
}

function getY(pos) {
    let y = 500 - pos.y * 50;
    return y;
}