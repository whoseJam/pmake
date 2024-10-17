import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;

sd.init(() => {
    for (let i = 0; i < n; i++) {
        const arr = new sd.Array(svg).resize(n).y(i * 50).color(C.red);
        if (i > 0) sd.Label(arr, "+", "lc");
    }

    for (let i = 0; i < n; i++) {
        const arr = new sd.Array(svg).resize(n).x(300).y(i * 50).color(i, C.red);
        if (i > 0) sd.Label(arr, "+", "lc");
    }
})

sd.main(async () => {

})