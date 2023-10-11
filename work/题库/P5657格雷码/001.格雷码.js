import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let code = [];
code.push(sd.Array(svg).push(0));
code.push(sd.Array(svg).push(1));

update(false);
main();

async function main() {
    for (let i = 1; i <= 3; i++) {
        await sd.pause();

        let len = code.length;
        for (let j = len - 1; j >= 0; j--) {
            let arr = sd.Array(svg);
            let from = code[j];
            arr.x(from.x()).y(from.y());
            for (let k = 0; k < from.length(); k++)
                arr.push(from.value(k).text());
            code.push(arr);
        }

        update();

        await sd.pause();
        for (let j = 0; j < len; j++)
            code[j].startAnimate().insert(0, 0).endAnimate();
        for (let j = len; j < len * 2; j++)
            code[j].startAnimate().insert(0, 1).endAnimate();
    }
}

function update(flag = true) {
    let x = 200, y = 20;
    for (let i = 0; i < code.length; i++) {
        if (flag) code[i].startAnimate();
        code[i].x(x).y(y);
        if (flag) code[i].endAnimate();
        y += 50;
        if (y >= 550) { x += 400; y = 20; }
    }
}