import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const L = [5, 4, 7, 3, 6, 8];

const arrs = [];
for (let i = 0; i < L.length; i++) {
    arrs.push(new sd.Array(svg).resize(L[i]));
    arrs[i].y(60 + i * 60);
}

const input = new sd.Slider(svg).width(100);
const label = new sd.Text(svg, "count = 0").x(input.mx() + 20);
sd.Label(input, "一条木板长度", "lc")
input.min(1).max(8);
input.onChange((value) => {
    let ans = 0;
    for (let i = 0; i < L.length; i++) {
        arrs[i].color(C.white);
        ans += Math.floor(L[i] / value);
        for (let j = 0; (j+1) * value <= arrs[i].length(); j++) {
            for (let k = j * value; k < (j+1) * value; k++) {
                if (j & 1) arrs[i].color(k, C.blue);
                else arrs[i].color(k, C.deepSkyBlue);
            }
        }
    }
    label.text(`count = ${ans}`);
});

main();

async function main() {
    await sd.pause();
}
