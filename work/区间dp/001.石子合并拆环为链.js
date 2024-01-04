import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let arr = sd.Array(svg).x(200).y(100).start(1);
for (let i = 1; i <= 2; i++) {
    arr.push("A[1]");
    arr.push("A[2]");
    arr.push("A[3]");
    arr.push("....");
    arr.push("A[n]");
}
makeElement(1, 5, "f(1,n)")
makeElement(2, 6, "f(2,n+1)")
makeElement(3, 7, "f(3,n+2)")

function makeElement(l, r, label) {
    let box = sd.Box(svg).color(C.blue);
    box.width(arr.elementWidth() * (r-l+1)).height(20);
    let txt = sd.Text(svg, label);
    box.value(txt);
    box.x(arr.element(l).x()).y((l - 1) * 40 + arr.my() + 20);
}