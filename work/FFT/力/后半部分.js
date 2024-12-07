import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 5;
const arrA = new sd.Array(svg).start(1);
const arrB = new sd.Array(svg).start(1).y(80).resize(n);
const fontSize = 18;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arrA.push(new sd.Mathjax(arrA, `\\frac{1}{${i}^2}`));
        const label = (i === 1 ? "n" : `n-${i-1}`);
        arrB.element(i).value(new sd.Mathjax(arrB, `q_{${label}}`).fontSize(fontSize), R.centerOnly());
    }
    arrA.push("...");
    arrA.push(new sd.Mathjax(arrA, "\\frac{1}{(n-j)^2}"))
    arrA.push(new sd.Mathjax(arrA, "\\frac{1}{(n-j+1)^2}"))

    arrB.push("...");
    arrB.push(); arrB.lastElement().value(new sd.Mathjax(arrB, "q_{j+1}").fontSize(fontSize), R.centerOnly());
    arrB.push(); arrB.lastElement().value(new sd.Mathjax(arrB, "q_{j}").fontSize(fontSize), R.centerOnly());
})

sd.main(async () => {
    await sd.pause();
})