import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 12;
const data = I.readIntArray("2 3 1 3 3 1 2 2 3 2 1 2", n);
const paper = new sd.Array(svg).y(40).resize(n).start(1);
const allFocus = [];

const input = new sd.Slider(svg).width(100).cx(paper.cx());
const minDist = new sd.Text(svg, "最大得分 = ?").x(input.mx() + 20).cy(input.cy());
sd.Label(input, "最大得分", "lc")
input.min(1).max(8);
input.onChange((value) => {
    minDist.text(`最大得分 = ${value}`);

    let current = sd.make1d(10);
    function getScore() {
        return current[1] * current[2] * current[3];
    }
    let used = 0;
    for (let l = 1, r; l <= n; l = r + 1) {
        r = l;
        current[data[l]]++;
        while (r + 1 <= n) {
            r++;
            current[data[r]]++;
            if (getScore() > value) {
                r--;
                break;
            }
        }
        current[1] = current[2] = current[3] = 0;
        allFocus[used++].focus(l, r);
    }
    for (let i = used; i < allFocus.length; i++)
            allFocus[i].focus(null);
});

init();
main();

function init() {
    function i2c(x) {
        if (x == 1) return C.red;
        else if(x == 2) return C.green;
        return C.blue;
    }
    for (let i = 1; i <= n; i++) {
        paper.color(i, i2c(data[i]));
        allFocus.push(sd.Focus(paper).stroke(C.black).strokeWidth(5));
    }
}

async function main() {
    await sd.pause();
}