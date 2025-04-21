import * as sd from "@/sd";

let svg = sd.svg();
let W = 300, H = 200;
let C = sd.color(), stars = [];
let data = [
    [430, 210],
    [250, 330],
    [320, 390],
    [510, 190],
    [490, 120],
];
for (let i = 0; i < data.length; i++) {
    data[i][0] += W;
}
for (let i = 0; i < data.length; i++) {
    let star = new sd.Circle(svg).cx(data[i][0]).cy(data[i][1]).color(C.deepSkyBlue).r(4);
    stars.push(star);
}
let p = new sd.Circle(svg).color(C.RED).r(4).cx(100).cy(400);
let r = new sd.Rect(svg).width(W).height(H).fillOpacity(0);
p.childAs("dot", r, function(parent, child) {
    child.x(parent.cx());
    child.my(parent.cy());
})
p.drag(true);

main();

async function main() {
    await sd.pause();
    for (let i = 0; i < 1; i++) {
        let r = new sd.Rect(stars[i]).width(W).height(H);
        r.x(stars[i].cx()-W).y(stars[i].cy());
        r.fillOpacity(0.2).stroke(C.BLUE.border);
        r.fill(C.orange);
    }
    await sd.pause();
    for (let i = 1; i < data.length; i++) {
        let r = new sd.Rect(stars[i]).width(W).height(H);
        r.x(stars[i].cx()-W).y(stars[i].cy());
        r.fillOpacity(0.2).stroke(C.BLUE.border);
        r.fill(C.orange);
    }
}