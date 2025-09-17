import * as sd from "@/sd";

const svg = sd.svg();

const r = new sd.Rect(svg).x(100).y(100);
const arr = new sd.Array(svg).x(100).y(200).resize(10);
const math = new sd.Math(svg, "a^2+b^2=c^2").width(200);

r.onClick(() => {
    console.log("click the rect");
});
r.onDblClick(() => {
    console.log("dbl click the rect");
});
r.drag(true);

arr.onClick(() => {
    console.log("click the array");
});
arr.onDblClick(() => {
    console.log("dbl click the array");
});
arr.drag(true);

math.drag(true);
