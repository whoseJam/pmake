import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const prim = [2, 3, 5, 7, 11, 13, 17, 19];
const dividers = [];
let n = 20;
const H = 70;

const slider = new sd.Slider(svg).min(5).max(20).value(20).width(300).cx(100).my(-10);
sd.Label(slider, "n", "lc");
const label = sd.Label(slider, "20", "rc");
slider.onChange(value => label.text(n = value));

sd.init(() => {
})

sd.main(async () => {
    await sd.pause();
    const math = new sd.Mathjax(svg, `${n}=${Divide(n)}`).cx(100).opacity(0).startAnimate().opacity(1).endAnimate();
    const a1 = math.element(1);
    console.log("a1=", a1);
    await sd.pause();
    a1.startAnimate().color(C.red).endAnimate();
})

function Divide(n) {
    let ans = "";
    for (let i = 0; i < prim.length; i++) {
        while (n % prim[i] === 0) {
            n /= prim[i];
            dividers.push(prim[i]);
            if (ans.length === 0) ans = ans + `{${String(prim[i])}}`;
            else ans = ans + "\\times " + `{${String(prim[i])}}`;
        }
    }
    return ans;
}

async function Combination(status) {
    // for (let i = )
}