import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let a = new sd.ValueArray(svg).x(200).y(100).start(1).elementWidth(60);
for (let i = 1; i <= 10; i++) {
    a.push(new sd.Circle(svg).color(C.blue));
}
sd.Pointer(a, "H(l)", "b").moveTo(1);
sd.Pointer(a, "T(r)", "b").moveTo(10);
sd.Pointer(a, "T(k)", "b").moveTo(4);
sd.Pointer(a, "H(k+1)", "b").moveTo(5);
new sd.Brace(a).source(a.element(10).pos("mx", "my", 0, 10)).target(a.element(1).pos("x", "my", 0, 10))
sd.Label(a, "H(l)T(k)T(r)", "bc", 20, 20);