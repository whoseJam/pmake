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

sd.main(async () => {
    await sd.pause();
    // for (let i = 0; i < seq.length; i++) {
    //     if (seq[i] === ")") continue;
    //     const info = find(i);
    //     const l = i;
    //     const r = info[0];
    //     const d = info[1];
    //     const zz = new sd.ZZLine(mathjax);
    //     zz.location("b").bending(d * 5);
    //     zz.source(mathjax.element(l).pos("cx", "my"));
    //     zz.target(mathjax.element(r).pos("cx", "my"));
    //     zz.opacity(0).startAnimate().opacity(1).endAnimate();
    // }
});

function find(x) {
    let i = x;
    let count = 1;
    let mx = 1;
    while (count > 0) {
        i++;
        if (seq[i] === "(") count++;
        else count--;
        mx = Math.max(mx, count);
    }
    return [i, mx];
}
