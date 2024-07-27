import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tot =  12;
const land = new sd.Array(svg).y(40).resize(tot);
const house = [1, 2, 8, 4, 9];

const input = new sd.Slider(svg).width(100).cx(land.cx());
const minDist = new sd.Text(svg, "minDist = ?").x(input.mx() + 20).cy(input.cy());
sd.Label(input, "相邻奶牛最近距离", "lc")
input.min(1).max(8);
input.onChange((value) => {
    minDist.text(`minDist = ${value}`);
    let lastPosition = -999;
    for (let i = 0; i < tot; i++) {
        if (land.value(i)) {
            if (i - lastPosition >= value) {
                land.value(i).value().opacity(1);
                lastPosition = i;
            } else {
                land.value(i).value().opacity(0);
            }
        }
    }
});

init();
main();

function init() {
    house.forEach(pos => {
        const box = new sd.Box(land).color(C.BLUE);
        const circ = new sd.Circle(box).color(C.ORANGE);
        box.value(circ).value().opacity(0);
        land.value(pos, box);
    });
}

async function main() {
    await sd.pause();
}