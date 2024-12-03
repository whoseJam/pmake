import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const arr = new sd.Array(svg);

sd.init(() => {
    for (let i = 0; i < n; i++) {
        arr.push(new sd.Mathjax(arr, `a_{${i}}`));
    }
})

sd.main(async () => {

})