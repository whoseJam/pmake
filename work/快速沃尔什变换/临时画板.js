import * as sd from "../../lib/slide";

const svg = sd.svg();
const length = 3;
const stk = new sd.Stack(svg).elementWidth(20 + length * 20).x(100).y(100);

const transToBinary = (x) => {
    let result = "";
    for (let i = 0; i < length; i++)
        result += String((x>>i)&1);
    return result.split("").reverse().join("");
}

for (let i = 0; i < (1<<length); i++) {
    stk.push(transToBinary(i));
}

main();

async function main() {
    await sd.pause();
    for (let l = 1; l <= length; l++) {
        const gap = (1<<l-1);
        for (let i = 0; i < (1<<length); i++) {
            if (((i>>l-1)&1) === 0) {
                const next = i + gap;
                // 按位或卷积
                // sd.Link(
                //     stk.element(i),
                //     stk.element(next),
                //     sd.Curve,
                //     "mx", "cy",
                //     "mx", "cy"
                // ).bending(-l * 0.3).arrow();
                // 按位与卷积
                sd.Link(
                    stk.element(next),
                    stk.element(i),
                    sd.Curve,
                    "mx", "cy",
                    "mx", "cy"
                ).bending(l * 0.3).arrow();
            }
        }
    }
    await sd.pause();
}
