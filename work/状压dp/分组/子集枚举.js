import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const code1 = new sd.Code(svg);
const code2 = new sd.Code(svg).x(80);
const All = 0b10111;
const pointer = sd.Pointer(code1, "T", "r", 20);

init();
main();

function init() {
    code1.push("     ");
    code2.push(convertXtoState(All));
    sd.Label(code1, "-1", "tc");
    sd.Label(code2, "&All", "tc");
}

async function main() {
    let cnt = 1;
    for (let T = All; T; T = (T - 1) & All) {
        await sd.pause();
        code1.startAnimate()
        code1.push(convertXtoState((T - 1)))
        pointer.moveTo(++cnt);
        code1.endAnimate();
        await sd.pause();
        code2.startAnimate().push(convertXtoState((T - 1) & All)).endAnimate();
    }
}

function convertXtoState(x) {
    let ans = "";
    for (let i = 0; i < n; i++) {
        ans = (x & 1) + ans;
        x >>= 1;
    }
    return ans;
}