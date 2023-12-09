import * as sd from "#lib/slide";

let svg = sd.svg();
let R = sd.rule();
let arr = sd.Array(svg).drag(true).resizeable(true);
let brr = sd.Array(svg);
let str = "4153";
for (let i = str.length - 1; i >= 0; i--)
    arr.push(str[i]);
arr.start(1).indexed(true);
arr.x(200).y(100);
brr.x(200).y(200).resize(4);
sd.EnableArrayName(arr, "a数组");
sd.EnableArrayName(brr, "构造数组");

let g = sd.TinyGraph(svg).x(600).y(100);
g.newNode(0).newNode(1).newNode(2);
link(0, 1, "4");
link(1, 0, "other");
link(1, 2, "9");

function link(u, v, txt) {
    if (u !== v) {
        g.linkType(sd.CurveLink);
        g.newLink(u, v, txt);
        let l = g.element(u, v);
        l.bending(0.3).arrow().valueRule(R.PointAtPathByRate(0.5, "x", "y"));
    } else {
        // g.linkType(sd.CircleLink);
    }
}

async function main() {

}