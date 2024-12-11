import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const arr = new sd.Array(svg).x(100).y(100).resize(n).start(1);

sd.init(() => {
    for (let i = 1; i <= n - 1; i++) {
        sd.Link(arr.element(i), arr.element(n), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).arrow();
    }
})

sd.main(async () => {

})