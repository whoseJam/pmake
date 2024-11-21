import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const m = 3;
const arr = new sd.Array(svg).start(1);
const hint = new sd.Mathjax(svg, `n=${n},m=${m}`);

sd.init(() => {
    sd.Index(arr, "t");
    arr.resize(n);
    hint.cx(arr.cx()).my(arr.y() - 40);
    for (let i = 1; i <= arr.length(); i++) {
        const idx = i;
        let cur = 0;
        arr.element(i).onClick(() => {
            sd.inter(async () => {
                cur ^= 1;
                arr.startAnimate().color(idx, cur ? C.orange : C.white).endAnimate();
            })
        })
    }
})

sd.main(async () => {

})