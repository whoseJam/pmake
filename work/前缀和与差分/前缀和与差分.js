import * as sd from "../@/SD";

let svg = sd.svg();
let R = sd.rule();
let arr = [0, 1, 4, 3, 2, 9];
let n = 5;


let d = new sd.Array(svg).x(200).y(100);
let a = new sd.Array(svg).x(200).y(250);
let s = new sd.Array(svg).x(200).y(400);
sd.Label(d, "d数组", "tc");
sd.Label(a, "a数组", "tc");
sd.Label(s, "s数组", "tc");
let lst = 0;
for (let i = 1; i <= n; i++) {
    d.push(arr[i] - arr[i-1]);
    a.push(arr[i]);
    s.push(arr[i] + lst);
    lst += arr[i];
}
link(d, a, "前缀和");
link(a, s, "前缀和");
link(s, a, "差分");
link(a, d, "差分");
function link(a, b, text) {
    let l = new sd.Curve(svg).bending(0.5);
    if (text === "前缀和") {
        l.source(a.x(), a.cy());
        l.target(b.x(), b.cy());
    } else {
        l.source(a.mx(), a.cy());
        l.target(b.mx(), b.cy());
    }
    l.arrow().value(text);
    if (text === "前缀和") l.value().rule = R.PointAtPathByRate(0.5, "cx", "my")
    else l.value().rule = R.PointAtPathByRate(0.5, "cx", "y");
    l.update();
}

let t = new sd.Array(svg).resize(10).x(100).y(550);
t.childAs(new sd.Text(svg, "+3"), function(parent, child) {
    child.cx(parent.element(4).cx()).my(parent.y() - 5);
})
t.childAs(new sd.Text(svg, "-3"), function(parent, child) {
    child.cx(parent.element(7).cx()).my(parent.y() - 5);
})