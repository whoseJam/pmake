import * as sd from "@/SD";

const svg = sd.svg();
const I = sd.input();
const boxes = [];

const data = `
wbwww
bwwbw
wwbww
wwwwb
wwwbw
`

init();
main();

function init() {
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            const box = new sd.Box(svg);
            box.i = i;
            box.j = j;
            if (i == 4) {
                if (j == 2) box.value("a");
                if (j == 4) box.value("b");
            }
            boxes.push(box);
        }
    }
    update();
}

async function main() {
    await sd.pause();
    
    await sd.pause();
    startAnimate();
    reorder({
        1: 2,
        2: 3,
        3: 1,
        4: 5,
        5: 4
    });
    update();
    endAnimate();
    await sd.pause();
}

function reorder(mp) {
    boxes.forEach(box => {
        box.i = mp[box.i];
    })
}