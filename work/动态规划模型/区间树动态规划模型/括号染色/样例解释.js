import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const colors = [C.black, C.red, C.textBlue];
const seq = "(())()";
const mathjax = new sd.Mathjax(svg);

sd.init(() => {
    let ans = "";
    for (let i = 0; i < seq.length; i++) {
        ans = ans + "{" + seq[i] + "}";
    }
    mathjax.math(ans);
    for (let i = 1; i <= seq.length; i++) {
        let tmp = 0;
        mathjax.element(i).onClick(() => {
            tmp = (tmp + 1) % colors.length;
            sd.inter(async () => {
                mathjax.startAnimate().color(i, colors[tmp]).endAnimate();
            });
        });
    }
});

sd.main(async () => {});
